import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Asset } from "@/database/models/asset.model";

// PUT /api/assets/[id]/value - Update asset value and create history record
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
        { error: "Asset ID is required and must be a valid string" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newValue, changeReason, changeDate } = body;

    // Validate input
    if (typeof newValue !== "number" || newValue < 0) {
      return NextResponse.json(
        { error: "New value must be a non-negative number" },
        { status: 400 }
      );
    }

    if (newValue > 999999999) {
      return NextResponse.json(
        { error: "New value cannot exceed 999,999,999" },
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

    // Get the current asset
    const currentAsset = await Asset.findOne({
      _id: id.trim(),
      userId,
    });

    if (!currentAsset) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    const previousValue = currentAsset.currentValue || currentAsset.value;
    const changeAmount = newValue - previousValue;
    const changePercentage =
      previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

    // Update the asset's current value and add to value history
    const updatedAsset = await Asset.findOneAndUpdate(
      {
        _id: id.trim(),
        userId,
      },
      {
        $set: {
          currentValue: newValue,
          changeAmount,
          changePercentage,
        },
        $push: {
          valueHistory: {
            value: newValue,
            createdAt: changeDate ? new Date(changeDate) : new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Failed to update asset" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset value:", error);

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
        { error: "Invalid asset ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/assets/[id]/value - Get asset value history
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
        { error: "Asset ID is required and must be a valid string" },
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

    // Verify the asset belongs to the user
    const asset = await Asset.findOne({
      _id: id.trim(),
      userId,
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get value history from the asset's valueHistory array
    const history = (asset.valueHistory || [])
      .sort(
        (a: { createdAt: Date }, b: { createdAt: Date }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching asset value history:", error);

    // Handle MongoDB ObjectId validation errors
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid asset ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
