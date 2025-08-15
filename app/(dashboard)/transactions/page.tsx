"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { sampleTransactions } from "@/database/test-data/sample-transactions";
import { Transaction } from "@/lib/types";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect } from "react";
import { TransactionPageSkeleton } from "@/components/transactions";

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create columns
  const columns = createColumns();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(sampleTransactions);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TransactionPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View, categorize, and analyze your financial transactions to
            understand your spending patterns.
          </p>
        </div>
        <Button className="button-blue-bg hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Suspense fallback={<TransactionPageSkeleton />}>
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
        />
      </Suspense>

      <DashboardFooter />
    </div>
  );
}

export default TransactionsPage;
