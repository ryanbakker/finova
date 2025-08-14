import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Plane, Car, Plus, Laptop } from "lucide-react";

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  icon: React.ReactNode;
}

const exampleGoals: FinancialGoal[] = [
  {
    id: "0",
    name: "Home Down Payment Fund",
    targetAmount: 50000,
    currentAmount: 15000,
    category: "Housing",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "1",
    name: "Laptop Fund",
    targetAmount: 2000,
    currentAmount: 2000,
    category: "Technology",
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    id: "2",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 8500,
    category: "Savings",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "3",
    name: "Vacation Fund",
    targetAmount: 5000,
    currentAmount: 3200,
    category: "Travel",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    id: "4",
    name: "New Car Fund",
    targetAmount: 25000,
    currentAmount: 8500,
    category: "Transportation",
    icon: <Car className="h-4 w-4" />,
  },
  {
    id: "5",
    name: "Wedding Fund",
    targetAmount: 30000,
    currentAmount: 12000,
    category: "Life Events",
    icon: <Target className="h-4 w-4" />,
  },
];

export function FinancialGoals() {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColors = (progress: number) => {
    if (progress >= 100) {
      // Completed - emerald theme
      return {
        border: "border-emerald-200",
        background:
          "bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-950/40 dark:to-green-950/40 dark:border-emerald-900/40 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        iconColor: "text-emerald-900 dark:text-emerald-500/90",
        textColor: "text-emerald-800 dark:text-emerald-500/90",
        percentageColor: "text-emerald-600 dark:text-emerald-500/90",
        progressColor: "#059669",
      };
    } else if (progress >= 75) {
      // Close to completion - cyan theme
      return {
        border: "border-cyan-200",
        background:
          "bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 dark:from-cyan-950/40 dark:to-blue-950/40 dark:border-cyan-900/40 dark:hover:from-cyan-900/50 dark:hover:to-blue-900/50",
        iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
        iconColor: "text-cyan-900 dark:text-cyan-500/90",
        textColor: "text-cyan-800 dark:text-cyan-500/90",
        percentageColor: "text-cyan-600 dark:text-cyan-500/90",
        progressColor: "#0891b2",
      };
    } else if (progress >= 50) {
      // Halfway there - sky theme
      return {
        border: "border-sky-200",
        background:
          "bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 dark:from-sky-950/40 dark:to-cyan-950/40 dark:border-sky-900/40 dark:hover:from-sky-900/50 dark:hover:to-cyan-900/50",
        iconBg: "bg-sky-100 dark:bg-sky-900/40",
        iconColor: "text-sky-900 dark:text-sky-500/90",
        textColor: "text-sky-800 dark:text-sky-500/90",
        percentageColor: "text-sky-600 dark:text-sky-500/90",
        progressColor: "#0ea5e9",
      };
    } else {
      // Early stages - lighter sky theme
      return {
        border: "border-sky-200",
        background:
          "bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40 dark:border-sky-900/40 dark:hover:from-sky-900/50 dark:hover:to-blue-900/50",
        iconBg: "bg-sky-100 dark:bg-sky-900/40",
        iconColor: "text-sky-900 dark:text-sky-500/90",
        textColor: "text-sky-800 dark:text-sky-500/90",
        percentageColor: "text-sky-600 dark:text-sky-500/90",
        progressColor: "#0ea5e9",
      };
    }
  };

  return (
    <Card className="h-full container-color">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <CardTitle className="card-title">Financial Goals</CardTitle>
            <CardDescription>
              Track your progress towards financial milestones
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <button className="px-3 py-1.5 text-sm bg-sky-600  rounded-md hover:bg-sky-700 flex items-center gap-2 bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 text-white hover:from-sky-600 hover:via-sky-600 hover:text-white transition-colors cursor-pointer shadow-sm">
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 overflow-y-auto category-breakdown-scroll max-h-[410px]">
          <div className="space-y-4">
            {exampleGoals.map((goal) => {
              const progress = getProgressPercentage(
                goal.currentAmount,
                goal.targetAmount
              );
              const remaining = goal.targetAmount - goal.currentAmount;
              const colors = getProgressColors(progress);

              return (
                <div
                  key={goal.id}
                  className={`p-3 border rounded-lg transition-colors ${colors.border} ${colors.background}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded-lg ${colors.iconBg} ${colors.iconColor}`}
                        >
                          {goal.icon}
                        </div>
                        <p className={`font-medium ${colors.textColor}`}>
                          {goal.name}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${colors.percentageColor}`}
                      >
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        ${goal.currentAmount.toLocaleString()} / $
                        {goal.targetAmount.toLocaleString()}
                      </p>
                      {remaining > 0 ? (
                        <p className="text-xs text-muted-foreground">
                          ${remaining.toLocaleString()} to go
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-emerald-600">
                          Completed
                        </p>
                      )}
                    </div>
                    <Progress
                      value={progress}
                      className="w-full h-2"
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
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
