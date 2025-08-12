"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonutChart } from "@/components/DonutChart";
import { type AvailableChartColorsKeys } from "@/lib/chartUtils";

export function CategoryBreakdownChart() {
  const categoryData = [
    { name: "Food & Dining", amount: 450, color: "sky50" },
    { name: "Shopping", amount: 300, color: "sky200" },
    { name: "Transportation", amount: 200, color: "sky400" },
    { name: "Utilities", amount: 180, color: "sky600" },
    { name: "Entertainment", amount: 150, color: "sky800" },
    { name: "Healthcare", amount: 120, color: "sky950" },
  ];

  const colors: AvailableChartColorsKeys[] = [
    "sky50",
    "sky200",
    "sky400",
    "sky600",
    "sky800",
    "sky950",
  ];

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
                  data={categoryData}
                  category="name"
                  value="amount"
                  showLabel={true}
                  colors={colors}
                  valueFormatter={(number) =>
                    `$${Intl.NumberFormat("us").format(number)}`
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
                {categoryData.map((category) => (
                  <li
                    key={category.name}
                    className="flex items-center justify-between py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          category.color === "sky50"
                            ? "bg-sky-100"
                            : category.color === "sky200"
                            ? "bg-sky-200"
                            : category.color === "sky400"
                            ? "bg-sky-400"
                            : category.color === "sky600"
                            ? "bg-sky-600"
                            : category.color === "sky800"
                            ? "bg-sky-800"
                            : category.color === "sky950"
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
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
