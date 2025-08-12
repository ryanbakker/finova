import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart } from "@tremor/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface NetWorthData {
  quarter: string;
  netWorth: number;
}

const exampleData: NetWorthData[] = [
  { quarter: "2024 Q1", netWorth: 40000 },
  { quarter: "2024 Q2", netWorth: 52000 },
  { quarter: "2024 Q3", netWorth: 48000 },
  { quarter: "2024 Q4", netWorth: 65000 },
  { quarter: "2025 Q1", netWorth: 58000 },
  { quarter: "2025 Q2", netWorth: 85000 },
  { quarter: "2025 Q3", netWorth: 125000 },
];

export function NetWorthSummary() {
  const currentNetWorth = 125000;
  const previousNetWorth = 85000;
  const change = currentNetWorth - previousNetWorth;
  const changePercentage = ((change / previousNetWorth) * 100).toFixed(1);
  const isPositive = change >= 0;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Net Worth Summary</CardTitle>
        <CardDescription>
          Your total financial position over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                ${currentNetWorth.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {changePercentage}% from last quarter
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Assets</div>
                <div className="font-semibold">$187,500</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Liabilities</div>
                <div className="font-semibold">$35,100</div>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center p-4">
            <LineChart
              data={exampleData}
              index="quarter"
              categories={["netWorth"]}
              colors={["sky"]}
              showLegend={false}
              showGridLines={true}
              showAnimation={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
