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
import { MoveRight } from "lucide-react";
import { DonutChart } from "@/components/DonutChart";
import { type AvailableChartColorsKeys } from "@/lib/chartUtils";

interface CategoryBreakdownChartProps {
  isLoading?: boolean;
}

export function CategoryBreakdownChart({
  isLoading = false,
}: CategoryBreakdownChartProps) {
  const categoryData = [
    { name: "Food & Dining", amount: 450 },
    { name: "Shopping", amount: 300 },
    { name: "Transportation", amount: 200 },
    { name: "Utilities", amount: 180 },
    { name: "Entertainment", amount: 150 },
    { name: "Healthcare", amount: 120 },
  ];

  // Sort data by amount in descending order (highest to lowest)
  // Note: Highest value gets darkest color, lowest value gets lightest color
  const sortedData = [...categoryData].sort((a, b) => b.amount - a.amount);

  // Sky colors from lightest to darkest - assign to categories from lowest to highest value
  const skyColors: AvailableChartColorsKeys[] = [
    "sky50",
    "sky200",
    "sky400",
    "sky600",
    "sky800",
    "sky950",
  ];

  // Create a map of category names to sky colors based on their value ranking
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  sortedData.forEach((item, index) => {
    const colorIndex = Math.min(index, skyColors.length - 1);
    categoryColors.set(item.name, skyColors[colorIndex]);
  });

  // Transform data for the donut chart with pre-assigned colors
  // Sort the chart data in the same order as the color assignment for proper color mapping
  const chartData = sortedData.map((item) => ({
    name: item.name,
    amount: item.amount,
    color: categoryColors.get(item.name) || "sky500", // fallback color
  }));

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col container-color">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-end justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 space-y-6 min-h-[400px] !max-h-[60vh]">
            {/* Chart and Legend Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 items-start justify-items-center h-full">
              {/* Donut Chart Column */}
              <div className="w-full flex justify-center items-start">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>

              {/* Category Legend/Key Column */}
              <div className="w-full max-w-xs xl:max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col max-h-[32vh] overflow-hidden category-legend-container pb-1">
                {/* Header Section */}
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Content Section */}
                <ul className="p-3 space-y-1.5 flex-1 overflow-y-auto min-h-0 category-legend-content category-breakdown-scroll list-none overflow-scroll max-h-[50vh]">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Skeleton className="w-3 h-3 rounded-full flex-shrink-0" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col container-color">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="card-title">Category Breakdown</CardTitle>
            <CardDescription>Spending breakdown by category</CardDescription>
          </div>
          <Button className="button-blue-bg">
            Categories
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 space-y-6 min-h-[400px] !max-h-[60vh]">
          {/* Chart and Legend Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 items-start justify-items-center h-full">
            {/* Donut Chart Column */}
            <div className="w-full flex justify-center items-start">
              <div className="w-48 aspect-square p-0 scale-90">
                <DonutChart
                  data={chartData}
                  category="name"
                  value="amount"
                  showLabel={true}
                  valueFormatter={(number) =>
                    `$${Intl.NumberFormat("us").format(number)}`
                  }
                />
              </div>
            </div>

            {/* Category Legend/Key Column */}
            <div className="w-full max-w-xs xl:max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col max-h-[32vh] overflow-hidden category-legend-container pb-1">
              {/* Header Section */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Spending by Category
                </h3>
              </div>

              {/* Content Section */}
              <ul className="p-3 space-y-1.5 flex-1 overflow-y-auto min-h-0 category-legend-content category-breakdown-scroll list-none overflow-scroll max-h-[50vh]">
                {categoryData.map((category) => {
                  const colorKey =
                    categoryColors.get(category.name) || "sky500";

                  return (
                    <li
                      key={category.name}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            colorKey === "sky50"
                              ? "bg-sky-100"
                              : colorKey === "sky200"
                              ? "bg-sky-200"
                              : colorKey === "sky400"
                              ? "bg-sky-400"
                              : colorKey === "sky600"
                              ? "bg-sky-600"
                              : colorKey === "sky800"
                              ? "bg-sky-800"
                              : colorKey === "sky950"
                              ? "bg-sky-950"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate text-xs">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ${category.amount.toLocaleString()}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
