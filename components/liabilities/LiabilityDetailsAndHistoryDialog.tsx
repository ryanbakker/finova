"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Liability, LiabilityAmountHistoryEntry } from "@/lib/types";
import { getLiabilityAmountHistory } from "@/lib/actions/liability.actions";
import { useToast } from "@/components/ui/use-toast";
import { formatDateForChart, getQuarterYearInfo } from "@/lib/utils/dateUtils";
import {
  Calendar,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Edit,
  Loader2,
  CircleArrowUp,
  CircleArrowDown,
  BarChart3,
  Info,
  Percent,
  DollarSign,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/chartUtils";
import { AreaChart } from "@tremor/react";

interface LiabilityDetailsAndHistoryDialogProps {
  liability: Liability | null;
  isOpen: boolean;
  onClose: () => void;
}

interface LiabilityAmountChartData {
  date: string;
  amount: number;
  quarter: number;
  year: number;
  quarterName: string;
  fullQuarter: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get change display
const getChangeDisplay = (liability: Liability) => {
  if (!liability.changeAmount || !liability.changePercentage) {
    return {
      text: "No change data",
      icon: null,
      className: "text-muted-foreground",
    };
  }

  const isPositive = liability.changeAmount >= 0;
  const changeText = `${isPositive ? "+" : ""}${formatCurrency(
    liability.changeAmount,
    liability.currency
  )} (${isPositive ? "+" : ""}${liability.changePercentage?.toFixed(2)}%)`;

  return {
    text: changeText,
    icon: isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ),
    className: isPositive ? "text-green-600" : "text-red-600",
  };
};

// Helper function to get liability category icon
const getLiabilityCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "mortgage":
      return <Building2 className="h-5 w-5 text-blue-600" />;
    case "vehicle loan":
      return <TrendingDown className="h-5 w-5 text-green-600" />;
    case "credit card":
      return <CreditCard className="h-5 w-5 text-purple-600" />;
    case "personal loan":
      return <DollarSign className="h-5 w-5 text-orange-600" />;
    case "education loan":
      return <FileText className="h-5 w-5 text-indigo-600" />;
    case "business loan":
      return <Building2 className="h-5 w-5 text-teal-600" />;
    case "line of credit":
      return <CreditCard className="h-5 w-5 text-pink-600" />;
    default:
      return <DollarSign className="h-5 w-5 text-gray-600" />;
  }
};

