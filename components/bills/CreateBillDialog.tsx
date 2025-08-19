"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createBill } from "@/lib/actions/bill.actions";
import { Plus, DollarSign, Calendar, FileText } from "lucide-react";
import { getCategoriesByType } from "@/constants";
import { toast } from "@/components/ui/use-toast";

interface CreateBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBillDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateBillDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    isRecurring: false,
    frequency: "monthly" as const,
    accountId: "",
    accountName: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.amount ||
      !formData.dueDate ||
      !formData.category
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createBill({
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate),
        category: formData.category,
        isRecurring: formData.isRecurring,
        frequency: formData.isRecurring ? formData.frequency : undefined,
        accountId: formData.accountId || undefined,
        accountName: formData.accountName || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Success",
        description: "Bill created successfully!",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        category: "",
        isRecurring: false,
        frequency: "monthly",
        accountId: "",
        accountName: "",
        notes: "",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating bill:", error);
      toast({
        title: "Error",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        category: "",
        isRecurring: false,
        frequency: "monthly",
        accountId: "",
        accountName: "",
        notes: "",
      });
      onClose();
    }
  };

  const categories = getCategoriesByType("bills");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Bill</span>
          </DialogTitle>
          <DialogDescription>
            Create a new recurring or one-time bill
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bill Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Rent, Car Insurance"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurring */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) =>
                handleInputChange("isRecurring", checked as boolean)
              }
            />
            <Label htmlFor="isRecurring">Recurring bill</Label>
          </div>

          {/* Frequency (only show if recurring) */}
          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  handleInputChange(
                    "frequency",
                    value as "monthly" | "quarterly" | "yearly" | "weekly"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Account */}
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name (Optional)</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) => handleInputChange("accountName", e.target.value)}
              placeholder="e.g., Chase Checking"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this bill"
                className="pl-10"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Bill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
