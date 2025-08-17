import { Skeleton } from "@/components/ui/skeleton";

export function BillPageHeaderSkeleton() {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" /> {/* Title */}
        <Skeleton className="h-5 w-80" /> {/* Description */}
      </div>
      <Skeleton className="h-10 w-36" /> {/* Add Bill button */}
    </div>
  );
}
