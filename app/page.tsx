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
  GetStartedNotice,
} from "@/components/dashboard";
import { useUser } from "@clerk/nextjs";
import { FileText, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDashboardData,
  DashboardData,
} from "@/lib/services/dashboard.service";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import { ContributionDialog } from "@/components/dashboard/ContributionDialog";
import { Account, Category } from "@/lib/types";
import Image from "next/image";

function DashboardContent({
  user,
  isLoaded,
}: {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showGetStartedNotice, setShowGetStartedNotice] = useState(true);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isContributionDialogOpen, setIsContributionDialogOpen] =
    useState(false);

  // Extract unique accounts and categories from dashboard data
  const extractAccountsAndCategories = (data: DashboardData) => {
    const accountMap = new Map<string, Account>();
    const categoryMap = new Map<string, Category>();

    // Extract from transactions
    data.recentTransactions.forEach((transaction) => {
      // Extract account information
      if (transaction.accountId && transaction.accountName) {
        accountMap.set(transaction.accountId, {
          id: transaction.accountId,
          name: transaction.accountName,
          type: "checking", // Default type since we don't store this in transactions
          balance: 0, // We don't track balance in transactions
          currency: "AUD", // Default currency
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Extract category information
      if (transaction.category) {
        categoryMap.set(transaction.category.id, {
          id: transaction.category.id,
          name: transaction.category.name,
          icon: transaction.category.icon,
        });
      }
    });

    return {
      accounts: Array.from(accountMap.values()),
      categories: Array.from(categoryMap.values()),
    };
  };

  // Function to refresh dashboard data
  const refreshDashboardData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);

      // Extract accounts and categories from dashboard data
      const { accounts: extractedAccounts, categories: extractedCategories } =
        extractAccountsAndCategories(data);
      setAccounts(extractedAccounts);
      setCategories(extractedCategories);

      setError(null);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError("Failed to refresh dashboard data");
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        console.log("🔄 Starting dashboard data fetch...");
        setIsLoading(true);
        setError(null);

        const data = await getDashboardData();
        console.log("✅ Dashboard data fetched successfully");
        setDashboardData(data);

        // Extract accounts and categories from dashboard data
        const { accounts: extractedAccounts, categories: extractedCategories } =
          extractAccountsAndCategories(data);
        setAccounts(extractedAccounts);
        setCategories(extractedCategories);

        setError(null);

        // Console log all financial data in an easy-to-understand format
        console.log("🏦 FINOVA FINANCIAL DATA OVERVIEW", {
          "💰 Financial Metrics": {
            "Total Income (This Month)": `$${data.metrics.totalIncome.toLocaleString()}`,
            "Total Expenses (This Month)": `$${data.metrics.totalExpenses.toLocaleString()}`,
            "Savings Contributions (This Month)": `$${data.metrics.savings.toLocaleString()}`,
            "Remaining (This Month)": `$${data.metrics.netIncome.toLocaleString()}`,
            "Net Worth": `$${data.metrics.netWorth.toLocaleString()}`,
            "Total Assets": `$${data.metrics.totalAssets.toLocaleString()}`,
            "Total Liabilities": `$${data.metrics.totalLiabilities.toLocaleString()}`,
          },
          "💳 Recent Transactions": data.recentTransactions.map((t) => ({
            Description: t.title,
            Amount: `${
              t.type === "income" ? "+" : "-"
            }$${t.amount.toLocaleString()}`,
            Type: t.type,
            Date: t.time,
          })),
          "📅 Upcoming Bills": data.upcomingBills.map((bill) => ({
            "Bill Name": bill.name,
            Amount: `$${bill.amount.toLocaleString()}`,
            "Due Date": bill.dueDate,
          })),
          "📊 Budget Progress": data.budgetProgress.map((budget) => ({
            Category: budget.category,
            Budgeted: `$${budget.budgeted.toLocaleString()}`,
            Spent: `$${budget.spent.toLocaleString()}`,
            Remaining: `$${budget.remaining.toLocaleString()}`,
            Progress: `${budget.percentage.toFixed(1)}%`,
          })),
          "🎯 Financial Goals": data.financialGoals.map((goal) => ({
            "Goal Name": goal.name,
            "Target Amount": `$${goal.targetAmount.toLocaleString()}`,
            "Current Amount": `$${goal.currentAmount.toLocaleString()}`,
            Progress: `${goal.progress.toFixed(1)}%`,
            "Target Date": new Date(goal.targetDate).toLocaleDateString(),
            Priority: goal.priority,
          })),
          "🏠 Assets": data.assets.map((asset) => ({
            "Asset Name": asset.name,
            Type: asset.type,
            "Current Value": `$${(
              asset.currentValue ||
              asset.value ||
              0
            ).toLocaleString()}`,
            "Original Value": `$${(
              asset.originalValue ||
              asset.value ||
              0
            ).toLocaleString()}`,
          })),
          "📈 Category Breakdown (This Month)": data.categoryBreakdown.map(
            (cat) => ({
              Category: cat.category,
              "Amount Spent": `$${cat.amount.toLocaleString()}`,
            })
          ),
          "📊 Monthly Income vs Spending (Last 6 Months)":
            data.monthlyIncomeSpending.map((month) => ({
              Month: month.month,
              Income: `$${month.income.toLocaleString()}`,
              Spending: `$${month.spending.toLocaleString()}`,
              Surplus: `$${month.surplus.toLocaleString()}`,
            })),
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);

        // Enhanced error handling
        let errorMessage = "Failed to load dashboard data";
        if (err instanceof Error) {
          if (err.message.includes("Unauthorized")) {
            errorMessage =
              "Authentication failed. Please try logging in again.";
          } else if (err.message.includes("MONGODB_URL")) {
            errorMessage =
              "Database connection failed. Please try again later.";
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  // Check if there's no data to show
  const hasNoData =
    dashboardData &&
    dashboardData.metrics.totalIncome === 0 &&
    dashboardData.metrics.totalExpenses === 0 &&
    dashboardData.metrics.totalAssets === 0 &&
    dashboardData.metrics.totalLiabilities === 0 &&
    dashboardData.recentTransactions.length === 0 &&
    dashboardData.upcomingBills.length === 0 &&
    dashboardData.budgetProgress.length === 0 &&
    dashboardData.financialGoals.length === 0 &&
    dashboardData.assets.length === 0;

  // Quick actions data
  const quickActions = [
    {
      id: 1,
      title: "Add Transaction",
      description: "Record a new expense or income",
      icon: Plus,
      action: () => setIsTransactionDialogOpen(true),
      disabled: false,
    },
    {
      id: 2,
      title: "Add Contribution",
      description: "Record a new savings or balance contribution",
      icon: Plus,
      action: () => setIsContributionDialogOpen(true),
      disabled: false,
    },
    {
      id: 3,
      title: "Generate Report",
      description: "Use AI to create a report to get financial insights",
      icon: FileText,
      action: () => router.push("/report"),
      disabled: true,
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
      <header className="rounded-b-xl">
        <div className="flex h-16 shrink-0 items-center gap-2 px-4 rounded-xl mb-1 dark:bg-[#0a0a0a] bg-white shadow-sm mt-1">
          <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
          <div className="ml-auto">
            <Image src="/finova-logo.svg" alt="Finova" width={80} height={30} />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto w-full rounded-xl mt-1 pt-5 dark:bg-[#0a0a0a] lg:bg-white shadow-sm">
        <div className="space-y-6 page-content">
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

          {/* Get Started Notice - shown when no data */}
          {!isLoading && hasNoData && showGetStartedNotice && (
            <GetStartedNotice onClose={() => setShowGetStartedNotice(false)} />
          )}

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
              title="Remaining"
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
              <NetWorthSummary />
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
                        onClick={action.disabled ? undefined : action.action}
                        disabled={action.disabled}
                        className={`w-full rounded-lg border transition-colors flex justify-between group ${
                          action.disabled
                            ? "cursor-not-allowed opacity-50 bg-neutral-100 dark:bg-neutral-800"
                            : "cursor-pointer bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <div className="p-3 text-left">
                          <div
                            className={`font-medium ${
                              action.disabled ? "text-muted-foreground" : ""
                            }`}
                          >
                            {action.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-center border-l px-3 rounded-r-lg transition-colors ${
                            action.disabled
                              ? "bg-neutral-100 dark:bg-neutral-800"
                              : "bg-neutral-50 group-hover:bg-sky-50 dark:bg-neutral-900 dark:group-hover:bg-sky-950"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 transition-colors ${
                              action.disabled
                                ? "text-muted-foreground"
                                : "group-hover:text-sky-600 dark:group-hover:text-sky-400"
                            }`}
                          />
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
                monthlyData={dashboardData?.monthlyIncomeSpending}
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

      {/* Modal Dialogs */}
      <CreateTransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        onSuccess={refreshDashboardData}
        accounts={accounts}
        categories={categories}
      />

      <ContributionDialog
        isOpen={isContributionDialogOpen}
        onClose={() => setIsContributionDialogOpen(false)}
        onSuccess={refreshDashboardData}
      />
    </>
  );
}

export default function Home() {
  const { user, isLoaded } = useUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 shadow-none! w-full min-w-0 dark:bg-[#171717] bg-[#fafafa]">
          <DashboardContent user={user} isLoaded={isLoaded} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
