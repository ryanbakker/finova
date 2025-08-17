import { Skeleton } from "@/components/ui/skeleton";

export function BillFiltersSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Filter Button */}
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Expanded Filters */}
      <div className="space-y-4">
        {/* Filter Row 1 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-24">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
