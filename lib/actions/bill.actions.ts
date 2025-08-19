"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/database/db";
import { Bill } from "@/database/models/bill.model";
import { auth } from "@clerk/nextjs/server";
import { handleError } from "../utils";

// Types for bill operations
export interface CreateBillParams {
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  isRecurring: boolean;
  status?: "paid" | "unpaid" | "overdue";
  frequency?: "monthly" | "quarterly" | "yearly" | "weekly";
  accountId?: string;
  accountName?: string;
  notes?: string;
}

export interface UpdateBillParams extends Partial<CreateBillParams> {
  id: string;
}

// Create a new bill
export async function createBill(billData: CreateBillParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const newBill = await Bill.create({
      ...billData,
      userId,
    });

    revalidatePath("/bills");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(newBill));
  } catch (error) {
    console.error("Error creating bill:", error);
    handleError(error);
    throw error;
  }
}

// Get all bills for the authenticated user
export async function getUserBills() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const bills = await Bill.find({ userId }).sort({ dueDate: 1 }).lean();

    return JSON.parse(JSON.stringify(bills));
  } catch (error) {
    console.error("Error fetching user bills:", error);
    handleError(error);
    throw error;
  }
}

// Get a specific bill by ID (user can only access their own)
export async function getBillById(billId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const bill = await Bill.findOne({
      _id: billId,
      userId,
    }).lean();

    if (!bill) {
      throw new Error("Bill not found");
    }

    return JSON.parse(JSON.stringify(bill));
  } catch (error) {
    console.error("Error fetching bill:", error);
    handleError(error);
    throw error;
  }
}

// Update a bill
export async function updateBill(billData: UpdateBillParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const { id, ...updateData } = billData;

    const updatedBill = await Bill.findOneAndUpdate(
      {
        _id: id,
        userId, // Ensure user can only update their own bills
      },
      updateData,
      { new: true }
    );

    if (!updatedBill) {
      throw new Error("Bill not found or unauthorized");
    }

    revalidatePath("/bills");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(updatedBill));
  } catch (error) {
    console.error("Error updating bill:", error);
    handleError(error);
    throw error;
  }
}

// Delete a bill
export async function deleteBill(billId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const deletedBill = await Bill.findOneAndDelete({
      _id: billId,
      userId, // Ensure user can only delete their own bills
    });

    if (!deletedBill) {
      throw new Error("Bill not found or unauthorized");
    }

    revalidatePath("/bills");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(deletedBill));
  } catch (error) {
    console.error("Error deleting bill:", error);
    handleError(error);
    throw error;
  }
}

// Get bill statistics for the authenticated user
export async function getBillStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const stats = await Bill.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          paidBills: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          unpaidBills: {
            $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] },
          },
          overdueBills: {
            $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] },
          },
          recurringBills: {
            $sum: { $cond: ["$isRecurring", 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalBills: 0,
        totalAmount: 0,
        paidBills: 0,
        unpaidBills: 0,
        overdueBills: 0,
        recurringBills: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching bill stats:", error);
    handleError(error);
    throw error;
  }
}

// Mark a bill as paid
export async function markBillAsPaid(billId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const updatedBill = await Bill.findOneAndUpdate(
      {
        _id: billId,
        userId,
      },
      { status: "paid" },
      { new: true }
    );

    if (!updatedBill) {
      throw new Error("Bill not found or unauthorized");
    }

    revalidatePath("/bills");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(updatedBill));
  } catch (error) {
    console.error("Error marking bill as paid:", error);
    handleError(error);
    throw error;
  }
}

// Get upcoming bills (due within the next 30 days)
export async function getUpcomingBills() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingBills = await Bill.find({
      userId,
      dueDate: { $lte: thirtyDaysFromNow },
      status: { $ne: "paid" },
    })
      .sort({ dueDate: 1 })
      .limit(10)
      .lean();

    return JSON.parse(JSON.stringify(upcomingBills));
  } catch (error) {
    console.error("Error fetching upcoming bills:", error);
    handleError(error);
    throw error;
  }
}
