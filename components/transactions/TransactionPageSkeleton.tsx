import { TransactionPageHeaderSkeleton } from "./TransactionPageHeaderSkeleton";
import { TransactionFiltersSkeleton } from "./TransactionFiltersSkeleton";
import { TransactionTableSkeleton } from "./TransactionTableSkeleton";
import { TransactionPaginationSkeleton } from "./TransactionPaginationSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function TransactionPageSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <TransactionPageHeaderSkeleton />
      <TransactionFiltersSkeleton />
      <TransactionTableSkeleton rowCount={8} isMobile={isMobile} />
      <TransactionPaginationSkeleton />
    </div>
  );
}
