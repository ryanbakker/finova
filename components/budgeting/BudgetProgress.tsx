import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetProgressProps {
  totalSpent: number;
  totalBudget: number;
  isLoading?: boolean;
}

export function BudgetProgress({
  totalSpent,
  totalBudget,
  isLoading = false,
}: BudgetProgressProps) {
  const utilizationPercentage = (totalSpent / totalBudget) * 100;

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-full h-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
