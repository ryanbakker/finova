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
  const startTime = Date.now();

  try {
    console.log(`[NETWORTH_SERVICE] Starting get current net worth`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[NETWORTH_SERVICE] Database connected`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    // Get current values from assets and liabilities
    const [assets, liabilities] = await Promise.all([
      Asset.find({ userId }).lean(),
      Liability.find({ userId }).lean(),
    ]);

    console.log(`[NETWORTH_SERVICE] Assets and liabilities fetched`, {
      userId,
      assetsCount: assets.length,
      liabilitiesCount: liabilities.length,
      timestamp: new Date().toISOString(),
    });

    const totalAssets = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.currentValue,
      0
    );
    const netWorth = totalAssets - totalLiabilities;

    const responseTime = Date.now() - startTime;
    console.log(`[NETWORTH_SERVICE] Current net worth calculated`, {
      userId,
      netWorth,
      totalAssets,
      totalLiabilities,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      netWorth,
      assets: totalAssets,
      liabilities: totalLiabilities,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[NETWORTH_SERVICE] Error getting current net worth`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
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
  const startTime = Date.now();

  try {
    console.log(`[NETWORTH_SERVICE] Starting get monthly net worth history`, {
      userId,
      months,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[NETWORTH_SERVICE] Database connected`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    // Get current net worth
    const current = await getCurrentNetWorth(userId);

    console.log(`[NETWORTH_SERVICE] Current net worth fetched`, {
      userId,
      currentNetWorth: current.netWorth,
      currentAssets: current.assets,
      currentLiabilities: current.liabilities,
      timestamp: new Date().toISOString(),
    });

    // Get monthly summaries (get most recent months, then sort chronologically)
    const monthlySummaries = await MonthlyNetWorthSummary.find({ userId })
      .sort({ year: -1, month: -1 })
      .limit(months)
      .lean({ virtuals: true });

    console.log(`[NETWORTH_SERVICE] Monthly summaries fetched`, {
      userId,
      summariesCount: monthlySummaries.length,
      requestedMonths: months,
      timestamp: new Date().toISOString(),
    });

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

    const responseTime = Date.now() - startTime;
    console.log(`[NETWORTH_SERVICE] Monthly net worth history completed`, {
      userId,
      currentNetWorth: current.netWorth,
      currentAssets: current.assets,
      currentLiabilities: current.liabilities,
      monthlyHistoryCount: monthlyHistory.length,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      currentNetWorth: current.netWorth,
      currentAssets: current.assets,
      currentLiabilities: current.liabilities,
      monthlyHistory,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(
      `[NETWORTH_SERVICE] Error getting monthly net worth history`,
      {
        userId,
        months,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );
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
  const startTime = Date.now();

  try {
    console.log(`[NETWORTH_SERVICE] Starting update item value`, {
      userId,
      itemId: data.itemId,
      itemType: data.itemType,
      newValue: data.newValue,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    const { itemId, itemType, newValue, timestamp = new Date() } = data;

    console.log(`[NETWORTH_SERVICE] Database connected`, {
      userId,
      itemId,
      timestamp: new Date().toISOString(),
    });

    // Create new value history entry
    const valueHistoryEntry = new ValueHistory({
      userId,
      itemId,
      itemType,
      value: newValue,
      timestamp,
    });

    await valueHistoryEntry.save();

    console.log(`[NETWORTH_SERVICE] Value history entry created`, {
      userId,
      itemId,
      itemType,
      newValue,
      timestamp: new Date().toISOString(),
    });

    // Update the current value in the asset/liability document
    if (itemType === "ASSET") {
      console.log(`[NETWORTH_SERVICE] Updating asset value`, {
        userId,
        itemId,
        timestamp: new Date().toISOString(),
      });

      const asset = await Asset.findOne({ _id: itemId, userId });
      if (!asset) {
        console.error(`[NETWORTH_SERVICE] Asset not found`, {
          userId,
          itemId,
          timestamp: new Date().toISOString(),
        });
        throw new Error("Asset not found");
      }

      const previousValue = asset.currentValue;
      const changeAmount = newValue - previousValue;
      const changePercentage =
        previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

      console.log(`[NETWORTH_SERVICE] Asset value change calculated`, {
        userId,
        itemId,
        previousValue,
        newValue,
        changeAmount,
        changePercentage: changePercentage.toFixed(2),
        timestamp: new Date().toISOString(),
      });

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

      console.log(`[NETWORTH_SERVICE] Asset value updated successfully`, {
        userId,
        itemId,
        timestamp: new Date().toISOString(),
      });
    } else if (itemType === "LIABILITY") {
      console.log(`[NETWORTH_SERVICE] Updating liability value`, {
        userId,
        itemId,
        timestamp: new Date().toISOString(),
      });

      const liability = await Liability.findOne({ _id: itemId, userId });
      if (!liability) {
        console.error(`[NETWORTH_SERVICE] Liability not found`, {
          userId,
          itemId,
          timestamp: new Date().toISOString(),
        });
        throw new Error("Liability not found");
      }

      const previousValue = liability.currentValue;
      const changeAmount = newValue - previousValue;
      const changePercentage =
        previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

      console.log(`[NETWORTH_SERVICE] Liability value change calculated`, {
        userId,
        itemId,
        previousValue,
        newValue,
        changeAmount,
        changePercentage: changePercentage.toFixed(2),
        timestamp: new Date().toISOString(),
      });

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

      console.log(`[NETWORTH_SERVICE] Liability value updated successfully`, {
        userId,
        itemId,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(
      `[NETWORTH_SERVICE] Triggering current month average recalculation`,
      {
        userId,
        itemId,
        timestamp: new Date().toISOString(),
      }
    );

    // Trigger recalculation of current month's average (optional - for real-time updates)
    await recalculateCurrentMonthAverage(userId);

    const responseTime = Date.now() - startTime;
    console.log(`[NETWORTH_SERVICE] Item value update completed successfully`, {
      userId,
      itemId,
      itemType,
      newValue,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return { success: true, message: "Value updated successfully" };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[NETWORTH_SERVICE] Error updating item value`, {
      userId,
      itemId: data.itemId,
      itemType: data.itemType,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return { success: false, message: `Failed to update value: ${error}` };
  }
}

/**
 * Recalculate the current month's average net worth
 */
export async function recalculateCurrentMonthAverage(
  userId: string
): Promise<void> {
  const startTime = Date.now();

  try {
    console.log(
      `[NETWORTH_SERVICE] Starting current month average recalculation`,
      {
        userId,
        timestamp: new Date().toISOString(),
      }
    );

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    console.log(`[NETWORTH_SERVICE] Current month context`, {
      userId,
      year,
      month,
      timestamp: new Date().toISOString(),
    });

    // Get all value history entries for the current month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    console.log(`[NETWORTH_SERVICE] Querying value history for current month`, {
      userId,
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString(),
      timestamp: new Date().toISOString(),
    });

    const valueHistory = await ValueHistory.find({
      userId,
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    console.log(`[NETWORTH_SERVICE] Value history entries fetched`, {
      userId,
      entriesCount: valueHistory.length,
      timestamp: new Date().toISOString(),
    });

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

    console.log(`[NETWORTH_SERVICE] Calculated monthly averages`, {
      userId,
      year,
      month,
      averageNetWorth,
      totalAssets,
      totalLiabilities,
      itemAveragesCount: itemAverages.size,
      timestamp: new Date().toISOString(),
    });

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

    const responseTime = Date.now() - startTime;
    console.log(
      `[NETWORTH_SERVICE] Current month average recalculation completed`,
      {
        userId,
        year,
        month,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(
      `[NETWORTH_SERVICE] Error in current month average recalculation`,
      {
        userId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );
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
  const startTime = Date.now();

  try {
    console.log(`[NETWORTH_SERVICE] Starting generate monthly summary`, {
      userId,
      year,
      month,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    // Get all value history entries for the specified month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    console.log(
      `[NETWORTH_SERVICE] Querying value history for specified month`,
      {
        userId,
        year,
        month,
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString(),
        timestamp: new Date().toISOString(),
      }
    );

    const valueHistory = await ValueHistory.find({
      userId,
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    console.log(
      `[NETWORTH_SERVICE] Value history entries fetched for specified month`,
      {
        userId,
        year,
        month,
        entriesCount: valueHistory.length,
        timestamp: new Date().toISOString(),
      }
    );

    if (valueHistory.length === 0) {
      console.log(
        `[NETWORTH_SERVICE] No value history entries found, skipping summary generation`,
        {
          userId,
          year,
          month,
          timestamp: new Date().toISOString(),
        }
      );
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

    console.log(`[NETWORTH_SERVICE] Calculated monthly summary averages`, {
      userId,
      year,
      month,
      averageNetWorth,
      totalAssets,
      totalLiabilities,
      itemAveragesCount: itemAverages.size,
      timestamp: new Date().toISOString(),
    });

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

    const responseTime = Date.now() - startTime;
    console.log(`[NETWORTH_SERVICE] Monthly summary generation completed`, {
      userId,
      year,
      month,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[NETWORTH_SERVICE] Error generating monthly summary`, {
      userId,
      year,
      month,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
