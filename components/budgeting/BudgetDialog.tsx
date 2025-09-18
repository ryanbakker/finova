"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/lib/types";
import {
  getCategoriesByType,
  getCategoriesWithIcons,
  getCategoryIcon,
} from "@/lib/categories";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
  onSave: (
    budget: Omit<Budget, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

export function BudgetDialog({
  open,
  onOpenChange,
  budget,
  onSave,
}: BudgetDialogProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || "",
    amount: budget?.amount || 0,
    spent: budget?.spent || 0,
    currency: budget?.currency || "USD",
    period: budget?.period || "monthly",
    startDate: budget?.startDate || new Date().toISOString().split("T")[0],
    endDate: budget?.endDate || new Date().toISOString().split("T")[0],
    isActive: budget?.isActive ?? true,
  });

  const budgetCategories = getCategoriesWithIcons("budgets");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const budgetData = {
        ...formData,
        category: {
          name:
            typeof formData.category === "string"
              ? formData.category
              : formData.category?.name || "",
          icon:
            typeof formData.category === "string"
              ? getCategoriesByType("budgets").find(
                  (cat) => cat.name === formData.category
                )?.icon || "Plus"
              : formData.category?.icon || "Plus",
        },
      };
      await onSave(budgetData);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save budget",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Edit Budget" : "Create New Budget"}
          </DialogTitle>
          <DialogDescription>
            {budget
              ? "Update your budget settings and amounts."
              : "Set up a new budget category with spending limits."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={
                typeof formData.category === "string"
                  ? formData.category
                  : formData.category?.name || ""
              }
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {budgetCategories.map((category) => {
                  const Icon = category.iconComponent;
                  return (
                    <SelectItem key={category.name} value={category.name}>
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  handleInputChange("amount", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spent">Amount Spent</Label>
              <Input
                id="spent"
                type="number"
                min="0"
                step="0.01"
                value={formData.spent}
                onChange={(e) =>
                  handleInputChange("spent", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value) => handleInputChange("period", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                value={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onChange={(date) =>
                  handleInputChange(
                    "startDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onChange={(date) =>
                  handleInputChange(
                    "endDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                placeholder="Select end date"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse md:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {budget ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
