"use server";

import { connectToDB } from "@/database/db";
import { ValueHistory } from "@/database/models/valueHistory.model";
import { MonthlyNetWorthSummary } from "@/database/models/monthlyNetWorthSummary.model";

// Import the old models for migration
import { Asset } from "@/database/models/asset.model";
import { default as Liability } from "@/database/models/liability.model";

interface OldAsset {
  _id: string;
  userId: string;
  name: string;
  category: string;
  value: number;
  currentValue?: number;
  valueHistory: Array<{
    value: number;
    createdAt: Date;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OldLiability {
  _id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  currentAmount?: number;
  remainingBalance?: number;
  amountHistory: Array<{
    amount: number;
    createdAt: Date;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function migrateToEventLedger() {
  try {
    await connectToDB();

    // Step 1: Migrate Asset data

    const oldAssets = (await Asset.find({}).lean()) as unknown as OldAsset[];

    for (const asset of oldAssets) {
      // Create value history entries from embedded history
      if (asset.valueHistory && asset.valueHistory.length > 0) {
        const valueHistoryEntries = asset.valueHistory.map((entry) => ({
          userId: asset.userId,
          itemId: asset._id,
          itemType: "ASSET" as const,
          value: entry.value,
          timestamp: entry.createdAt,
        }));

        await ValueHistory.insertMany(valueHistoryEntries);
      }

      // Update asset with new structure
      const currentValue = asset.currentValue ?? asset.value;
      const changeAmount = currentValue - asset.value;
      const changePercentage =
        asset.value > 0 ? (changeAmount / asset.value) * 100 : 0;

      await Asset.updateOne(
        { _id: asset._id },
        {
          $set: {
            currentValue,
            changeAmount,
            changePercentage,
            description: asset.notes || "",
          },
          $unset: {
            value: 1,
            currency: 1,
            institution: 1,
            accountNumber: 1,
            purchaseDate: 1,
            currentValue: 1,
            changeAmount: 1,
            changePercentage: 1,
            valueHistory: 1,
            notes: 1,
            isActive: 1,
          },
        }
      );
    }

    // Step 2: Migrate Liability data

    const oldLiabilities = (await Liability.find(
      {}
    ).lean()) as unknown as OldLiability[];

    for (const liability of oldLiabilities) {
      // Create value history entries from embedded history
      if (liability.amountHistory && liability.amountHistory.length > 0) {
        const valueHistoryEntries = liability.amountHistory.map((entry) => ({
          userId: liability.userId,
          itemId: liability._id,
          itemType: "LIABILITY" as const,
          value: entry.amount,
          timestamp: entry.createdAt,
        }));

        await ValueHistory.insertMany(valueHistoryEntries);
      }

      // Update liability with new structure
      const currentValue =
        liability.currentAmount ??
        liability.remainingBalance ??
        liability.amount;
      const changeAmount = currentValue - liability.amount;
      const changePercentage =
        liability.amount > 0 ? (changeAmount / liability.amount) * 100 : 0;

      await Liability.updateOne(
        { _id: liability._id },
        {
          $set: {
            currentValue,
            changeAmount,
            changePercentage,
            description: liability.notes || "",
          },
          $unset: {
            amount: 1,
            currency: 1,
            institution: 1,
            accountNumber: 1,
            dueDate: 1,
            interestRate: 1,
            monthlyPayment: 1,
            remainingBalance: 1,
            originalAmount: 1,
            currentAmount: 1,
            changeAmount: 1,
            changePercentage: 1,
            amountHistory: 1,
            notes: 1,
            isActive: 1,
          },
        }
      );
    }

    // Step 3: Generate monthly net worth summaries

    await generateMonthlyNetWorthSummaries();

    return { success: true, message: "Migration completed successfully!" };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, message: `Migration failed: ${error}` };
  }
}

async function generateMonthlyNetWorthSummaries() {
  // Get all unique users
  const users = await ValueHistory.distinct("userId");

  for (const userId of users) {
    // Get all value history entries for this user
    const valueHistory = await ValueHistory.find({ userId })
      .sort({ timestamp: 1 })
      .lean();

    // Group by year and month
    const monthlyData = new Map<
      string,
      Array<{
        itemId: string;
        itemType: string;
        value: number;
        timestamp: Date;
      }>
    >();

    for (const entry of valueHistory) {
      const date = new Date(entry.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, []);
      }
      monthlyData.get(key)!.push({
        itemId: entry.itemId,
        itemType: entry.itemType,
        value: entry.value,
        timestamp: entry.timestamp,
      });
    }

    // Calculate monthly averages
    for (const [monthKey, entries] of monthlyData) {
      const [year, month] = monthKey.split("-").map(Number);

      // Group by itemId and calculate average for each item
      const itemAverages = new Map<string, number>();
      const itemGroups = new Map<
        string,
        Array<{ value: number; timestamp: Date }>
      >();

      for (const entry of entries) {
        if (!itemGroups.has(entry.itemId)) {
          itemGroups.set(entry.itemId, []);
        }
        itemGroups.get(entry.itemId)!.push({
          value: entry.value,
          timestamp: entry.timestamp,
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
        const entry = entries.find((e) => e.itemId === itemId);
        if (entry?.itemType === "ASSET") {
          totalAssets += average;
        } else if (entry?.itemType === "LIABILITY") {
          totalLiabilities += average;
        }
      }

      const averageNetWorth = totalAssets - totalLiabilities;

      // Save or update monthly summary
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
    }
  }
}

// Utility function to rollback migration (if needed)
export async function rollbackMigration() {
  try {
    await connectToDB();

    // Clear the new collections
    await ValueHistory.deleteMany({});
    await MonthlyNetWorthSummary.deleteMany({});

    return { success: true, message: "Rollback completed" };
  } catch (error) {
    console.error("Rollback failed:", error);
    return { success: false, message: `Rollback failed: ${error}` };
  }
}

export async function regenerateMonthlySummaries() {
  try {
    await connectToDB();

    // Clear existing monthly summaries
    await MonthlyNetWorthSummary.deleteMany({});

    // Regenerate them
    await generateMonthlyNetWorthSummaries();

    return {
      success: true,
      message: "Monthly summaries regenerated successfully",
    };
  } catch (error) {
    console.error("Regeneration failed:", error);
    return { success: false, message: `Regeneration failed: ${error}` };
  }
}
