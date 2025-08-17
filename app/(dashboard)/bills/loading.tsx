import { DashboardFooter } from "@/components/DashboardFooter";
import { BillPageSkeleton } from "@/components/bills";

export default function BillsLoading() {
  return (
    <div className="space-y-6">
      <BillPageSkeleton />
      <DashboardFooter />
    </div>
  );
}
