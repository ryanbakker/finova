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

function DashboardContent({
  user,
  isLoaded,
}: {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Remove unused state variable

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: "Salary Deposit",
      time: "Today, 9:00 AM",
      amount: 4500.0,
      type: "income",
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      id: 2,
      title: "Grocery Store",
      time: "Yesterday, 2:30 PM",
      amount: 89.45,
      type: "expense",
      color: "bg-red-500",
      textColor: "text-red-600",
    },
    {
      id: 3,
      title: "Prime Subscription - For Michael",
      time: "Yesterday, 10:55 AM - Then 2025-08-13, 10:55 AM",
      amount: 888888888888888888888.88,
      type: "expense",
      color: "bg-red-500",
      textColor: "text-red-600",
    },
    {
      id: 4,
      title: "Netflix Subscription",
      time: "Dec 15, 2:00 PM",
      amount: 15.99,
      type: "expense",
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      id: 5,
      title: "Coffee Shop",
      time: "Dec 14, 8:30 AM",
      amount: 4.5,
      type: "expense",
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

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
              value={8450}
              subtitle="This month"
              dataValueColor="text-emerald-600 dark:text-emerald-400"
              borderColor="border-l-emerald-700"
              bgGradientFrom="from-emerald-50/50 dark:from-emerald-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Expenses"
              value={5230}
              subtitle="This month"
              dataValueColor="text-red-600 dark:text-red-400"
              borderColor="border-l-red-700"
              bgGradientFrom="from-red-50/50 dark:from-red-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Savings"
              value={3220}
              subtitle="This month"
              dataValueColor="text-sky-600 dark:text-sky-400"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/50 dark:from-sky-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
            <MetricCard
              title="Net Income"
              value={3220}
              subtitle="This month"
              dataValueColor="text-sky-600 dark:text-sky-400"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/50 dark:from-sky-950/40 dark:to-neutral-900"
              isLoading={isLoading}
            />
          </div>

          {/* Second Row - Net Worth Summary & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto w-full">
            <div className="w-full lg:col-span-3 flex">
              <NetWorthSummary isLoading={isLoading} />
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
                      {recentActivities.map((activity) => (
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
                      ))}
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
                      {[
                        {
                          name: "Rent",
                          dueDate: "Dec 1",
                          amount: 1200,
                        },
                        {
                          name: "Electric Bill",
                          dueDate: "Dec 5",
                          amount: 85,
                        },
                        {
                          name: "Internet",
                          dueDate: "Dec 10",
                          amount: 65,
                        },
                        {
                          name: "Phone Bill",
                          dueDate: "Dec 15",
                          amount: 45,
                        },
                        {
                          name: "Gym Membership",
                          dueDate: "Dec 20",
                          amount: 35,
                        },
                        {
                          name: "Car Insurance",
                          dueDate: "Dec 25",
                          amount: 120,
                        },
                      ].map((bill, index) => (
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
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Income vs Spending Chart */}
            <div className="w-full lg:col-span-3">
              <IncomeVsSpendingChart isLoading={isLoading} />
            </div>
          </div>

          {/* Fourth Row - Budget Snapshot & Financial Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <BudgetSnapshot isLoading={isLoading} />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialGoals isLoading={isLoading} />
            </div>
          </div>

          {/* Fifth Row - Category Breakdown & Financial Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <CategoryBreakdownChart isLoading={isLoading} />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialAssets isLoading={isLoading} />
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
