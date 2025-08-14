import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function BillsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">
            Manage recurring bills, track due dates, and monitor your payment
            history.
          </p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600 hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Add Bill
        </Button>
      </div>

      <DashboardFooter />
    </div>
  );
}

export default BillsPage;
