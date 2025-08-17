import { LiabilityPageSkeleton } from "@/components/liabilities";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LiabilityPageSkeleton />
      <DashboardFooter />
    </div>
  );
}
