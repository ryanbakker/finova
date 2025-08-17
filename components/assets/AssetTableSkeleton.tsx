import { Skeleton } from "@/components/ui/skeleton";

interface AssetTableSkeletonProps {
  rowCount: number;
  isMobile: boolean;
}

export function AssetTableSkeleton({ rowCount }: AssetTableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Table Header Skeleton */}
      <div className="overflow-hidden rounded-md border w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm">
        <div className="border-b bg-white dark:bg-neutral-950">
          <div className="grid grid-cols-6 gap-4 p-4">
            <Skeleton className="h-4 w-4" /> {/* Select */}
            <Skeleton className="h-4 w-24" /> {/* Name */}
            <Skeleton className="h-4 w-20" /> {/* Category */}
            <Skeleton className="h-4 w-28" /> {/* Current Value */}
            <Skeleton className="h-4 w-24" /> {/* Purchase Date */}
            <Skeleton className="h-4 w-16" /> {/* Status */}
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="divide-y">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div
              key={index}
              className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Select Checkbox */}
                <Skeleton className="h-4 w-4" />

                {/* Asset Name and Institution */}
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Category */}
                <Skeleton className="h-4 w-20" />

                {/* Current Value and Change */}
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>

                {/* Purchase Date */}
                <div className="flex items-center space-x-1">
                  <Skeleton className="w-3 h-3" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Status */}
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
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