export function LiabilityDetailsAndHistoryDialog({
  liability,
  isOpen,
  onClose,
}: LiabilityDetailsAndHistoryDialogProps) {
  const [history, setHistory] = useState<LiabilityAmountHistoryEntry[]>([]);
  const [chartData, setChartData] = useState<LiabilityAmountChartData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    if (!liability) {
      console.log("No liability provided to loadHistory");
      return;
    }

    console.log("Loading history for liability:", liability.id, liability.name);
    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const historyData = await getLiabilityAmountHistory(liability.id, 50);
      console.log("Loaded history data:", historyData);
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading liability amount history:", error);
      setHistoryError(
        error instanceof Error ? error.message : "Failed to load history"
      );
      toast({
        title: "Error",
        description: "Failed to load liability amount history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [liability, toast]);

  // Load history when dialog opens
  useEffect(() => {
    console.log("Dialog state changed:", {
      isOpen,
      liability: liability?.name,
    });
    if (isOpen && liability) {
      console.log("Dialog opened, loading history...");
      loadHistory();
    }
  }, [isOpen, liability, loadHistory]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setHistory([]);
      setChartData([]);
      setHistoryError(null);
    }
  }, [isOpen]);

  // Process chart data when history changes
  useEffect(() => {
    console.log("Processing chart data:", {
      history: history.length,
      liability: liability?.name,
    });

    if (history.length > 0 && liability) {
      const processedData: LiabilityAmountChartData[] = [];

      // Sort history by date (oldest first for chart)
      const sortedHistory = [...history].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Add all amount changes
      sortedHistory.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const quarterYearInfo = getQuarterYearInfo(recordDate);

        processedData.push({
          date: formatDateForChart(recordDate),
          amount: record.amount,
          quarter: quarterYearInfo.quarter,
          year: quarterYearInfo.year,
          quarterName: quarterYearInfo.quarterName,
          fullQuarter: quarterYearInfo.fullQuarter,
        });
      });

      console.log("Processed chart data:", processedData);
      setChartData(processedData);
    } else {
      console.log("No history data, setting empty chart data");
      setChartData([]);
    }
  }, [history, liability]);

  // Calculate change amount and percentage for a given record
  const calculateChange = (
    record: LiabilityAmountHistoryEntry,
    index: number
  ) => {
    if (!liability) {
      return { changeAmount: 0, changePercentage: 0 };
    }

    if (index === 0) {
      // First record - compare with initial liability amount
      const changeAmount = record.amount - liability.amount;
      const changePercentage =
        liability.amount > 0 ? (changeAmount / liability.amount) * 100 : 0;
      return { changeAmount, changePercentage };
    } else {
      // Compare with previous record
      const previousRecord = history[index - 1];
      const changeAmount = record.amount - previousRecord.amount;
      const changePercentage =
        previousRecord.amount > 0
          ? (changeAmount / previousRecord.amount) * 100
          : 0;
      return { changeAmount, changePercentage };
    }
  };

  // Calculate dynamic y-axis width based on data values
  const calculateYAxisWidth = () => {
    if (!chartData.length) return 65;

    const maxValue = Math.max(...chartData.map((d) => d.amount));
    const formattedValue = `$${maxValue.toLocaleString()}`;
    const baseWidth = 65;
    const additionalWidth = Math.max(0, (formattedValue.length - 8) * 8);
    return Math.min(baseWidth + additionalWidth, 120);
  };

  const formatDateDetailed = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChangeIcon = (changeAmount: number) => {
    if (changeAmount > 0) {
      return <TrendingUp className="h-4 w-4 text-red-600" />;
    } else if (changeAmount < 0) {
      return <TrendingDown className="h-4 w-4 text-green-600" />;
    }
    return null;
  };

  const getChangeColor = (changeAmount: number) => {
    if (changeAmount > 0) {
      return "text-red-600";
    } else if (changeAmount < 0) {
      return "text-green-600";
    }
    return "text-muted-foreground";
  };

  if (!liability) return null;

  const changeDisplay = getChangeDisplay(liability);
  const IconComponent = getLiabilityCategoryIcon(liability.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                {IconComponent}
              </div>
            )}
            <div>
              <DialogTitle className="text-xl">{liability.name}</DialogTitle>
              <DialogDescription className="text-base">
                {liability.category}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="details"
              className="flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Amount History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Liability Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Amount */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Amount
                </h3>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(
                    liability.currentAmount || liability.amount,
                    liability.currency
                  )}
                </div>
                {liability.changeAmount !== undefined && (
                  <div
                    className={`flex items-center space-x-2 text-sm ${changeDisplay.className}`}
                  >
                    {changeDisplay.icon}
                    <span>{changeDisplay.text}</span>
                  </div>
                )}
              </div>

              {/* Original Amount */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Original Amount
                </h3>
                <div className="text-xl font-semibold">
                  {formatCurrency(liability.amount, liability.currency)}
                </div>
                {liability.dueDate && (
                  <div className="text-sm text-muted-foreground">
                    Due {formatDate(liability.dueDate)}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Liability Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Liability Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution */}
                {liability.institution && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Institution</span>
                    </div>
                    <p className="text-sm">{liability.institution}</p>
                  </div>
                )}

                {/* Account Number */}
                {liability.accountNumber && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Account Number
                      </span>
                    </div>
                    <p className="text-sm font-mono">
                      {liability.accountNumber}
                    </p>
                  </div>
                )}

                {/* Interest Rate */}
                {liability.interestRate && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Interest Rate</span>
                    </div>
                    <p className="text-sm">{liability.interestRate}%</p>
                  </div>
                )}

                {/* Monthly Payment */}
                {liability.monthlyPayment && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Monthly Payment
                      </span>
                    </div>
                    <p className="text-sm">
                      {formatCurrency(
                        liability.monthlyPayment,
                        liability.currency
                      )}
                    </p>
                  </div>
                )}

                {/* Remaining Balance */}
                {liability.remainingBalance && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Remaining Balance
                      </span>
                    </div>
                    <p className="text-sm">
                      {formatCurrency(
                        liability.remainingBalance,
                        liability.currency
                      )}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Status</span>
                  <div>
                    <Badge
                      variant={liability.isActive ? "default" : "secondary"}
                      className={
                        liability.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                      }
                    >
                      {liability.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Currency</span>
                  <p className="text-sm">{liability.currency}</p>
                </div>

                {/* Created Date */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Added</span>
                  <p className="text-sm">{formatDate(liability.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {liability.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {liability.notes}
                  </p>
                </div>
              </>
            )}

            {/* Performance Summary */}
            {liability.changeAmount !== undefined && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Amount Change Summary
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${
                          liability.changeAmount >= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {liability.changeAmount >= 0 ? "+" : ""}
                        {formatCurrency(
                          liability.changeAmount,
                          liability.currency
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Change
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${
                          liability.changePercentage &&
                          liability.changePercentage >= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {liability.changePercentage &&
                        liability.changePercentage >= 0
                          ? "+"
                          : ""}
                        {liability.changePercentage?.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Percentage Change
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(
                          liability.currentAmount || liability.amount,
                          liability.currency
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Amount
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            {/* Amount Chart Section */}
            <div className="flex flex-row gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Amount History</h3>
                  <div className="text-sm text-muted-foreground">
                    Liability amount changes over time
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-extrabold text-red-950 dark:text-red-100">
                    {formatCurrency(
                      liability.currentAmount || liability.amount,
                      liability.currency
                    )}
                  </div>
                  {liability.changeAmount !== undefined &&
                    liability.changePercentage !== undefined && (
                      <div className="flex items-center space-x-2">
                        {liability.changeAmount >= 0 ? (
                          <CircleArrowUp className="h-4 w-4 text-red-700 dark:text-red-500" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 text-green-700 dark:text-green-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            liability.changeAmount >= 0
                              ? "text-red-700 dark:text-red-500"
                              : "text-green-700 dark:text-green-500"
                          }`}
                        >
                          {liability.changeAmount >= 0 ? "+" : ""}
                          {liability.changePercentage?.toFixed(2)}% from initial
                          amount
                        </span>
                      </div>
                    )}
                </div>

                <div className="text-sm">
                  <div className="text-muted-foreground">Total Changes</div>
                  <div className="font-semibold">
                    {history.length} amount update
                    {history.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Chart Key */}
                {chartData.length > 0 && (
                  <div className="flex flex-col items-start space-y-2 text-xs bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 w-fit">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 dark:invert rounded-full"></div>
                      <span className="text-muted-foreground">
                        Liability Amount
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart */}
              <div className="flex-1 flex items-center justify-center bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:invert dark:bg-neutral-100/40">
                {chartData.length > 0 ? (
                  <AreaChart
                    data={chartData}
                    index="date"
                    categories={["amount"]}
                    colors={["red"]}
                    showLegend={false}
                    showGridLines={true}
                    showAnimation={true}
                    curveType="natural"
                    yAxisWidth={calculateYAxisWidth()}
                    valueFormatter={(value: number) =>
                      `$${value.toLocaleString()}`
                    }
                    className="h-80 w-full [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:leading-none [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:leading-none"
                    customTooltip={({ payload, active }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0]?.payload;
                        return (
                          <div className="bg-white dark:bg-neutral-100 p-3 border border-gray-200 dark:border-neutral-300 rounded-lg shadow-xl dark:shadow-neutral-100/40 text-xs backdrop-blur-sm">
                            <p className="font-semibold text-gray-900 dark:text-neutral-800 mb-2 pb-2 border-b border-gray-200 dark:border-neutral-300">
                              {data?.date}
                            </p>
                            <p className="font-medium py-1 text-gray-600 dark:text-neutral-400 mb-1">
                              Quarter:{" "}
                              <span className="font-semibold">
                                {data?.fullQuarter}
                              </span>
                            </p>
                            <p className="font-medium py-1 text-gray-700 dark:text-neutral-500">
                              Liability Amount:{" "}
                              <span
                                className="font-bold"
                                style={{ color: "#dc2626" }}
                              >
                                ${payload[0]?.value?.toLocaleString()}
                              </span>
                            </p>
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
                      No Amount History
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                      Update the liability amount to see the trend over time.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* History List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Amount Changes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadHistory}
                  disabled={isLoadingHistory}
                >
                  {isLoadingHistory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>

              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading history...</span>
                </div>
              ) : historyError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{historyError}</p>
                  <Button variant="outline" onClick={loadHistory}>
                    Try Again
                  </Button>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No amount changes recorded yet.</p>
                  <p className="text-sm">
                    Update the liability amount to see history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((record, index) => {
                    const { changeAmount, changePercentage } = calculateChange(
                      record,
                      index
                    );
                    return (
                      <div
                        key={`${record.createdAt}-${index}`}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {getChangeIcon(changeAmount)}
                              <span className="font-medium">
                                {formatCurrency(
                                  record.amount,
                                  liability.currency
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatDateDetailed(record.createdAt)}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-medium ${getChangeColor(
                                  changeAmount
                                )}`}
                              >
                                {changeAmount >= 0 ? "+" : ""}
                                {formatCurrency(
                                  changeAmount,
                                  liability.currency
                                )}{" "}
                                ({changePercentage >= 0 ? "+" : ""}
                                {changePercentage.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="button-blue-bg">
            <Edit className="h-4 w-4 mr-2" />
            Edit Liability
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
