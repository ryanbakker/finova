import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  Target,
  PieChart,
  AlertTriangle,
} from "lucide-react";

interface BudgetMetricsProps {
  totalSpent: number;
  totalBudget: number;
  isLoading?: boolean;
  totalBudgets?: number;
  overBudgetCount?: number;
  warningBudgetCount?: number;
}

export function BudgetMetrics({
  totalSpent,
  totalBudget,
  isLoading = false,
  totalBudgets = 0,
  overBudgetCount = 0,
  warningBudgetCount = 0,
}: BudgetMetricsProps) {
  const remainingBudget = totalBudget - totalSpent;
  const utilizationPercentage = Math.round((totalSpent / totalBudget) * 100);
  const onTrackCount = Math.max(
    totalBudgets - overBudgetCount - warningBudgetCount,
    0
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <DollarSign className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Target spending limit</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
          <TrendingUp className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
            ${totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <Target className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
            ${remainingBudget.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Available to spend</p>
        </CardContent>
      </Card>

      {/* Quick Insights unified in the same grid */}
      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Track</CardTitle>
          <Target className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
            {onTrackCount}
          </div>
          <p className="text-xs text-muted-foreground">Within budget</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warning</CardTitle>
          <AlertTriangle className="h-6 w-6 opacity-80 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {warningBudgetCount}
          </div>
          <p className="text-xs text-muted-foreground">Categories near limit</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/30 dark:to-neutral-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
          <TrendingUp className="h-6 w-6 opacity-80 text-rose-600 dark:text-rose-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            {overBudgetCount}
          </div>
          <p className="text-xs text-muted-foreground">Categories exceeded</p>
        </CardContent>
      </Card>
    </div>
  );
}
