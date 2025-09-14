"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Asset } from "@/lib/types";
import { updateAssetValue } from "@/lib/actions/asset.actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

interface UpdateAssetValueDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateAssetValueDialog({
  asset,
  isOpen,
  onClose,
  onSuccess,
}: UpdateAssetValueDialogProps) {
  const [formData, setFormData] = useState({
    newValue: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form data when asset changes
  useEffect(() => {
    if (asset) {
      setFormData({
        newValue: asset.currentValue.toString(),
      });
    }
  }, [asset]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        newValue: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate new value
    const newValueNum = parseFloat(formData.newValue);
    if (!formData.newValue.trim()) {
      newErrors.newValue = "New value is required";
    } else if (isNaN(newValueNum) || newValueNum < 0) {
      newErrors.newValue = "New value must be a non-negative number";
    } else if (newValueNum > 999999999) {
      newErrors.newValue = "New value cannot exceed 999,999,999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!asset || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newValue = parseFloat(formData.newValue);
      const previousValue = asset.currentValue;

      await updateAssetValue({
        assetId: asset.id,
        newValue,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Asset value updated successfully",
        description: `Value changed from ${formatCurrency(
          previousValue,
          asset.currency
        )} to ${formatCurrency(newValue, asset.currency)}`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update asset value",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChangePreview = () => {
    if (!asset || !formData.newValue) return null;

    const newValueNum = parseFloat(formData.newValue);
    if (isNaN(newValueNum)) return null;

    const previousValue = asset.currentValue;
    const changeAmount = newValueNum - previousValue;
    const changePercentage =
      previousValue > 0 ? (changeAmount / previousValue) * 100 : 0;

    const isPositive = changeAmount >= 0;
    const isNeutral = changeAmount === 0;

    return (
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Change Preview:</span>
          <div className="flex items-center space-x-2">
            {!isNeutral &&
              (isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ))}
            <span
              className={`text-sm font-medium ${
                isNeutral
                  ? "text-muted-foreground"
                  : isPositive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(changeAmount, asset.currency)} (
              {isPositive ? "+" : ""}
              {changePercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          From {formatCurrency(previousValue, asset.currency)} to{" "}
          {formatCurrency(newValueNum, asset.currency)}
        </div>
      </div>
    );
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Update Asset Value</span>
          </DialogTitle>
          <DialogDescription>
            Update the current value of &quot;{asset.name}&quot;. The change
            will be recorded with the current timestamp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Value Display */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium text-muted-foreground">
              Current Value
            </Label>
            <div className="text-lg font-semibold">
              {formatCurrency(asset.currentValue, asset.currency)}
            </div>
          </div>

          {/* New Value Input */}
          <div className="space-y-2">
            <Label htmlFor="newValue">
              New Value <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                {asset.currency}
              </span>
              <Input
                id="newValue"
                type="number"
                step="0.01"
                min="0"
                max="999999999"
                value={formData.newValue}
                onChange={(e) => handleInputChange("newValue", e.target.value)}
                className={`pl-12 ${errors.newValue ? "border-red-500" : ""}`}
                placeholder="Enter new value"
                disabled={isSubmitting}
              />
            </div>
            {errors.newValue && (
              <p className="text-sm text-red-500">{errors.newValue}</p>
            )}
          </div>

          {/* Change Preview */}
          {getChangePreview()}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="button-blue-bg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Value"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
