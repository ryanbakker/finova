import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock, MoveRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  icon: React.ReactNode;
}

interface BudgetSnapshotProps {
  isLoading?: boolean;
  budgetProgress?: Array<{
    category: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
}

export function BudgetSnapshot({
  isLoading = false,
  budgetProgress,
}: BudgetSnapshotProps) {
  const getStatusIcon = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage > 100)
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (percentage === 100) return <Clock className="h-4 w-4 text-amber-600" />;
    return <CheckCircle className="h-4 w-4 text-sky-600" />;
  };

  // Transform budget progress data to match the expected format
  const transformedCategories: BudgetCategory[] =
    budgetProgress?.map((item) => ({
      name: item.category,
      budgeted: item.budgeted,
      spent: item.spent,
      icon: getStatusIcon(item.spent, item.budgeted),
    })) || [];

  const getCategoryColors = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;

    if (percentage > 100) {
      // Over budget - red theme
      return {
        border: "border-red-200",
        background:
          "bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-900/40 dark:hover:from-red-900/50 dark:hover:to-rose-900/50",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600",
        textColor: "text-red-800 dark:text-red-500/90",
        percentageColor: "text-red-600 dark:text-red-500/90",
        progressColor: "#dc2626",
      };
    } else if (percentage === 100) {
      // Exactly 100% - amber theme
      return {
        border: "border-amber-200",
        background:
          "bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/40 dark:border-amber-900/40 dark:hover:from-amber-900/50 dark:hover:to-amber-900/50",
        iconBg: "bg-amber-100 dark:bg-amber-900/40",
        iconColor: "text-amber-600",
        textColor: "text-amber-800 dark:text-amber-500/90",
        percentageColor: "text-amber-600 dark:text-amber-500/90",
        progressColor: "#d97706",
      };
    } else {
      // Under budget - sky theme
      return {
        border: "border-sky-200",
        background:
          "bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 dark:from-sky-950/40 dark:to-cyan-950/40 dark:border-sky-900/40 dark:hover:from-sky-900/50 dark:hover:to-cyan-900/50",
        iconBg: "bg-sky-100 dark:bg-sky-900/40",
        iconColor: "text-sky-600",
        textColor: "text-sky-800 dark:text-sky-500/90",
        percentageColor: "text-sky-600 dark:text-sky-500/90",
        progressColor: "#0ea5e9",
      };
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full container-color">
        <CardHeader>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 overflow-y-auto category-breakdown-scroll max-h-[410px]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-lg border-gray-200 bg-white dark:bg-neutral-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="w-6 h-6 rounded-sm" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="w-full h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message when no budget data is available
  if (!budgetProgress || budgetProgress.length === 0) {
    return (
      <Card className="h-full container-color">
        <CardHeader>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <CardTitle className="card-title">Budget Snapshot</CardTitle>
              <CardDescription>No budget data available</CardDescription>
            </div>
            <Link href="/budgeting">
              <Button className="button-blue-bg">
                Create Budget
                <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-8">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">You haven't set up any budgets yet.</p>
              <p className="text-sm">
                Create your first budget to start tracking your spending.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full container-color">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <CardTitle className="card-title">Budget Snapshot</CardTitle>
            <CardDescription>
              Top budget categories for the current month
            </CardDescription>
          </div>
          <Link href="/budgeting">
            <Button className="button-blue-bg">
              Budgets
              <MoveRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 overflow-y-auto category-breakdown-scroll max-h-[410px]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {transformedCategories.map((category) => {
                const percentage = (category.spent / category.budgeted) * 100;
                const remaining = category.budgeted - category.spent;
                const colors = getCategoryColors(
                  category.spent,
                  category.budgeted
                );

                return (
                  <div
                    key={category.name}
                    className={`p-3 border rounded-lg transition-colors ${colors.border} ${colors.background}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-sm ${colors.iconBg}`}>
                            {getStatusIcon(category.spent, category.budgeted)}
                          </div>
                          <p className={`font-medium ${colors.textColor}`}>
                            {category.name}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${colors.percentageColor}`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} / $
                          {category.budgeted.toLocaleString()}
                        </p>
                        {remaining >= 0 ? (
                          <p className="text-xs text-muted-foreground">
                            ${remaining.toLocaleString()} left
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            ${Math.abs(remaining).toLocaleString()} over
                          </p>
                        )}
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="w-full h-2"
                        style={
                          {
                            "--progress-background": "#e5e7eb",
                            "--progress-foreground": colors.progressColor,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
