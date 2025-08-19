import { Skeleton } from "@/components/ui/skeleton";

export function TransactionFiltersSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" /> {/* Filter icon */}
          <Skeleton className="h-6 w-20" /> {/* Filters title */}
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Description Search */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-9 w-full" /> {/* Input */}
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label */}
          <Skeleton className="h-9 w-full" /> {/* Date picker */}
        </div>

        {/* Account Filter */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" /> {/* Label */}
          <Skeleton className="h-9 w-full" /> {/* Select */}
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* Label */}
          <Skeleton className="h-9 w-full" /> {/* Select */}
        </div>
      </div>

      {/* Transaction Type Filter */}
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-8 w-16" /> {/* All button */}
              <Skeleton className="h-8 w-20" /> {/* Income button */}
              <Skeleton className="h-8 w-20" /> {/* Expense button */}
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <Skeleton className="h-4 w-24" /> {/* Columns label */}
            <Skeleton className="h-8 w-24" /> {/* Columns dropdown */}
          </div>
        </div>
      </div>
    </div>
  );
}
