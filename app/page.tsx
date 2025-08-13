"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
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

function DashboardContent({
  user,
  isLoaded,
}: {
  user: any;
  isLoaded: boolean;
}) {
  const { state } = useSidebar();

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

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <div className="mx-auto w-full flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
        </div>
      </header>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto w-full">
            <MetricCard
              title="Total Income"
              value={8450}
              subtitle="This month"
              dataValueColor="text-emerald-600"
              borderColor="border-l-emerald-700"
              bgGradientFrom="from-emerald-50/50"
            />
            <MetricCard
              title="Total Expenses"
              value={5230}
              subtitle="This month"
              dataValueColor="text-red-600"
              borderColor="border-l-red-700"
              bgGradientFrom="from-red-50/50"
            />
            <MetricCard
              title="Savings"
              value={3220}
              subtitle="This month"
              dataValueColor="text-sky-600"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/50"
            />
            <MetricCard
              title="Net Income"
              value={3220}
              subtitle="This month"
              dataValueColor="text-sky-600"
              borderColor="border-l-sky-700"
              bgGradientFrom="from-sky-50/50"
            />
          </div>

          {/* Second Row - Net Worth Summary & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto w-full">
            <div className="w-full lg:col-span-3 flex">
              <NetWorthSummary />
            </div>
            <Card className="w-full lg:col-span-1 container-color">
              <CardHeader>
                <CardTitle className="text-sky-900">Quick Actions</CardTitle>
                <CardDescription>
                  Update your financial data and generate reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full rounded-lg border transition-colors flex justify-between group cursor-pointer bg-white">
                    <div className="p-3 text-left">
                      <div className="font-medium">Add Transaction</div>
                      <div className="text-xs text-muted-foreground">
                        Record a new expense or income
                      </div>
                    </div>
                    <div className="flex items-center justify-center border-l px-3 bg-neutral-50 group-hover:bg-sky-50">
                      <Plus className="w-5 h-5 group-hover:text-sky-600 transition-colors" />
                    </div>
                  </button>
                  <button className="w-full rounded-lg border transition-colors flex justify-between group cursor-pointer bg-white">
                    <div className="p-3 text-left">
                      <div className="font-medium">Add Contribution</div>
                      <div className="text-xs text-muted-foreground">
                        Record a new savings or balance contribution
                      </div>
                    </div>
                    <div className="flex items-center justify-center border-l px-3 bg-neutral-50 group-hover:bg-sky-50">
                      <Plus className="w-5 h-5 group-hover:text-sky-600 transition-colors" />
                    </div>
                  </button>
                  <button className="w-full rounded-lg border transition-colors flex justify-between group cursor-pointer bg-white">
                    <div className="p-3 text-left">
                      <div className="font-medium">Generate Report</div>
                      <div className="text-xs text-muted-foreground">
                        Use AI to create a report to get financial insights
                      </div>
                    </div>
                    <div className="flex items-center justify-center border-l px-3 bg-neutral-50 group-hover:bg-sky-50">
                      <FileText className="w-5 h-5 group-hover:text-sky-600 transition-colors" />
                    </div>
                  </button>
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
                  <CardTitle className="text-sky-900">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest financial updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll">
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className={`py-2 px-3 border rounded-lg transition-colors ${
                            activity.type === "income"
                              ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                              : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100"
                          }`}
                        >
                          <div className="flex flex-col items-start space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate max-w-[170px]">
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
                  <CardTitle className="text-sky-900">Upcoming Bills</CardTitle>
                  <CardDescription>
                    Bills due in the next 30 days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[250px] overflow-y-auto category-breakdown-scroll">
                    <div className="space-y-3">
                      {[
                        {
                          name: "Rent",
                          dueDate: "Dec 1",
                          amount: 1200,
                          color: "text-red-600",
                        },
                        {
                          name: "Electric Bill",
                          dueDate: "Dec 5",
                          amount: 85,
                          color: "text-orange-600",
                        },
                        {
                          name: "Internet",
                          dueDate: "Dec 10",
                          amount: 65,
                          color: "text-blue-600",
                        },
                        {
                          name: "Phone Bill",
                          dueDate: "Dec 15",
                          amount: 45,
                          color: "text-purple-600",
                        },
                        {
                          name: "Gym Membership",
                          dueDate: "Dec 20",
                          amount: 35,
                          color: "text-indigo-600",
                        },
                        {
                          name: "Car Insurance",
                          dueDate: "Dec 25",
                          amount: 120,
                          color: "text-amber-600",
                        },
                      ].map((bill, index) => (
                        <div
                          key={index}
                          className="p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm text-sky-800">
                                {bill.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due {bill.dueDate}
                              </p>
                            </div>
                            <span
                              className={`text-sm font-medium ${bill.color}`}
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
              <IncomeVsSpendingChart />
            </div>
          </div>

          {/* Fourth Row - Budget Snapshot & Financial Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <BudgetSnapshot />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialGoals />
            </div>
          </div>

          {/* Fifth Row - Category Breakdown & Financial Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
            <div className="w-full lg:col-span-2">
              <CategoryBreakdownChart />
            </div>
            <div className="w-full lg:col-span-2">
              <FinancialAssets />
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
