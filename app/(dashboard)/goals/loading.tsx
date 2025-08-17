import { DashboardFooter } from "@/components/DashboardFooter";
import { GoalTableSkeleton } from "@/components/goals";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <GoalTableSkeleton />

      <DashboardFooter />
    </div>
  );
}
