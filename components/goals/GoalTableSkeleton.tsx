"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface GoalTableSkeletonProps {
  rowCount?: number;
  isMobile?: boolean;
}

export function GoalTableSkeleton({
  rowCount = 5,
  isMobile = false,
}: GoalTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-md border w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm">
        <div className="border-b bg-white dark:bg-neutral-950">
          <div className="grid grid-cols-7 gap-4 p-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {/* Table Body Skeleton */}
        <div className="divide-y">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div
              key={index}
              className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-4 w-48" />
        <div className="space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
