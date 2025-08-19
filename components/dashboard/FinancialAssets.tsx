"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoveRight,
  Building2,
  TrendingUp,
  Home,
  PiggyBank,
  Car,
  Gem,
  Coins,
  Wallet,
} from "lucide-react";

// Asset data structure
interface Asset {
  id: string;
  name: string;
  category: string;
  value: number;
  currentValue: number;
  changeAmount: number;
  changePercentage: number;
  institution?: string;
  currency: string;
}

// Icon mapping for different asset categories
const getAssetIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "savings account":
    case "checking account":
      return Building2;
    case "investment account":
    case "retirement account":
      return TrendingUp;
    case "real estate":
    case "property":
      return Home;
    case "vehicle":
    case "car":
      return Car;
    case "jewelry":
      return Gem;
    case "cryptocurrency":
      return Coins;
    case "emergency fund":
      return PiggyBank;
    default:
      return Wallet;
  }
};

interface FinancialAssetsProps {
  isLoading?: boolean;
  assets?: Asset[];
  totalAssets?: number;
}

export function FinancialAssets({
  isLoading = false,
  assets = [],
  totalAssets = 0,
}: FinancialAssetsProps) {
  // Calculate total change amount and percentage
  const totalChangeAmount = assets.reduce(
    (sum, asset) => sum + (asset.changeAmount || 0),
    0
  );
  const totalChangePercentage =
    totalAssets > 0 ? (totalChangeAmount / totalAssets) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="container-color h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-end justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Total Assets Summary */}
          <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll mb-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-28 mb-3" />
            {/* Mapped Assets */}
            <ul className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[280px] overflow-y-auto category-breakdown-scroll space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-neutral-900 dark:border-sky-900/50"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="container-color h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="card-title">Financial Assets</CardTitle>
            <CardDescription>
              Track your individual financial assets and investments
            </CardDescription>
          </div>
          <Button className="button-blue-bg">
            Assets
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Total Assets Summary */}
        <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Total Assets
            </span>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              ${totalAssets.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              This month
            </span>
            <span
              className={`text-sm font-medium ${
                totalChangeAmount >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {totalChangeAmount >= 0 ? "+" : ""}$
              {totalChangeAmount.toLocaleString()} (
              {totalChangePercentage >= 0 ? "+" : ""}
              {totalChangePercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Individual Assets
          </h3>

          {assets.length > 0 ? (
            <ul className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[280px] overflow-y-auto category-breakdown-scroll space-y-3">
              {assets.map((asset) => {
                const IconComponent = getAssetIcon(asset.category);
                const isPositive = (asset.changeAmount || 0) >= 0;

                return (
                  <li
                    key={asset.id}
                    className={`flex items-center justify-between p-3 rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 transition-colors dark:from-sky-950/50 dark:to-cyan-950/50 dark:border-sky-900/50 dark:hover:from-sky-900/50 dark:hover:to-cyan-950/50`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 dark:bg-sky-900/20`}
                      >
                        <IconComponent className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-sky-900 dark:text-gray-100">
                          {asset.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {asset.institution || asset.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold text-sky-800`}>
                        ${(asset.currentValue || asset.value).toLocaleString()}
                      </div>
                      <div
                        className={`text-xs ${
                          isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {asset.changePercentage?.toFixed(1) || "0.0"}%
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-8 text-center">
              <div className="text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium mb-1">No assets found</p>
                <p className="text-xs">
                  Add your first financial asset to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
