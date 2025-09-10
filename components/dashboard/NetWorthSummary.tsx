import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart } from "@tremor/react";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  getDashboardData,
  type DashboardData,
} from "@/lib/services/dashboard.service";

interface NetWorthSummaryProps {
  className?: string;
}

interface NetWorthData {
  month: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export function NetWorthSummary({ className }: NetWorthSummaryProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load net worth data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    netWorth,
    totalAssets,
    totalLiabilities,
    chartData,
    hasData,
    isPositive,
    changePercentage,
  } = useMemo(() => {
    if (!dashboardData) {
      return {
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        chartData: [],
        hasData: false,
        isPositive: true,
        changePercentage: 0,
      };
    }

    const { metrics, netWorthHistory } = dashboardData;
    const netWorth = metrics.netWorth;
    const totalAssets = metrics.totalAssets;
    const totalLiabilities = metrics.totalLiabilities;

    // Calculate change percentage from last month
    let changePercentage = 0;
    let isPositive = true;

    if (netWorthHistory.length >= 2) {
      const current = netWorthHistory[netWorthHistory.length - 1];
      const previous = netWorthHistory[netWorthHistory.length - 2];

      if (previous.netWorth !== 0) {
        changePercentage =
          ((current.netWorth - previous.netWorth) /
            Math.abs(previous.netWorth)) *
          100;
        isPositive = changePercentage >= 0;
      }
    }

    // Format chart data for AreaChart
    const chartData = netWorthHistory.map((entry: NetWorthData) => ({
      month: entry.month,
      netWorth: entry.netWorth,
      totalAssets: entry.totalAssets,
      totalLiabilities: entry.totalLiabilities,
    }));

    // Debug: Log the chart data to see what's being passed
    console.log("Chart data:", chartData);

    const hasData = netWorthHistory.length > 0;

    return {
      netWorth,
      totalAssets,
      totalLiabilities,
      chartData,
      hasData,
      isPositive,
      changePercentage: Math.abs(changePercentage),
    };
  }, [dashboardData]);

  const calculateYAxisWidth = () => {
    if (!hasData || chartData.length === 0) return 60;

    const maxValue = Math.max(
      ...chartData.map((d) =>
        Math.max(d.netWorth, d.totalAssets, d.totalLiabilities)
      )
    );

    const formattedValue = `$${maxValue.toLocaleString()}`;
    return Math.max(60, formattedValue.length * 8);
  };

  if (error) {
    return (
      <Card
        className={`col-span-4 h-full container-color !w-full flex-1 ${
          className || ""
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-2">
                Error loading data
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (isLoading) {
    return (
      <Card
        className={`col-span-4 h-full container-color !w-full flex-1 ${
          className || ""
        }`}
      >
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
              <Skeleton className="w-full h-48 dark:bg-neutral-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`col-span-4 h-full container-color !w-full flex-1 ${
        className || ""
      }`}
    >
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
                  {changePercentage.toFixed(1)}% from last month
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
                <div className="w-3 h-3 bg-emerald-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Total Assets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Total Liabilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-sky-700 dark:invert rounded-full"></div>
                <span className="text-muted-foreground">Net Worth</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:invert dark:bg-neutral-100/40">
            {hasData && chartData.length > 0 ? (
              <AreaChart
                data={chartData}
                index="month"
                categories={["totalAssets", "totalLiabilities", "netWorth"]}
                colors={["emerald", "red", "sky"]}
                showLegend={false}
                showGridLines={true}
                showAnimation={true}
                curveType="natural"
                yAxisWidth={calculateYAxisWidth()}
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
              <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-400 shadow-sm">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-200 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-neutral-400 dark:text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-600 mb-2">
                  No Financial Data
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                  Add some assets, liabilities, or transactions to see your net
                  worth trend over time.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
