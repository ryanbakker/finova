import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Calendar,
  Home,
  Plane,
  GraduationCap,
  Car,
  Plus,
} from "lucide-react";

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
}

const exampleGoals: FinancialGoal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 8500,
    targetDate: "2024-06-01",
    category: "Savings",
    icon: <Target className="h-4 w-4" />,
    priority: "high",
  },
  {
    id: "2",
    name: "Vacation Fund",
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: "2024-08-01",
    category: "Travel",
    icon: <Plane className="h-4 w-4" />,
    priority: "medium",
  },
  {
    id: "5",
    name: "New Car Fund",
    targetAmount: 25000,
    currentAmount: 8500,
    targetDate: "2026-03-01",
    category: "Transportation",
    icon: <Car className="h-4 w-4" />,
    priority: "low",
  },
  {
    id: "6",
    name: "Wedding Fund",
    targetAmount: 30000,
    currentAmount: 12000,
    targetDate: "2025-06-01",
    category: "Life Events",
    icon: <Target className="h-4 w-4" />,
    priority: "high",
  },
];

export function FinancialGoals() {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityText = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeStatus = (daysUntilTarget: number) => {
    if (daysUntilTarget <= 0) return "Overdue";
    if (daysUntilTarget <= 30) return "Due Soon";
    if (daysUntilTarget <= 90) return "On Track";
    return "Plenty of Time";
  };

  const getTimeStatusColor = (daysUntilTarget: number) => {
    if (daysUntilTarget <= 0) return "destructive";
    if (daysUntilTarget <= 30) return "default";
    if (daysUntilTarget <= 90) return "secondary";
    return "secondary";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>
              Track your progress towards financial milestones
            </CardDescription>
            <div className="text-lg font-semibold text-blue-600">
              Overall Progress Completed:{" "}
              {(
                (exampleGoals.reduce(
                  (sum, goal) => sum + goal.currentAmount,
                  0
                ) /
                  exampleGoals.reduce(
                    (sum, goal) => sum + goal.targetAmount,
                    0
                  )) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-sm text-muted-foreground">
              {exampleGoals.length} Goals
            </div>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {exampleGoals.map((goal) => {
              const progress = getProgressPercentage(
                goal.currentAmount,
                goal.targetAmount
              );
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
              const timeStatus = getTimeStatus(daysUntilTarget);
              const timeStatusColor = getTimeStatusColor(daysUntilTarget);

              return (
                <div key={goal.id} className="space-y-4 p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-muted">{goal.icon}</div>
                      <div>
                        <div className="font-medium">{goal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {goal.category}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant={getPriorityColor(goal.priority)}
                        className="text-xs"
                      >
                        {getPriorityText(goal.priority)} Priority
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {progress.toFixed(1)}%
                      </span>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-semibold">
                          ${goal.currentAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Target</div>
                        <div className="font-semibold">
                          ${goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Target Date
                        </span>
                      </div>
                      <Badge variant={timeStatusColor} className="text-xs">
                        {timeStatus}
                      </Badge>
                    </div>

                    {remaining > 0 && (
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium">
                          ${remaining.toLocaleString()} to go
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntilTarget > 0
                            ? `${daysUntilTarget} days remaining`
                            : "Target date passed"}
                        </div>
                      </div>
                    )}
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
