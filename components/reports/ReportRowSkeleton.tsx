"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface ReportRowSkeletonProps {
  showHealthScore?: boolean;
  showDate?: boolean;
}

export function ReportRowSkeleton({
  showHealthScore = true,
  showDate = true,
}: ReportRowSkeletonProps) {
  return (
    <tr className="dashboard-table-row">
      {/* Select checkbox */}
      <td className="dashboard-table-cell">
        <Skeleton className="h-4 w-4 rounded" />
      </td>

      {/* Title */}
      <td className="dashboard-table-cell dashboard-table-cell--padded">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </td>

      {/* Type */}
      <td className="dashboard-table-cell dashboard-table-cell--padded">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
      </td>

      {/* Date */}
      {showDate && (
        <td className="dashboard-table-cell dashboard-table-cell--padded">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        </td>
      )}

      {/* Status */}
      <td className="dashboard-table-cell dashboard-table-cell--padded">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
            Generating
          </span>
        </div>
      </td>

      {/* Health Score */}
      {showHealthScore && (
        <td className="dashboard-table-cell dashboard-table-cell--padded">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </td>
      )}

      {/* Download */}
      <td className="dashboard-table-cell">
        <Skeleton className="h-8 w-8 rounded" />
      </td>

      {/* Delete */}
      <td className="dashboard-table-cell">
        <Skeleton className="h-8 w-8 rounded" />
      </td>
    </tr>
  );
}
