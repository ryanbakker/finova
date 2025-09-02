import { Asset, AssetValueHistoryEntry } from "@/lib/types";

/**
 * Calculate the change amount and percentage for an asset based on its current value vs initial value
 * @param asset - The asset with valueHistory array
 * @returns Object with changeAmount and changePercentage
 */
export function calculateAssetChange(asset: Asset): {
  changeAmount: number;
  changePercentage: number;
} {
  const currentValue = getCurrentAssetValue(asset);

  // Calculate change from initial asset value
  const changeAmount = currentValue - asset.value;
  const changePercentage =
    asset.value > 0 ? (changeAmount / asset.value) * 100 : 0;

  return { changeAmount, changePercentage };
}

/**
 * Get the current value of an asset (from valueHistory, currentValue, or fallback to value)
 * @param asset - The asset
 * @returns Current value
 */
export function getCurrentAssetValue(asset: Asset): number {
  // First, check if there's a currentValue field (most reliable)
  if (asset.currentValue !== undefined && asset.currentValue !== null) {
    return asset.currentValue;
  }

  // Then check valueHistory for the most recent value
  if (asset.valueHistory && asset.valueHistory.length > 0) {
    // Sort history by date (newest first) and get the most recent value
    const sortedHistory = [...asset.valueHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedHistory[0].value;
  }

  // Finally, fallback to the original value
  return asset.value;
}

/**
 * Calculate total change across multiple assets
 * @param assets - Array of assets
 * @returns Object with totalChange and totalChangePercentage
 */
export function calculateTotalChange(assets: Asset[]): {
  totalChange: number;
  totalChangePercentage: number;
} {
  const totalCurrentValue = assets.reduce(
    (sum, asset) => sum + getCurrentAssetValue(asset),
    0
  );
  const totalInitialValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const totalChange = totalCurrentValue - totalInitialValue;
  const totalChangePercentage =
    totalInitialValue > 0 ? (totalChange / totalInitialValue) * 100 : 0;

  return { totalChange, totalChangePercentage };
}

/**
 * Get the most recent value history entry for an asset
 * @param asset - The asset
 * @returns Most recent value history entry or null
 */
export function getLatestValueHistory(
  asset: Asset
): AssetValueHistoryEntry | null {
  if (!asset.valueHistory || asset.valueHistory.length === 0) {
    return null;
  }

  // Sort history by date (newest first) and get the most recent entry
  const sortedHistory = [...asset.valueHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sortedHistory[0];
}
