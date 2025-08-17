import { Skeleton } from "@/components/ui/skeleton";

export function BudgetMetricsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="rounded-lg border p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="rounded-lg border p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
