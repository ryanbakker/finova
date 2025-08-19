"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/database/db";
import { Transaction } from "@/database/models/transaction.model";
import { Budget } from "@/database/models/budget.model";
import { auth } from "@clerk/nextjs/server";
import { handleError } from "../utils";

// Types for transaction operations
export interface CreateTransactionParams {
  date: Date;
  amount: number;
  type: "income" | "expense" | "transfer";
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    budget?: number;
  };
  description: string;
  merchant?: string;
  accountId: string;
  accountName: string;
  isRecurring: boolean;
  recurringId?: string;
  tags: string[];
  notes?: string;
}

export interface UpdateTransactionParams
  extends Partial<CreateTransactionParams> {
  id: string;
}

// Helper function to update budget spent amounts
async function updateBudgetSpentAmount(
  userId: string,
  category: string,
  amount: number,
  operation: "add" | "subtract"
) {
  try {
    // Find active budgets for this category
    const budgets = await Budget.find({
      userId,
      category: category,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    for (const budget of budgets) {
      const currentSpent = budget.spent || 0;
      const newSpent = operation === "add" 
        ? currentSpent + amount 
        : Math.max(0, currentSpent - amount);
      
      await Budget.findByIdAndUpdate(budget._id, { spent: newSpent });
    }
  } catch (error) {
    console.error("Error updating budget spent amount:", error);
    // Don't throw error here as it shouldn't break the transaction operation
  }
}

// Create a new transaction
export async function createTransaction(
  transactionData: CreateTransactionParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const newTransaction = await Transaction.create({
      ...transactionData,
      userId,
    });

    // Update budget spent amount if this is an expense
    if (transactionData.type === "expense") {
      await updateBudgetSpentAmount(
        userId,
        transactionData.category.name,
        transactionData.amount,
        "add"
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/budgeting");

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    console.error("Error creating transaction:", error);
    handleError(error);
    throw error;
  }
}

// Get all transactions for the authenticated user
export async function getUserTransactions() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .lean();

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    handleError(error);
    throw error;
  }
}

// Get a specific transaction by ID (user can only access their own)
export async function getTransactionById(transactionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    }).lean();

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return JSON.parse(JSON.stringify(transaction));
  } catch (error) {
    console.error("Error fetching transaction:", error);
    handleError(error);
    throw error;
  }
}

// Update a transaction
export async function updateTransaction(
  transactionData: UpdateTransactionParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const { id, ...updateData } = transactionData;

    // Get the original transaction to calculate budget changes
    const originalTransaction = await Transaction.findById(id);
    if (!originalTransaction || originalTransaction.userId !== userId) {
      throw new Error("Transaction not found or unauthorized");
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId, // Ensure user can only update their own transactions
      },
      updateData,
      { new: true }
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found or unauthorized");
    }

    // Update budget spent amounts
    if (originalTransaction.type === "expense") {
      // Subtract the original amount
      await updateBudgetSpentAmount(
        userId,
        originalTransaction.category.name,
        originalTransaction.amount,
        "subtract"
      );
    }

    if (updatedTransaction.type === "expense") {
      // Add the new amount
      await updateBudgetSpentAmount(
        userId,
        updatedTransaction.category.name,
        updatedTransaction.amount,
        "add"
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/budgeting");

    return JSON.parse(JSON.stringify(updatedTransaction));
  } catch (error) {
    console.error("Error updating transaction:", error);
    handleError(error);
    throw error;
  }
}

// Delete a transaction
export async function deleteTransaction(transactionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId, // Ensure user can only delete their own transactions
    });

    if (!deletedTransaction) {
      throw new Error("Transaction not found or unauthorized");
    }

    // Update budget spent amount if this was an expense
    if (deletedTransaction.type === "expense") {
      await updateBudgetSpentAmount(
        userId,
        deletedTransaction.category.name,
        deletedTransaction.amount,
        "subtract"
      );
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/budgeting");

    return JSON.parse(JSON.stringify(deletedTransaction));
  } catch (error) {
    console.error("Error deleting transaction:", error);
    handleError(error);
    throw error;
  }
}

// Get transaction statistics for the authenticated user
export async function getTransactionStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const stats = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          totalTransactions: { $sum: 1 },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);

    return (
      stats[0] || {
        totalIncome: 0,
        totalExpenses: 0,
        totalTransactions: 0,
        averageAmount: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    handleError(error);
    throw error;
  }
}
