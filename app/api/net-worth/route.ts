import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getCurrentNetWorth,
  getMonthlyNetWorthHistory,
} from "@/lib/services/networth.service";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "1Y";

    // Parse range parameter
    let months = 12;
    if (range === "6M") {
      months = 6;
    } else if (range === "1Y") {
      months = 12;
    } else if (range === "2Y") {
      months = 24;
    }

    const netWorthData = await getMonthlyNetWorthHistory(userId, months);

    return NextResponse.json({
      success: true,
      data: netWorthData,
    });
  } catch (error) {
    console.error("Error fetching net worth data:", error);
    return NextResponse.json(
      { error: "Failed to fetch net worth data" },
      { status: 500 }
    );
  }
}

