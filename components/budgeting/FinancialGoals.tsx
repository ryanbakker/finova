import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";

export function FinancialGoals() {
  return (
    <Card className="border-l-4 border-l-sky-500">
      <CardHeader>
        <CardTitle className="text-sky-700">Financial Goals</CardTitle>
        <CardDescription>
          Track progress toward your savings targets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50">
            <Target className="h-5 w-5 text-sky-600" />
            <div className="flex-1">
              <p className="font-medium text-sky-800">Emergency Fund</p>
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

          <div className="flex items-center space-x-3 p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50">
            <TrendingUp className="h-5 w-5 text-sky-600" />
            <div className="flex-1">
              <p className="font-medium text-sky-800">Vacation Fund</p>
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

          <div className="flex items-center space-x-3 p-3 border border-sky-200 rounded-lg bg-gradient-to-r from-sky-50 to-cyan-50">
            <Target className="h-5 w-5 text-sky-600" />
            <div className="flex-1">
              <p className="font-medium text-sky-800">New Car Down Payment</p>
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
        </div>
      </CardContent>
    </Card>
  );
}
