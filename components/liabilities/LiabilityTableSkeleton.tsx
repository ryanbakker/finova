import { Skeleton } from "@/components/ui/skeleton";

interface LiabilityTableSkeletonProps {
  rowCount?: number;
}

export function LiabilityTableSkeleton({
  rowCount = 8,
}: LiabilityTableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-md border w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm">
        <div className="p-4">
          <div className="space-y-3">
            {/* Header Row */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Data Rows */}
            {Array.from({ length: rowCount }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-4 w-4" />
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
