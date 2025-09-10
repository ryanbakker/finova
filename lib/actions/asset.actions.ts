"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/database/db";
import { Asset } from "@/database/models/asset.model";
import { ValueHistory } from "@/database/models/valueHistory.model";
import { updateItemValue } from "@/lib/services/networth.service";
import { auth } from "@clerk/nextjs/server";
import { handleError } from "../utils";

// Types for asset operations
export interface CreateAssetParams {
  name: string;
  category: string;
  currentValue: number;
  changeAmount?: number;
  changePercentage?: number;
  description?: string;
  institution?: string;
  currency?: string;
  isActive?: boolean;
  value?: number;
  purchaseDate?: string;
  accountNumber?: string;
  notes?: string;
}

export interface UpdateAssetParams extends Partial<CreateAssetParams> {
  id: string;
}

export interface UpdateAssetValueParams {
  assetId: string;
  newValue: number;
  timestamp?: string;
}

// Enhanced validation function
function validateAssetData(
  data: CreateAssetParams | UpdateAssetParams | Partial<CreateAssetParams>
): void {
  if (data.name && (!data.name.trim() || data.name.trim().length < 1)) {
    throw new Error("Asset name must be at least 1 character long");
  }

  if (data.name && data.name.trim().length > 100) {
    throw new Error("Asset name cannot exceed 100 characters");
  }

  if (
    data.currentValue !== undefined &&
    (typeof data.currentValue !== "number" || data.currentValue < 0)
  ) {
    throw new Error("Current value must be a non-negative number");
  }

  if (data.currentValue !== undefined && data.currentValue > 999999999) {
    throw new Error("Current value cannot exceed 999,999,999");
  }

  if (data.description && data.description.length > 1000) {
    throw new Error("Description cannot exceed 1000 characters");
  }
}

// Create a new asset
export async function createAsset(assetData: CreateAssetParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    // Validate input data
    validateAssetData(assetData);

    await connectToDB();

    // Sanitize and prepare data
    const sanitizedData = {
      ...assetData,
      userId,
      name: assetData.name.trim(),
      category: assetData.category.trim(),
      description: assetData.description?.trim(),
      changeAmount: 0,
      changePercentage: 0,
    };

    const newAsset = await Asset.create(sanitizedData);

    // Create initial value history entry
    await ValueHistory.create({
      userId,
      itemId: newAsset._id.toString(),
      itemType: "ASSET",
      value: assetData.currentValue,
      timestamp: new Date(),
    });

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedAsset = {
      ...newAsset.toObject(),
      id: newAsset._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedAsset));
  } catch (error) {
    console.error("Error creating asset:", error);
    handleError(error);
    throw error;
  }
}

// Get all assets for the authenticated user
export async function getUserAssets() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const assets = await Asset.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .limit(1000); // Prevent excessive data retrieval

    // Transform MongoDB _id to id for frontend compatibility
    const transformedAssets = assets.map((asset) => ({
      ...asset,
      id: asset._id,
      _id: undefined,
    }));

    return JSON.parse(JSON.stringify(transformedAssets));
  } catch (error) {
    console.error("Error fetching user assets:", error);
    handleError(error);
    throw error;
  }
}

// Get a specific asset by ID (user can only access their own)
export async function getAssetById(assetId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !assetId ||
      typeof assetId !== "string" ||
      assetId.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    await connectToDB();

    const asset = await Asset.findOne({
      _id: assetId.trim(),
      userId,
    }).lean();

    if (!asset) {
      throw new Error("Asset not found");
    }

    // Transform MongoDB _id to id for frontend compatibility
    const transformedAsset = {
      ...asset,
      id: (asset as { _id: unknown })._id?.toString(),
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedAsset));
  } catch (error) {
    console.error("Error fetching asset:", error);
    handleError(error);
    throw error;
  }
}

