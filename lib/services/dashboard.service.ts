"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  netIncome: number;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentTransactions: any[];
  upcomingBills: any[];
  budgetProgress: any[];
  financialGoals: any[];
  categoryBreakdown: any[];
  monthlySpending: any[];
  weeklySpending: any[];
  assets: any[];
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Helper function to serialize data for client components
    const serializeData = (data: any): any => {
      if (data === null || data === undefined) return data;
      if (
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "boolean"
      )
        return data;
      if (data instanceof Date) return data.toISOString();
      if (Array.isArray(data)) return data.map(serializeData);
      if (typeof data === "object") {
        const serialized: any = {};
        for (const [key, value] of Object.entries(data)) {
          if (key === "_id") {
            serialized.id = value?.toString() || value;
          } else {
            serialized[key] = serializeData(value);
          }
        }
        return serialized;
      }
      return data;
    };

    // Use dynamic imports only for the models, not the actions
    const [
      { Transaction },
      { Asset },
      { Budget },
      { Bill },
      { default: Goal },
      { default: Liability },
    ] = await Promise.all([
      import("@/database/models/transaction.model"),
      import("@/database/models/asset.model"),
      import("@/database/models/budget.model"),
      import("@/database/models/bill.model"),
      import("@/database/models/goal.model"),
      import("@/database/models/liability.model"),
    ]);

    // Fetch all data in parallel using direct database queries
    const [transactions, assets, budgets, bills, goals, liabilities] =
      await Promise.all([
        Transaction.find({ userId }).sort({ date: -1 }).lean(),
        Asset.find({ userId }).lean(),
        Budget.find({ userId }).lean(),
        Bill.find({ userId }).sort({ dueDate: 1 }).lean(),
        Goal.find({ userId, isActive: true }).lean(),
        Liability.find({ userId }).lean(),
      ]);

    // Serialize all fetched data
    const serializedTransactions = serializeData(transactions);
    const serializedAssets = serializeData(assets);
    const serializedBudgets = serializeData(budgets);
    const serializedBills = serializeData(bills);
    const serializedGoals = serializeData(goals);
    const serializedLiabilities = serializeData(liabilities);

    // Calculate current month metrics
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthTransactions = serializedTransactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const currentMonthIncome = currentMonthTransactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const currentMonthExpenses = currentMonthTransactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

    // Calculate net worth
    const totalAssets = serializedAssets.reduce(
      (sum: number, asset: any) => sum + (asset.currentValue || asset.value),
      0
    );
    const totalLiabilities = serializedLiabilities.reduce(
      (sum: number, liability: any) => sum + liability.amount,
      0
    );
    const netWorth = totalAssets - totalLiabilities;

    // Get recent transactions (last 5)
    const recentTransactions = serializedTransactions
      .slice(0, 5)
      .map((t: any) => ({
        id: t.id, // Now using the serialized id
        title: t.description,
        time: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: t.amount,
        type: t.type,
        color: t.type === "income" ? "bg-green-500" : "bg-red-500",
        textColor: t.type === "income" ? "text-green-600" : "text-red-600",
      }));

    // Get upcoming bills (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingBills = serializedBills
      .filter((bill: any) => {
        const dueDate = new Date(bill.dueDate);
        return dueDate >= currentDate && dueDate <= thirtyDaysFromNow;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 6)
      .map((bill: any) => ({
        name: bill.name,
        dueDate: new Date(bill.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: bill.amount,
      }));

    // Calculate budget progress
    const budgetProgress = serializedBudgets
      .filter((budget: any) => budget.isActive)
      .map((budget: any) => {
        const spent = budget.spent || 0;
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;

        return {
          category: budget.category,
          budgeted: budget.amount,
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
        };
      });

    // Get financial goals
    const financialGoals = serializedGoals
      .filter((goal: any) => goal.status === "active")
      .map((goal: any) => ({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progress: (goal.currentAmount / goal.targetAmount) * 100,
        targetDate: goal.targetDate,
        priority: goal.priority,
      }));

    // Calculate category breakdown for current month
    const categoryBreakdown = currentMonthTransactions
      .filter((t: any) => t.type === "expense")
      .reduce((acc: Record<string, number>, transaction: any) => {
        const category = transaction.category?.name || "Uncategorized";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const categoryBreakdownArray = Object.entries(categoryBreakdown)
      .map(([category, amount]): { category: string; amount: number } => ({
        category,
        amount: amount as number,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    // Calculate monthly spending for the last 6 months
    const monthlySpending = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = serializedTransactions.filter((t: any) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === month.getMonth() &&
          transactionDate.getFullYear() === month.getFullYear()
        );
      });

      const monthExpenses = monthTransactions
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      monthlySpending.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        expenses: monthExpenses,
      });
    }

    // Calculate weekly spending for current month
    const weeklySpending = [];
    const weeksInMonth = Math.ceil(
      new Date(currentYear, currentMonth + 1, 0).getDate() / 7
    );

    for (let week = 1; week <= weeksInMonth; week++) {
      const weekStart = new Date(currentYear, currentMonth, (week - 1) * 7 + 1);
      const weekEnd = new Date(
        currentYear,
        currentMonth,
        Math.min(week * 7, new Date(currentYear, currentMonth + 1, 0).getDate())
      );

      const weekTransactions = currentMonthTransactions.filter((t: any) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      });

      const weekExpenses = weekTransactions
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      weeklySpending.push({
        week: `Week ${week}`,
        expenses: weekExpenses,
      });
    }

    const metrics: DashboardMetrics = {
      totalIncome: currentMonthIncome,
      totalExpenses: currentMonthExpenses,
      savings: currentMonthSavings,
      netIncome: currentMonthSavings,
      netWorth,
      totalAssets,
      totalLiabilities,
    };

    return {
      metrics,
      recentTransactions,
      upcomingBills,
      budgetProgress,
      financialGoals,
      categoryBreakdown: categoryBreakdownArray,
      monthlySpending,
      weeklySpending,
      assets: serializedAssets,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
