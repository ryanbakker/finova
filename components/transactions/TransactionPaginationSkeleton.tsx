import { Skeleton } from "@/components/ui/skeleton";

export function TransactionPaginationSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-48" /> {/* Row selection info */}
      </div>
      <div className="flex items-center space-x-6">
        <Skeleton className="h-4 w-32" /> {/* Results info */}
        <div className="space-x-2">
          <Skeleton className="h-8 w-20" /> {/* Previous button */}
          <Skeleton className="h-8 w-16" /> {/* Next button */}
        </div>
      </div>
    </div>
  );
}
