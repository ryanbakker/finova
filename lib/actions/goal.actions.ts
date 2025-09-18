"use server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { connectToDB } from "@/database/db";
import Goal from "@/database/models/goal.model";

declare type CreateGoalParams = {
  userId: string;
  name: string;
  category: {
    name: string;
    icon: string;
  };
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
  category?: {
    name: string;
    icon: string;
  };
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
  const startTime = Date.now();

  try {
    console.log(`[ACTION] createGoal - Starting goal creation`, {
      userId: goal.userId,
      goalName: goal.name,
      category: goal.category,
      targetAmount: goal.targetAmount,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    // Validate that the goal belongs to the authenticated user
    if (!goal.userId) {
      console.error(`[ACTION] createGoal - Missing user ID`, {
        goalData: goal,
        timestamp: new Date().toISOString(),
      });
      throw new Error("User ID is required");
    }

    // Additional validation
    if (!goal.name || goal.name.trim().length === 0) {
      console.error(`[ACTION] createGoal - Invalid goal name`, {
        userId: goal.userId,
        goalName: goal.name,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Goal name is required");
    }

    if (goal.targetAmount <= 0) {
      console.error(`[ACTION] createGoal - Invalid target amount`, {
        userId: goal.userId,
        targetAmount: goal.targetAmount,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Target amount must be greater than 0");
    }

    console.log(`[ACTION] createGoal - Validation passed, creating goal`, {
      userId: goal.userId,
      timestamp: new Date().toISOString(),
    });

    const newGoal = await Goal.create(goal);
    revalidatePath("/goals");

    const responseTime = Date.now() - startTime;
    console.log(`[ACTION] createGoal - Goal created successfully`, {
      userId: goal.userId,
      goalId: newGoal._id,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    // Transform MongoDB _id to id for frontend compatibility
    const transformedGoal = {
      ...newGoal.toObject(),
      id: newGoal._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedGoal));
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[ACTION] createGoal - Error occurred`, {
      userId: goal.userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
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

    // Transform MongoDB _id to id for frontend compatibility
    const transformedGoals = goals.map((goal) => ({
      ...goal,
      id: goal._id,
      _id: undefined,
    }));

    return JSON.parse(JSON.stringify(transformedGoals));
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

    // Transform MongoDB _id to id for frontend compatibility
    const transformedGoal = {
      ...goal.toObject(),
      id: goal._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedGoal));
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

    // Transform MongoDB _id to id for frontend compatibility
    const transformedGoal = {
      ...updatedGoal.toObject(),
      id: updatedGoal._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedGoal));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// Delete a goal (with user authentication)
export async function deleteGoal(goalId: string, userId: string) {
  const startTime = Date.now();

  try {
    console.log(`[ACTION] deleteGoal - Starting goal deletion`, {
      goalId,
      userId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    if (!goalId || !userId) {
      console.error(`[ACTION] deleteGoal - Missing required parameters`, {
        goalId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Goal ID and User ID are required");
    }

    // Validate goalId format (basic MongoDB ObjectId check)
    if (goalId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(goalId)) {
      console.error(`[ACTION] deleteGoal - Invalid goal ID format`, {
        goalId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Invalid goal ID format");
    }

    // First verify the goal belongs to the user
    const existingGoal = await Goal.findOne({ _id: goalId, userId });
    if (!existingGoal) {
      console.warn(`[ACTION] deleteGoal - Goal not found or access denied`, {
        goalId,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Goal not found or access denied");
    }

    console.log(
      `[ACTION] deleteGoal - Goal ownership verified, proceeding with deletion`,
      {
        goalId,
        userId,
        goalName: existingGoal.name,
        timestamp: new Date().toISOString(),
      }
    );

    const deletedGoal = await Goal.findByIdAndDelete(goalId);
    revalidatePath("/goals");

    const responseTime = Date.now() - startTime;
    console.log(`[ACTION] deleteGoal - Goal deleted successfully`, {
      goalId,
      userId,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return deletedGoal ? JSON.parse(JSON.stringify(deletedGoal)) : null;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[ACTION] deleteGoal - Error occurred`, {
      goalId,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
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
