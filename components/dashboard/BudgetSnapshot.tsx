import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

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
  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return "destructive";
    if (percentage >= 80) return "default";
    return "default";
  };

  const getStatusIcon = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100)
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (percentage >= 80) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getStatusText = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return "Over Budget";
    if (percentage >= 80) return "Approaching Limit";
    return "On Track";
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Budget Snapshot</CardTitle>
        <CardDescription>
          Top budget categories for the current month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {exampleCategories.map((category) => {
              const percentage = Math.min(
                (category.spent / category.budgeted) * 100,
                100
              );
              const remaining = category.budgeted - category.spent;

              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(category.spent, category.budgeted)}
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} of $
                          {category.budgeted.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          remaining >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {remaining >= 0
                          ? `$${remaining.toLocaleString()} left`
                          : `$${Math.abs(remaining).toLocaleString()} over`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getStatusText(category.spent, category.budgeted)}
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={percentage}
                    className="h-2"
                    style={
                      {
                        "--progress-background":
                          getProgressColor(
                            category.spent,
                            category.budgeted
                          ) === "destructive"
                            ? "#ef4444"
                            : undefined,
                      } as React.CSSProperties
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Budget</span>
              <span className="font-medium">$3,500</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-medium">$3,250</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Remaining</span>
              <span className="text-green-600">$250</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
