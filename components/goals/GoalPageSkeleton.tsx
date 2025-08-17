"use client";

import { GoalPageHeaderSkeleton } from "./GoalPageHeaderSkeleton";
import { GoalFiltersSkeleton } from "./GoalFiltersSkeleton";
import { GoalTableSkeleton } from "./GoalTableSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function GoalPageSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <GoalPageHeaderSkeleton />
      <GoalFiltersSkeleton />
      <GoalTableSkeleton rowCount={8} isMobile={isMobile} />
    </div>
  );
}