// Update an asset
export async function updateAsset(assetData: UpdateAssetParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !assetData.id ||
      typeof assetData.id !== "string" ||
      assetData.id.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    // Validate input data
    validateAssetData(assetData);

    await connectToDB();

    const { id, ...updateData } = assetData;

    // Sanitize update data
    const sanitizedUpdateData: Record<string, unknown> = {};
    if (updateData.name !== undefined)
      sanitizedUpdateData.name = updateData.name.trim();
    if (updateData.category !== undefined)
      sanitizedUpdateData.category = updateData.category.trim();
    if (updateData.institution !== undefined)
      sanitizedUpdateData.institution = updateData.institution?.trim();
    if (updateData.accountNumber !== undefined)
      sanitizedUpdateData.accountNumber = updateData.accountNumber?.trim();
    if (updateData.notes !== undefined)
      sanitizedUpdateData.notes = updateData.notes?.trim();
    if (updateData.value !== undefined)
      sanitizedUpdateData.value = updateData.value;
    if (updateData.currency !== undefined)
      sanitizedUpdateData.currency = updateData.currency;
    if (updateData.purchaseDate !== undefined)
      sanitizedUpdateData.purchaseDate = updateData.purchaseDate;
    if (updateData.currentValue !== undefined)
      sanitizedUpdateData.currentValue = updateData.currentValue;
    if (updateData.changeAmount !== undefined)
      sanitizedUpdateData.changeAmount = updateData.changeAmount;
    if (updateData.changePercentage !== undefined)
      sanitizedUpdateData.changePercentage = updateData.changePercentage;
    if (updateData.isActive !== undefined)
      sanitizedUpdateData.isActive = updateData.isActive;

    // Ensure user can only update their own assets
    const updatedAsset = await Asset.findOneAndUpdate(
      {
        _id: id.trim(),
        userId,
      },
      sanitizedUpdateData,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      throw new Error("Asset not found or unauthorized");
    }

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    // Transform MongoDB _id to id for frontend compatibility
    const transformedAsset = {
      ...updatedAsset.toObject(),
      id: updatedAsset._id,
      _id: undefined,
    };

    return JSON.parse(JSON.stringify(transformedAsset));
  } catch (error) {
    console.error("Error updating asset:", error);
    handleError(error);
    throw error;
  }
}

// Delete an asset
export async function deleteAsset(assetId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !assetId ||
      typeof assetId !== "string" ||
      assetId.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    await connectToDB();

    const deletedAsset = await Asset.findOneAndDelete({
      _id: assetId.trim(),
      userId, // Ensure user can only delete their own assets
    });

    if (!deletedAsset) {
      throw new Error("Asset not found or unauthorized");
    }

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(deletedAsset));
  } catch (error) {
    console.error("Error deleting asset:", error);
    handleError(error);
    throw error;
  }
}

// Get asset statistics for the authenticated user
export async function getAssetStats() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const stats = await Asset.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalAssets: { $sum: 1 },
          totalValue: { $sum: "$value" },
          averageValue: { $avg: "$value" },
          categoryCount: { $addToSet: "$category" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAssets: 1,
          totalValue: 1,
          averageValue: 1,
          uniqueCategories: { $size: "$categoryCount" },
        },
      },
    ]);

    return (
      stats[0] || {
        totalAssets: 0,
        totalValue: 0,
        averageValue: 0,
        uniqueCategories: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching asset stats:", error);
    handleError(error);
    throw error;
  }
}

// Get assets by category for the authenticated user
export async function getAssetsByCategory(category: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      throw new Error("Invalid category provided");
    }

    await connectToDB();

    const assets = await Asset.find({
      userId,
      category: category.trim(),
      isActive: true,
    })
      .sort({ value: -1 })
      .lean()
      .limit(500); // Prevent excessive data retrieval

    return JSON.parse(JSON.stringify(assets));
  } catch (error) {
    console.error("Error fetching assets by category:", error);
    handleError(error);
    throw error;
  }
}

// Toggle asset active status
export async function toggleAssetStatus(assetId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !assetId ||
      typeof assetId !== "string" ||
      assetId.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    await connectToDB();

    const asset = await Asset.findOne({
      _id: assetId.trim(),
      userId,
    });

    if (!asset) {
      throw new Error("Asset not found or unauthorized");
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId.trim(),
      { isActive: !asset.isActive },
      { new: true, runValidators: true }
    );

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(updatedAsset));
  } catch (error) {
    console.error("Error toggling asset status:", error);
    handleError(error);
    throw error;
  }
}

