import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import Liability from "@/database/models/liability.model";

// PUT /api/liabilities/[id]/amount - Update liability amount and create history record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Liability ID is required and must be a valid string" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newAmount, changeReason, changeDate } = body;

    // Validate input
    if (typeof newAmount !== "number" || newAmount < 0) {
      return NextResponse.json(
        { error: "New amount must be a non-negative number" },
        { status: 400 }
      );
    }

    if (newAmount > 999999999) {
      return NextResponse.json(
        { error: "New amount cannot exceed 999,999,999" },
        { status: 400 }
      );
    }

    if (
      changeReason &&
      (typeof changeReason !== "string" || changeReason.length > 500)
    ) {
      return NextResponse.json(
        { error: "Change reason must be a string with maximum 500 characters" },
        { status: 400 }
      );
    }

    if (
      changeDate &&
      (typeof changeDate !== "string" || isNaN(Date.parse(changeDate)))
    ) {
      return NextResponse.json(
        { error: "Change date must be a valid date string" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Get the current liability
    const currentLiability = await Liability.findOne({
      _id: id.trim(),
      userId,
    });

    if (!currentLiability) {
      return NextResponse.json(
        { error: "Liability not found or unauthorized" },
        { status: 404 }
      );
    }

    const previousAmount =
      currentLiability.currentAmount || currentLiability.amount;
    const changeAmount = newAmount - previousAmount;
    const changePercentage =
      previousAmount > 0 ? (changeAmount / previousAmount) * 100 : 0;

    // Update the liability's current amount and add to amount history
    const updatedLiability = await Liability.findOneAndUpdate(
      {
        _id: id.trim(),
        userId,
      },
      {
        $set: {
          currentAmount: newAmount,
          changeAmount,
          changePercentage,
        },
        $push: {
          amountHistory: {
            amount: newAmount,
            createdAt: changeDate ? new Date(changeDate) : new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedLiability) {
      return NextResponse.json(
        { error: "Failed to update liability" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedLiability);
  } catch (error) {
    console.error("Error updating liability amount:", error);

    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    // Handle MongoDB ObjectId validation errors
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid liability ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/liabilities/[id]/amount - Get liability amount history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Liability ID is required and must be a valid string" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be a number between 1 and 100" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Verify the liability belongs to the user
    const liability = await Liability.findOne({
      _id: id.trim(),
      userId,
    });

    if (!liability) {
      return NextResponse.json(
        { error: "Liability not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get amount history from the liability's amountHistory array
    const history = (liability.amountHistory || [])
      .sort(
        (a: { createdAt: Date }, b: { createdAt: Date }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching liability amount history:", error);

    // Handle MongoDB ObjectId validation errors
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid liability ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
