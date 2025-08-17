"use client";

import { useState, useEffect } from "react";
import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { sampleGoals, GoalPageSkeleton } from "@/components/goals";
import { FinancialGoal } from "@/lib/types";
import { EditGoalDialog } from "@/components/goals";

function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setGoals(sampleGoals);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <GoalPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  const handleCreateGoal = () => {
    setEditingGoal(null); // null means we're creating a new goal
    setIsCreateDialogOpen(true);
  };

  const handleSaveGoal = (goal: FinancialGoal) => {
    if (editingGoal) {
      // Update existing goal
      setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? goal : g)));
    } else {
      // Add new goal
      setGoals((prev) => [...prev, goal]);
    }
    setIsCreateDialogOpen(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="text-muted-foreground">
            Set, track, and achieve your financial goals with progress
            monitoring and milestone tracking.
          </p>
        </div>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={handleCreateGoal}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      {/* Goals Data Table */}
      <DataTable
        columns={columns}
        data={goals}
        isLoading={isLoading}
        onDelete={handleDeleteGoal}
      />

      {/* Create/Edit Goal Dialog */}
      <EditGoalDialog
        goal={editingGoal}
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
      />

      <DashboardFooter />
    </div>
  );
}

export default GoalsPage;
