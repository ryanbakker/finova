"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface DailySpending {
  day: string;
  amount: number;
}

interface WeeklySpendingChartProps {
  dailySpending: DailySpending[];
}

export function WeeklySpendingChart({
  dailySpending,
}: WeeklySpendingChartProps) {
  return (
    <Card className="border-l-4 border-l-sky-500 overflow-hidden h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sky-700">Weekly Spending Pattern</CardTitle>
        <CardDescription>
          Daily spending trends throughout the week
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 pr-8 mb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 w-full min-h-[250px] !max-h-[60vh] overflow-hidden">
          <AreaChart
            className="h-full w-full"
            data={dailySpending}
            index="day"
            categories={["amount"]}
            showGradient={true}
            colors={["sky-600"]}
            color="sky-500"
            curveType="natural"
            valueFormatter={(value: number) => `$${value.toLocaleString()}`}
            showGridLines
            showLegend={false}
            showAnimation
            showTooltip
            yAxisWidth={80}
            minValue={0}
            customTooltip={({ payload, active }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium">{data.payload?.day}</p>
                    <p className="text-sm" style={{ color: data.color }}>
                      ${data.value?.toLocaleString()}
                    </p>
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
