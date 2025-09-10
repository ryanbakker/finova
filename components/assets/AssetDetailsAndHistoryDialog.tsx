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
import { Asset, ValueHistoryEntry } from "@/lib/types";
import { getAssetCategoryIcon } from "@/lib/utils/categoryUtils";
import { getAssetValueHistory } from "@/lib/actions/asset.actions";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/chartUtils";
import { AreaChart } from "@tremor/react";

interface AssetDetailsAndHistoryDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AssetValueChartData {
  date: string;
  value: number;
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
const getChangeDisplay = (asset: Asset) => {
  if (!asset.changeAmount || !asset.changePercentage) {
    return {
      text: "No change data",
      icon: null,
      className: "text-muted-foreground",
    };
  }

  const isPositive = asset.changeAmount >= 0;
  const changeText = `${isPositive ? "+" : ""}${formatCurrency(
    asset.changeAmount,
    asset.currency
  )} (${isPositive ? "+" : ""}${asset.changePercentage?.toFixed(2)}%)`;

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

export function AssetDetailsAndHistoryDialog({
  asset,
  isOpen,
  onClose,
}: AssetDetailsAndHistoryDialogProps) {
  const [history, setHistory] = useState<ValueHistoryEntry[]>([]);
  const [chartData, setChartData] = useState<AssetValueChartData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    if (!asset) {
      return;
    }

    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const historyData = await getAssetValueHistory(asset.id, 50);
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading asset value history:", error);
      setHistoryError(
        error instanceof Error ? error.message : "Failed to load history"
      );
      toast({
        title: "Error",
        description: "Failed to load asset value history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [asset, toast]);

  // Load history when dialog opens
  useEffect(() => {
    if (isOpen && asset) {
      loadHistory();
    }
  }, [isOpen, asset, loadHistory]);

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
    if (history.length > 0 && asset) {
      const processedData: AssetValueChartData[] = [];

      // Sort history by date (oldest first for chart)
      const sortedHistory = [...history].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Add all value changes
      sortedHistory.forEach((record) => {
        const recordDate = new Date(record.createdAt);
        const quarterYearInfo = getQuarterYearInfo(recordDate);

        processedData.push({
          date: formatDateForChart(recordDate),
          value: record.value,
          quarter: quarterYearInfo.quarter,
          year: quarterYearInfo.year,
          quarterName: quarterYearInfo.quarterName,
          fullQuarter: quarterYearInfo.fullQuarter,
        });
      });

      setChartData(processedData);
    } else {
      setChartData([]);
    }
  }, [history, asset]);

  // Calculate change amount and percentage for a given record
  const calculateChange = (record: ValueHistoryEntry, index: number) => {
    if (!asset) {
      return { changeAmount: 0, changePercentage: 0 };
    }

    if (index === 0) {
      // First record - compare with initial asset value
      const changeAmount = record.value - asset.currentValue;
      const changePercentage =
        asset.currentValue > 0 ? (changeAmount / asset.currentValue) * 100 : 0;
      return { changeAmount, changePercentage };
    } else {
      // Compare with previous record
      const previousRecord = history[index - 1];
      const changeAmount = record.value - previousRecord.value;
      const changePercentage =
        previousRecord.value > 0
          ? (changeAmount / previousRecord.value) * 100
          : 0;
      return { changeAmount, changePercentage };
    }
  };

  // Calculate dynamic y-axis width based on data values
  const calculateYAxisWidth = () => {
    if (!chartData.length) return 65;

    const maxValue = Math.max(...chartData.map((d) => d.value));
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
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (changeAmount < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getChangeColor = (changeAmount: number) => {
    if (changeAmount > 0) {
      return "text-green-600";
    } else if (changeAmount < 0) {
      return "text-red-600";
    }
    return "text-muted-foreground";
  };

  if (!asset) return null;

  const changeDisplay = getChangeDisplay(asset);
  const IconComponent = getAssetCategoryIcon(asset.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <DialogTitle className="text-xl">{asset.name}</DialogTitle>
              <DialogDescription className="text-base">
                {asset.category}
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
              <span>Value History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Asset Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Value */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Value
                </h3>
                <div className="text-2xl font-bold">
                  {formatCurrency(asset.currentValue, asset.currency)}
                </div>
                {asset.changeAmount !== undefined && (
                  <div
                    className={`flex items-center space-x-2 text-sm ${changeDisplay.className}`}
                  >
                    {changeDisplay.icon}
                    <span>{changeDisplay.text}</span>
                  </div>
                )}
              </div>

              {/* Original Value */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Original Value
                </h3>
                <div className="text-xl font-semibold">
                  {formatCurrency(asset.currentValue, asset.currency)}
                </div>
                {asset.purchaseDate && (
                  <div className="text-sm text-muted-foreground">
                    Purchased {formatDate(asset.purchaseDate)}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Asset Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Asset Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution */}
                {asset.institution && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Institution</span>
                    </div>
                    <p className="text-sm">{asset.institution}</p>
                  </div>
                )}

                {/* Account Number */}
                {asset.accountNumber && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Account Number
                      </span>
                    </div>
                    <p className="text-sm font-mono">{asset.accountNumber}</p>
                  </div>
                )}

                {/* Purchase Date */}
                {asset.purchaseDate && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Purchase Date</span>
                    </div>
                    <p className="text-sm">{formatDate(asset.purchaseDate)}</p>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Status</span>
                  <div>
                    <Badge
                      variant={asset.isActive ? "default" : "secondary"}
                      className={
                        asset.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                      }
                    >
                      {asset.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Currency</span>
                  <p className="text-sm">{asset.currency}</p>
                </div>

                {/* Created Date */}
                <div className="space-y-1">
                  <span className="text-sm font-medium">Added</span>
                  <p className="text-sm">{formatDate(asset.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {asset.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {asset.notes}
                  </p>
                </div>
              </>
            )}

            {/* Performance Summary */}
            {asset.changeAmount !== undefined && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {asset.changeAmount >= 0 ? "+" : ""}
                        {formatCurrency(asset.changeAmount, asset.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Change
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${
                          asset.changePercentage && asset.changePercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {asset.changePercentage && asset.changePercentage >= 0
                          ? "+"
                          : ""}
                        {asset.changePercentage?.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Percentage Change
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <div className="text-2xl font-bold">
                        {formatCurrency(asset.currentValue, asset.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Value
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            {/* Value Chart Section */}
            <div className="flex flex-row gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Value History</h3>
                  <div className="text-sm text-muted-foreground">
                    Asset value changes over time
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-extrabold text-sky-950 dark:text-sky-100">
                    {formatCurrency(asset.currentValue, asset.currency)}
                  </div>
                  {asset.changeAmount !== undefined &&
                    asset.changePercentage !== undefined && (
                      <div className="flex items-center space-x-2">
                        {asset.changeAmount >= 0 ? (
                          <CircleArrowUp className="h-4 w-4 text-emerald-700 dark:text-emerald-500" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 text-red-700 dark:text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            asset.changeAmount >= 0
                              ? "text-emerald-700 dark:text-emerald-500"
                              : "text-red-700 dark:text-red-500"
                          }`}
                        >
                          {asset.changeAmount >= 0 ? "+" : ""}
                          {asset.changePercentage?.toFixed(2)}% from initial
                          value
                        </span>
                      </div>
                    )}
                </div>

                <div className="text-sm">
                  <div className="text-muted-foreground">Total Changes</div>
                  <div className="font-semibold">
                    {history.length} value update
                    {history.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Chart Key */}
                {chartData.length > 0 && (
                  <div className="flex flex-col items-start space-y-2 text-xs bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 w-fit">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-sky-700 dark:invert rounded-full"></div>
                      <span className="text-muted-foreground">Asset Value</span>
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
                    categories={["value"]}
                    colors={["sky"]}
                    showLegend={false}
                    showGridLines={true}
                    showAnimation={true}
                    curveType="natural"
                    yAxisWidth={calculateYAxisWidth()}
                    valueFormatter={(value: number) =>
                      `$${value.toLocaleString()}`
                    }
                    className="[&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-xs [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-yAxis_.recharts-cartesian-axis-tick]:leading-none [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:text-[11px] [&_.recharts-xAxis_.recharts-cartesian-axis-tick]:leading-none"
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
                              Asset Value:{" "}
                              <span
                                className="font-bold"
                                style={{ color: "#0369a1" }}
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
                      No Value History
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                      Update the asset value to see the trend over time.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* History List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Value Changes</h3>
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
                  <p>No value changes recorded yet.</p>
                  <p className="text-sm">
                    Update the asset value to see history here.
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
                                {formatCurrency(record.value, asset.currency)}
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
                                {formatCurrency(changeAmount, asset.currency)} (
                                {changePercentage >= 0 ? "+" : ""}
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
            Edit Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
