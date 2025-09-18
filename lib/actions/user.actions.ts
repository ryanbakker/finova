"use server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { connectToDB } from "@/database/db";
import User from "@/database/models/user.model";

declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  companyId?: string;
  subscription?: {
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled" | "past_due";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
  companyId?: string;
  subscription?: {
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled" | "past_due";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
};

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDB();

    const newUser = await User.create(user);

    const result = JSON.parse(JSON.stringify(newUser));
    return result;
  } catch (e) {
    handleError(e);
    throw e; // Re-throw to ensure the error is properly handled
  }
}
export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDB();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}
export async function deleteUser(clerkId: string) {
  try {
    await connectToDB();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUserSubscription(
  clerkId: string,
  subscription: {
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled" | "past_due";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
) {
  try {
    await connectToDB();
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { subscription },
      { new: true }
    );

    if (!updatedUser) throw new Error("User not found");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUsersByCompanyId(companyId: string) {
  try {
    await connectToDB();
    const users = await User.find({ companyId, isActive: true });
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUsersByCompanyId(
  companyId: string,
  subscription: {
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled" | "past_due";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
) {
  try {
    await connectToDB();
    const updatedUsers = await User.updateMany(
      { companyId, isActive: true },
      { subscription },
      { new: true }
    );

    console.log(
      `[USER_ACTIONS] Updated ${updatedUsers.modifiedCount} users for company ${companyId}`
    );

    return {
      modifiedCount: updatedUsers.modifiedCount,
      matchedCount: updatedUsers.matchedCount,
    };
  } catch (error) {
    handleError(error);
  }
}
