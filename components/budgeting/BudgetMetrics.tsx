import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Target, PieChart } from "lucide-react";

interface BudgetMetricsProps {
  totalSpent: number;
  totalBudget: number;
}

export function BudgetMetrics({ totalSpent, totalBudget }: BudgetMetricsProps) {
  const remainingBudget = totalBudget - totalSpent;
  const utilizationPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <DollarSign className="h-6 opacity-80 w-6 text-sky-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-700">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Target spending limit</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
          <TrendingUp className="h-6 opacity-80 w-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <Target className="h-6 opacity-80 w-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${remainingBudget.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Available to spend</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilization</CardTitle>
          <PieChart className="h-6 opacity-80 w-6 text-sky-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-600">
            {utilizationPercentage}%
          </div>
          <p className="text-xs text-muted-foreground">Budget used</p>
        </CardContent>
      </Card>
    </div>
  );
}
