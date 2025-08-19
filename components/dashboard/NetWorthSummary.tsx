import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "@tremor/react";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

interface NetWorthData {
  quarter: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

interface NetWorthSummaryProps {
  isLoading?: boolean;
  netWorth?: number;
  totalAssets?: number;
  totalLiabilities?: number;
}

export function NetWorthSummary({
  isLoading = false,
  netWorth = 0,
  totalAssets = 0,
  totalLiabilities = 0,
}: NetWorthSummaryProps) {
  const [chartData, setChartData] = useState<NetWorthData[]>([]);

  // Generate chart data based on current values
  useEffect(() => {
    if (
      netWorth !== undefined &&
      totalAssets !== undefined &&
      totalLiabilities !== undefined
    ) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;

      // Generate data for the last 8 quarters
      const generatedData: NetWorthData[] = [];

      for (let i = 7; i >= 0; i--) {
        const quarter = currentQuarter - i;
        const year = currentYear - Math.floor((i - currentQuarter + 1) / 4);
        const actualQuarter = ((quarter - 1 + 4) % 4) + 1;

        // Simulate growth over time (you can replace this with actual historical data)
        const growthFactor = 1 + i * 0.05; // 5% growth per quarter
        const quarterNetWorth = Math.round(netWorth * growthFactor);
        const quarterAssets = Math.round(totalAssets * growthFactor);
        const quarterLiabilities = Math.round(
          totalLiabilities * (1 + i * 0.02)
        ); // Liabilities grow slower

        generatedData.push({
          quarter: `${year} Q${actualQuarter}`,
          netWorth: quarterNetWorth,
          totalAssets: quarterAssets,
          totalLiabilities: quarterLiabilities,
        });
      }

      setChartData(generatedData);
    }
  }, [netWorth, totalAssets, totalLiabilities]);

  // Calculate change from previous quarter (for now using a simple calculation)
  const previousNetWorth = netWorth * 0.95; // Simulate 5% growth
  const change = netWorth - previousNetWorth;
  const changePercentage =
    previousNetWorth > 0
      ? ((change / previousNetWorth) * 100).toFixed(1)
      : "0.0";
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
                ${netWorth.toLocaleString()}
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
                <div className="font-semibold">
                  ${totalAssets.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Liabilities</div>
                <div className="font-semibold">
                  ${totalLiabilities.toLocaleString()}
                </div>
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
            {chartData.length > 0 ? (
              <LineChart
                data={chartData}
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
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Chart data loading...</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
