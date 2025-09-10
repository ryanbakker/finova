import {
  processAssetValueHistoryForChart,
  getQuarterYearSummary,
  filterChartDataByQuarterYear,
} from "../assetValueChartUtils";
import { ValueHistoryEntry } from "@/lib/types";

// Sample test data
const sampleHistory: ValueHistoryEntry[] = [
  {
    id: "1",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 10000,
    timestamp: "2024-01-15T10:00:00Z", // Q1 2024
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 10500,
    timestamp: "2024-03-20T10:00:00Z", // Q1 2024
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "3",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 11200,
    timestamp: "2024-06-10T10:00:00Z", // Q2 2024
    createdAt: "2024-06-10T10:00:00Z",
    updatedAt: "2024-06-10T10:00:00Z",
  },
  {
    id: "4",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 10800,
    timestamp: "2024-09-05T10:00:00Z", // Q3 2024
    createdAt: "2024-09-05T10:00:00Z",
    updatedAt: "2024-09-05T10:00:00Z",
  },
  {
    id: "5",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 12000,
    timestamp: "2024-12-15T10:00:00Z", // Q4 2024
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "6",
    userId: "test-user",
    itemId: "test-asset",
    itemType: "ASSET",
    value: 12500,
    timestamp: "2025-02-10T10:00:00Z", // Q1 2025
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2025-02-10T10:00:00Z",
  },
];

describe("Asset Value Chart Utils", () => {
  describe("processAssetValueHistoryForChart", () => {
    it("should process history data with quarter and year information", () => {
      const result = processAssetValueHistoryForChart(sampleHistory);

      expect(result).toHaveLength(6);

      // Check first entry (Q1 2024)
      expect(result[0]).toMatchObject({
        value: 10000,
        quarter: 1,
        year: 2024,
        quarterName: "Q1",
        fullQuarter: "Q1 2024",
      });

      // Check Q2 2024 entry
      expect(result[2]).toMatchObject({
        value: 11200,
        quarter: 2,
        year: 2024,
        quarterName: "Q2",
        fullQuarter: "Q2 2024",
      });

      // Check Q1 2025 entry
      expect(result[5]).toMatchObject({
        value: 12500,
        quarter: 1,
        year: 2025,
        quarterName: "Q1",
        fullQuarter: "Q1 2025",
      });
    });

    it("should handle empty history", () => {
      const result = processAssetValueHistoryForChart([]);
      expect(result).toEqual([]);
    });
  });

  describe("getQuarterYearSummary", () => {
    it("should return correct quarter and year summary", () => {
      const chartData = processAssetValueHistoryForChart(sampleHistory);
      const summary = getQuarterYearSummary(chartData);

      expect(summary.quarters).toEqual([
        "Q1 2024",
        "Q2 2024",
        "Q3 2024",
        "Q4 2024",
        "Q1 2025",
      ]);
      expect(summary.years).toEqual([2024, 2025]);
      expect(summary.totalQuarters).toBe(5);
      expect(summary.totalYears).toBe(2);
    });

    it("should handle empty data", () => {
      const summary = getQuarterYearSummary([]);
      expect(summary).toEqual({
        quarters: [],
        years: [],
        totalQuarters: 0,
        totalYears: 0,
      });
    });
  });

  describe("filterChartDataByQuarterYear", () => {
    it("should filter by quarter", () => {
      const chartData = processAssetValueHistoryForChart(sampleHistory);
      const q1Data = filterChartDataByQuarterYear(chartData, 1);

      expect(q1Data).toHaveLength(2); // Q1 2024 and Q1 2025
      expect(q1Data.every((data) => data.quarter === 1)).toBe(true);
    });

    it("should filter by year", () => {
      const chartData = processAssetValueHistoryForChart(sampleHistory);
      const year2024Data = filterChartDataByQuarterYear(
        chartData,
        undefined,
        2024
      );

      expect(year2024Data).toHaveLength(5); // All 2024 entries
      expect(year2024Data.every((data) => data.year === 2024)).toBe(true);
    });

    it("should filter by both quarter and year", () => {
      const chartData = processAssetValueHistoryForChart(sampleHistory);
      const q1_2024Data = filterChartDataByQuarterYear(chartData, 1, 2024);

      expect(q1_2024Data).toHaveLength(2); // Q1 2024 entries
      expect(
        q1_2024Data.every((data) => data.quarter === 1 && data.year === 2024)
      ).toBe(true);
    });
  });
});

// Example usage function for demonstration
export function demonstrateAssetValueChartFunctionality() {
  const chartData = processAssetValueHistoryForChart(sampleHistory);

  const summary = getQuarterYearSummary(chartData);

  const q1Data = filterChartDataByQuarterYear(chartData, 1);

  const year2024Data = filterChartDataByQuarterYear(chartData, undefined, 2024);

  return {
    chartData,
    summary,
    q1Data,
    year2024Data,
  };
}
