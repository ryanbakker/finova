"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Bill } from "@/lib/types";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect } from "react";
import { BillPageSkeleton, CreateBillDialog } from "@/components/bills";
import { useSorting } from "@/hooks/use-sorting";
import { getUserBills } from "@/lib/actions/bill.actions";
import { toast } from "@/components/ui/use-toast";

function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { sortStates, toggleSorting } = useSorting();

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Fetch bills from database
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        const userBills = await getUserBills();
        setBills(userBills || []);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to fetch bills. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, []);

  const refreshBills = async () => {
    try {
      const userBills = await getUserBills();
      setBills(userBills || []);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to refresh bills. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 page-content">
        <BillPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-content">
      <div className="flex gap-5 md:gap-0 justify-between flex-col md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Bills</h1>
          <h2 className="page-sub-title">
            Manage recurring bills, track due dates, and monitor your payment
            obligations to stay on top of your finances.
          </h2>
        </div>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Bill
        </Button>
      </div>

      <Suspense fallback={<BillPageSkeleton />}>
        <DataTable
          columns={columns}
          data={bills}
          isLoading={isLoading}
          sortStates={sortStates}
          onRefresh={refreshBills}
        />
      </Suspense>

      <DashboardFooter />

      <CreateBillDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refreshBills}
      />
    </div>
  );
}

export default BillsPage;
