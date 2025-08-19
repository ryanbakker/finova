import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Asset } from "@/database/models/asset.model";

// Enhanced validation function
function validateAssetInput(body: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required field validation
  if (!body.name || typeof body.name !== "string" || (body.name as string).trim().length === 0) {
    errors.push("Asset name is required and must be a non-empty string");
  } else if ((body.name as string).trim().length > 100) {
    errors.push("Asset name cannot exceed 100 characters");
  }

  if (!body.category || typeof body.category !== "string" || (body.category as string).trim().length === 0) {
    errors.push("Category is required and must be a non-empty string");
  }

  if (body.value === undefined || body.value === null) {
    errors.push("Value is required");
  } else if (typeof body.value !== "number" || body.value < 0) {
    errors.push("Value must be a non-negative number");
  } else if (body.value > 999999999) {
    errors.push("Value cannot exceed 999,999,999");
  }

  if (!body.currency || typeof body.currency !== "string" || (body.currency as string).trim().length === 0) {
    errors.push("Currency is required and must be a non-empty string");
  }

  // Optional field validation
  if (body.currentValue !== undefined && body.currentValue !== null) {
    if (typeof body.currentValue !== "number" || body.currentValue < 0) {
      errors.push("Current value must be a non-negative number");
    }
  }

  if (body.changeAmount !== undefined && body.changeAmount !== null) {
    if (typeof body.changeAmount !== "number" || body.changeAmount < -999999999) {
      errors.push("Change amount cannot be less than -999,999,999");
    }
  }

  if (body.changePercentage !== undefined && body.changePercentage !== null) {
    if (typeof body.changePercentage !== "number" || body.changePercentage < -100 || body.changePercentage > 1000) {
      errors.push("Change percentage must be between -100% and 1000%");
    }
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string" || (body.notes as string).length > 1000) {
      errors.push("Notes cannot exceed 1000 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// GET /api/assets - Get all assets for the authenticated user
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

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Asset.countDocuments(query);

    return NextResponse.json({
      assets,
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
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/assets - Create a new asset for the authenticated user
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
    const validation = validateAssetInput(body);
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
      value: body.value as number,
      currency: (body.currency as string).trim(),
      institution: (body.institution as string)?.trim(),
      accountNumber: (body.accountNumber as string)?.trim(),
      purchaseDate: body.purchaseDate ? new Date(body.purchaseDate as string) : undefined,
      currentValue: body.currentValue as number || body.value as number,
      changeAmount: (body.changeAmount as number) || 0,
      changePercentage: (body.changePercentage as number) || 0,
      notes: (body.notes as string)?.trim(),
      isActive: body.isActive !== undefined ? body.isActive as boolean : true,
    };

    const newAsset = await Asset.create(sanitizedData);

    return NextResponse.json(newAsset, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    
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
