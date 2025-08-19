"use server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { connectToDB } from "@/database/db";
import Goal from "@/database/models/goal.model";

declare type CreateGoalParams = {
  userId: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused";
  notes?: string;
  isActive: boolean;
};

declare type UpdateGoalParams = {
  name?: string;
  category?: string;
  targetAmount?: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: string;
  priority?: "low" | "medium" | "high";
  status?: "active" | "completed" | "paused";
  notes?: string;
  isActive?: boolean;
};

// Create a new goal
export async function createGoal(goal: CreateGoalParams) {
  try {
    await connectToDB();

    // Validate that the goal belongs to the authenticated user
    if (!goal.userId) {
      throw new Error("User ID is required");
    }

    const newGoal = await Goal.create(goal);
    revalidatePath("/goals");

    return JSON.parse(JSON.stringify(newGoal));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Get all goals for a specific user
export async function getGoalsByUserId(userId: string) {
  try {
    await connectToDB();

    if (!userId) {
      throw new Error("User ID is required");
    }

    const goals = await Goal.find({ userId, isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(goals));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Get a specific goal by ID (with user authentication)
export async function getGoalById(goalId: string, userId: string) {
  try {
    await connectToDB();

    if (!goalId || !userId) {
      throw new Error("Goal ID and User ID are required");
    }

    const goal = await Goal.findOne({ _id: goalId, userId });

    if (!goal) {
      throw new Error("Goal not found or access denied");
    }

    return JSON.parse(JSON.stringify(goal));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Update a goal (with user authentication)
export async function updateGoal(
  goalId: string,
  userId: string,
  updates: UpdateGoalParams
) {
  try {
    await connectToDB();

    if (!goalId || !userId) {
      throw new Error("Goal ID and User ID are required");
    }

    // First verify the goal belongs to the user
    const existingGoal = await Goal.findOne({ _id: goalId, userId });
    if (!existingGoal) {
      throw new Error("Goal not found or access denied");
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      throw new Error("Failed to update goal");
    }

    revalidatePath("/goals");
    return JSON.parse(JSON.stringify(updatedGoal));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Delete a goal (with user authentication)
export async function deleteGoal(goalId: string, userId: string) {
  try {
    await connectToDB();

    if (!goalId || !userId) {
      throw new Error("Goal ID and User ID are required");
    }

    // First verify the goal belongs to the user
    const existingGoal = await Goal.findOne({ _id: goalId, userId });
    if (!existingGoal) {
      throw new Error("Goal not found or access denied");
    }

    const deletedGoal = await Goal.findByIdAndDelete(goalId);
    revalidatePath("/goals");

    return deletedGoal ? JSON.parse(JSON.stringify(deletedGoal)) : null;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Soft delete a goal (mark as inactive)
export async function deactivateGoal(goalId: string, userId: string) {
  try {
    await connectToDB();

    if (!goalId || !userId) {
      throw new Error("Goal ID and User ID are required");
    }

    // First verify the goal belongs to the user
    const existingGoal = await Goal.findOne({ _id: goalId, userId });
    if (!existingGoal) {
      throw new Error("Goal not found or access denied");
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedGoal) {
      throw new Error("Failed to deactivate goal");
    }

    revalidatePath("/goals");
    return JSON.parse(JSON.stringify(updatedGoal));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Get goal statistics for a user
export async function getGoalStats(userId: string) {
  try {
    await connectToDB();

    if (!userId) {
      throw new Error("User ID is required");
    }

    const stats = await Goal.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalGoals: { $sum: 1 },
          activeGoals: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          completedGoals: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pausedGoals: {
            $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] },
          },
          totalTargetAmount: { $sum: "$targetAmount" },
          totalCurrentAmount: { $sum: "$currentAmount" },
        },
      },
    ]);

    return (
      stats[0] || {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        pausedGoals: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
      }
    );
  } catch (error) {
    handleError(error);
    throw error;
  }
}
