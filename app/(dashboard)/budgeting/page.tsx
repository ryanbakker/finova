"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Target, AlertTriangle } from "lucide-react";
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
import { Budget } from "@/lib/types";
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

export default function BudgetingPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalBudgets: 0,
    overBudgetCount: 0,
    warningBudgetCount: 0,
  });

  // Load budgets from database
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setIsLoading(true);
        const [budgetsData, statsData] = await Promise.all([
          getUserBudgets(),
          getBudgetStats(),
        ]);

        setBudgets(budgetsData);
        setStats({
          totalBudget: statsData.totalBudgetAmount,
          totalSpent: statsData.totalSpent,
          totalBudgets: statsData.totalBudgets,
          overBudgetCount: statsData.overBudgetCount,
          warningBudgetCount: statsData.warningBudgetCount,
        });
      } catch (error) {
        console.error("Error loading budgets:", error);
        toast({
          title: "Error",
          description: "Failed to load budgets",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // Calculate category data from budgets
  const categoryData = budgets.reduce((acc, budget) => {
    const existing = acc.find((cat) => cat.name === budget.category);
    if (existing) {
      existing.budget += budget.amount;
      existing.value += budget.spent;
    } else {
      acc.push({
        name: budget.category,
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
    } catch (error) {
      console.error("Error deleting budget:", error);
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
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  // Calculate insights from stats
  const insights = {
    overBudget: stats.overBudgetCount,
    warningBudget: stats.warningBudgetCount,
    onTrack:
      stats.totalBudgets - stats.overBudgetCount - stats.warningBudgetCount,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BudgetPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgeting</h1>
          <p className="text-muted-foreground">
            Set budgets, track spending, and achieve your financial goals.
          </p>
        </div>
        <Button className="button-blue-bg" onClick={handleCreateBudget}>
          <Plus className="mr-1 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Budget Metrics */}
      <BudgetMetrics
        totalSpent={stats.totalSpent}
        totalBudget={stats.totalBudget}
      />

      {/* Quick Insights */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {insights.onTrack}
            </div>
            <p className="text-xs text-muted-foreground">
              Categories within budget
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {insights.warningBudget}
            </div>
            <p className="text-xs text-muted-foreground">
              Categories near limit
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {insights.overBudget}
            </div>
            <p className="text-xs text-muted-foreground">Categories exceeded</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analysis</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
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
          <FinancialGoals />
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
  );
}
