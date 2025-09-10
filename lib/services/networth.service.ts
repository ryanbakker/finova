"use server";

import { connectToDB } from "@/database/db";
import { ValueHistory } from "@/database/models/valueHistory.model";
import { MonthlyNetWorthSummary } from "@/database/models/monthlyNetWorthSummary.model";
import { Asset } from "@/database/models/asset.model";
import { default as Liability } from "@/database/models/liability.model";

export interface NetWorthData {
  currentNetWorth: number;
  currentAssets: number;
  currentLiabilities: number;
  monthlyHistory: Array<{
    month: string;
    year: number;
    monthNumber: number;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
}

export interface ValueUpdateData {
  itemId: string;
  itemType: "ASSET" | "LIABILITY";
  newValue: number;
  timestamp?: Date;
}

/**
 * Get current net worth for a user
 */
export async function getCurrentNetWorth(userId: string): Promise<{
  netWorth: number;
  assets: number;
  liabilities: number;
}> {
  try {
    await connectToDB();

    // Get current values from assets and liabilities
    const [assets, liabilities] = await Promise.all([
      Asset.find({ userId }).lean(),
      Liability.find({ userId }).lean(),
    ]);

    const totalAssets = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.currentValue,
      0
    );
    const netWorth = totalAssets - totalLiabilities;

    return {
      netWorth,
      assets: totalAssets,
      liabilities: totalLiabilities,
    };
  } catch (error) {
    console.error("Error getting current net worth:", error);
    throw error;
  }
}

/**
 * Get monthly net worth history for a user
 */
export async function getMonthlyNetWorthHistory(
  userId: string,
  months: number = 12
): Promise<NetWorthData> {
  try {
    await connectToDB();

    // Get current net worth
    const current = await getCurrentNetWorth(userId);

    // Get monthly summaries (get most recent months, then sort chronologically)
    const monthlySummaries = await MonthlyNetWorthSummary.find({ userId })
      .sort({ year: -1, month: -1 })
      .limit(months)
      .lean({ virtuals: true });

    // Format monthly history with abbreviated months and proper ordering
    const monthlyHistory = monthlySummaries
      .map((summary) => {
        // Always use abbreviated month names directly
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const monthName = monthNames[summary.month - 1];

        return {
          month: monthName,
          year: summary.year,
          monthNumber: summary.month,
          netWorth: summary.averageNetWorth,
          assets: summary.averageAssets,
          liabilities: summary.averageLiabilities,
        };
      })
      .sort((a, b) => {
        // Sort by year first, then by month (ascending order for chronological display)
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.monthNumber - b.monthNumber;
      });

    return {
      currentNetWorth: current.netWorth,
      currentAssets: current.assets,
      currentLiabilities: current.liabilities,
      monthlyHistory,
    };
  } catch (error) {
    console.error("Error getting monthly net worth history:", error);
    throw error;
  }
}

/**
 * Update the value of an asset or liability
 */
export async function updateItemValue(
  userId: string,
  data: ValueUpdateData
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB();

    const { itemId, itemType, newValue, timestamp = new Date() } = data;

    // Create new value history entry
    const valueHistoryEntry = new ValueHistory({
      userId,
      itemId,
      itemType,
      value: newValue,
      timestamp,
    });

    await valueHistoryEntry.save();

    // Update the current value in the asset/liability document
    if (itemType === "ASSET") {
      const asset = await Asset.findOne({ _id: itemId, userId });
      if (!asset) {
        throw new Error("Asset not found");
      }

      const previousValue = asset.currentValue;
      const changeAmount = newValue - previousValue;
      const changePercentage =
        previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

      await Asset.updateOne(
        { _id: itemId },
        {
          $set: {
            currentValue: newValue,
            changeAmount,
            changePercentage,
            updatedAt: timestamp,
          },
        }
      );
    } else if (itemType === "LIABILITY") {
      const liability = await Liability.findOne({ _id: itemId, userId });
      if (!liability) {
        throw new Error("Liability not found");
      }

      const previousValue = liability.currentValue;
      const changeAmount = newValue - previousValue;
      const changePercentage =
        previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

      await Liability.updateOne(
        { _id: itemId },
        {
          $set: {
            currentValue: newValue,
            changeAmount,
            changePercentage,
            updatedAt: timestamp,
          },
        }
      );
    }

    // Trigger recalculation of current month's average (optional - for real-time updates)
    await recalculateCurrentMonthAverage(userId);

    return { success: true, message: "Value updated successfully" };
  } catch (error) {
    console.error("Error updating item value:", error);
    return { success: false, message: `Failed to update value: ${error}` };
  }
}

