"use client";

import { useState, useEffect } from "react";
import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { GoalPageSkeleton } from "@/components/goals";
import { FinancialGoal } from "@/lib/types";
import { EditGoalDialog } from "@/components/goals";
import { useUser } from "@clerk/nextjs";
import { getGoalsByUserId, deleteGoal } from "@/lib/actions/goal.actions";
import { toast } from "@/components/ui/use-toast";

function GoalsPage() {
  const { user, isLoaded } = useUser();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  // Load goals from database
  useEffect(() => {
    const loadGoals = async () => {
      if (!isLoaded || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userGoals = await getGoalsByUserId(user.id);
        setGoals(userGoals || []);
      } catch (error) {
        console.error("Error loading goals:", error);
        toast({
          title: "Error",
          description: "Failed to load goals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [isLoaded, user?.id]);

  if (!isLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <GoalPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Please sign in to view your goals
          </h1>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  const handleCreateGoal = () => {
    setEditingGoal(null); // null means we're creating a new goal
    setIsCreateDialogOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setIsCreateDialogOpen(true);
  };

  const handleSaveGoal = async () => {
    try {
      // Refresh goals from database
      if (user?.id) {
        const userGoals = await getGoalsByUserId(user.id);
        setGoals(userGoals || []);
      }
      setIsCreateDialogOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error("Error refreshing goals:", error);
      toast({
        title: "Error",
        description:
          "Goal saved but failed to refresh the list. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to delete goals.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteGoal(goalId, user.id);

      // Refresh goals from database
      const userGoals = await getGoalsByUserId(user.id);
      setGoals(userGoals || []);

      toast({
        title: "Goal Deleted",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
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
        onEdit={handleEditGoal}
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
