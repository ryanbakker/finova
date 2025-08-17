import { Skeleton } from "@/components/ui/skeleton";
import { BudgetMetricsSkeleton } from "./BudgetMetricsSkeleton";
import { CategoryBudgetsSkeleton } from "./CategoryBudgetsSkeleton";
import { BudgetProgressSkeleton } from "./BudgetProgressSkeleton";

export function BudgetPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Budget Metrics Skeleton */}
      <BudgetMetricsSkeleton />

      {/* Quick Insights Skeleton */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />

        {/* Overview Tab Content Skeleton */}
        <div className="space-y-6">
          <CategoryBudgetsSkeleton />
          <BudgetProgressSkeleton />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
