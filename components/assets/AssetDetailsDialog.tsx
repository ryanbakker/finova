"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Asset } from "@/lib/types";
import { getAssetCategoryIcon } from "@/lib/utils/categoryUtils";
import {
  Calendar,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Edit,
} from "lucide-react";
import { formatCurrency } from "@/lib/chartUtils";

interface AssetDetailsDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get change display
const getChangeDisplay = (asset: Asset) => {
  if (!asset.changeAmount || !asset.changePercentage) {
    return {
      text: "No change data",
      icon: null,
      className: "text-muted-foreground",
    };
  }

  const isPositive = asset.changeAmount >= 0;
  const changeText = `${isPositive ? "+" : ""}${formatCurrency(
    asset.changeAmount,
    asset.currency
  )} (${isPositive ? "+" : ""}${asset.changePercentage}%)`;

  return {
    text: changeText,
    icon: isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ),
    className: isPositive ? "text-green-600" : "text-red-600",
  };
};

export function AssetDetailsDialog({
  asset,
  isOpen,
  onClose,
}: AssetDetailsDialogProps) {
  if (!asset) return null;

  const changeDisplay = getChangeDisplay(asset);
  const IconComponent = getAssetCategoryIcon(asset.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <DialogTitle className="text-xl">{asset.name}</DialogTitle>
              <DialogDescription className="text-base">
                {asset.category}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Value */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Current Value
              </h3>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  asset.currentValue || asset.value,
                  asset.currency
                )}
              </div>
              {asset.changeAmount !== undefined && (
                <div
                  className={`flex items-center space-x-2 text-sm ${changeDisplay.className}`}
                >
                  {changeDisplay.icon}
                  <span>{changeDisplay.text}</span>
                </div>
              )}
            </div>

            {/* Original Value */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Original Value
              </h3>
              <div className="text-xl font-semibold">
                {formatCurrency(asset.value, asset.currency)}
              </div>
              {asset.purchaseDate && (
                <div className="text-sm text-muted-foreground">
                  Purchased {formatDate(asset.purchaseDate)}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Asset Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asset Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution */}
              {asset.institution && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Institution</span>
                  </div>
                  <p className="text-sm">{asset.institution}</p>
                </div>
              )}

              {/* Account Number */}
              {asset.accountNumber && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Account Number</span>
                  </div>
                  <p className="text-sm font-mono">{asset.accountNumber}</p>
                </div>
              )}

              {/* Purchase Date */}
              {asset.purchaseDate && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Purchase Date</span>
                  </div>
                  <p className="text-sm">{formatDate(asset.purchaseDate)}</p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-1">
                <span className="text-sm font-medium">Status</span>
                <div>
                  <Badge
                    variant={asset.isActive ? "default" : "secondary"}
                    className={
                      asset.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }
                  >
                    {asset.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <span className="text-sm font-medium">Currency</span>
                <p className="text-sm">{asset.currency}</p>
              </div>

              {/* Created Date */}
              <div className="space-y-1">
                <span className="text-sm font-medium">Added</span>
                <p className="text-sm">{formatDate(asset.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {asset.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {asset.notes}
                </p>
              </div>
            </>
          )}

          {/* Performance Summary */}
          {asset.changeAmount !== undefined && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {asset.changeAmount >= 0 ? "+" : ""}
                      {formatCurrency(asset.changeAmount, asset.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Change
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div
                      className={`text-2xl font-bold ${
                        asset.changePercentage && asset.changePercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {asset.changePercentage && asset.changePercentage >= 0
                        ? "+"
                        : ""}
                      {asset.changePercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Percentage Change
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        asset.currentValue || asset.value,
                        asset.currency
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current Value
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="button-blue-bg">
            <Edit className="h-4 w-4 mr-2" />
            Edit Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
