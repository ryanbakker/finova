import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "@tremor/react";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";

interface NetWorthData {
  quarter: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

const exampleData: NetWorthData[] = [
  {
    quarter: "2023 Q1",
    netWorth: 25000,
    totalAssets: 95000,
    totalLiabilities: 70000,
  },
  {
    quarter: "2023 Q2",
    netWorth: 28000,
    totalAssets: 98000,
    totalLiabilities: 70000,
  },
  {
    quarter: "2023 Q3",
    netWorth: 32000,
    totalAssets: 102000,
    totalLiabilities: 70000,
  },
  {
    quarter: "2023 Q4",
    netWorth: 35000,
    totalAssets: 110000,
    totalLiabilities: 75000,
  },
  {
    quarter: "2024 Q1",
    netWorth: 40000,
    totalAssets: 125000,
    totalLiabilities: 85000,
  },
  {
    quarter: "2024 Q2",
    netWorth: 52000,
    totalAssets: 138000,
    totalLiabilities: 86000,
  },
  {
    quarter: "2024 Q3",
    netWorth: 48000,
    totalAssets: 132000,
    totalLiabilities: 84000,
  },
  {
    quarter: "2024 Q4",
    netWorth: 65000,
    totalAssets: 150000,
    totalLiabilities: 85000,
  },
  {
    quarter: "2025 Q1",
    netWorth: 58000,
    totalAssets: 143000,
    totalLiabilities: 85000,
  },
  {
    quarter: "2025 Q2",
    netWorth: 85000,
    totalAssets: 170000,
    totalLiabilities: 85000,
  },
  {
    quarter: "2025 Q3",
    netWorth: 125000,
    totalAssets: 187500,
    totalLiabilities: 62500,
  },
  {
    quarter: "2025 Q4",
    netWorth: 142000,
    totalAssets: 205000,
    totalLiabilities: 63000,
  },
];

interface NetWorthSummaryProps {
  isLoading?: boolean;
}

export function NetWorthSummary({ isLoading = false }: NetWorthSummaryProps) {
  const currentNetWorth = 125000;
  const previousNetWorth = 85000;
  const change = currentNetWorth - previousNetWorth;
  const changePercentage = ((change / previousNetWorth) * 100).toFixed(1);
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card className="col-span-4 h-full container-color !w-full flex-1">
        <CardContent className="pt-6">
          <div className="flex flex-row gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-10 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <div className="flex flex-col items-start space-y-2 text-xs bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 w-fit">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:invert dark:bg-neutral-100/40">
              <Skeleton className="w-full h-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 h-full container-color !w-full flex-1">
      <CardContent className="pt-6">
        <div className="flex flex-row gap-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="card-title">Net Worth Summary</h3>
              <div className="text-sm text-muted-foreground">
                Your total financial position over time
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-sky-950 dark:text-sky-100">
                ${currentNetWorth.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <CircleArrowUp className="h-4 w-4 text-emerald-700 dark:text-emerald-500" />
                ) : (
                  <CircleArrowDown className="h-4 w-4 text-red-700 dark:text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-red-700 dark:text-red-500"
                  }`}
                >
                  {isPositive ? "+" : "-"}
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
                <div className="font-semibold">$62,500</div>
              </div>
            </div>

            {/* Custom Graph Key */}
            <div className="flex flex-col items-start space-y-2 text-xs bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 w-fit">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-sky-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Net Worth</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Total Assets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Total Liabilities</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:invert dark:bg-neutral-100/40">
            <LineChart
              data={exampleData}
              index="quarter"
              categories={["totalAssets", "totalLiabilities", "netWorth"]}
              colors={["sky", "emerald", "red"]}
              showLegend={false}
              showGridLines={true}
              showAnimation={true}
              curveType="natural"
              yAxisWidth={65}
              valueFormatter={(value: number) => `$${value.toLocaleString()}`}
              className="[&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:leading-none [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:leading-none"
              customTooltip={({ payload, active }) => {
                if (active && payload && payload.length) {
                  const colorMap = {
                    netWorth: "#0369a1", // sky-700
                    totalAssets: "#047857", // emerald-700
                    totalLiabilities: "#b91c1c", // red-700
                  };

                  return (
                    <div className="bg-white dark:bg-neutral-100 p-3 border border-gray-200 dark:border-neutral-300 rounded-lg shadow-xl dark:shadow-neutral-100/40 text-xs backdrop-blur-sm">
                      <p className="font-semibold text-gray-900 dark:text-neutral-800 mb-2 pb-2 border-b border-gray-200 dark:border-neutral-300">
                        {payload[0]?.payload?.quarter}
                      </p>
                      {payload.map((entry, index) => {
                        const categoryColor =
                          colorMap[entry.name as keyof typeof colorMap];
                        return (
                          <p
                            key={index}
                            className="font-medium py-1 text-gray-700 dark:text-neutral-500"
                          >
                            {entry.name === "netWorth"
                              ? "Net Worth"
                              : entry.name === "totalAssets"
                              ? "Total Assets"
                              : "Total Liabilities"}
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
        </div>
      </CardContent>
    </Card>
  );
}
