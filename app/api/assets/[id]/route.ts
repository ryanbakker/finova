import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Asset } from "@/database/models/asset.model";

// Enhanced validation function for updates
function validateAssetUpdate(body: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name if provided
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("Asset name must be a non-empty string");
    } else if (body.name.trim().length > 100) {
      errors.push("Asset name cannot exceed 100 characters");
    }
  }

  // Validate category if provided
  if (body.category !== undefined) {
    if (typeof body.category !== "string" || body.category.trim().length === 0) {
      errors.push("Category must be a non-empty string");
    }
  }

  // Validate value if provided
  if (body.value !== undefined) {
    if (typeof body.value !== "number" || body.value < 0) {
      errors.push("Value must be a non-negative number");
    } else if (body.value > 999999999) {
      errors.push("Value cannot exceed 999,999,999");
    }
  }

  // Validate currency if provided
  if (body.currency !== undefined) {
    if (typeof body.currency !== "string" || body.currency.trim().length === 0) {
      errors.push("Currency must be a non-empty string");
    }
  }

  // Validate currentValue if provided
  if (body.currentValue !== undefined && body.currentValue !== null) {
    if (typeof body.currentValue !== "number" || body.currentValue < 0) {
      errors.push("Current value must be a non-negative number");
    }
  }

  // Validate changeAmount if provided
  if (body.changeAmount !== undefined && body.changeAmount !== null) {
    if (typeof body.changeAmount !== "number" || body.changeAmount < -999999999) {
      errors.push("Change amount cannot be less than -999,999,999");
    }
  }

  // Validate changePercentage if provided
  if (body.changePercentage !== undefined && body.changePercentage !== null) {
    if (typeof body.changePercentage !== "number" || body.changePercentage < -100 || body.changePercentage > 1000) {
      errors.push("Change percentage must be between -100% and 1000%");
    }
  }

  // Validate notes if provided
  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string" || body.notes.length > 1000) {
      errors.push("Notes cannot exceed 1000 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// GET /api/assets/[id] - Get a specific asset by ID
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

    await connectToDB();

    const asset = await Asset.findOne({
      _id: id.trim(),
      userId,
    }).lean();

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    
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

// PUT /api/assets/[id] - Update a specific asset by ID
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

    // Validate update data
    const validation = validateAssetUpdate(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    await connectToDB();

    // Sanitize update data
    const sanitizedUpdateData: Record<string, unknown> = {};
    
    if (body.name !== undefined) sanitizedUpdateData.name = (body.name as string).trim();
    if (body.category !== undefined) sanitizedUpdateData.category = (body.category as string).trim();
    if (body.value !== undefined) sanitizedUpdateData.value = body.value;
    if (body.currency !== undefined) sanitizedUpdateData.currency = (body.currency as string).trim();
    if (body.institution !== undefined) sanitizedUpdateData.institution = (body.institution as string)?.trim();
    if (body.accountNumber !== undefined) sanitizedUpdateData.accountNumber = (body.accountNumber as string)?.trim();
    if (body.purchaseDate !== undefined) sanitizedUpdateData.purchaseDate = body.purchaseDate;
    if (body.currentValue !== undefined) sanitizedUpdateData.currentValue = body.currentValue;
    if (body.changeAmount !== undefined) sanitizedUpdateData.changeAmount = body.changeAmount;
    if (body.changePercentage !== undefined) sanitizedUpdateData.changePercentage = body.changePercentage;
    if (body.notes !== undefined) sanitizedUpdateData.notes = (body.notes as string)?.trim();
    if (body.isActive !== undefined) sanitizedUpdateData.isActive = body.isActive;

    // Ensure user can only update their own assets
    const updatedAsset = await Asset.findOneAndUpdate(
      {
        _id: id.trim(),
        userId,
      },
      sanitizedUpdateData,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    
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

// DELETE /api/assets/[id] - Delete a specific asset by ID
export async function DELETE(
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

    await connectToDB();

    const deletedAsset = await Asset.findOneAndDelete({
      _id: id.trim(),
      userId, // Ensure user can only delete their own assets
    });

    if (!deletedAsset) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Asset deleted successfully",
        deletedAsset: {
          id: deletedAsset._id,
          name: deletedAsset.name,
          category: deletedAsset.category,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting asset:", error);
    
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

// PATCH /api/assets/[id] - Partial update for specific fields
export async function PATCH(
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

    // Validate update data
    const validation = validateAssetUpdate(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    await connectToDB();

    // Sanitize update data (same as PUT but only for provided fields)
    const sanitizedUpdateData: Record<string, unknown> = {};
    
    if (body.name !== undefined) sanitizedUpdateData.name = (body.name as string).trim();
    if (body.category !== undefined) sanitizedUpdateData.category = (body.category as string).trim();
    if (body.value !== undefined) sanitizedUpdateData.value = body.value;
    if (body.currency !== undefined) sanitizedUpdateData.currency = (body.currency as string).trim();
    if (body.institution !== undefined) sanitizedUpdateData.institution = (body.institution as string)?.trim();
    if (body.accountNumber !== undefined) sanitizedUpdateData.accountNumber = (body.accountNumber as string)?.trim();
    if (body.purchaseDate !== undefined) sanitizedUpdateData.purchaseDate = body.purchaseDate;
    if (body.currentValue !== undefined) sanitizedUpdateData.currentValue = body.currentValue;
    if (body.changeAmount !== undefined) sanitizedUpdateData.changeAmount = body.changeAmount;
    if (body.changePercentage !== undefined) sanitizedUpdateData.changePercentage = body.changePercentage;
    if (body.notes !== undefined) sanitizedUpdateData.notes = (body.notes as string)?.trim();
    if (body.isActive !== undefined) sanitizedUpdateData.isActive = body.isActive;

    // Ensure user can only update their own assets
    const updatedAsset = await Asset.findOneAndUpdate(
      {
        _id: id.trim(),
        userId,
      },
      sanitizedUpdateData,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    
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
