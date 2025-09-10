"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import {
  getCurrentNetWorth,
  getMonthlyNetWorthHistory,
} from "./networth.service";

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
  recentTransactions: Array<{
    id: string;
    title: string;
    time: string;
    amount: number;
    type: string;
    color: string;
    textColor: string;
    accountId?: string;
    accountName?: string;
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  }>;
  upcomingBills: Array<{
    name: string;
    dueDate: string;
    amount: number;
  }>;
  budgetProgress: Array<{
    category: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  financialGoals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    progress: number;
    targetDate: string;
    priority: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
  }>;
  monthlySpending: Array<{
    month: string;
    expenses: number;
  }>;
  weeklySpending: Array<{
    week: string;
    expenses: number;
  }>;
  monthlyIncomeSpending: Array<{
    month: string;
    income: number;
    spending: number;
    surplus: number;
  }>;
  assets: Array<{
    id: string;
    name: string;
    category: string;
    currentValue: number;
    changeAmount: number;
    changePercentage: number;
    description?: string;
    institution?: string;
    currency?: string;
    isActive?: boolean;
    value?: number;
    type?: string;
    originalValue?: number;
    createdAt: string;
    updatedAt: string;
  }>;
  netWorthHistory: Array<{
    month: string;
    netWorth: number;
    totalAssets: number;
    totalLiabilities: number;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    // Helper function to serialize data for client components
    const serializeData = (data: unknown): unknown => {
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
        const serialized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(
          data as Record<string, unknown>
        )) {
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
    const [transactions, assets, budgets, bills, goals] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1, createdAt: -1 }).lean(),
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
    // Note: serializedLiabilities is not used in this function

    // Calculate current month metrics
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthTransactions = (
      serializedTransactions as Array<Record<string, unknown>>
    ).filter((t) => {
      const transactionDate = new Date(t.date as string);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const currentMonthIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

    const currentMonthExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

    // Calculate savings contributions from transfer transactions
    // These represent money moved to savings accounts, investments, etc.
    const currentMonthSavingsContributions = currentMonthTransactions
      .filter((t) => t.type === "transfer")
      .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

    // Net income (remaining) is income minus expenses minus savings contributions
    const currentMonthRemaining =
      currentMonthIncome -
      currentMonthExpenses -
      currentMonthSavingsContributions;

    // Calculate net worth using the new service
    const {
      netWorth,
      assets: totalAssets,
      liabilities: totalLiabilities,
    } = await getCurrentNetWorth(userId);

    // Get recent transactions (last 5)
    const recentTransactions = (
      serializedTransactions as Array<Record<string, unknown>>
    )
      .slice(0, 5)
      .map((t) => ({
        id: (t.id || t._id) as string, // Handle both serialized id and original _id
        title: (t.description || "Unknown Transaction") as string,
        time: new Date((t.date as string) || new Date()).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        amount: (t.amount as number) || 0,
        type: (t.type as string) || "expense",
        color: t.type === "income" ? "bg-green-500" : "bg-red-500",
        textColor: t.type === "income" ? "text-green-600" : "text-red-600",
      }));

    // Get upcoming bills (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingBills = (serializedBills as Array<Record<string, unknown>>)
      .filter((bill) => {
        const dueDate = new Date((bill.dueDate as string) || new Date());
        return dueDate >= currentDate && dueDate <= thirtyDaysFromNow;
      })
      .sort(
        (a, b) =>
          new Date((a.dueDate as string) || new Date()).getTime() -
          new Date((b.dueDate as string) || new Date()).getTime()
      )
      .slice(0, 6)
      .map((bill) => ({
        name: (bill.name as string) || "Unknown Bill",
        dueDate: new Date(
          (bill.dueDate as string) || new Date()
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: (bill.amount as number) || 0,
      }));

    // Calculate budget progress
    const budgetProgress = (serializedBudgets as Array<Record<string, unknown>>)
      .filter((budget) => budget.isActive)
      .map((budget) => {
        const spent = (budget.spent as number) || 0;
        const budgetAmount = (budget.amount as number) || 0;
        const remaining = budgetAmount - spent;
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          category: (budget.category as string) || "Unknown",
          budgeted: budgetAmount,
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
        };
      });

    // Get financial goals
    const financialGoals = (serializedGoals as Array<Record<string, unknown>>)
      .filter((goal) => goal.status === "active")
      .map((goal) => {
        const currentAmount = (goal.currentAmount as number) || 0;
        const targetAmount = (goal.targetAmount as number) || 1; // Avoid division by zero
        const progress =
          targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

        return {
          name: (goal.name as string) || "Unknown Goal",
          targetAmount: targetAmount,
          currentAmount: currentAmount,
          progress: Math.min(progress, 100),
          targetDate: (goal.targetDate as string) || new Date().toISOString(),
          priority: (goal.priority as string) || "medium",
        };
      });

    // Calculate category breakdown for current month
    const categoryBreakdown = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc: Record<string, number>, transaction) => {
        const category =
          ((transaction.category as Record<string, unknown>)?.name as string) ||
          "Uncategorized";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += (transaction.amount as number) || 0;
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
    const monthlySpending: Array<{ month: string; expenses: number }> = [];
    const monthlyIncomeSpending: Array<{
      month: string;
      income: number;
      spending: number;
      surplus: number;
    }> = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = (
        serializedTransactions as Array<Record<string, unknown>>
      ).filter((t) => {
        const transactionDate = new Date(t.date as string);
        return (
          transactionDate.getMonth() === month.getMonth() &&
          transactionDate.getFullYear() === month.getFullYear()
        );
      });

      const monthExpenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

      const monthIncome = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

      monthlySpending.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        expenses: monthExpenses,
      });

      monthlyIncomeSpending.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        income: monthIncome,
        spending: monthExpenses,
        surplus: monthIncome - monthExpenses,
      });
    }

    // Calculate weekly spending for current month
    const weeklySpending: Array<{ week: string; expenses: number }> = [];
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

      const weekTransactions = currentMonthTransactions.filter((t) => {
        const transactionDate = new Date(t.date as string);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      });

      const weekExpenses = weekTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum: number, t) => sum + ((t.amount as number) || 0), 0);

      weeklySpending.push({
        week: `Week ${week}`,
        expenses: weekExpenses,
      });
    }

    // Get monthly net worth history using the new service
    const netWorthData = await getMonthlyNetWorthHistory(userId, 12);
    const netWorthHistory = netWorthData.monthlyHistory.map((entry) => ({
      month: entry.month,
      netWorth: entry.netWorth,
      totalAssets: entry.assets,
      totalLiabilities: entry.liabilities,
    }));

    const metrics: DashboardMetrics = {
      totalIncome: currentMonthIncome,
      totalExpenses: currentMonthExpenses,
      savings: currentMonthSavingsContributions,
      netIncome: currentMonthRemaining,
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
      monthlyIncomeSpending,
      assets: serializedAssets as Array<{
        id: string;
        name: string;
        category: string;
        currentValue: number;
        changeAmount: number;
        changePercentage: number;
        description?: string;
        institution?: string;
        currency?: string;
        isActive?: boolean;
        value?: number;
        type?: string;
        originalValue?: number;
        createdAt: string;
        updatedAt: string;
      }>,
      netWorthHistory,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
