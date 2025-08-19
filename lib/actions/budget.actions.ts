"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/database/db";
import { auth } from "@clerk/nextjs/server";
import { handleError } from "../utils";

// Types for budget operations
export interface CreateBudgetParams {
  category: string;
  amount: number;
  spent?: number;
  currency: string;
  period: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface UpdateBudgetParams extends Partial<CreateBudgetParams> {
  id: string;
}

// Create a new budget
export async function createBudget(budgetData: CreateBudgetParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    // Validate that the user doesn't already have a budget for this category and period
    const existingBudget = await Budget.findOne({
      userId,
      category: budgetData.category,
      period: budgetData.period,
      isActive: true,
      $or: [
        {
          startDate: { $lte: budgetData.endDate },
          endDate: { $gte: budgetData.startDate },
        },
      ],
    });

    if (existingBudget) {
      throw new Error(
        "A budget already exists for this category and time period"
      );
    }

    const newBudget = await Budget.create({
      ...budgetData,
      userId,
      spent: budgetData.spent || 0,
      isActive: budgetData.isActive ?? true,
    });

    revalidatePath("/budgeting");
    revalidatePath("/dashboard");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedBudget = {
      ...newBudget.toObject(),
      id: newBudget._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedBudget));
  } catch (error) {
    console.error("Error creating budget:", error);
    handleError(error);
    throw error;
  }
}

// Get all budgets for the authenticated user
export async function getUserBudgets() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const budgets = await Budget.find({ userId })
      .sort({ startDate: -1, category: 1 })
      .lean();

    // Transform MongoDB _id to id for frontend compatibility
    const transformedBudgets = budgets.map((budget) => ({
      ...budget,
      id: budget._id,
      _id: undefined,
    }));

    return JSON.parse(JSON.stringify(transformedBudgets));
  } catch (error) {
    console.error("Error fetching user budgets:", error);
    handleError(error);
    throw error;
  }
}

// Get a specific budget by ID (user can only access their own)
export async function getBudgetById(budgetId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const budget = await Budget.findOne({
      _id: budgetId,
      userId,
    }).lean();

    if (!budget) {
      throw new Error("Budget not found");
    }

    // Transform MongoDB _id to id for frontend compatibility
    const transformedBudget = {
      ...budget,
      id: budget._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedBudget));
  } catch (error) {
    console.error("Error fetching budget:", error);
    handleError(error);
    throw error;
  }
}

// Update a budget
export async function updateBudget(budgetData: UpdateBudgetParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const { id, ...updateData } = budgetData;

    // If updating category or period, check for conflicts
    if (
      updateData.category ||
      updateData.period ||
      updateData.startDate ||
      updateData.endDate
    ) {
      const currentBudget = await Budget.findById(id);
      if (!currentBudget || currentBudget.userId !== userId) {
        throw new Error("Budget not found or unauthorized");
      }

      const category = updateData.category || currentBudget.category;
      const period = updateData.period || currentBudget.period;
      const startDate = updateData.startDate || currentBudget.startDate;
      const endDate = updateData.endDate || currentBudget.endDate;

      // Check for conflicts with other budgets
      const conflictingBudget = await Budget.findOne({
        _id: { $ne: id },
        userId,
        category,
        period,
        isActive: true,
        $or: [
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
        ],
      });

      if (conflictingBudget) {
        throw new Error(
          "A budget already exists for this category and time period"
        );
      }
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      {
        _id: id,
        userId, // Ensure user can only update their own budgets
      },
      updateData,
      { new: true }
    );

    if (!updatedBudget) {
      throw new Error("Budget not found or unauthorized");
    }

    revalidatePath("/budgeting");
    revalidatePath("/dashboard");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedBudget = {
      ...updatedBudget.toObject(),
      id: updatedBudget._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedBudget));
  } catch (error) {
    console.error("Error updating budget:", error);
    handleError(error);
    throw error;
  }
}

// Delete a budget
export async function deleteBudget(budgetId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const deletedBudget = await Budget.findOneAndDelete({
      _id: budgetId,
      userId, // Ensure user can only delete their own budgets
    });

    if (!deletedBudget) {
      throw new Error("Budget not found or unauthorized");
    }

    revalidatePath("/budgeting");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(deletedBudget));
  } catch (error) {
    console.error("Error deleting budget:", error);
    handleError(error);
    throw error;
  }
}

// Get budget statistics for the authenticated user
export async function getBudgetStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const stats = await Budget.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalBudgets: { $sum: 1 },
          totalBudgetAmount: { $sum: "$amount" },
          totalSpent: { $sum: "$spent" },
          averageBudget: { $avg: "$amount" },
          overBudgetCount: {
            $sum: { $cond: [{ $gt: ["$spent", "$amount"] }, 1, 0] },
          },
          warningBudgetCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ["$spent", "$amount"] },
                    { $gte: [{ $divide: ["$spent", "$amount"] }, 0.8] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalBudgets: 0,
        totalBudgetAmount: 0,
        totalSpent: 0,
        averageBudget: 0,
        overBudgetCount: 0,
        warningBudgetCount: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching budget stats:", error);
    handleError(error);
    throw error;
  }
}

// Get budgets by period for the authenticated user
export async function getBudgetsByPeriod(
  period: "monthly" | "quarterly" | "yearly"
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const budgets = await Budget.find({
      userId,
      period,
      isActive: true,
    })
      .sort({ startDate: -1 })
      .lean();

    return JSON.parse(JSON.stringify(budgets));
  } catch (error) {
    console.error("Error fetching budgets by period:", error);
    handleError(error);
    throw error;
  }
}

// Update budget spent amount (useful for syncing with transactions)
export async function updateBudgetSpent(budgetId: string, spentAmount: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Dynamic import to prevent model compilation conflicts
    const { Budget } = await import("@/database/models/budget.model");

    const updatedBudget = await Budget.findOneAndUpdate(
      {
        _id: budgetId,
        userId,
      },
      { spent: Math.max(0, spentAmount) },
      { new: true }
    );

    if (!updatedBudget) {
      throw new Error("Budget not found or unauthorized");
    }

    revalidatePath("/budgeting");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(updatedBudget));
  } catch (error) {
    console.error("Error updating budget spent amount:", error);
    handleError(error);
    throw error;
  }
}
