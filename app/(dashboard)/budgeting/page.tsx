"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function BudgetingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgeting</h1>
          <p className="text-muted-foreground">
            Set budgets, track spending, and achieve your financial goals.
          </p>
        </div>
        <Button className="button-blue-bg hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Create / Edit Budget
        </Button>
      </div>

      <DashboardFooter />
    </div>
  );
}
