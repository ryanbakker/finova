import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Plane, Car, Plus } from "lucide-react";

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
    id: "1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 8500,
    category: "Savings",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "2",
    name: "Vacation Fund",
    targetAmount: 5000,
    currentAmount: 3200,
    category: "Travel",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    id: "3",
    name: "New Car Fund",
    targetAmount: 25000,
    currentAmount: 8500,
    category: "Transportation",
    icon: <Car className="h-4 w-4" />,
  },
  {
    id: "4",
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

  const getOverallProgress = () => {
    const totalCurrent = exampleGoals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0
    );
    const totalTarget = exampleGoals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0
    );
    return ((totalCurrent / totalTarget) * 100).toFixed(1);
  };

  return (
    <Card className="h-full container-color">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sky-900">Financial Goals</CardTitle>
            <CardDescription>
              Track your progress towards financial milestones
            </CardDescription>
            <div className="text-lg font-semibold text-sky-600">
              Overall Progress: {getOverallProgress()}%
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-sm text-muted-foreground">
              {exampleGoals.length} Goals
            </div>
            <button className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 max-h-[375px] overflow-y-auto category-breakdown-scroll">
          <div className="space-y-4">
            {exampleGoals.map((goal) => {
              const progress = getProgressPercentage(
                goal.currentAmount,
                goal.targetAmount
              );
              const remaining = goal.targetAmount - goal.currentAmount;

              return (
                <div
                  key={goal.id}
                  className="p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-sky-100 text-sky-900">
                          {goal.icon}
                        </div>
                        <p className="font-medium text-sky-800">{goal.name}</p>
                      </div>
                      <span className="text-sm font-medium text-sky-600">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        ${goal.currentAmount.toLocaleString()} / $
                        {goal.targetAmount.toLocaleString()}
                      </p>
                      {remaining > 0 && (
                        <p className="text-xs text-muted-foreground">
                          ${remaining.toLocaleString()} to go
                        </p>
                      )}
                    </div>
                    <Progress
                      value={progress}
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
      </CardContent>
    </Card>
  );
}
