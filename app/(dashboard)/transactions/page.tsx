"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { sampleTransactions } from "@/database/test-data/sample-transactions";
import { Transaction } from "@/lib/types";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense } from "react";
import { useState } from "react";

function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(sampleTransactions);

  // Create columns
  const columns = createColumns();

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

      <Suspense fallback={<div>Loading transactions...</div>}>
        <DataTable columns={columns} data={transactions} />
      </Suspense>

      <DashboardFooter />
    </div>
  );
}

export default TransactionsPage;
