import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Asset } from "@/database/models/asset.model";

// GET /api/assets/stats - Get asset statistics for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const category = searchParams.get("category");
    const timeRange = searchParams.get("timeRange") || "all"; // all, 1y, 6m, 3m, 1m

    // Build base match criteria
    const baseMatch: Record<string, unknown> = { userId };
    if (!includeInactive) {
      baseMatch.isActive = true;
    }
    if (category && category !== "all") {
      baseMatch.category = category;
    }

    // Add time range filtering
    if (timeRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case "1y":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case "6m":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "3m":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "1m":
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      baseMatch.createdAt = { $gte: startDate };
    }

    // Get basic statistics
    const stats = await Asset.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalAssets: { $sum: 1 },
          totalValue: { $sum: "$value" },
          totalCurrentValue: { $sum: "$currentValue" },
          averageValue: { $avg: "$value" },
          averageCurrentValue: { $avg: "$currentValue" },
          minValue: { $min: "$value" },
          maxValue: { $max: "$value" },
          categoryCount: { $addToSet: "$category" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAssets: 1,
          totalValue: 1,
          totalCurrentValue: 1,
          averageValue: 1,
          averageCurrentValue: 1,
          minValue: 1,
          maxValue: 1,
          uniqueCategories: { $size: "$categoryCount" },
        },
      },
    ]);

    // Get category breakdown with enhanced metrics
    const categoryBreakdown = await Asset.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
          totalCurrentValue: { $sum: "$currentValue" },
          averageValue: { $avg: "$value" },
          averageCurrentValue: { $avg: "$currentValue" },
          totalChangeAmount: { $sum: "$changeAmount" },
          totalChangePercentage: { $avg: "$changePercentage" },
        },
      },
      {
        $addFields: {
          totalReturn: { $subtract: ["$totalCurrentValue", "$totalValue"] },
          returnPercentage: {
            $cond: [
              { $eq: ["$totalValue", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$totalCurrentValue", "$totalValue"] }, "$totalValue"] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { totalCurrentValue: -1 },
      },
    ]);

    // Get performance metrics
    const performanceMetrics = await Asset.aggregate([
      { $match: baseMatch },
      {
        $addFields: {
          returnAmount: { $subtract: ["$currentValue", "$value"] },
          returnPercentage: {
            $cond: [
              { $eq: ["$value", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$currentValue", "$value"] }, "$value"] }, 100] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalReturn: { $sum: "$returnAmount" },
          averageReturn: { $avg: "$returnAmount" },
          totalReturnPercentage: { $avg: "$returnPercentage" },
          positiveReturns: { $sum: { $cond: [{ $gt: ["$returnAmount", 0] }, 1, 0] } },
          negativeReturns: { $sum: { $cond: [{ $lt: ["$returnAmount", 0] }, 1, 0] } },
          neutralReturns: { $sum: { $cond: [{ $eq: ["$returnAmount", 0] }, 1, 0] } },
        },
      },
    ]);

    // Get recent assets with change tracking
    const recentAssets = await Asset.find(baseMatch)
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean()
      .select('name category value currentValue changeAmount changePercentage updatedAt');

    // Get top performing assets
    const topPerformers = await Asset.aggregate([
      { $match: baseMatch },
      {
        $addFields: {
          returnPercentage: {
            $cond: [
              { $eq: ["$value", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$currentValue", "$value"] }, "$value"] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { returnPercentage: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          category: 1,
          value: 1,
          currentValue: 1,
          returnPercentage: 1,
          changeAmount: 1,
        },
      },
    ]);

    // Get worst performing assets
    const worstPerformers = await Asset.aggregate([
      { $match: baseMatch },
      {
        $addFields: {
          returnPercentage: {
            $cond: [
              { $eq: ["$value", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$currentValue", "$value"] }, "$value"] }, 100] }
            ]
          }
        }
      },
      {
        $sort: { returnPercentage: 1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          category: 1,
          value: 1,
          currentValue: 1,
          returnPercentage: 1,
          changeAmount: 1,
        },
      },
    ]);

    // Calculate summary metrics
    const baseStats = stats[0] || {
      totalAssets: 0,
      totalValue: 0,
      totalCurrentValue: 0,
      averageValue: 0,
      averageCurrentValue: 0,
      minValue: 0,
      maxValue: 0,
      uniqueCategories: 0,
    };

    const performance = performanceMetrics[0] || {
      totalReturn: 0,
      averageReturn: 0,
      totalReturnPercentage: 0,
      positiveReturns: 0,
      negativeReturns: 0,
      neutralReturns: 0,
    };

    const result = {
      summary: {
        ...baseStats,
        totalReturn: performance.totalReturn,
        totalReturnPercentage: performance.totalReturnPercentage,
        netWorth: baseStats.totalCurrentValue,
        assetDiversity: baseStats.uniqueCategories,
      },
      performance: {
        ...performance,
        returnRate: baseStats.totalValue > 0 ? (performance.totalReturn / baseStats.totalValue) * 100 : 0,
        positiveReturnRate: baseStats.totalAssets > 0 ? (performance.positiveReturns / baseStats.totalAssets) * 100 : 0,
        negativeReturnRate: baseStats.totalAssets > 0 ? (performance.negativeReturns / baseStats.totalAssets) * 100 : 0,
      },
      categoryBreakdown,
      recentAssets,
      topPerformers,
      worstPerformers,
      filters: {
        includeInactive,
        category: category || "all",
        timeRange,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching asset stats:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized: User not authenticated" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
