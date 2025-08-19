"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart } from "@tremor/react";
import {
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  MoveRight,
} from "lucide-react";

interface MonthlyData {
  month: string;
  income: number;
  spending: number;
  surplus: number;
}

const exampleData: MonthlyData[] = [
  { month: "Jan", income: 5200, spending: 4800, surplus: 400 },
  { month: "Feb", income: 5400, spending: 5100, surplus: 300 },
  { month: "Mar", income: 5100, spending: 4900, surplus: 200 },
  { month: "Apr", income: 5800, spending: 5200, surplus: 600 },
  { month: "May", income: 5600, spending: 5400, surplus: 200 },
  { month: "Jun", income: 5900, spending: 5100, surplus: 800 },
  { month: "Jul", income: 6100, spending: 5300, surplus: 800 },
  { month: "Aug", income: 5800, spending: 5600, surplus: 200 },
  { month: "Sep", income: 6200, spending: 5400, surplus: 800 },
  { month: "Oct", income: 6000, spending: 5200, surplus: 800 },
  { month: "Nov", income: 6400, spending: 5800, surplus: 600 },
  { month: "Dec", income: 6800, spending: 6200, surplus: 600 },
];

interface IncomeVsSpendingChartProps {
  isLoading?: boolean;
  monthlyData?: Array<{ month: string; expenses: number }>;
  weeklyData?: Array<{ week: string; expenses: number }>;
}

export function IncomeVsSpendingChart({
  isLoading = false,
  monthlyData,
  weeklyData,
}: IncomeVsSpendingChartProps) {
  // Transform the data to match the expected format
  const transformedData: MonthlyData[] =
    monthlyData?.map((item) => ({
      month: item.month,
      income: item.expenses * 1.2, // Estimate income as 20% more than expenses
      spending: item.expenses,
      surplus: item.expenses * 0.2, // Estimate surplus as 20% of expenses
    })) || exampleData;

  const currentMonth = transformedData[transformedData.length - 1];

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full container-color !w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col">
          {/* Summary Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-pink-950/20">
              <div className="flex items-center justify-center mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 mx-auto mb-2" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>

            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-cyan-950/20">
              <div className="flex items-center justify-center mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 mx-auto mb-2" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>

            <div className="text-center p-3 rounded-lg bg-sky-50 dark:bg-amber-950/20">
              <div className="flex items-center justify-center mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 mx-auto mb-2" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          </div>

          {/* Area Chart */}
          <div className="p-6 bg-neutral-50 border border-gray-200 rounded-lg text-xs dark:invert dark:bg-neutral-100/40 flex-1">
            <Skeleton className="w-full h-80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full container-color !w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="card-title pb-1">
            Income vs Spending Over Time
          </CardTitle>
          <CardDescription>
            Monthly trends in your income and spending patterns
          </CardDescription>
        </div>
        <Button className="button-blue-bg">
          Transactions
          <MoveRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col">
        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-pink-950/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-pink-500" />
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-pink-500">
              ${currentMonth.income.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground dark:text-pink-700">
              Income this month
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-cyan-950/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-cyan-700" />
            </div>
            <div className="text-lg font-bold text-red-600 dark:text-cyan-500">
              ${currentMonth.spending.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground dark:text-cyan-700">
              Spending this month
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-sky-50 dark:bg-amber-950/20">
            <div className="flex items-center justify-center mb-2">
              <CircleDollarSign className="h-4 w-4 text-sky-600 dark:text-amber-600" />
            </div>
            <div className="text-lg font-bold text-sky-600 dark:text-amber-500">
              ${(currentMonth.income - currentMonth.spending).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground dark:text-amber-700">
              Surplus this month
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="p-6 bg-neutral-50 border border-gray-200 rounded-lg text-xs dark:invert dark:bg-neutral-100/40 flex-1">
          <AreaChart
            data={transformedData}
            index="month"
            categories={["income", "spending", "surplus"]}
            colors={["emerald", "red", "sky"]}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            curveType="monotone"
            className="w-full max-h-[400px] flex-1"
            customTooltip={({ payload, active }) => {
              if (active && payload && payload.length) {
                const colorMap = {
                  income: "#047857", // emerald-700
                  spending: "#b91c1c", // red-700
                  surplus: "#3b82f6", // blue-700
                };

                return (
                  <div className="bg-white dark:bg-neutral-100 p-3 border border-gray-200 dark:border-neutral-300 rounded-lg shadow-xl text-xs backdrop-blur-sm dark:shadow-neutral-100/40">
                    <p className="font-semibold text-gray-900 dark:text-neutral-800 mb-2 pb-2 border-b border-gray-200 dark:border-neutral-300">
                      {payload[0]?.payload?.month}
                    </p>
                    {payload.map((entry, index) => {
                      const categoryColor =
                        colorMap[entry.name as keyof typeof colorMap];
                      return (
                        <p
                          key={index}
                          className="font-medium py-1 text-gray-700 dark:text-neutral-500"
                        >
                          {entry.name === "income"
                            ? "Income"
                            : entry.name === "spending"
                            ? "Spending"
                            : "Surplus"}
                          :{" "}
                          <span
                            className="font-bold"
                            style={{ color: categoryColor }}
                          >
                            ${entry.value?.toLocaleString()}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
