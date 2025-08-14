"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "@tremor/react";

interface BudgetVsActual {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
}

interface BudgetVsActualChartProps {
  budgetVsActual: BudgetVsActual[];
  isLoading?: boolean;
}

export function BudgetVsActualChart({
  budgetVsActual,
  isLoading = false,
}: BudgetVsActualChartProps) {
  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 w-full min-h-[300px] !max-h-[60vh] overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sky-700">
          Budget vs Actual Spending
        </CardTitle>
        <CardDescription>
          Compare your budgeted vs actual spending for each category.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 w-full min-h-[300px] !max-h-[60vh] overflow-hidden">
          <BarChart
            className="h-full w-full [&_.recharts-rectangle]:opacity-80 [&_.recharts-xAxis]:text-xs [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:mb-2 [&_.recharts-xAxis]:min-w-full [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-center"
            data={budgetVsActual}
            index="category"
            categories={["budget", "actual"]}
            colors={["sky-600", "sky-400"]}
            valueFormatter={(value: number) => `$${value.toLocaleString()}`}
            showLegend={false}
            showGridLines
            showAnimation
            showTooltip
            showXAxis
            customTooltip={({ payload, active }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium">
                      {payload[0]?.payload?.category}
                    </p>
                    {payload.map((entry, index: number) => (
                      <p
                        key={index}
                        className="text-sm"
                        style={{ color: entry.color }}
                      >
                        {entry.name}: ${entry.value?.toLocaleString()}
                      </p>
                    ))}
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
