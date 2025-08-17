import { Skeleton } from "@/components/ui/skeleton";
import { AssetTableSkeleton } from "./AssetTableSkeleton";

export function AssetPageSkeleton() {
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

      {/* Filters Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-24" />
            <span className="text-muted-foreground">-</span>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <AssetTableSkeleton rowCount={8} isMobile={false} />
    </div>
  );
}
