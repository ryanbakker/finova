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
        const userBills = await getUserBills();
        setBills(userBills || []);
      } catch (error) {
        console.error("Error fetching bills:", error);
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
    } catch (error) {
      console.error("Error refreshing bills:", error);
      toast({
        title: "Error",
        description: "Failed to refresh bills. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BillPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">
            Manage recurring bills, track due dates, and monitor your payment
            obligations to stay on top of your finances.
          </p>
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
