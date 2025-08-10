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
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

export async function createUser(user: CreateUserParams) {
  try {
    console.log("createUser called with:", user);
    console.log("Attempting to connect to database...");

    const connection = await connectToDB();
    console.log("Database connected successfully");

    console.log("Creating user in database...");
    const newUser = await User.create(user);
    console.log("User created in database:", newUser);

    const result = JSON.parse(JSON.stringify(newUser));
    console.log("Returning parsed user:", result);
    return result;
  } catch (e) {
    console.error("Error in createUser:", e);

    // Check if it's a connection error
    if (
      e instanceof Error &&
      (e.message.includes("SSL") || e.message.includes("TLS"))
    ) {
      console.error("SSL/TLS connection error detected. This might be due to:");
      console.error("1. Network/firewall issues");
      console.error("2. MongoDB Atlas SSL certificate issues");
      console.error("3. Connection string format problems");
    }

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
