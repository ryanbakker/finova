"use server";

import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { connectToDB } from "@/database/db";
import Liability from "@/database/models/liability.model";
import { ValueHistory } from "@/database/models/valueHistory.model";
import { updateItemValue } from "@/lib/services/networth.service";
import { auth } from "@clerk/nextjs/server";

declare type CreateLiabilityParams = {
  name: string;
  category: string;
  currentValue: number;
  description?: string;
};

declare type UpdateLiabilityParams = {
  name?: string;
  category?: string;
  currentValue?: number;
  description?: string;
};

export interface UpdateLiabilityAmountParams {
  liabilityId: string;
  newAmount: number;
  timestamp?: string;
}

// Helper function to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return userId;
}

export async function createLiability(liability: CreateLiabilityParams) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    // Sanitize and prepare data
    const sanitizedData = {
      ...liability,
      userId,
      name: liability.name.trim(),
      category: liability.category.trim(),
      description: liability.description?.trim(),
      changeAmount: 0,
      changePercentage: 0,
    };

    // Create new liability with user ID
    const newLiability = await Liability.create(sanitizedData);

    // Create initial value history entry
    await ValueHistory.create({
      userId,
      itemId: newLiability._id.toString(),
      itemType: "LIABILITY",
      value: liability.currentValue,
      timestamp: new Date(),
    });

    revalidatePath("/liabilities");
    revalidatePath("/dashboard");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedLiability = {
      ...newLiability.toObject(),
      id: newLiability._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedLiability));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getLiabilitiesByUserId() {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    const liabilities = await Liability.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform MongoDB _id to id for frontend compatibility
    const transformedLiabilities = liabilities.map((liability) => ({
      ...liability,
      id: liability._id,
      _id: undefined,
    }));

    return JSON.parse(JSON.stringify(transformedLiabilities));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getLiabilityById(liabilityId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    // Ensure user can only access their own liability
    const liability = await Liability.findOne({
      _id: liabilityId,
      userId,
    }).lean();

    if (!liability) {
      throw new Error("Liability not found or access denied");
    }

    // Transform MongoDB _id to id for frontend compatibility
    const transformedLiability = {
      ...liability,
      id: liability._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedLiability));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updateLiability(
  liabilityId: string,
  updates: UpdateLiabilityParams
) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    // Ensure user can only update their own liability
    const existingLiability = await Liability.findOne({
      _id: liabilityId,
      userId,
    });

    if (!existingLiability) {
      throw new Error("Liability not found or access denied");
    }

    // Convert string dates to Date objects if provided
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.dueDate) {
      updateData.dueDate = new Date(updates.dueDate);
    }

    const updatedLiability = await Liability.findByIdAndUpdate(
      liabilityId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLiability) {
      throw new Error("Failed to update liability");
    }

    revalidatePath("/liabilities");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedLiability = {
      ...updatedLiability.toObject(),
      id: updatedLiability._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedLiability));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function deleteLiability(liabilityId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    // Ensure user can only delete their own liability
    const existingLiability = await Liability.findOne({
      _id: liabilityId,
      userId,
    });

    if (!existingLiability) {
      throw new Error("Liability not found or access denied");
    }

    const deletedLiability = await Liability.findByIdAndDelete(liabilityId);

    if (!deletedLiability) {
      throw new Error("Failed to delete liability");
    }

    revalidatePath("/liabilities");
    return JSON.parse(JSON.stringify(deletedLiability));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getLiabilityStats() {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    const stats = await Liability.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalLiabilities: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalRemainingBalance: { $sum: "$remainingBalance" },
          totalMonthlyPayments: { $sum: { $ifNull: ["$monthlyPayment", 0] } },
          averageInterestRate: { $avg: "$interestRate" },
        },
      },
    ]);

    const categoryBreakdown = await Liability.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalRemainingBalance: { $sum: "$remainingBalance" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    return {
      summary: stats[0] || {
        totalLiabilities: 0,
        totalAmount: 0,
        totalRemainingBalance: 0,
        totalMonthlyPayments: 0,
        averageInterestRate: 0,
      },
      categoryBreakdown,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function searchLiabilities(
  query: string,
  filters?: {
    category?: string;
    status?: string;
    minAmount?: number;
    maxAmount?: number;
  }
) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    const searchQuery: Record<string, unknown> = { userId };

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { institution: { $regex: query, $options: "i" } },
        { notes: { $regex: query, $options: "i" } },
      ];
    }

    // Apply filters
    if (filters?.category) {
      searchQuery.category = filters.category;
    }

    if (filters?.status === "active") {
      searchQuery.isActive = true;
    } else if (filters?.status === "inactive") {
      searchQuery.isActive = false;
    }

    if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
      (searchQuery.amount as Record<string, number>) = {};
      if (filters.minAmount !== undefined) {
        (searchQuery.amount as Record<string, number>).$gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        (searchQuery.amount as Record<string, number>).$lte = filters.maxAmount;
      }
    }

    const liabilities = await Liability.find(searchQuery)
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(liabilities));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Update liability amount and create history record
export async function updateLiabilityAmount(
  params: UpdateLiabilityAmountParams
) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    const { liabilityId, newAmount, timestamp } = params;

    if (
      !liabilityId ||
      typeof liabilityId !== "string" ||
      liabilityId.trim().length === 0
    ) {
      throw new Error("Invalid liability ID provided");
    }

    if (typeof newAmount !== "number" || newAmount < 0) {
      throw new Error("New amount must be a non-negative number");
    }

    if (newAmount > 999999999) {
      throw new Error("New amount cannot exceed 999,999,999");
    }

    // Use the new net worth service to update the value
    const result = await updateItemValue(userId, {
      itemId: liabilityId.trim(),
      itemType: "LIABILITY",
      newValue: newAmount,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    revalidatePath("/liabilities");
    revalidatePath("/dashboard");

    return { success: true, message: "Liability amount updated successfully" };
  } catch (error) {
    console.error("Error updating liability amount:", error);
    handleError(error);
    throw error;
  }
}

// Get liability amount history
export async function getLiabilityAmountHistory(
  liabilityId: string,
  limit: number = 50
) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectToDB();

    if (
      !liabilityId ||
      typeof liabilityId !== "string" ||
      liabilityId.trim().length === 0
    ) {
      throw new Error("Invalid liability ID provided");
    }

    if (typeof limit !== "number" || limit < 1 || limit > 100) {
      throw new Error("Limit must be a number between 1 and 100");
    }

    // Get the liability to ensure user owns it
    const liability = await Liability.findOne({
      _id: liabilityId.trim(),
      userId,
    });

    if (!liability) {
      throw new Error("Liability not found or unauthorized");
    }

    // Get amount history from the ValueHistory collection
    const valueHistory = await ValueHistory.find({
      userId,
      itemId: liabilityId.trim(),
      itemType: "LIABILITY",
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return valueHistory.map((entry) => ({
      amount: entry.value,
      createdAt: entry.timestamp.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching liability amount history:", error);
    handleError(error);
    throw error;
  }
}
