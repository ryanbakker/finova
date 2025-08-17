import { BudgetPageSkeleton } from "@/components/budgeting";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function BudgetingLoading() {
  return (
    <div className="space-y-6">
      <BudgetPageSkeleton />
      <DashboardFooter />
    </div>
  );
}
