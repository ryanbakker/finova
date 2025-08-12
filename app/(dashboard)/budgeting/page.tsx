"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BudgetMetrics,
  BudgetProgress,
  BudgetAlerts,
  CategoryBudgets,
  FinancialGoals,
} from "@/components/budgeting";
import { MonthlySpendingChart } from "@/components/budgeting/MonthlySpendingChart";
import { BudgetVsActualChart } from "@/components/budgeting/BudgetVsActualChart";
import { CategoryBreakdownChart } from "@/components/budgeting/CategoryBreakdownChart";
import { WeeklySpendingChart } from "@/components/budgeting/WeeklySpendingChart";
import { DashboardFooter } from "@/components/DashboardFooter";
import { useState, useEffect } from "react";

// Skeleton Components
function BudgetMetricsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card className="border-l-4 border-l-sky-500 overflow-hidden h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="pl-2 pr-8 mb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 w-full min-h-[300px] !max-h-[60vh] overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetProgressSkeleton() {
  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
      <CardHeader>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

function BudgetAlertsSkeleton() {
  return (
    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
      <CardHeader>
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CategoryBudgetsSkeleton() {
  return (
    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
      <CardHeader>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FinancialGoalsSkeleton() {
  return (
    <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white">
      <CardHeader>
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function BudgetingPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const monthlySpending = [
    { month: "Jan", spent: 2100, budget: 3000 },
    { month: "Feb", spent: 1850, budget: 3000 },
    { month: "Mar", spent: 2400, budget: 3000 },
    { month: "Apr", spent: 2200, budget: 3000 },
    { month: "May", spent: 2456, budget: 3000 },
    { month: "Jun", spent: 2100, budget: 3000 },
    { month: "Jul", spent: 2350, budget: 3000 },
    { month: "Aug", spent: 1980, budget: 3000 },
    { month: "Sep", spent: 2250, budget: 3000 },
    { month: "Oct", spent: 2600, budget: 3000 },
    { month: "Nov", spent: 2150, budget: 3000 },
    { month: "Dec", spent: 2800, budget: 3000 },
  ];

  const dailySpending = [
    { day: "Mon", amount: 85 },
    { day: "Tue", amount: 120 },
    { day: "Wed", amount: 65 },
    { day: "Thu", amount: 95 },
    { day: "Fri", amount: 150 },
    { day: "Sat", amount: 200 },
    { day: "Sun", amount: 75 },
  ];

  const budgetVsActual = [
    { category: "Food", budget: 500, actual: 450, remaining: 50 },
    { category: "Transport", budget: 300, actual: 200, remaining: 100 },
    { category: "Entertainment", budget: 200, actual: 150, remaining: 50 },
    { category: "Shopping", budget: 400, actual: 300, remaining: 100 },
    { category: "Utilities", budget: 200, actual: 180, remaining: 20 },
    { category: "Healthcare", budget: 150, actual: 120, remaining: 30 },
  ];

  const categoryData = [
    { name: "Food & Dining", value: 450, budget: 500 },
    { name: "Shopping", value: 300, budget: 400 },
    { name: "Transportation", value: 200, budget: 300 },
    { name: "Utilities", value: 180, budget: 200 },
    { name: "Entertainment", value: 150, budget: 200 },
    { name: "Healthcare", value: 120, budget: 150 },
  ];

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);
  const totalBudget = categoryData.reduce((sum, item) => sum + item.budget, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Key Metrics Cards Skeleton */}
        <BudgetMetricsSkeleton />

        {/* Unified Grid Layout Skeleton */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          }}
        >
          <ChartSkeleton title="Monthly Spending Trends" />
          <ChartSkeleton title="Budget vs Actual" />
          <ChartSkeleton title="Category Breakdown" />
          <ChartSkeleton title="Weekly Spending" />

          {/* Combined Budget Overview and Alerts Container Skeleton */}
          <div className="flex flex-col h-full space-y-2">
            <BudgetProgressSkeleton />
            <BudgetAlertsSkeleton />
          </div>

          <CategoryBudgetsSkeleton />
          <FinancialGoalsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgeting</h1>
          <p className="text-muted-foreground">
            Set budgets, track spending, and achieve your financial goals.
          </p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600 hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <BudgetMetrics totalSpent={totalSpent} totalBudget={totalBudget} />

      {/* Unified Grid Layout */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}
      >
        <MonthlySpendingChart
          monthlySpending={monthlySpending}
          monthlyBudget={3000}
        />

        <BudgetVsActualChart budgetVsActual={budgetVsActual} />

        <CategoryBreakdownChart categoryData={categoryData} />

        <WeeklySpendingChart dailySpending={dailySpending} />

        {/* Combined Budget Overview and Alerts Container */}
        <div className="flex flex-col h-full space-y-2">
          <BudgetProgress totalSpent={totalSpent} totalBudget={totalBudget} />
          <BudgetAlerts categoryData={categoryData} />
        </div>

        <CategoryBudgets categoryData={categoryData} />

        <FinancialGoals />
      </div>

      <DashboardFooter />
    </div>
  );
}
