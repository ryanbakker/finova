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
import { FinancialGoal } from "@/lib/types";
import { getCategoriesByType } from "@/constants";
import { X } from "lucide-react";

interface EditGoalDialogProps {
  goal: FinancialGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: FinancialGoal) => void;
}

export function EditGoalDialog({
  goal,
  isOpen,
  onClose,
  onSave,
}: EditGoalDialogProps) {
  const [formData, setFormData] = useState<Partial<FinancialGoal>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get goal categories
  const goalCategories = getCategoriesByType("goals");

  // Initialize form data when goal changes
  useEffect(() => {
    if (goal) {
      // Editing existing goal
      setFormData({
        name: goal.name,
        category: goal.category,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        currency: goal.currency,
        targetDate: goal.targetDate,
        priority: goal.priority,
        status: goal.status,
        notes: goal.notes || "",
        isActive: goal.isActive,
      });
    } else {
      // Creating new goal - set defaults
      setFormData({
        name: "",
        category: "",
        targetAmount: 0,
        currentAmount: 0,
        currency: "AUD",
        targetDate: "",
        priority: "medium",
        status: "active",
        notes: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [goal]);

  // Handle form field changes
  const handleInputChange = (
    field: keyof FinancialGoal,
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
      newErrors.name = "Goal name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }

    if (formData.currentAmount && formData.currentAmount < 0) {
      newErrors.currentAmount = "Current amount cannot be negative";
    }

    if (
      formData.currentAmount &&
      formData.targetAmount &&
      formData.currentAmount > formData.targetAmount
    ) {
      newErrors.currentAmount = "Current amount cannot exceed target amount";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Target date is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (goal) {
      // Editing existing goal
      const updatedGoal: FinancialGoal = {
        ...goal,
        ...formData,
        updatedAt: new Date().toISOString(),
      } as FinancialGoal;

      onSave(updatedGoal);
    } else {
      // Creating new goal
      const newGoal: FinancialGoal = {
        id: `goal-${Date.now()}`,
        name: formData.name || "",
        category: formData.category || "",
        targetAmount: formData.targetAmount || 0,
        currentAmount: formData.currentAmount || 0,
        currency: formData.currency || "AUD",
        targetDate: formData.targetDate || "",
        priority: formData.priority || "medium",
        status: formData.status || "active",
        notes: formData.notes || "",
        isActive: formData.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as FinancialGoal;

      onSave(newGoal);
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Edit Financial Goal" : "Create Financial Goal"}
          </DialogTitle>
          <DialogDescription>
            {goal
              ? "Update your financial goal details"
              : "Set a new financial goal to track your progress"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Goal Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Emergency Fund, Vacation Savings"
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
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {goalCategories.map((category) => (
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

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any additional notes about your goal..."
                rows={3}
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.targetAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "targetAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className={errors.targetAmount ? "border-red-500" : ""}
                />
                {errors.targetAmount && (
                  <p className="text-sm text-red-500">{errors.targetAmount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentAmount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "currentAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className={errors.currentAmount ? "border-red-500" : ""}
                />
                {errors.currentAmount && (
                  <p className="text-sm text-red-500">{errors.currentAmount}</p>
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
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500">{errors.currency}</p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline & Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline & Priority</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate || ""}
                  onChange={(e) =>
                    handleInputChange("targetDate", e.target.value)
                  }
                  className={errors.targetDate ? "border-red-500" : ""}
                />
                {errors.targetDate && (
                  <p className="text-sm text-red-500">{errors.targetDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority || ""}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger
                    className={errors.priority ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-500">{errors.priority}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive !== false}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Active Goal</Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {goal ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
