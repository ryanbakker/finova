import {
  getCurrentAssetValue,
  calculateAssetChange,
} from "../assetCalculations";
import { Asset } from "@/lib/types";

// Sample test data with different scenarios
const sampleAssetWithCurrentValue: Asset = {
  id: "1",
  name: "Test Asset 1",
  category: "Investment Account",
  value: 10000, // Original value
  currentValue: 12000, // Current value field
  currency: "USD",
  valueHistory: [
    { value: 10000, createdAt: "2024-01-01T00:00:00Z" },
    { value: 11000, createdAt: "2024-02-01T00:00:00Z" },
    { value: 12000, createdAt: "2024-03-01T00:00:00Z" },
  ],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-03-01T00:00:00Z",
};

const sampleAssetWithoutCurrentValue: Asset = {
  id: "2",
  name: "Test Asset 2",
  category: "Savings Account",
  value: 5000, // Original value
  currency: "USD",
  valueHistory: [
    { value: 5000, createdAt: "2024-01-01T00:00:00Z" },
    { value: 5500, createdAt: "2024-02-01T00:00:00Z" },
    { value: 6000, createdAt: "2024-03-01T00:00:00Z" },
  ],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-03-01T00:00:00Z",
};

const sampleAssetWithoutHistory: Asset = {
  id: "3",
  name: "Test Asset 3",
  category: "Cash",
  value: 1000, // Original value
  currency: "USD",
  valueHistory: [],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("Asset Calculations", () => {
  describe("getCurrentAssetValue", () => {
    it("should return currentValue field when available", () => {
      const result = getCurrentAssetValue(sampleAssetWithCurrentValue);
      expect(result).toBe(12000);
    });

    it("should return most recent valueHistory when currentValue is not available", () => {
      const result = getCurrentAssetValue(sampleAssetWithoutCurrentValue);
      expect(result).toBe(6000);
    });

    it("should return original value when no history and no currentValue", () => {
      const result = getCurrentAssetValue(sampleAssetWithoutHistory);
      expect(result).toBe(1000);
    });

    it("should prioritize currentValue over valueHistory", () => {
      // Even if valueHistory has a different value, currentValue should take precedence
      const assetWithMismatch: Asset = {
        ...sampleAssetWithCurrentValue,
        currentValue: 15000, // Different from most recent history value (12000)
      };

      const result = getCurrentAssetValue(assetWithMismatch);
      expect(result).toBe(15000);
    });
  });

  describe("calculateAssetChange", () => {
    it("should calculate change from original value to current value", () => {
      const result = calculateAssetChange(sampleAssetWithCurrentValue);
      expect(result.changeAmount).toBe(2000); // 12000 - 10000
      expect(result.changePercentage).toBe(20); // (2000 / 10000) * 100
    });

    it("should calculate change using valueHistory when currentValue not available", () => {
      const result = calculateAssetChange(sampleAssetWithoutCurrentValue);
      expect(result.changeAmount).toBe(1000); // 6000 - 5000
      expect(result.changePercentage).toBe(20); // (1000 / 5000) * 100
    });

    it("should return zero change when no history and no currentValue", () => {
      const result = calculateAssetChange(sampleAssetWithoutHistory);
      expect(result.changeAmount).toBe(0);
      expect(result.changePercentage).toBe(0);
    });
  });
});

// Example usage function for demonstration
export function demonstrateAssetValueFix() {
  return {
    asset1: getCurrentAssetValue(sampleAssetWithCurrentValue),
    asset2: getCurrentAssetValue(sampleAssetWithoutCurrentValue),
    asset3: getCurrentAssetValue(sampleAssetWithoutHistory),
  };
}
