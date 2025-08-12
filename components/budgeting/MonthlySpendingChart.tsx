"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface MonthlySpending {
  month: string;
  spent: number;
  budget: number;
}

interface MonthlySpendingChartProps {
  monthlySpending: MonthlySpending[];
  monthlyBudget: number;
}

export function MonthlySpendingChart({
  monthlySpending,
  monthlyBudget,
}: MonthlySpendingChartProps) {
  return (
    <div style={{ gridColumn: "1 / -1" }} className="h-full">
      <Card className="border-l-4 border-l-sky-500 overflow-hidden h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-sky-700">
            Monthly Spending Trends
          </CardTitle>
          <CardDescription>
            Track your spending patterns over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2 pr-8 mb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 w-full min-h-[300px] !max-h-[60vh] overflow-hidden">
            <AreaChart
              className="h-full w-full"
              data={monthlySpending}
              index="month"
              categories={["spent"]}
              showGradient={true}
              colors={["sky-600"]}
              color="sky-500"
              curveType="natural"
              valueFormatter={(value: number) => `$${value.toLocaleString()}`}
              showLegend={false}
              showGridLines
              showAnimation
              showTooltip
              yAxisWidth={80}
              minValue={0}
              maxValue={monthlyBudget}
              customTooltip={({ payload, active }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium">
                        {payload[0]?.payload?.month}
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
    </div>
  );
}
