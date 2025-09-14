"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Liability, LiabilityAmountHistoryEntry } from "@/lib/types";
import { DonutChart } from "@/components/DonutChart";
import { getLiabilityAmountHistory } from "@/lib/actions/liability.actions";
import { formatDateForChart, getQuarterYearInfo } from "@/lib/utils/dateUtils";
import { AreaChart } from "@tremor/react";
import { Building2, TrendingDown, Loader2 } from "lucide-react";

interface LiabilityInsightsProps {
  liabilities: Liability[];
  isLoading?: boolean;
}

interface LiabilityAmountChartData {
  date: string;
  amount: number;
  quarter: number;
  year: number;
  quarterName: string;
  fullQuarter: string;
}

export function LiabilityInsights({
  liabilities,
  isLoading,
}: LiabilityInsightsProps) {
  const [aggregatedHistory, setAggregatedHistory] = useState<
    LiabilityAmountChartData[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load aggregated liability history data
  const loadAggregatedHistory = useCallback(async () => {
    if (!liabilities || liabilities.length === 0) {
      setAggregatedHistory([]);
      return;
    }

    setIsLoadingHistory(true);
    try {
      // Get history for all liabilities and aggregate by date
      const allHistoryData: LiabilityAmountHistoryEntry[] = [];

      for (const liability of liabilities) {
        try {
          const history = await getLiabilityAmountHistory(liability.id, 20);
          allHistoryData.push(
            ...history.map((entry) => ({
              ...entry,
              liabilityId: liability.id,
              liabilityName: liability.name,
            }))
          );
        } catch (_error) {
          // Error loading history for liability - continue with other liabilities
        }
      }

      // Sort all history by date
      const sortedHistory = allHistoryData.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Aggregate by date for chart
      const dateMap = new Map<string, number>();

      // Add initial amounts for each liability
      liabilities.forEach((liability) => {
        const initialDate = new Date(liability.createdAt)
          .toISOString()
          .split("T")[0];
        const currentAmount = dateMap.get(initialDate) || 0;
        dateMap.set(initialDate, currentAmount + liability.currentValue);
      });

      // Add history entries
      sortedHistory.forEach((entry) => {
        const date = new Date(entry.createdAt).toISOString().split("T")[0];
        const currentAmount = dateMap.get(date) || 0;
        dateMap.set(date, currentAmount + entry.amount);
      });

      // Convert to chart data
      const chartData: LiabilityAmountChartData[] = Array.from(
        dateMap.entries()
      )
        .map(([date, amount]) => {
          const recordDate = new Date(date);
          const quarterYearInfo = getQuarterYearInfo(recordDate);

          return {
            date: formatDateForChart(recordDate),
            amount,
            quarter: quarterYearInfo.quarter,
            year: quarterYearInfo.year,
            quarterName: quarterYearInfo.quarterName,
            fullQuarter: quarterYearInfo.fullQuarter,
          };
        })
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setAggregatedHistory(chartData);
    } catch (_error) {
    } finally {
      setIsLoadingHistory(false);
    }
  }, [liabilities]);

  // Load history when liabilities change
  useEffect(() => {
    loadAggregatedHistory();
  }, [loadAggregatedHistory]);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Mortgage: "#3B82F6", // blue
      "Vehicle Loan": "#10B981", // green
      "Credit Card": "#8B5CF6", // purple
      "Personal Loan": "#F59E0B", // orange
      "Education Loan": "#6366F1", // indigo
      "Business Loan": "#14B8A6", // teal
      "Line of Credit": "#EC4899", // pink
      Other: "#6B7280", // gray
    };
    return colors[category] || "#6B7280";
  };

  const insights = useMemo(() => {
    if (!liabilities || liabilities.length === 0) return null;

    const activeLiabilities = liabilities.filter((l) => l.isActive);
    const totalAmount = activeLiabilities.reduce(
      (sum, l) => sum + l.currentValue,
      0
    );

    // Category breakdown
    const categoryBreakdown = activeLiabilities.reduce((acc, liability) => {
      const category = liability.category;
      if (!acc[category]) {
        acc[category] = {
          amount: 0,
          count: 0,
          color: getCategoryColor(category),
        };
      }
      acc[category].amount += liability.currentValue;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number; color: string }>);

    // Institution breakdown
    const institutionBreakdown = activeLiabilities.reduce((acc, liability) => {
      const institution = liability.institution || "Unknown";
      if (!acc[institution]) {
        acc[institution] = { amount: 0, count: 0 };
      }
      acc[institution].amount += liability.currentValue;
      acc[institution].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return {
      totalAmount,
      categoryBreakdown,
      institutionBreakdown,
      activeCount: activeLiabilities.length,
      totalCount: liabilities.length,
    };
  }, [liabilities]);

  const formatCurrency = (amount: number, currency: string = "AUD"): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No liabilities found
        </h3>
        <p className="text-sm text-muted-foreground">
          Add some liabilities to see insights and analytics
        </p>
      </div>
    );
  }

  const chartData = Object.entries(insights.categoryBreakdown).map(
    ([category, data]) => ({
      name: category,
      value: data.amount,
      color: data.color,
    })
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(insights.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.activeCount} active liabilities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Liability Breakdown by Category</CardTitle>
            <CardDescription>
              Distribution of your liabilities across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutChart data={chartData} category="name" value="value" />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(insights.categoryBreakdown).map(
                ([category, data]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.count} liability{data.count !== 1 ? "ies" : ""}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Institution Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Liability Breakdown by Institution</CardTitle>
            <CardDescription>
              Distribution of your liabilities across different financial
              institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(insights.institutionBreakdown)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .slice(0, 8)
                .map(([institution, data]) => (
                  <div
                    key={institution}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{institution}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.count} liability{data.count !== 1 ? "ies" : ""}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liability Amount History Chart */}
      {aggregatedHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Liability Amount History</span>
            </CardTitle>
            <CardDescription>
              Track changes in your total liability amounts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <AreaChart
                  data={aggregatedHistory}
                  index="date"
                  categories={["amount"]}
                  colors={["red"]}
                  showLegend={false}
                  showGridLines={true}
                  showAnimation={true}
                  curveType="natural"
                  valueFormatter={(value: number) => formatCurrency(value)}
                  className="[&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:leading-none [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:leading-none"
                />
              )}
            </div>
            <div className="flex flex-col items-start space-y-2 text-xs bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 w-fit mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-muted-foreground">
                  Total Liability Amount
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
