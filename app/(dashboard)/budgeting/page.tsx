import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Plus, Target, AlertCircle } from "lucide-react";

export default function BudgetingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgeting</h1>
          <p className="text-muted-foreground">
            Set budgets, track spending, and achieve your financial goals.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Monthly Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,000.00</div>
            <p className="text-xs text-muted-foreground">
              Target spending limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$2,456.78</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$543.22</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>
            Track your spending against your monthly budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">81.9% used</span>
            </div>
            <Progress value={81.9} className="w-full" />
            <div className="text-xs text-muted-foreground">
              $2,456.78 of $3,000.00 budget used
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>
              Individual spending limits by category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Food & Dining</span>
                  <span className="text-sm text-muted-foreground">
                    $450 / $500
                  </span>
                </div>
                <Progress value={90} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Transportation</span>
                  <span className="text-sm text-muted-foreground">
                    $200 / $300
                  </span>
                </div>
                <Progress value={66.7} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entertainment</span>
                  <span className="text-sm text-muted-foreground">
                    $150 / $200
                  </span>
                </div>
                <Progress value={75} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Shopping</span>
                  <span className="text-sm text-muted-foreground">
                    $300 / $400
                  </span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>
              Track progress toward your savings targets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-sm text-muted-foreground">
                    $8,500 / $10,000
                  </p>
                  <Progress value={85} className="w-full mt-2" />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Vacation Fund</p>
                  <p className="text-sm text-muted-foreground">
                    $1,200 / $3,000
                  </p>
                  <Progress value={40} className="w-full mt-2" />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium">New Car Down Payment</p>
                  <p className="text-sm text-muted-foreground">
                    $2,000 / $5,000
                  </p>
                  <Progress value={40} className="w-full mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span>Budget Alerts</span>
          </CardTitle>
          <CardDescription>
            Stay informed about your spending patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  Food & Dining Budget
                </p>
                <p className="text-sm text-yellow-700">
                  You've used 90% of your monthly budget
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Emergency Fund Goal</p>
                <p className="text-sm text-blue-700">
                  You're 85% of the way to your $10,000 goal!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
