import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetProgressProps {
  totalSpent: number;
  totalBudget: number;
}

export function BudgetProgress({
  totalSpent,
  totalBudget,
}: BudgetProgressProps) {
  const utilizationPercentage = (totalSpent / totalBudget) * 100;

  return (
    <Card className="border-l-4 border-l-sky-500 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sky-700 text-base">
          Budget Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Track your spending against your monthly budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Overall Progress</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(utilizationPercentage)}% used
            </span>
          </div>
          <Progress
            value={utilizationPercentage}
            className="w-full h-2"
            style={
              {
                "--progress-background": "#e5e7eb",
                "--progress-foreground":
                  utilizationPercentage > 80
                    ? "#ef4444"
                    : utilizationPercentage > 60
                    ? "#f59e0b"
                    : "#10b981",
              } as React.CSSProperties
            }
          />
          <div className="text-xs text-muted-foreground">
            ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}{" "}
            budget used
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
