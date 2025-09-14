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

import { Liability } from "@/lib/types";
import {
  updateLiabilityAmount,
  deleteLiability,
} from "@/lib/actions/liability.actions";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

interface UpdateLiabilityAmountDialogProps {
  liability: Liability | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateLiabilityAmountDialog({
  liability,
  isOpen,
  onClose,
  onSuccess,
}: UpdateLiabilityAmountDialogProps) {
  const [formData, setFormData] = useState({
    newAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form data when liability changes
  useEffect(() => {
    if (liability) {
      const currentAmount = liability.currentValue;
      setFormData({
        newAmount: currentAmount.toString(),
      });
    }
  }, [liability]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        newAmount: "",
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

    // Validate new amount
    const newAmountNum = parseFloat(formData.newAmount);
    if (!formData.newAmount.trim()) {
      newErrors.newAmount = "New amount is required";
    } else if (isNaN(newAmountNum) || newAmountNum < 0) {
      newErrors.newAmount = "New amount must be a non-negative number";
    } else if (newAmountNum > 999999999) {
      newErrors.newAmount = "New amount cannot exceed 999,999,999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !liability) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newAmount = parseFloat(formData.newAmount);

      await updateLiabilityAmount({
        liabilityId: liability.id,
        newAmount,
      });

      // If the new amount is zero, delete the liability and notify the user
      if (newAmount === 0) {
        await deleteLiability(liability.id);
        toast({
          title: "Liability removed",
          description: `${liability.name} has been fully paid off and deleted`,
        });
      } else {
        toast({
          title: "Success",
          description: "Liability amount updated successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update liability amount. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "AUD"): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChangePreview = () => {
    if (!liability || !formData.newAmount.trim()) {
      return null;
    }

    const currentAmount = liability.currentValue;
    const newAmount = parseFloat(formData.newAmount);

    if (isNaN(newAmount)) {
      return null;
    }

    const changeAmount = newAmount - currentAmount;
    const changePercentage =
      currentAmount > 0 ? (changeAmount / currentAmount) * 100 : 0;

    const isIncrease = changeAmount > 0;
    const isDecrease = changeAmount < 0;

    return (
      <div className="p-3 bg-muted rounded-lg">
        <Label className="text-sm font-medium text-muted-foreground">
          Change Preview
        </Label>
        <div className="flex items-center space-x-2 mt-1">
          {isIncrease ? (
            <TrendingUp className="h-4 w-4 text-red-600" />
          ) : isDecrease ? (
            <TrendingDown className="h-4 w-4 text-green-600" />
          ) : null}
          <span
            className={`text-sm font-medium ${
              isIncrease
                ? "text-red-600"
                : isDecrease
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          >
            {changeAmount >= 0 ? "+" : ""}
            {formatCurrency(changeAmount, liability.currency)} (
            {changePercentage >= 0 ? "+" : ""}
            {changePercentage.toFixed(2)}%)
          </span>
        </div>
      </div>
    );
  };

  if (!liability) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Update Liability Amount</span>
          </DialogTitle>
          <DialogDescription>
            Update the current amount of &quot;{liability.name}&quot;. The
            change will be recorded with the current timestamp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Amount Display */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm font-medium text-muted-foreground">
              Current Amount
            </Label>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(liability.currentValue, liability.currency)}
            </div>
          </div>

          {/* New Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="newAmount">New Amount</Label>
            <Input
              id="newAmount"
              type="number"
              step="0.01"
              min="0"
              max="999999999"
              value={formData.newAmount}
              onChange={(e) => handleInputChange("newAmount", e.target.value)}
              placeholder="Enter new amount"
              className={errors.newAmount ? "border-red-500" : ""}
            />
            {errors.newAmount && (
              <p className="text-sm text-red-500">{errors.newAmount}</p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Amount"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
