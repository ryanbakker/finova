"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function GoalTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
      </Card>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <div className="p-4">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 py-4 border-t">
              <Skeleton className="h-4 w-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
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
