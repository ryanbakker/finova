"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { sampleBills } from "@/components/bills/sample-bills";
import { Bill } from "@/lib/types";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect } from "react";
import { BillPageSkeleton } from "@/components/bills";
import { useSorting } from "@/hooks/use-sorting";

function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sortStates, toggleSorting } = useSorting();

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setBills(sampleBills);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

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
        <Button className="button-blue-bg hover:cursor-pointer">
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
        />
      </Suspense>

      <DashboardFooter />
    </div>
  );
}

export default BillsPage;
