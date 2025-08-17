"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Asset } from "@/lib/types";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/lib/chartUtils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Target,
  Home,
  Car,
  Gem,
  Plus,
} from "lucide-react";

interface AssetInsightsProps {
  assets: Asset[];
  isLoading?: boolean;
}

export function AssetInsights({
  assets,
  isLoading = false,
}: AssetInsightsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="container-color">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <Card className="container-color">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">
            No assets available for insights
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals and statistics
  const totalValue = assets.reduce(
    (sum, asset) => sum + (asset.currentValue || asset.value),
    0
  );
  const totalChange = assets.reduce(
    (sum, asset) => sum + (asset.changeAmount || 0),
    0
  );
  const totalChangePercentage =
    totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

  // Group assets by category
  const categoryBreakdown = assets.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        count: 0,
        assets: [],
      };
    }
    acc[category].total += asset.currentValue || asset.value;
    acc[category].count += 1;
    acc[category].assets.push(asset);
    return acc;
  }, {} as Record<string, { total: number; count: number; assets: Asset[] }>);

  // Prepare data for donut chart
  const chartData = Object.entries(categoryBreakdown).map(
    ([category, data]) => ({
      name: category,
      value: data.total,
      color: getCategoryColor(category),
    })
  );

  // Top performing assets
  const topPerformers = assets
    .filter((asset) => asset.changeAmount && asset.changeAmount > 0)
    .sort((a, b) => (b.changeAmount || 0) - (a.changeAmount || 0))
    .slice(0, 3);

  // Assets with losses
  const losingAssets = assets
    .filter((asset) => asset.changeAmount && asset.changeAmount < 0)
    .sort((a, b) => (a.changeAmount || 0) - (b.changeAmount || 0))
    .slice(0, 3);

  // Asset distribution by type
  const assetTypes = {
    "Cash & Savings": assets.filter((a) =>
      ["Cash", "Checking Account", "Savings Account"].includes(a.category)
    ).length,
    Investments: assets.filter((a) =>
      ["Investment Account", "Retirement Account", "Cryptocurrency"].includes(
        a.category
      )
    ).length,
    "Real Estate": assets.filter((a) => ["Real Estate"].includes(a.category))
      .length,
    Vehicles: assets.filter((a) => ["Vehicle"].includes(a.category)).length,
    Collectibles: assets.filter((a) =>
      ["Jewelry", "Collectibles", "Art", "Precious Metals"].includes(a.category)
    ).length,
    Other: assets.filter((a) =>
      ["Business", "Other Assets"].includes(a.category)
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <Card className="container-color">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {assets.length} assets
            </p>
          </CardContent>
        </Card>

        {/* Total Change */}
        <Card className="container-color">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Change</CardTitle>
            {totalChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalChange >= 0 ? "+" : ""}
              {formatCurrency(totalChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalChangePercentage >= 0 ? "+" : ""}
              {totalChangePercentage.toFixed(1)}% overall
            </p>
          </CardContent>
        </Card>

        {/* Active Assets */}
        <Card className="container-color">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter((a) => a.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {assets.length} total
            </p>
          </CardContent>
        </Card>

        {/* Average Value */}
        <Card className="container-color">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue / assets.length)}
            </div>
            <p className="text-xs text-muted-foreground">per asset</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <Card className="container-color">
          <CardHeader>
            <CardTitle>Asset Distribution by Category</CardTitle>
            <CardDescription>
              Breakdown of your assets by financial category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutChart
                data={chartData}
                category="name"
                value="value"
                colors={[
                  "sky",
                  "blue",
                  "emerald",
                  "violet",
                  "amber",
                  "cyan",
                  "pink",
                  "lime",
                ]}
              />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(categoryBreakdown).map(([category, data]) => (
                <div
                  key={category}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getCategoryColorClass(
                        category
                      )}`}
                    />
                    <span>{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {formatCurrency(data.total)}
                    </span>
                    <span className="text-muted-foreground">
                      ({data.count})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Stacked Performance Cards */}
        <div className="flex flex-col h-full space-y-6">
          {/* Top Performers */}
          <Card className="container-color flex-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Top Performing Assets</span>
              </CardTitle>
              <CardDescription>Assets with the highest gains</CardDescription>
            </CardHeader>
            <CardContent>
              {topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          +{formatCurrency(asset.changeAmount || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          +{asset.changePercentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No gains to display
                </p>
              )}
            </CardContent>
          </Card>

          {/* Assets with Losses */}
          <Card className="container-color flex-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>Assets with Losses</span>
              </CardTitle>
              <CardDescription>
                Assets that have decreased in value
              </CardDescription>
            </CardHeader>
            <CardContent>
              {losingAssets.length > 0 ? (
                <div className="space-y-3">
                  {losingAssets.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-red-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-red-600">
                          {formatCurrency(asset.changeAmount || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {asset.changePercentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No losses to display
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Asset Type Distribution - Full Width Below */}
      <Card className="container-color">
        <CardHeader>
          <CardTitle>Asset Type Distribution</CardTitle>
          <CardDescription>Count of assets by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(assetTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(type)}
                  <span className="text-sm">{type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / assets.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get category colors
function getCategoryColor(category: string): string {
  const colors = {
    Cash: "emerald",
    "Checking Account": "blue",
    "Savings Account": "violet",
    "Investment Account": "amber",
    "Retirement Account": "red",
    "Real Estate": "cyan",
    Vehicle: "lime",
    Jewelry: "orange",
    Collectibles: "pink",
    Business: "indigo",
    Cryptocurrency: "amber",
    "Precious Metals": "amber",
    Art: "violet",
    "Other Assets": "gray",
  };

  return colors[category as keyof typeof colors] || "gray";
}

// Helper function to get category color classes for Tailwind
function getCategoryColorClass(category: string): string {
  const colorClasses = {
    Cash: "bg-emerald-500",
    "Checking Account": "bg-blue-500",
    "Savings Account": "bg-violet-500",
    "Investment Account": "bg-amber-500",
    "Retirement Account": "bg-red-500",
    "Real Estate": "bg-cyan-500",
    Vehicle: "bg-lime-500",
    Jewelry: "bg-orange-500",
    Collectibles: "bg-pink-500",
    Business: "bg-indigo-500",
    Cryptocurrency: "bg-amber-500",
    "Precious Metals": "bg-amber-500",
    Art: "bg-violet-500",
    "Other Assets": "bg-gray-500",
  };

  return colorClasses[category as keyof typeof colorClasses] || "bg-gray-500";
}

// Helper function to get type icons
function getTypeIcon(type: string) {
  const icons = {
    "Cash & Savings": <DollarSign className="h-4 w-4 text-green-600" />,
    Investments: <TrendingUp className="h-4 w-4 text-blue-600" />,
    "Real Estate": <Home className="h-4 w-4 text-cyan-600" />,
    Vehicles: <Car className="h-4 w-4 text-lime-600" />,
    Collectibles: <Gem className="h-4 w-4 text-pink-600" />,
    Other: <Plus className="h-4 w-4 text-gray-600" />,
  };

  return (
    icons[type as keyof typeof icons] || (
      <Plus className="h-4 w-4 text-gray-600" />
    )
  );
}
