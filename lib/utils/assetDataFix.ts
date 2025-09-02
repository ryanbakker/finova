import { Asset } from "@/lib/types";
import { getCurrentAssetValue } from "./assetCalculations";

/**
 * Fix asset data inconsistencies by synchronizing currentValue with valueHistory
 * @param asset - The asset to fix
 * @returns Fixed asset data
 */
export function fixAssetValueInconsistency(asset: Asset): Asset {
  // Get the most recent value from history
  let mostRecentHistoryValue: number | null = null;
  if (asset.valueHistory && asset.valueHistory.length > 0) {
    const sortedHistory = [...asset.valueHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    mostRecentHistoryValue = sortedHistory[0].value;
  }

  // If we have a valueHistory entry but currentValue is different or missing
  if (mostRecentHistoryValue !== null) {
    const currentValue = asset.currentValue || null;

    // If currentValue is missing or different from most recent history
    if (currentValue === null || currentValue !== mostRecentHistoryValue) {
      console.log(
        `Fixing asset "${asset.name}": currentValue ${currentValue} -> ${mostRecentHistoryValue}`
      );

      return {
        ...asset,
        currentValue: mostRecentHistoryValue,
        // Also update changeAmount and changePercentage
        changeAmount: mostRecentHistoryValue - asset.value,
        changePercentage:
          asset.value > 0
            ? ((mostRecentHistoryValue - asset.value) / asset.value) * 100
            : 0,
      };
    }
  }

  return asset;
}

/**
 * Fix multiple assets for value inconsistencies
 * @param assets - Array of assets to fix
 * @returns Array of fixed assets
 */
export function fixAssetsValueInconsistencies(assets: Asset[]): Asset[] {
  return assets.map(fixAssetValueInconsistency);
}

/**
 * Check if an asset has value inconsistencies
 * @param asset - The asset to check
 * @returns True if there are inconsistencies
 */
export function hasAssetValueInconsistency(asset: Asset): boolean {
  const currentValue = getCurrentAssetValue(asset);

  // Get the most recent value from history
  let mostRecentHistoryValue: number | null = null;
  if (asset.valueHistory && asset.valueHistory.length > 0) {
    const sortedHistory = [...asset.valueHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    mostRecentHistoryValue = sortedHistory[0].value;
  }

  // Check for inconsistencies
  if (mostRecentHistoryValue !== null) {
    const currentValueField = asset.currentValue || null;

    // Inconsistency if currentValue field doesn't match most recent history
    if (currentValueField !== mostRecentHistoryValue) {
      return true;
    }
  }

  return false;
}

/**
 * Get a summary of assets with value inconsistencies
 * @param assets - Array of assets to check
 * @returns Summary of inconsistent assets
 */
export function getInconsistentAssetsSummary(assets: Asset[]): {
  totalAssets: number;
  inconsistentAssets: Asset[];
  inconsistentAssetNames: string[];
} {
  const inconsistentAssets = assets.filter(hasAssetValueInconsistency);

  return {
    totalAssets: assets.length,
    inconsistentAssets,
    inconsistentAssetNames: inconsistentAssets.map((asset) => asset.name),
  };
}
