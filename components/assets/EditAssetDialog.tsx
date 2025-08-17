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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Asset } from "@/lib/types";
import { getCategoriesByType } from "@/constants";
import { X } from "lucide-react";

interface EditAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
}

export function EditAssetDialog({
  asset,
  isOpen,
  onClose,
  onSave,
}: EditAssetDialogProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get asset categories
  const assetCategories = getCategoriesByType("assets");

  // Initialize form data when asset changes
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        value: asset.value,
        currency: asset.currency,
        institution: asset.institution || "",
        accountNumber: asset.accountNumber || "",
        purchaseDate: asset.purchaseDate || "",
        currentValue: asset.currentValue || asset.value,
        changeAmount: asset.changeAmount || 0,
        changePercentage: asset.changePercentage || 0,
        notes: asset.notes || "",
        isActive: asset.isActive,
      });
      setErrors({});
    }
  }, [asset]);

  // Handle form field changes
  const handleInputChange = (
    field: keyof Asset,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Asset name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    // Validate current value if provided
    if (formData.currentValue !== undefined && formData.currentValue < 0) {
      newErrors.currentValue = "Current value cannot be negative";
    }

    // Validate change amount if provided
    if (
      formData.changeAmount !== undefined &&
      formData.changeAmount < 0 &&
      formData.value &&
      formData.currentValue
    ) {
      const maxLoss = formData.value;
      if (Math.abs(formData.changeAmount) > maxLoss) {
        newErrors.changeAmount = "Loss cannot exceed original value";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !asset) return;

    const updatedAsset: Asset = {
      ...asset,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedAsset);
  };

  // Handle close
  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update the details for &ldquo;{asset.name}&rdquo;
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter asset name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Original Value */}
              <div className="space-y-2">
                <Label htmlFor="value">Original Value *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value || ""}
                  onChange={(e) =>
                    handleInputChange("value", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className={errors.value ? "border-red-500" : ""}
                />
                {errors.value && (
                  <p className="text-sm text-red-500">{errors.value}</p>
                )}
              </div>

              {/* Current Value */}
              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentValue || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "currentValue",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className={errors.currentValue ? "border-red-500" : ""}
                />
                {errors.currentValue && (
                  <p className="text-sm text-red-500">{errors.currentValue}</p>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={formData.currency || ""}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger
                    className={errors.currency ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500">{errors.currency}</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Tracking */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Tracking</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Change Amount */}
              <div className="space-y-2">
                <Label htmlFor="changeAmount">Change Amount</Label>
                <Input
                  id="changeAmount"
                  type="number"
                  step="0.01"
                  value={formData.changeAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "changeAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className={errors.changeAmount ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Positive for gains, negative for losses
                </p>
                {errors.changeAmount && (
                  <p className="text-sm text-red-500">{errors.changeAmount}</p>
                )}
              </div>

              {/* Change Percentage */}
              <div className="space-y-2">
                <Label htmlFor="changePercentage">Change Percentage</Label>
                <Input
                  id="changePercentage"
                  type="number"
                  step="0.01"
                  value={formData.changePercentage || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "changePercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage change (e.g., 5.2 for 5.2%)
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution || ""}
                  onChange={(e) =>
                    handleInputChange("institution", e.target.value)
                  }
                  placeholder="Bank, company, etc."
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber || ""}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  placeholder="Account or reference number"
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate || ""}
                onChange={(e) =>
                  handleInputChange("purchaseDate", e.target.value)
                }
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this asset..."
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive">Asset is active</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="button-blue-bg">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
