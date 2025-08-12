"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart } from "@tremor/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyData {
  month: string;
  income: number;
  spending: number;
}

const exampleData: MonthlyData[] = [
  { month: "Jan", income: 5200, spending: 4800 },
  { month: "Feb", income: 5400, spending: 5100 },
  { month: "Mar", income: 5100, spending: 4900 },
  { month: "Apr", income: 5800, spending: 5200 },
  { month: "May", income: 5600, spending: 5400 },
  { month: "Jun", income: 5900, spending: 5100 },
  { month: "Jul", income: 6100, spending: 5300 },
  { month: "Aug", income: 5800, spending: 5600 },
  { month: "Sep", income: 6200, spending: 5400 },
  { month: "Oct", income: 6000, spending: 5200 },
  { month: "Nov", income: 6400, spending: 5800 },
  { month: "Dec", income: 6800, spending: 6200 },
];

export function IncomeVsSpendingChart() {
  const currentMonth = exampleData[exampleData.length - 1];
  const previousMonth = exampleData[exampleData.length - 2];

  const incomeChange = currentMonth.income - previousMonth.income;
  const spendingChange = currentMonth.spending - previousMonth.spending;

  const incomeChangePercent = (
    (incomeChange / previousMonth.income) *
    100
  ).toFixed(1);
  const spendingChangePercent = (
    (spendingChange / previousMonth.spending) *
    100
  ).toFixed(1);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Income vs Spending Over Time</CardTitle>
        <CardDescription>
          Monthly trends in your income and spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-600">
                ${currentMonth.income.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {incomeChange >= 0 ? "+" : ""}
                {incomeChangePercent}% from last month
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-lg font-bold text-red-600">
                ${currentMonth.spending.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {spendingChange >= 0 ? "+" : ""}
                {spendingChangePercent}% from last month
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="flex-1 min-h-0" style={{ height: "100%" }}>
            <AreaChart
              data={exampleData}
              index="month"
              categories={["income", "spending"]}
              colors={["emerald", "red"]}
              showLegend={true}
              showGridLines={true}
              showAnimation={true}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              curveType="monotone"
              className="h-full w-full"
              style={{ height: "100%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
