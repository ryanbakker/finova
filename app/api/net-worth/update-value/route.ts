import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateItemValue } from "@/lib/services/networth.service";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, itemType, newValue, timestamp } = body;

    // Validate required fields
    if (!itemId || !itemType || newValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: itemId, itemType, newValue" },
        { status: 400 }
      );
    }

    // Validate itemType
    if (!["ASSET", "LIABILITY"].includes(itemType)) {
      return NextResponse.json(
        { error: "itemType must be either 'ASSET' or 'LIABILITY'" },
        { status: 400 }
      );
    }

    // Validate newValue
    if (typeof newValue !== "number" || newValue < 0) {
      return NextResponse.json(
        { error: "newValue must be a non-negative number" },
        { status: 400 }
      );
    }

    const result = await updateItemValue(userId, {
      itemId,
      itemType: itemType as "ASSET" | "LIABILITY",
      newValue,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating item value:", error);
    return NextResponse.json(
      { error: "Failed to update item value" },
      { status: 500 }
    );
  }
}

