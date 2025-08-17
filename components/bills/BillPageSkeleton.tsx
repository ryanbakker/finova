"use client";

import { BillPageHeaderSkeleton } from "./BillPageHeaderSkeleton";
import { BillFiltersSkeleton } from "./BillFiltersSkeleton";
import { BillTableSkeleton } from "./BillTableSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function BillPageSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <BillPageHeaderSkeleton />
      <BillFiltersSkeleton />
      <BillTableSkeleton rowCount={8} isMobile={isMobile} />
    </div>
  );
}
