"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart } from "@/components/DonutChart";
import { type AvailableChartColorsKeys } from "@/lib/chartUtils";
import { useTheme } from "next-themes";

interface CategoryData {
  name: string;
  value: number;
  budget: number;
}

interface CategoryBreakdownChartProps {
  categoryData: CategoryData[];
  isLoading?: boolean;
}

// Helper function to get the appropriate color class for the legend based on theme
const getLegendColorClass = (
  colorKey: AvailableChartColorsKeys,
  isDarkMode: boolean
): string => {
  const lightColorMap: Record<AvailableChartColorsKeys, string> = {
    sky50: "bg-sky-100",
    sky100: "bg-sky-100",
    sky200: "bg-sky-200",
    sky300: "bg-sky-300",
    sky400: "bg-sky-400",
    sky500: "bg-sky-500",
    sky600: "bg-sky-600",
    sky700: "bg-sky-700",
    sky800: "bg-sky-800",
    sky900: "bg-sky-900",
    sky950: "bg-sky-950",
    sky1000: "bg-sky-950",
    sky1100: "bg-sky-950",
    sky1200: "bg-sky-950",
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
    gray: "bg-gray-500",
    cyan: "bg-cyan-500",
    pink: "bg-pink-500",
    lime: "bg-lime-500",
    fuchsia: "bg-fuchsia-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    rose: "bg-rose-500",
    yellow: "bg-yellow-500",
  };

  const darkColorMap: Record<AvailableChartColorsKeys, string> = {
    sky50: "bg-sky-950", // sky950 equivalent
    sky100: "bg-sky-900", // sky900 equivalent
    sky200: "bg-sky-800", // sky800 equivalent
    sky300: "bg-sky-700", // sky700 equivalent
    sky400: "bg-sky-600", // sky600 equivalent
    sky500: "bg-sky-500", // keep same
    sky600: "bg-sky-400", // sky400 equivalent
    sky700: "bg-sky-300", // sky300 equivalent
    sky800: "bg-sky-200", // sky200 equivalent
    sky900: "bg-sky-100", // sky100 equivalent
    sky950: "bg-sky-100", // sky100 equivalent
    sky1000: "bg-sky-100",
    sky1100: "bg-sky-100",
    sky1200: "bg-sky-100",
    sky: "bg-sky-500",
    blue: "bg-blue-700",
    emerald: "bg-emerald-700",
    violet: "bg-violet-600",
    amber: "bg-amber-600",
    gray: "bg-gray-700",
    cyan: "bg-cyan-600",
    pink: "bg-pink-700",
    lime: "bg-lime-600",
    fuchsia: "bg-fuchsia-600",
    red: "bg-red-600",
    orange: "bg-orange-600",
    green: "bg-green-600",
    teal: "bg-teal-600",
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    rose: "bg-rose-600",
    yellow: "bg-yellow-600",
  };

  const colorMap = isDarkMode ? darkColorMap : lightColorMap;
  return colorMap[colorKey] || (isDarkMode ? "bg-gray-700" : "bg-gray-500");
};

export function CategoryBreakdownChart({
  categoryData,
  isLoading = false,
}: CategoryBreakdownChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
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
              <div className="w-full max-w-xs xl:max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col max-h-[50vh] overflow-hidden category-legend-container pb-1">
                {/* Header Section */}
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Content Section */}
                <ul className="p-3 space-y-1.5 flex-1 overflow-y-auto min-h-0 category-legend-content category-breakdown-scroll list-none overflow-scroll max-h-[28vh]">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg"
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

  // Handle empty data
  if (!categoryData || categoryData.length === 0) {
    return (
      <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-sky-700 dark:text-sky-300">
            Category Breakdown
          </CardTitle>
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
          <CardTitle className="text-sky-700 dark:text-sky-300">
            Category Breakdown
          </CardTitle>
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
  // Note: Highest value gets darkest color, lowest value gets lightest color
  const sortedData = [...validData].sort((a, b) => b.value - a.value);

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
  // Sort the chart data in the same order as the color assignment for proper color mapping
  const chartData = sortedData.map((item) => ({
    name: item.name,
    amount: item.value,
    color: categoryColors.get(item.name) || "sky500", // fallback color
  }));

  return (
    <Card className="border-l-4 border-l-sky-500 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sky-700 dark:text-sky-300">
          Category Breakdown
        </CardTitle>
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
                    categoryColors.get(category.name) || "sky500";

                  return (
                    <li
                      key={category.name}
                      className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${getLegendColorClass(
                            colorKey,
                            isDarkMode
                          )}`}
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
