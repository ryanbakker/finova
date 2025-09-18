"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChartPie } from "lucide-react";
import { DashboardFooter } from "@/components/DashboardFooter";
import {
  BudgetMetrics,
  BudgetCharts,
  BudgetProgress,
  BudgetAlerts,
  CategoryBudgets,
  FinancialGoals,
  BudgetDialog,
  BudgetTable,
  BudgetPageSkeleton,
} from "@/components/budgeting";
import { Budget, FinancialGoal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  getUserBudgets,
  getBudgetStats,
} from "@/lib/actions/budget.actions";
import { getGoalsByUserId } from "@/lib/actions/goal.actions";
import { useUser } from "@clerk/nextjs";
import { DynamicUpgradeOverlay } from "@/components/upgrade";

export default function BudgetingPage() {
  const { user, isLoaded } = useUser();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "Budgeting | Finova";
  }, []);
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalBudgets: 0,
    overBudgetCount: 0,
    warningBudgetCount: 0,
  });

  // Load budgets and goals from database
  useEffect(() => {
    const loadData = async () => {
      if (!isLoaded || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [budgetsData, statsData, goalsData] = await Promise.all([
          getUserBudgets(),
          getBudgetStats(),
          getGoalsByUserId(user.id),
        ]);

        setBudgets(budgetsData);
        setGoals(goalsData || []);
        setStats({
          totalBudget: statsData.totalBudgetAmount,
          totalSpent: statsData.totalSpent,
          totalBudgets: statsData.totalBudgets,
          overBudgetCount: statsData.overBudgetCount,
          warningBudgetCount: statsData.warningBudgetCount,
        });
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoaded, user?.id]);

  // Calculate category data from budgets
  const categoryData = budgets.reduce((acc, budget) => {
    const categoryName =
      typeof budget.category === "string"
        ? budget.category
        : budget.category.name;
    const existing = acc.find((cat) => cat.name === categoryName);
    if (existing) {
      existing.budget += budget.amount;
      existing.value += budget.spent;
      // Recalculate percentage after updating totals
      existing.percentage = (existing.value / existing.budget) * 100;
    } else {
      acc.push({
        name: categoryName,
        budget: budget.amount,
        value: budget.spent,
        percentage: (budget.spent / budget.amount) * 100,
      });
    }
    return acc;
  }, [] as Array<{ name: string; budget: number; value: number; percentage: number }>);

  // Sample data for charts
  const monthlySpending = [
    { month: "Jan", spent: 3200, budget: 4000 },
    { month: "Feb", spent: 3800, budget: 4000 },
    { month: "Mar", spent: 3500, budget: 4000 },
    { month: "Apr", spent: 4200, budget: 4000 },
    { month: "May", spent: 3900, budget: 4000 },
    { month: "Jun", spent: 4100, budget: 4000 },
  ];

  const dailySpending = [
    { day: "Mon", amount: 150 },
    { day: "Tue", amount: 120 },
    { day: "Wed", amount: 200 },
    { day: "Thu", amount: 180 },
    { day: "Fri", amount: 250 },
    { day: "Sat", amount: 300 },
    { day: "Sun", amount: 100 },
  ];

  const budgetVsActual = categoryData.map(
    (cat: {
      name: string;
      budget: number;
      value: number;
      percentage: number;
    }) => ({
      category: cat.name,
      budget: cat.budget,
      actual: cat.value,
      remaining: cat.budget - cat.value,
    })
  );

  const handleCreateBudget = () => {
    setEditingBudget(undefined);
    setDialogOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setDialogOpen(true);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);
      setBudgets((prev) => prev.filter((b) => (b._id || b.id) !== budgetId));
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  const handleSaveBudget = async (
    budgetData: Omit<Budget, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // Convert string dates to Date objects
      const processedData = {
        ...budgetData,
        startDate: new Date(budgetData.startDate),
        endDate: new Date(budgetData.endDate),
      };

      if (editingBudget) {
        // Update existing budget
        const budgetId = editingBudget._id || editingBudget.id;
        if (!budgetId) {
          throw new Error("Invalid budget ID");
        }

        const updatedBudget = await updateBudget({
          id: budgetId,
          ...processedData,
        });
        setBudgets((prev) =>
          prev.map((b) =>
            b._id === editingBudget._id || b.id === editingBudget.id
              ? updatedBudget
              : b
          )
        );
        toast({
          title: "Success",
          description: "Budget updated successfully",
        });
      } else {
        // Create new budget
        const newBudget = await createBudget(processedData);
        setBudgets((prev) => [...prev, newBudget]);
        toast({
          title: "Success",
          description: "Budget created successfully",
        });
      }

      // Refresh stats
      const statsData = await getBudgetStats();
      setStats({
        totalBudget: statsData.totalBudgetAmount,
        totalSpent: statsData.totalSpent,
        totalBudgets: statsData.totalBudgets,
        overBudgetCount: statsData.overBudgetCount,
        warningBudgetCount: statsData.warningBudgetCount,
      });
    } catch (_error) {
      throw _error; // Re-throw to let the dialog handle the error
    }
  };

  // Calculate insights from stats
  const _insights = {
    overBudget: stats.overBudgetCount,
    warningBudget: stats.warningBudgetCount,
    onTrack:
      stats.totalBudgets - stats.overBudgetCount - stats.warningBudgetCount,
  };

  if (isLoading) {
    return (
      <div className="space-y-6 page-content">
        <BudgetPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <DynamicUpgradeOverlay
      title="Advanced Budgeting"
      description="Access advanced budgeting tools, detailed analytics, and comprehensive financial planning features."
      icon={ChartPie}
    >
      <div className="space-y-6 page-content">
        {/* Header */}
        <div className="flex gap-5 md:gap-0 justify-between flex-col md:flex-row md:items-end">
          <div>
            <h1 className="page-title">Budgeting</h1>
            <h2 className="page-sub-title">
              Set budgets, track spending, and achieve your financial goals.
            </h2>
          </div>
          <Button className="button-blue-bg" onClick={handleCreateBudget}>
            <Plus className="mr-1 h-4 w-4" />
            Create Budget
          </Button>
        </div>

        {/* Budget Metrics + Quick Insights (unified) */}
        <BudgetMetrics
          totalSpent={stats.totalSpent}
          totalBudget={stats.totalBudget}
          totalBudgets={stats.totalBudgets}
          overBudgetCount={stats.overBudgetCount}
          warningBudgetCount={stats.warningBudgetCount}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 h-auto">
            <TabsTrigger
              value="overview"
              className="budget-content-tabs-trigger"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="budget-content-tabs-trigger"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger value="charts" className="budget-content-tabs-trigger">
              Charts & Analysis
            </TabsTrigger>
            <TabsTrigger value="goals" className="budget-content-tabs-trigger">
              Financial Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Category Budgets */}
            <CategoryBudgets categoryData={categoryData} />

            {/* Budget Progress */}
            <BudgetProgress
              totalSpent={stats.totalSpent}
              totalBudget={stats.totalBudget}
            />

            {/* Budget Alerts */}
            <BudgetAlerts categoryData={categoryData} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* Budget Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Budgets</CardTitle>
                <CardDescription>
                  Manage and monitor all your budget categories in detail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetTable
                  budgets={budgets}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Budget Charts */}
            <BudgetCharts
              monthlySpending={monthlySpending}
              dailySpending={dailySpending}
              budgetVsActual={budgetVsActual}
              categoryData={categoryData}
              monthlyBudget={stats.totalBudget}
            />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {/* Financial Goals */}
            <FinancialGoals goals={goals} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {/* Budget Dialog */}
        <BudgetDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          budget={editingBudget}
          onSave={handleSaveBudget}
        />

        <DashboardFooter />
      </div>
    </DynamicUpgradeOverlay>
  );
}
