import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Target,
  TrendingUp,
  Home,
  Car,
  Plane,
  Laptop,
  Heart,
  PiggyBank,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { FinancialGoal } from "@/lib/types";

interface FinancialGoalsProps {
  isLoading?: boolean;
  goals?: FinancialGoal[];
}

export function FinancialGoals({
  isLoading = false,
  goals = [],
}: FinancialGoalsProps) {
  // Helper function to get appropriate icon based on goal category
  const getGoalIcon = (category: string) => {
    const iconClass = "h-5 w-5";
    switch (category.toLowerCase()) {
      case "housing":
      case "home":
        return <Home className={iconClass} />;
      case "transportation":
      case "car":
        return <Car className={iconClass} />;
      case "travel":
      case "vacation":
        return <Plane className={iconClass} />;
      case "technology":
      case "electronics":
        return <Laptop className={iconClass} />;
      case "wedding":
      case "marriage":
        return <Heart className={iconClass} />;
      case "emergency":
      case "savings":
        return <PiggyBank className={iconClass} />;
      case "investment":
      case "business":
        return <Briefcase className={iconClass} />;
      case "education":
      case "school":
        return <GraduationCap className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  // Helper function to get progress percentage
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Helper function to get progress colors based on completion
  const getProgressColors = (progress: number) => {
    if (progress >= 90) {
      return {
        border: "border-rose-200 dark:border-rose-700",
        background:
          "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
        iconColor: "text-rose-600 dark:text-rose-400",
        textColor: "text-rose-800 dark:text-rose-200",
        progressColor: "#e11d48",
      };
    } else if (progress >= 75) {
      return {
        border: "border-amber-200 dark:border-amber-700",
        background:
          "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        textColor: "text-amber-800 dark:text-amber-200",
        progressColor: "#f59e0b",
      };
    } else {
      return {
        border: "border-sky-200 dark:border-sky-700",
        background:
          "bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30",
        iconColor: "text-sky-600 dark:text-sky-400",
        textColor: "text-sky-800 dark:text-sky-200",
        progressColor: "#0ea5e9",
      };
    }
  };
  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[150px] overflow-y-auto category-breakdown-scroll">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30"
                >
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="w-full h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-sky-500">
      <CardHeader>
        <CardTitle className="text-sky-700 dark:text-sky-300">
          Financial Goals
        </CardTitle>
        <CardDescription>
          Track progress toward your savings targets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[300px] overflow-y-auto category-breakdown-scroll">
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map((goal) => {
                const progress = getProgressPercentage(
                  goal.currentAmount,
                  goal.targetAmount
                );
                const colors = getProgressColors(progress);
                const remaining = goal.targetAmount - goal.currentAmount;

                return (
                  <div
                    key={goal.id || goal._id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg ${colors.border} ${colors.background}`}
                  >
                    {getGoalIcon(goal.category)}
                    <div className="flex-1">
                      <p className={`font-medium ${colors.textColor}`}>
                        {goal.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${goal.currentAmount.toLocaleString()} / $
                        {goal.targetAmount.toLocaleString()}
                        {remaining > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (${remaining.toLocaleString()} remaining)
                          </span>
                        )}
                      </p>
                      <Progress
                        value={progress}
                        className="w-full mt-2 h-2"
                        style={
                          {
                            "--progress-background": "#e5e7eb",
                            "--progress-foreground": colors.progressColor,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-medium mb-2">
                  No Financial Goals Yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Create your first financial goal to start tracking your
                  progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
