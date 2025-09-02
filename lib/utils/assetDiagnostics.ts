import { Asset } from "@/lib/types";
import { getCurrentAssetValue } from "./assetCalculations";

/**
 * Diagnostic information about an asset's value fields
 */
export interface AssetValueDiagnostic {
  assetId: string;
  assetName: string;
  originalValue: number;
  currentValueField: number | null;
  valueHistoryCount: number;
  mostRecentHistoryValue: number | null;
  calculatedCurrentValue: number;
  hasInconsistency: boolean;
  inconsistencyDetails: string[];
}

/**
 * Analyze an asset for value inconsistencies
 * @param asset - The asset to analyze
 * @returns Diagnostic information
 */
export function analyzeAssetValueConsistency(
  asset: Asset
): AssetValueDiagnostic {
  const inconsistencies: string[] = [];

  // Get values from different sources
  const originalValue = asset.value;
  const currentValueField = asset.currentValue || null;
  const valueHistoryCount = asset.valueHistory?.length || 0;

  let mostRecentHistoryValue: number | null = null;
  if (asset.valueHistory && asset.valueHistory.length > 0) {
    const sortedHistory = [...asset.valueHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    mostRecentHistoryValue = sortedHistory[0].value;
  }

  const calculatedCurrentValue = getCurrentAssetValue(asset);

  // Check for inconsistencies
  if (currentValueField !== null && mostRecentHistoryValue !== null) {
    if (currentValueField !== mostRecentHistoryValue) {
      inconsistencies.push(
        `currentValue field (${currentValueField}) doesn't match most recent valueHistory entry (${mostRecentHistoryValue})`
      );
    }
  }

  if (
    currentValueField !== null &&
    currentValueField !== calculatedCurrentValue
  ) {
    inconsistencies.push(
      `currentValue field (${currentValueField}) doesn't match calculated current value (${calculatedCurrentValue})`
    );
  }

  if (
    mostRecentHistoryValue !== null &&
    mostRecentHistoryValue !== calculatedCurrentValue
  ) {
    inconsistencies.push(
      `Most recent valueHistory entry (${mostRecentHistoryValue}) doesn't match calculated current value (${calculatedCurrentValue})`
    );
  }

  return {
    assetId: asset.id,
    assetName: asset.name,
    originalValue,
    currentValueField,
    valueHistoryCount,
    mostRecentHistoryValue,
    calculatedCurrentValue,
    hasInconsistency: inconsistencies.length > 0,
    inconsistencyDetails: inconsistencies,
  };
}

/**
 * Analyze multiple assets for value inconsistencies
 * @param assets - Array of assets to analyze
 * @returns Array of diagnostic information
 */
export function analyzeAssetsValueConsistency(
  assets: Asset[]
): AssetValueDiagnostic[] {
  return assets.map(analyzeAssetValueConsistency);
}

/**
 * Get a summary of value inconsistencies across all assets
 * @param assets - Array of assets to analyze
 * @returns Summary of inconsistencies
 */
export function getValueConsistencySummary(assets: Asset[]): {
  totalAssets: number;
  assetsWithInconsistencies: number;
  totalInconsistencies: number;
  diagnostics: AssetValueDiagnostic[];
} {
  const diagnostics = analyzeAssetsValueConsistency(assets);
  const assetsWithInconsistencies = diagnostics.filter(
    (d) => d.hasInconsistency
  ).length;
  const totalInconsistencies = diagnostics.reduce(
    (sum, d) => sum + d.inconsistencyDetails.length,
    0
  );

  return {
    totalAssets: assets.length,
    assetsWithInconsistencies,
    totalInconsistencies,
    diagnostics,
  };
}

/**
 * Log diagnostic information for debugging
 * @param asset - The asset to log diagnostics for
 */
export function logAssetValueDiagnostics(asset: Asset): void {
  const diagnostic = analyzeAssetValueConsistency(asset);

  console.log(`=== Asset Value Diagnostics for "${asset.name}" ===`);
  console.log(`Asset ID: ${diagnostic.assetId}`);
  console.log(`Original Value: $${diagnostic.originalValue.toLocaleString()}`);
  console.log(
    `Current Value Field: ${
      diagnostic.currentValueField
        ? `$${diagnostic.currentValueField.toLocaleString()}`
        : "null"
    }`
  );
  console.log(`Value History Count: ${diagnostic.valueHistoryCount}`);
  console.log(
    `Most Recent History Value: ${
      diagnostic.mostRecentHistoryValue
        ? `$${diagnostic.mostRecentHistoryValue.toLocaleString()}`
        : "null"
    }`
  );
  console.log(
    `Calculated Current Value: $${diagnostic.calculatedCurrentValue.toLocaleString()}`
  );
  console.log(`Has Inconsistency: ${diagnostic.hasInconsistency}`);

  if (diagnostic.hasInconsistency) {
    console.log("Inconsistencies:");
    diagnostic.inconsistencyDetails.forEach((detail, index) => {
      console.log(`  ${index + 1}. ${detail}`);
    });
  }

  console.log("=====================================");
}