/**
 * Recalculate the current month's average net worth
 */
export async function recalculateCurrentMonthAverage(
  userId: string
): Promise<void> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Get all value history entries for the current month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const valueHistory = await ValueHistory.find({
      userId,
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    // Group by itemId and calculate averages
    const itemAverages = new Map<string, number>();
    const itemGroups = new Map<
      string,
      Array<{ value: number; itemType: string }>
    >();

    for (const entry of valueHistory) {
      if (!itemGroups.has(entry.itemId)) {
        itemGroups.set(entry.itemId, []);
      }
      itemGroups.get(entry.itemId)!.push({
        value: entry.value,
        itemType: entry.itemType,
      });
    }

    // Calculate average for each item
    for (const [itemId, itemEntries] of itemGroups) {
      const total = itemEntries.reduce((sum, entry) => sum + entry.value, 0);
      const average = total / itemEntries.length;
      itemAverages.set(itemId, average);
    }

    // Calculate total assets and liabilities
    let totalAssets = 0;
    let totalLiabilities = 0;

    for (const [itemId, average] of itemAverages) {
      const entry = valueHistory.find((e) => e.itemId === itemId);
      if (entry?.itemType === "ASSET") {
        totalAssets += average;
      } else if (entry?.itemType === "LIABILITY") {
        totalLiabilities += average;
      }
    }

    const averageNetWorth = totalAssets - totalLiabilities;

    // Update or create monthly summary
    await MonthlyNetWorthSummary.findOneAndUpdate(
      { userId, year, month },
      {
        userId,
        year,
        month,
        averageNetWorth,
        averageAssets: totalAssets,
        averageLiabilities: totalLiabilities,
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error recalculating current month average:", error);
    // Don't throw - this is a background operation
  }
}

/**
 * Generate monthly summaries for a specific month (for batch processing)
 */
export async function generateMonthlySummary(
  userId: string,
  year: number,
  month: number
): Promise<void> {
  try {
    await connectToDB();

    // Get all value history entries for the specified month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const valueHistory = await ValueHistory.find({
      userId,
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    if (valueHistory.length === 0) {
      console.log(`No value history found for ${year}-${month}`);
      return;
    }

    // Group by itemId and calculate averages
    const itemAverages = new Map<string, number>();
    const itemGroups = new Map<
      string,
      Array<{ value: number; itemType: string }>
    >();

    for (const entry of valueHistory) {
      if (!itemGroups.has(entry.itemId)) {
        itemGroups.set(entry.itemId, []);
      }
      itemGroups.get(entry.itemId)!.push({
        value: entry.value,
        itemType: entry.itemType,
      });
    }

    // Calculate average for each item
    for (const [itemId, itemEntries] of itemGroups) {
      const total = itemEntries.reduce((sum, entry) => sum + entry.value, 0);
      const average = total / itemEntries.length;
      itemAverages.set(itemId, average);
    }

    // Calculate total assets and liabilities
    let totalAssets = 0;
    let totalLiabilities = 0;

    for (const [itemId, average] of itemAverages) {
      const entry = valueHistory.find((e) => e.itemId === itemId);
      if (entry?.itemType === "ASSET") {
        totalAssets += average;
      } else if (entry?.itemType === "LIABILITY") {
        totalLiabilities += average;
      }
    }

    const averageNetWorth = totalAssets - totalLiabilities;

    // Save monthly summary
    await MonthlyNetWorthSummary.findOneAndUpdate(
      { userId, year, month },
      {
        userId,
        year,
        month,
        averageNetWorth,
        averageAssets: totalAssets,
        averageLiabilities: totalLiabilities,
      },
      { upsert: true, new: true }
    );

    console.log(
      `Generated monthly summary for ${userId} - ${year}-${month}: Net Worth $${averageNetWorth.toFixed(
        2
      )}`
    );
  } catch (error) {
    console.error(
      `Error generating monthly summary for ${year}-${month}:`,
      error
    );
    throw error;
  }
}
