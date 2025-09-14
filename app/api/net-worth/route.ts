import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMonthlyNetWorthHistory } from "@/lib/services/networth.service";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[API] GET /api/net-worth - Request started`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
    });

    const authResult = await auth();
    userId = authResult.userId;

    if (!userId) {
      console.warn(`[API] GET /api/net-worth - Unauthorized access attempt`, {
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get("user-agent"),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip"),
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[API] GET /api/net-worth - User authenticated`, {
      userId,
      timestamp: new Date().toISOString(),
    });

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

    console.log(`[API] GET /api/net-worth - Fetching net worth data`, {
      userId,
      range,
      months,
      timestamp: new Date().toISOString(),
    });

    const netWorthData = await getMonthlyNetWorthHistory(userId, months);

    const responseTime = Date.now() - startTime;
    console.log(`[API] GET /api/net-worth - Data fetched successfully`, {
      userId,
      dataPoints: netWorthData.monthlyHistory.length,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: netWorthData,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[API] GET /api/net-worth - Error occurred`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch net worth data" },
      { status: 500 }
    );
  }
}
