"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Liability, LiabilityAmountHistoryEntry } from "@/lib/types";
import { DonutChart } from "@/components/DonutChart";
import { getLiabilityAmountHistory } from "@/lib/actions/liability.actions";
import { formatDateForChart, getQuarterYearInfo } from "@/lib/utils/dateUtils";
import { AreaChart } from "@tremor/react";
import {
  Building2,
  CreditCard,
  TrendingDown,
  DollarSign,
  FileText,
  AlertTriangle,
  Calendar,
  Percent,
  CircleArrowUp,
  CircleArrowDown,
  Loader2,
} from "lucide-react";

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
  const [recentChanges, setRecentChanges] = useState<
    LiabilityAmountHistoryEntry[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load aggregated liability history data
  const loadAggregatedHistory = useCallback(async () => {
    if (!liabilities || liabilities.length === 0) {
      setAggregatedHistory([]);
      setRecentChanges([]);
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
        } catch (error) {
          console.error(
            `Error loading history for liability ${liability.id}:`,
            error
          );
        }
      }

      // Sort all history by date
      const sortedHistory = allHistoryData.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Get recent changes (last 10 entries)
      setRecentChanges(sortedHistory.slice(-10).reverse());

      // Aggregate by date for chart
      const dateMap = new Map<string, number>();

      // Add initial amounts for each liability
      liabilities.forEach((liability) => {
        const initialDate = new Date(liability.createdAt)
          .toISOString()
          .split("T")[0];
        const currentAmount = dateMap.get(initialDate) || 0;
        dateMap.set(initialDate, currentAmount + liability.amount);
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
    } catch (error) {
      console.error("Error loading aggregated liability history:", error);
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
    const totalAmount = activeLiabilities.reduce((sum, l) => sum + l.amount, 0);
    const totalMonthlyPayments = activeLiabilities.reduce(
      (sum, l) => sum + (l.monthlyPayment || 0),
      0
    );
    const totalInterest = activeLiabilities.reduce((sum, l) => {
      if (l.interestRate && l.remainingBalance) {
        return sum + (l.remainingBalance * l.interestRate) / 100 / 12;
      }
      return sum;
    }, 0);

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
      acc[category].amount += liability.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number; color: string }>);

    // Institution breakdown
    const institutionBreakdown = activeLiabilities.reduce((acc, liability) => {
      const institution = liability.institution || "Unknown";
      if (!acc[institution]) {
        acc[institution] = { amount: 0, count: 0 };
      }
      acc[institution].amount += liability.amount;
      acc[institution].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // High interest liabilities (above 10%)
    const highInterestLiabilities = activeLiabilities.filter(
      (l) => (l.interestRate || 0) > 10
    );

    // Due soon (within 30 days)
    const dueSoon = activeLiabilities.filter((l) => {
      if (!l.dueDate) return false;
      const dueDate = new Date(l.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    });

    return {
      totalAmount,
      totalMonthlyPayments,
      totalInterest,
      categoryBreakdown,
      institutionBreakdown,
      highInterestLiabilities,
      dueSoon,
      activeCount: activeLiabilities.length,
      totalCount: liabilities.length,
    };
  }, [liabilities]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "mortgage":
        return <Building2 className="h-4 w-4" />;
      case "vehicle loan":
        return <TrendingDown className="h-4 w-4" />;
      case "credit card":
        return <CreditCard className="h-4 w-4" />;
      case "personal loan":
        return <DollarSign className="h-4 w-4" />;
      case "education loan":
        return <FileText className="h-4 w-4" />;
      case "business loan":
        return <Building2 className="h-4 w-4" />;
      case "line of credit":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payments
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(insights.totalMonthlyPayments)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total monthly obligations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Interest
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(insights.totalInterest)}
            </div>
            <p className="text-xs text-muted-foreground">
              Interest paid monthly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Interest</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {insights.highInterestLiabilities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Above 10% interest rate
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

      {/* Recent Liability Changes */}
      {recentChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Recent Liability Changes</span>
            </CardTitle>
            <CardDescription>
              Latest updates to your liability amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChanges.slice(0, 8).map((change) => {
                const liability = liabilities.find(
                  (l) => l.id === change.liabilityId
                );
                if (!liability) return null;

                // Calculate change from previous amount
                const previousAmount = liability.amount;
                const changeAmount = change.amount - previousAmount;
                const changePercentage =
                  previousAmount > 0
                    ? (changeAmount / previousAmount) * 100
                    : 0;
                const isIncrease = changeAmount > 0;

                return (
                  <div
                    key={`${change.liabilityId}-${change.createdAt}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isIncrease
                            ? "bg-red-100 dark:bg-red-900/20"
                            : "bg-green-100 dark:bg-green-900/20"
                        }`}
                      >
                        {isIncrease ? (
                          <CircleArrowUp className="h-4 w-4 text-red-600" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{liability.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {liability.category} •{" "}
                          {new Date(change.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${
                          isIncrease ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isIncrease ? "+" : ""}
                        {formatCurrency(changeAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isIncrease ? "+" : ""}
                        {changePercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(change.amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts and Warnings */}
      {(insights.highInterestLiabilities.length > 0 ||
        insights.dueSoon.length > 0) && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              <span>Important Alerts</span>
            </CardTitle>
            <CardDescription>Items that require your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.highInterestLiabilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  High Interest Liabilities (
                  {insights.highInterestLiabilities.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {insights.highInterestLiabilities
                    .slice(0, 4)
                    .map((liability) => (
                      <div
                        key={liability.id}
                        className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(liability.category)}
                          <span className="text-sm font-medium">
                            {liability.name}
                          </span>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {(liability.interestRate || 0).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {insights.dueSoon.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  Due Soon ({insights.dueSoon.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {insights.dueSoon.slice(0, 4).map((liability) => (
                    <div
                      key={liability.id}
                      className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">
                          {liability.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {liability.dueDate
                          ? new Date(liability.dueDate).toLocaleDateString()
                          : "N/A"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
