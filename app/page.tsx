"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardFooter } from "@/components/DashboardFooter";
import {
  NetWorthSummary,
  IncomeVsSpendingChart,
  BudgetSnapshot,
  FinancialGoals,
  CategoryBreakdownChart,
  FinancialAssets,
  MetricCard,
} from "@/components/dashboard";
import { useUser } from "@clerk/nextjs";
import { FileText, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getDashboardData,
  DashboardData,
} from "@/lib/services/dashboard.service";

function DashboardContent({
  user,
  isLoaded,
}: {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  // Quick actions data
  const quickActions = [
    {
      id: 1,
      title: "Add Transaction",
      description: "Record a new expense or income",
      icon: Plus,
      action: () => console.log("Add Transaction clicked"),
    },
    {
      id: 2,
      title: "Add Contribution",
      description: "Record a new savings or balance contribution",
      icon: Plus,
      action: () => console.log("Add Contribution clicked"),
    },
    {
      id: 3,
      title: "Generate Report",
      description: "Use AI to create a report to get financial insights",
      icon: FileText,
      action: () => console.log("Generate Report clicked"),
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <div className="mx-auto w-full flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
        </div>
      </header>
      <div className="mr-4 overflow-hidden">
        <Separator className="mx-4" />
      </div>
      <main className="flex-1 w-full p-6 overflow-y-auto category-breakdown-scroll">
        <div className="space-y-6 w-full">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              {isLoaded && user
                ? `Welcome back ${
                    user.firstName || "there"
                  }! Here's an overview of your financial health.`
                : "Welcome back! Here's an overview of your financial health."}
            </p>
          </div>

          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-auto w-full">
            <MetricCard
              title="Total Income"
              value={dashboardData?.metrics.totalIncome || 0}
              subtitle="This month"
              dataValueColor="text-emerald-600 dark:text-emerald-400"
              borderColor="border-l-emerald-700"
              bgGradientFrom="from-emerald-50/90 to-teal-50/90 dark:from-emerald-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Expenses"
              value={dashboardData?.metrics.totalExpenses || 0}
              subtitle="This month"
              dataValueColor="text-red-600 dark:text-red-400"
              borderColor="border-l-red-700"
              bgGradientFrom="from-red-50/90 to-rose-50/90 dark:from-red-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Savings"
              value={dashboardData?.metrics.savings || 0}
              subtitle="This month"
              dataValueColor="text-sky-600 dark:text-sky-400"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/90 to-cyan-50/90 dark:from-sky-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Net Income"
              value={dashboardData?.metrics.netIncome || 0}
              subtitle="This month"
              dataValueColor="text-sky-600 dark:text-sky-400"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/90 to-cyan-50/90 dark:from-sky-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
          </div>

          {/* Second Row - Net Worth Summary & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto w-full">
            <div className="w-full lg:col-span-3 flex">
              <NetWorthSummary
                isLoading={isLoading}
                netWorth={dashboardData?.metrics.netWorth}
                totalAssets={dashboardData?.metrics.totalAssets}
                totalLiabilities={dashboardData?.metrics.totalLiabilities}
              />
            </div>
            <Card className="w-full lg:col-span-1 container-color">
              <CardHeader>
                <CardTitle className="card-title">Quick Actions</CardTitle>
                <CardDescription>
                  Update your financial data and generate reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="w-full rounded-lg border transition-colors flex justify-between group cursor-pointer bg-neutral-50 dark:bg-neutral-900"
                      >
                        <div className="p-3 text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <div className="flex items-center justify-center border-l px-3 bg-neutral-50 group-hover:bg-sky-50 rounded-r-lg dark:bg-neutral-900 dark:group-hover:bg-sky-950 transition-colors">
                          <IconComponent className="w-5 h-5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Income vs Spending Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto w-full">
            <div className="w-full lg:col-span-1 flex flex-col space-y-4">
              {/* Recent Activity Container */}
              <Card className="flex-1 container-color">
                <CardHeader>
                  <CardTitle className="card-title">Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest financial updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll">
                    <div className="space-y-3">
                      {dashboardData?.recentTransactions?.length ? (
                        dashboardData.recentTransactions.map((activity) => (
                          <div
                            key={activity.id}
                            className={`py-2 px-3 border rounded-sm transition-colors ${
                              activity.type === "income"
                                ? "border-green-200 bg-gradient-to-r from-green-50 to-cyan-50 hover:from-green-100 hover:to-emerald-100 dark:from-green-950/50 dark:to-cyan-950/50 dark:border-green-900/50 dark:hover:from-green-900/50 dark:hover:to-cyan-900/50"
                                : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 dark:from-red-950/50 dark:to-rose-950/50 dark:border-red-900/50 dark:hover:from-red-900/50 dark:hover:to-rose-900/50"
                            }`}
                          >
                            <div className="flex flex-col items-start space-x-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate max-w-[170px]">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[175px]">
                                  {activity.time}
                                </p>
                              </div>
                              <div
                                className={`text-sm font-medium pt-0.5 truncate max-w-[175px] ${
                                  activity.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {activity.type === "income" ? "+" : "-"}$
                                {activity.amount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No recent transactions</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bills Container */}
              <Card className="flex-1 w-full container-color">
                <CardHeader>
                  <CardTitle className="card-title">Upcoming Bills</CardTitle>
                  <CardDescription>
                    Bills due in the next 30 days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll">
                    <div className="space-y-3">
                      {dashboardData?.upcomingBills?.length ? (
                        dashboardData.upcomingBills.map((bill, index) => (
                          <div
                            key={index}
                            className="p-3 border border-sky-200 rounded-sm bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 transition-colors dark:from-sky-950/50 dark:to-cyan-950/50 dark:border-sky-900/50 dark:hover:from-sky-900/50 dark:hover:to-cyan-900/50"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm text-sky-800 dark:text-sky-500">
                                  {bill.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Due {bill.dueDate}
                                </p>
                              </div>
                              <span
                                className={`text-sm font-medium text-sky-900 dark:text-sky-500`}
                              >
                                ${bill.amount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No upcoming bills</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Income vs Spending Chart */}
            <div className="w-full lg:col-span-3">
              <IncomeVsSpendingChart
                isLoading={isLoading}
                monthlyData={dashboardData?.monthlySpending}
                weeklyData={dashboardData?.weeklySpending}
              />
            </div>
          </div>

          {/* Fourth Row - Budget Snapshot & Financial Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <BudgetSnapshot
                isLoading={isLoading}
                budgetProgress={dashboardData?.budgetProgress}
              />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialGoals
                isLoading={isLoading}
                goals={dashboardData?.financialGoals}
              />
            </div>
          </div>

          {/* Fifth Row - Category Breakdown & Financial Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <CategoryBreakdownChart
                isLoading={isLoading}
                categoryData={dashboardData?.categoryBreakdown}
              />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialAssets
                isLoading={isLoading}
                assets={dashboardData?.assets}
                totalAssets={dashboardData?.metrics.totalAssets}
              />
            </div>
          </div>

          {/* Dashboard Footer */}
          <DashboardFooter />
        </div>
      </main>
    </>
  );
}

export default function Home() {
  const { user, isLoaded } = useUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <DashboardContent user={user} isLoaded={isLoaded} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
