"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonutChart } from "@/components/DonutChart";
import {
  AvailableChartColors,
  type AvailableChartColorsKeys,
} from "@/lib/chartUtils";

interface CategoryData {
  name: string;
  value: number;
  budget: number;
}

interface CategoryBreakdownChartProps {
  categoryData: CategoryData[];
}

export function CategoryBreakdownChart({
  categoryData,
}: CategoryBreakdownChartProps) {
  // Handle empty data
  if (!categoryData || categoryData.length === 0) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-sky-700">Category Breakdown</CardTitle>
          <CardDescription>
            Visual representation of spending by category
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-gray-500">
          No category data available
        </CardContent>
      </Card>
    );
  }

  // Ensure all values are numbers and positive
  const validData = categoryData.filter(
    (item) => typeof item.value === "number" && item.value > 0
  );

  if (validData.length === 0) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-sky-700">Category Breakdown</CardTitle>
          <CardDescription>
            Visual representation of spending by category
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-gray-500">
          No valid spending data available
        </CardContent>
      </Card>
    );
  }

  // Create value-based color mapping using sky gradient
  // Sort data by value to assign colors from lightest (lowest) to darkest (highest)
  const sortedData = [...validData].sort((a, b) => a.value - b.value);

  // Sky colors from lightest to darkest - optimized for 6 categories
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
  const chartData = validData.map((item) => ({
    name: item.name,
    amount: item.value,
    color: categoryColors.get(item.name) || "sky500", // fallback color
  }));

  return (
    <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sky-700">Category Breakdown</CardTitle>
        <CardDescription>Spending breakdown by category</CardDescription>
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
                  colors={Array.from(categoryColors.values())}
                  valueFormatter={(number: number) =>
                    `$${Intl.NumberFormat("us").format(number).toString()}`
                  }
                />
              </div>
            </div>

            {/* Category Legend/Key Column */}
            <div className="w-full max-w-xs xl:max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col max-h-[50vh] overflow-hidden category-legend-container pb-1">
              {/* Header Section */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Spending by Category
                </h3>
              </div>

              {/* Content Section */}
              <ul className="p-3 space-y-1.5 flex-1 overflow-y-auto min-h-0 category-legend-content category-breakdown-scroll list-none overflow-scroll max-h-[28vh]">
                {validData.map((category) => {
                  const colorKey =
                    categoryColors.get(category.name) ||
                    AvailableChartColors[0];

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
                              : colorKey === "sky100"
                              ? "bg-sky-100"
                              : colorKey === "sky200"
                              ? "bg-sky-200"
                              : colorKey === "sky300"
                              ? "bg-sky-300"
                              : colorKey === "sky400"
                              ? "bg-sky-400"
                              : colorKey === "sky500"
                              ? "bg-sky-500"
                              : colorKey === "sky600"
                              ? "bg-sky-600"
                              : colorKey === "sky700"
                              ? "bg-sky-700"
                              : colorKey === "sky800"
                              ? "bg-sky-800"
                              : colorKey === "sky900"
                              ? "bg-sky-900"
                              : colorKey === "sky950"
                              ? "bg-sky-950"
                              : colorKey === "sky1000"
                              ? "bg-sky-950"
                              : colorKey === "sky1100"
                              ? "bg-sky-950"
                              : colorKey === "sky1200"
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
                          ${category.value.toLocaleString()}
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
