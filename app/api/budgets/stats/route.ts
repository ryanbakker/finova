import { NextResponse } from "next/server";
import { getBudgetStats } from "@/lib/actions/budget.actions";

export async function GET() {
  try {
    const stats = await getBudgetStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching budget stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget stats" },
      { status: 500 }
    );
  }
}
