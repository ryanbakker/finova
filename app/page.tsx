import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { BarChart3, TrendingUp, CreditCard, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's an overview of your financial health.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$24,567.89</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Spending
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$3,234.56</div>
                    <p className="text-xs text-muted-foreground">
                      -1.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Savings Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.5%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Transactions
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
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
                          <p className="text-sm font-medium">Salary Deposit</p>
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

                <Card className="col-span-3">
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
