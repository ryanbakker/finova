import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import Liability from "@/database/models/liability.model";

// Enhanced validation function
function validateLiabilityInput(body: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required field validation
  if (!body.name || typeof body.name !== "string" || (body.name as string).trim().length === 0) {
    errors.push("Liability name is required and must be a non-empty string");
  } else if ((body.name as string).trim().length > 100) {
    errors.push("Liability name cannot exceed 100 characters");
  }

  if (!body.category || typeof body.category !== "string" || (body.category as string).trim().length === 0) {
    errors.push("Category is required and must be a non-empty string");
  }

  if (body.amount === undefined || body.amount === null) {
    errors.push("Amount is required");
  } else if (typeof body.amount !== "number" || body.amount < 0) {
    errors.push("Amount must be a non-negative number");
  } else if (body.amount > 999999999) {
    errors.push("Amount cannot exceed 999,999,999");
  }

  if (!body.currency || typeof body.currency !== "string" || (body.currency as string).trim().length === 0) {
    errors.push("Currency is required and must be a non-empty string");
  }

  // Optional field validation
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

// GET /api/liabilities - Get all liabilities for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Build query
    const query: Record<string, unknown> = { userId };
    if (category && category !== "all") {
      query.category = category;
    }
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const liabilities = await Liability.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Liability.countDocuments(query);

    return NextResponse.json({
      liabilities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching liabilities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/liabilities - Create a new liability for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateLiabilityInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    await connectToDB();

    // Sanitize and prepare data
    const sanitizedData = {
      userId,
      name: (body.name as string).trim(),
      category: (body.category as string).trim(),
      amount: body.amount as number,
      currency: (body.currency as string).trim().toUpperCase(),
      institution: (body.institution as string)?.trim(),
      accountNumber: (body.accountNumber as string)?.trim(),
      dueDate: body.dueDate ? new Date(body.dueDate as string) : undefined,
      interestRate: body.interestRate as number,
      monthlyPayment: body.monthlyPayment as number,
      remainingBalance: body.remainingBalance as number || body.amount as number,
      originalAmount: body.originalAmount as number || body.amount as number,
      notes: (body.notes as string)?.trim(),
      isActive: body.isActive !== undefined ? body.isActive as boolean : true,
    };

    const newLiability = await Liability.create(sanitizedData);

    return NextResponse.json(newLiability, { status: 201 });
  } catch (error) {
    console.error("Error creating liability:", error);
    
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
