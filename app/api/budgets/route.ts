import { NextRequest, NextResponse } from "next/server";
import { getUserBudgets, createBudget } from "@/lib/actions/budget.actions";

export async function GET() {
  try {
    const budgets = await getUserBudgets();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const budget = await createBudget(body);
    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
