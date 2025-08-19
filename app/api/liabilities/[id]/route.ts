import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import Liability from "@/database/models/liability.model";

// Enhanced validation function for updates
function validateLiabilityUpdate(body: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Optional field validation (all fields are optional for updates)
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || (body.name as string).trim().length === 0) {
      errors.push("Liability name must be a non-empty string");
    } else if ((body.name as string).trim().length > 100) {
      errors.push("Liability name cannot exceed 100 characters");
    }
  }

  if (body.category !== undefined) {
    if (typeof body.category !== "string" || (body.category as string).trim().length === 0) {
      errors.push("Category must be a non-empty string");
    }
  }

  if (body.amount !== undefined) {
    if (typeof body.amount !== "number" || body.amount < 0) {
      errors.push("Amount must be a non-negative number");
    } else if (body.amount > 999999999) {
      errors.push("Amount cannot exceed 999,999,999");
    }
  }

  if (body.currency !== undefined) {
    if (typeof body.currency !== "string" || (body.currency as string).trim().length === 0) {
      errors.push("Currency must be a non-empty string");
    }
  }

  if (body.interestRate !== undefined && body.interestRate !== null) {
    if (typeof body.interestRate !== "number" || body.interestRate < 0 || body.interestRate > 100) {
      errors.push("Interest rate must be between 0% and 100%");
    }
  }

  if (body.monthlyPayment !== undefined && body.monthlyPayment !== null) {
    if (typeof body.monthlyPayment !== "number" || body.monthlyPayment < 0) {
      errors.push("Monthly payment must be a non-negative number");
    }
  }

  if (body.remainingBalance !== undefined && body.remainingBalance !== null) {
    if (typeof body.remainingBalance !== "number" || body.remainingBalance < 0) {
      errors.push("Remaining balance must be a non-negative number");
    }
  }

  if (body.originalAmount !== undefined && body.originalAmount !== null) {
    if (typeof body.originalAmount !== "number" || body.originalAmount < 0) {
      errors.push("Original amount must be a non-negative number");
    }
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string" || (body.notes as string).length > 500) {
      errors.push("Notes cannot exceed 500 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// GET /api/liabilities/[id] - Get a specific liability by ID
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

    await connectToDB();

    // Ensure user can only access their own liability
    const liability = await Liability.findOne({
      _id: id,
      userId
    }).lean();

    if (!liability) {
      return NextResponse.json(
        { error: "Liability not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(liability);
  } catch (error) {
    console.error("Error fetching liability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/liabilities/[id] - Update a specific liability by ID
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
        { status: 400 }
      );
    }

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Liability ID is required and must be a valid string" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateLiabilityUpdate(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    await connectToDB();

    // Ensure user can only update their own liability
    const existingLiability = await Liability.findOne({
      _id: id,
      userId
    });

    if (!existingLiability) {
      return NextResponse.json(
        { error: "Liability not found or access denied" },
        { status: 404 }
      );
    }

    // Sanitize and prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (body.name !== undefined) {
      updateData.name = (body.name as string).trim();
    }
    if (body.category !== undefined) {
      updateData.category = (body.category as string).trim();
    }
    if (body.amount !== undefined) {
      updateData.amount = body.amount as number;
    }
    if (body.currency !== undefined) {
      updateData.currency = (body.currency as string).trim().toUpperCase();
    }
    if (body.institution !== undefined) {
      updateData.institution = (body.institution as string)?.trim();
    }
    if (body.accountNumber !== undefined) {
      updateData.accountNumber = (body.accountNumber as string)?.trim();
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate as string) : undefined;
    }
    if (body.interestRate !== undefined) {
      updateData.interestRate = body.interestRate as number;
    }
    if (body.monthlyPayment !== undefined) {
      updateData.monthlyPayment = body.monthlyPayment as number;
    }
    if (body.remainingBalance !== undefined) {
      updateData.remainingBalance = body.remainingBalance as number;
    }
    if (body.originalAmount !== undefined) {
      updateData.originalAmount = body.originalAmount as number;
    }
    if (body.notes !== undefined) {
      updateData.notes = (body.notes as string)?.trim();
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive as boolean;
    }

    const updatedLiability = await Liability.findByIdAndUpdate(
      id,
      updateData,
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
    console.error("Error updating liability:", error);
    
    // Handle MongoDB validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/liabilities/[id] - Delete a specific liability by ID
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
        { status: 400 }
      );
    }

    await connectToDB();

    // Ensure user can only delete their own liability
    const existingLiability = await Liability.findOne({
      _id: id,
      userId
    });

    if (!existingLiability) {
      return NextResponse.json(
        { error: "Liability not found or access denied" },
        { status: 404 }
      );
    }

    const deletedLiability = await Liability.findByIdAndDelete(id);

    if (!deletedLiability) {
      return NextResponse.json(
        { error: "Failed to delete liability" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Liability deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting liability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
