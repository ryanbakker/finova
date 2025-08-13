import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock, MoveRight } from "lucide-react";
import Link from "next/link";

interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  icon: React.ReactNode;
}

const exampleCategories: BudgetCategory[] = [
  {
    name: "Groceries",
    budgeted: 600,
    spent: 720,
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    name: "Rent",
    budgeted: 1800,
    spent: 1800,
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    name: "Transportation",
    budgeted: 400,
    spent: 320,
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    name: "Shopping",
    budgeted: 200,
    spent: 150,
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    name: "Healthcare",
    budgeted: 150,
    spent: 180,
    icon: <Clock className="h-4 w-4" />,
  },
];

export function BudgetSnapshot() {
  const getStatusIcon = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100)
      return <AlertCircle className="h-4 w-4 text-sky-900" />;
    if (percentage >= 80) return <Clock className="h-4 w-4 text-sky-900" />;
    return <CheckCircle className="h-4 w-4 text-sky-900" />;
  };

  return (
    <Card className="h-full container-color">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sky-900">Budget Snapshot</CardTitle>
            <CardDescription>
              Top budget categories for the current month
            </CardDescription>
          </div>
          <Link href="/budgeting">
            <button className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center gap-2">
              Budgets
              <MoveRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[410px] overflow-y-auto category-breakdown-scroll">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {exampleCategories.map((category) => {
                const percentage = Math.min(
                  (category.spent / category.budgeted) * 100,
                  100
                );
                const remaining = category.budgeted - category.spent;

                return (
                  <div
                    key={category.name}
                    className="p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-sky-100">
                            {getStatusIcon(category.spent, category.budgeted)}
                          </div>
                          <p className="font-medium text-sky-800">
                            {category.name}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-sky-600">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} / $
                          {category.budgeted.toLocaleString()}
                        </p>
                        {remaining >= 0 ? (
                          <p className="text-xs text-muted-foreground">
                            ${remaining.toLocaleString()} left
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            ${Math.abs(remaining).toLocaleString()} over
                          </p>
                        )}
                      </div>
                      <Progress
                        value={percentage}
                        className="w-full h-2"
                        style={
                          {
                            "--progress-background": "#e5e7eb",
                            "--progress-foreground": "#0ea5e9",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
