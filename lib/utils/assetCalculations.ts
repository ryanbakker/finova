import { Asset } from "@/lib/types";

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
  const initialValue = asset.value ?? 0;
  const changeAmount = currentValue - initialValue;
  const changePercentage =
    initialValue > 0 ? (changeAmount / initialValue) * 100 : 0;

  return { changeAmount, changePercentage };
}

/**
 * Get the current value of an asset (from valueHistory, currentValue, or fallback to value)
 * @param asset - The asset
 * @returns Current value
 */
export function getCurrentAssetValue(asset: Asset): number {
  // Return the currentValue field (most reliable)
  if (asset.currentValue !== undefined && asset.currentValue !== null) {
    return asset.currentValue;
  }

  // Fallback to the original value if currentValue is not available
  return asset.value ?? 0;
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
  const totalInitialValue = assets.reduce(
    (sum, asset) => sum + (asset.value ?? 0),
    0
  );

  const totalChange = totalCurrentValue - totalInitialValue;
  const totalChangePercentage =
    totalInitialValue > 0 ? (totalChange / totalInitialValue) * 100 : 0;

  return { totalChange, totalChangePercentage };
}
