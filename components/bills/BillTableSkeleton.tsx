import { Skeleton } from "@/components/ui/skeleton";

interface BillTableSkeletonProps {
  rowCount?: number;
  isMobile?: boolean;
}

export function BillTableSkeleton({
  rowCount = 10,
  isMobile = false,
}: BillTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-md border w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm">
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="text-semibold !bg-white dark:!bg-neutral-950 rounded-t-lg border-b">
          <div className="flex items-center h-12 px-4">
            <Skeleton className="h-4 w-4 mr-2" /> {/* Select checkbox */}
            <Skeleton className="h-4 w-20 mr-4" /> {/* Bill Name */}
            <Skeleton className="h-4 w-16 mr-4" /> {/* Amount */}
            <Skeleton className="h-4 w-20 mr-4" /> {/* Due Date */}
            {!isMobile && (
              <>
                <Skeleton className="h-4 w-16 mr-4" /> {/* Category */}
                <Skeleton className="h-4 w-16 mr-4" /> {/* Status */}
                <Skeleton className="h-4 w-16 mr-4" /> {/* Recurring */}
              </>
            )}
            <Skeleton className="h-4 w-16 ml-auto" /> {/* Actions */}
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="bg-white dark:bg-neutral-950">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center px-4 border-b border-border last:border-b-0 ${
                isMobile ? "h-12" : "h-14"
              }`}
            >
              <Skeleton className="h-4 w-4 mr-2" /> {/* Select checkbox */}
              <Skeleton className="h-4 w-24 mr-4" /> {/* Bill Name */}
              <Skeleton className="h-4 w-20 mr-4" /> {/* Amount */}
              <Skeleton className="h-4 w-20 mr-4" /> {/* Due Date */}
              {!isMobile && (
                <>
                  <Skeleton className="h-4 w-20 mr-4" /> {/* Category */}
                  <Skeleton className="h-4 w-20 mr-4" /> {/* Status */}
                  <Skeleton className="h-4 w-16 mr-4" /> {/* Recurring */}
                </>
              )}
              <Skeleton className="h-8 w-16 ml-auto" /> {/* Actions */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
