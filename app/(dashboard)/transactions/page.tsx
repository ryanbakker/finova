import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Plus, Search, Filter } from "lucide-react";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your financial transactions.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activity across all accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Salary Deposit</p>
                  <p className="text-sm text-muted-foreground">
                    Bank of America • Today
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+$4,500.00</p>
                <p className="text-sm text-muted-foreground">Income</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Grocery Store</p>
                  <p className="text-sm text-muted-foreground">
                    Safeway • Yesterday
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-$89.45</p>
                <p className="text-sm text-muted-foreground">Food & Dining</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Gas Station</p>
                  <p className="text-sm text-muted-foreground">
                    Shell • Yesterday
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-$45.67</p>
                <p className="text-sm text-muted-foreground">Transportation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Netflix Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    Netflix • 2 days ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-$15.99</p>
                <p className="text-sm text-muted-foreground">Entertainment</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Freelance Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Upwork • 3 days ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+$250.00</p>
                <p className="text-sm text-muted-foreground">Income</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$4,750.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$1,151.11</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$3,598.89</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <DashboardFooter />
    </div>
  );
}
