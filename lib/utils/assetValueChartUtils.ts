import { AssetValueHistoryEntry } from "@/lib/types";
import { getQuarterYearInfo, formatDateForChart } from "./dateUtils";

/**
 * Interface for asset value chart data with quarter and year information
 */
export interface AssetValueChartData {
  date: string;
  value: number;
  quarter: number;
  year: number;
  quarterName: string;
  fullQuarter: string;
}

/**
 * Process asset value history data for chart display with quarter and year information
 * @param history - Array of asset value history entries
 * @returns Processed chart data with quarter and year information
 */
export function processAssetValueHistoryForChart(
  history: AssetValueHistoryEntry[]
): AssetValueChartData[] {
  if (!history || history.length === 0) {
    return [];
  }

  const processedData: AssetValueChartData[] = [];

  // Sort history by date (oldest first for chart)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Add all value changes with quarter and year information
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

  return processedData;
}

/**
 * Get quarter and year summary for asset value changes
 * @param chartData - Processed chart data
 * @returns Summary of quarters and years covered
 */
export function getQuarterYearSummary(chartData: AssetValueChartData[]): {
  quarters: string[];
  years: number[];
  totalQuarters: number;
  totalYears: number;
} {
  if (!chartData || chartData.length === 0) {
    return {
      quarters: [],
      years: [],
      totalQuarters: 0,
      totalYears: 0,
    };
  }

  const uniqueQuarters = new Set<string>();
  const uniqueYears = new Set<number>();

  chartData.forEach((data) => {
    uniqueQuarters.add(data.fullQuarter);
    uniqueYears.add(data.year);
  });

  return {
    quarters: Array.from(uniqueQuarters).sort(),
    years: Array.from(uniqueYears).sort((a, b) => a - b),
    totalQuarters: uniqueQuarters.size,
    totalYears: uniqueYears.size,
  };
}

/**
 * Filter chart data by quarter and year
 * @param chartData - Processed chart data
 * @param quarter - Quarter to filter by (1-4)
 * @param year - Year to filter by
 * @returns Filtered chart data
 */
export function filterChartDataByQuarterYear(
  chartData: AssetValueChartData[],
  quarter?: number,
  year?: number
): AssetValueChartData[] {
  if (!chartData || chartData.length === 0) {
    return [];
  }

  return chartData.filter((data) => {
    const matchesQuarter = quarter === undefined || data.quarter === quarter;
    const matchesYear = year === undefined || data.year === year;
    return matchesQuarter && matchesYear;
  });
}
