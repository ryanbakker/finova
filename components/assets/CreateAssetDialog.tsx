"use client";

import { useState } from "react";
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
import { getCategoriesByType } from "@/constants";
import { createAsset } from "@/lib/actions/asset.actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CreateAssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAssetDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateAssetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    value: "",
    currency: "USD",
    institution: "",
    accountNumber: "",
    purchaseDate: "",
    currentValue: "",
    changeAmount: "",
    changePercentage: "",
    notes: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Get asset categories
  const assetCategories = getCategoriesByType("assets");

  // Handle form field changes
  const handleInputChange = (
    field: keyof typeof formData,
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

    if (!formData.name.trim()) {
      newErrors.name = "Asset name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    // Validate current value if provided
    if (formData.currentValue && parseFloat(formData.currentValue) < 0) {
      newErrors.currentValue = "Current value cannot be negative";
    }

    // Validate change amount if provided
    if (formData.changeAmount && parseFloat(formData.changeAmount) < 0) {
      newErrors.changeAmount = "Change amount cannot be negative";
    }

    // Validate change percentage if provided
    if (formData.changePercentage && parseFloat(formData.changePercentage) < -100) {
      newErrors.changePercentage = "Change percentage cannot be less than -100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const assetData = {
        name: formData.name.trim(),
        category: formData.category,
        value: parseFloat(formData.value),
        currency: formData.currency,
        institution: formData.institution.trim() || undefined,
        accountNumber: formData.accountNumber.trim() || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        changeAmount: formData.changeAmount ? parseFloat(formData.changeAmount) : 0,
        changePercentage: formData.changePercentage ? parseFloat(formData.changePercentage) : 0,
        notes: formData.notes.trim() || undefined,
        isActive: formData.isActive,
      };

      await createAsset(assetData);

      toast({
        title: "Success",
        description: "Asset created successfully",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        category: "",
        value: "",
        currency: "USD",
        institution: "",
        accountNumber: "",
        purchaseDate: "",
        currentValue: "",
        changeAmount: "",
        changePercentage: "",
        notes: "",
        isActive: true,
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog opens/closes
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        category: "",
        value: "",
        currency: "USD",
        institution: "",
        accountNumber: "",
        purchaseDate: "",
        currentValue: "",
        changeAmount: "",
        changePercentage: "",
        notes: "",
        isActive: true,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Asset</DialogTitle>
          <DialogDescription>
            Add a new financial asset to your portfolio. Fill in the required fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Tesla Stock, House, 401k"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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

          {/* Value Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                placeholder="0.00"
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.currentValue}
                onChange={(e) => handleInputChange("currentValue", e.target.value)}
                placeholder="Auto-filled"
                className={errors.currentValue ? "border-red-500" : ""}
              />
              {errors.currentValue && (
                <p className="text-sm text-red-500">{errors.currentValue}</p>
              )}
            </div>
          </div>

          {/* Change Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="changeAmount">Change Amount</Label>
              <Input
                id="changeAmount"
                type="number"
                step="0.01"
                value={formData.changeAmount}
                onChange={(e) => handleInputChange("changeAmount", e.target.value)}
                placeholder="0.00"
                className={errors.changeAmount ? "border-red-500" : ""}
              />
              {errors.changeAmount && (
                <p className="text-sm text-red-500">{errors.changeAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="changePercentage">Change Percentage (%)</Label>
              <Input
                id="changePercentage"
                type="number"
                step="0.01"
                min="-100"
                value={formData.changePercentage}
                onChange={(e) => handleInputChange("changePercentage", e.target.value)}
                placeholder="0.00"
                className={errors.changePercentage ? "border-red-500" : ""}
              />
              {errors.changePercentage && (
                <p className="text-sm text-red-500">{errors.changePercentage}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="e.g., Bank of America, Vanguard"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="Last 4 digits only"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional details about this asset..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleInputChange("isActive", checked as boolean)
              }
            />
            <Label htmlFor="isActive" className="text-sm">
              Asset is active and should be included in calculations
            </Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Asset"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
