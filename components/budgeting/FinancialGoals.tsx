import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, TrendingUp } from "lucide-react";

interface FinancialGoalsProps {
  isLoading?: boolean;
}

export function FinancialGoals({ isLoading = false }: FinancialGoalsProps) {
  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div
            className="space-y-4 max-h-[150px] overflow-y-auto category-breakdown-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
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
        <div
          className="space-y-4 max-h-[150px] overflow-y-auto category-breakdown-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
        >
          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <Target className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                Emergency Fund
              </p>
              <p className="text-sm text-muted-foreground">$8,500 / $10,000</p>
              <Progress
                value={85}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                Vacation Fund
              </p>
              <p className="text-sm text-muted-foreground">$1,200 / $3,000</p>
              <Progress
                value={40}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <Target className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                New Car Down Payment
              </p>
              <p className="text-sm text-muted-foreground">$2,000 / $5,000</p>
              <Progress
                value={40}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                Home Renovation
              </p>
              <p className="text-sm text-muted-foreground">$5,000 / $15,000</p>
              <Progress
                value={33}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <Target className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                Investment Portfolio
              </p>
              <p className="text-sm text-muted-foreground">$12,000 / $25,000</p>
              <Progress
                value={48}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-sky-200 dark:border-sky-700 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30">
            <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-medium text-sky-800 dark:text-sky-200">
                Wedding Fund
              </p>
              <p className="text-sm text-muted-foreground">$3,500 / $8,000</p>
              <Progress
                value={44}
                className="w-full mt-2 h-2"
                style={
                  {
                    "--progress-background": "#e5e7eb",
                    "--progress-foreground": "#0ea5e9",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
