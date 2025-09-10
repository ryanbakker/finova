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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Liability } from "@/lib/types";
import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  TrendingDown,
} from "lucide-react";

interface EditLiabilityDialogProps {
  liability: Liability | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (liability: Liability) => void;
}

const liabilityCategories = [
  "Mortgage",
  "Vehicle Loan",
  "Credit Card",
  "Personal Loan",
  "Education Loan",
  "Business Loan",
  "Line of Credit",
  "Other",
];

const currencies = ["AUD", "USD", "EUR", "GBP", "CAD", "JPY"];

export function EditLiabilityDialog({
  liability,
  isOpen,
  onClose,
  onSave,
}: EditLiabilityDialogProps) {
  const [formData, setFormData] = useState<Partial<Liability>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (liability) {
      setFormData({
        name: liability.name,
        category: liability.category,
        amount: liability.amount,
        currency: liability.currency,
        institution: liability.institution || "",
        isActive: liability.isActive,
      });
    }
    setErrors({});
  }, [liability]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !liability) return;

    const updatedLiability: Liability = {
      ...liability,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedLiability);
  };

  const handleInputChange = (
    field: keyof Liability,
    value: string | number | boolean
  ) => {
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

  const getLiabilityCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "mortgage":
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case "vehicle loan":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "credit card":
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case "personal loan":
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      case "education loan":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case "business loan":
        return <Building2 className="h-4 w-4 text-teal-600" />;
      case "line of credit":
        return <CreditCard className="h-4 w-4 text-pink-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!liability) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getLiabilityCategoryIcon(formData.category || liability.category)}
            <span>Edit Liability</span>
          </DialogTitle>
          <DialogDescription>
            Update the details of your liability
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter liability name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

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
                    {liabilityCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center space-x-2">
                          {getLiabilityCategoryIcon(category)}
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution || ""}
                  onChange={(e) =>
                    handleInputChange("institution", e.target.value)
                  }
                  placeholder="e.g., Bank name"
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Current Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    handleInputChange("amount", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

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
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500">{errors.currency}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Important Dates</h3>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked as boolean)
                }
              />
              <Label htmlFor="isActive">Active liability</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
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
