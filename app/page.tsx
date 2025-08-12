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
} from "@/components/dashboard";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here&apos;s an overview of your financial
                  health.
                </p>
              </div>

              {/* Top Row - Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="h-24 col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      $8,450
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card className="h-24 col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      $5,230
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card className="h-24 col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      $3,220
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card className="h-24 col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Net Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      $3,220
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Second Row - Net Worth Summary & Quick Actions */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-3">
                  <NetWorthSummary />
                </div>
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="font-medium">Add Transaction</div>
                        <div className="text-sm text-muted-foreground">
                          Record a new expense or income
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="font-medium">Update Budget</div>
                        <div className="text-sm text-muted-foreground">
                          Adjust your spending limits
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                        <div className="font-medium">View Reports</div>
                        <div className="text-sm text-muted-foreground">
                          Generate financial insights
                        </div>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Third Row - Income vs Spending Chart */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1 flex flex-col space-y-4">
                  {/* Upcoming Bills Container */}
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Upcoming Bills</CardTitle>
                      <CardDescription>
                        Bills due in the next 30 days.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">Rent</p>
                            <p className="text-xs text-muted-foreground">
                              Due Dec 1
                            </p>
                          </div>
                          <span className="text-sm font-medium text-red-600">
                            $1,200
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">Electric Bill</p>
                            <p className="text-xs text-muted-foreground">
                              Due Dec 5
                            </p>
                          </div>
                          <span className="text-sm font-medium text-orange-600">
                            $85
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">Internet</p>
                            <p className="text-xs text-muted-foreground">
                              Due Dec 10
                            </p>
                          </div>
                          <span className="text-xs font-medium text-blue-600">
                            $65
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Container */}
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your latest financial transactions and updates.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Salary Deposit
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Today, 9:00 AM
                            </p>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            +$4,500.00
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Grocery Store</p>
                            <p className="text-xs text-muted-foreground">
                              Yesterday, 2:30 PM
                            </p>
                          </div>
                          <div className="text-sm font-medium text-red-600">
                            -$89.45
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Gas Station</p>
                            <p className="text-xs text-muted-foreground">
                              Yesterday, 10:15 AM
                            </p>
                          </div>
                          <div className="text-sm font-medium text-red-600">
                            -$45.67
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Income vs Spending Chart */}
                <div className="col-span-3">
                  <IncomeVsSpendingChart />
                </div>
              </div>

              {/* Fourth Row - Budget Snapshot & Financial Goals */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2">
                  <BudgetSnapshot />
                </div>
                <div className="col-span-2">
                  <FinancialGoals />
                </div>
              </div>

              {/* Fifth Row - Category Breakdown & Financial Assets */}
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-2">
                  <CategoryBreakdownChart />
                </div>
                <div className="col-span-2">
                  <FinancialAssets />
                </div>
              </div>

              {/* Dashboard Footer */}
              <DashboardFooter />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