// Bulk operations with enhanced security
export async function bulkUpdateAssets(
  assetIds: string[],
  updateData: Partial<CreateAssetParams>
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      throw new Error("No asset IDs provided");
    }

    if (assetIds.length > 100) {
      throw new Error("Cannot update more than 100 assets at once");
    }

    // Validate update data
    validateAssetData(updateData);

    await connectToDB();

    // Ensure all assets belong to the user
    const userAssets = await Asset.find({
      _id: { $in: assetIds },
      userId,
    });

    if (userAssets.length !== assetIds.length) {
      throw new Error("Some assets not found or unauthorized");
    }

    // Sanitize update data
    const sanitizedUpdateData: Record<string, unknown> = {};
    if (updateData.name !== undefined)
      sanitizedUpdateData.name = updateData.name.trim();
    if (updateData.category !== undefined)
      sanitizedUpdateData.category = updateData.category.trim();
    if (updateData.institution !== undefined)
      sanitizedUpdateData.institution = updateData.institution?.trim();
    if (updateData.accountNumber !== undefined)
      sanitizedUpdateData.accountNumber = updateData.accountNumber?.trim();
    if (updateData.notes !== undefined)
      sanitizedUpdateData.notes = updateData.notes?.trim();
    if (updateData.value !== undefined)
      sanitizedUpdateData.value = updateData.value;
    if (updateData.currency !== undefined)
      sanitizedUpdateData.currency = updateData.currency;
    if (updateData.purchaseDate !== undefined)
      sanitizedUpdateData.purchaseDate = updateData.purchaseDate;
    if (updateData.currentValue !== undefined)
      sanitizedUpdateData.currentValue = updateData.currentValue;
    if (updateData.changeAmount !== undefined)
      sanitizedUpdateData.changeAmount = updateData.changeAmount;
    if (updateData.changePercentage !== undefined)
      sanitizedUpdateData.changePercentage = updateData.changePercentage;
    if (updateData.isActive !== undefined)
      sanitizedUpdateData.isActive = updateData.isActive;

    const result = await Asset.updateMany(
      {
        _id: { $in: assetIds },
        userId,
      },
      sanitizedUpdateData
    );

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    return {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  } catch (error) {
    console.error("Error bulk updating assets:", error);
    handleError(error);
    throw error;
  }
}

// Update asset value and create history record
export async function updateAssetValue(params: UpdateAssetValueParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    const { assetId, newValue, timestamp } = params;

    if (
      !assetId ||
      typeof assetId !== "string" ||
      assetId.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    if (typeof newValue !== "number" || newValue < 0) {
      throw new Error("New value must be a non-negative number");
    }

    if (newValue > 999999999) {
      throw new Error("New value cannot exceed 999,999,999");
    }

    // Use the new net worth service to update the value
    const result = await updateItemValue(userId, {
      itemId: assetId.trim(),
      itemType: "ASSET",
      newValue,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    revalidatePath("/assets");
    revalidatePath("/dashboard");

    return { success: true, message: "Asset value updated successfully" };
  } catch (error) {
    console.error("Error updating asset value:", error);
    handleError(error);
    throw error;
  }
}

// Get asset value history
export async function getAssetValueHistory(
  assetId: string,
  limit: number = 50
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    if (
      !assetId ||
      typeof assetId !== "string" ||
      assetId.trim().length === 0
    ) {
      throw new Error("Invalid asset ID provided");
    }

    if (typeof limit !== "number" || limit < 1 || limit > 100) {
      throw new Error("Limit must be a number between 1 and 100");
    }

    await connectToDB();

    // Get the asset to ensure user owns it
    const asset = await Asset.findOne({
      _id: assetId.trim(),
      userId,
    });

    if (!asset) {
      throw new Error("Asset not found or unauthorized");
    }

    // Get value history from the ValueHistory collection
    const valueHistory = await ValueHistory.find({
      userId,
      itemId: assetId.trim(),
      itemType: "ASSET",
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return valueHistory.map((entry) => ({
      id: (entry as { _id: unknown })._id?.toString() || "",
      userId: entry.userId,
      itemId: entry.itemId,
      itemType: entry.itemType,
      value: entry.value,
      timestamp: entry.timestamp.toISOString(),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching asset value history:", error);
    handleError(error);
    throw error;
  }
}
