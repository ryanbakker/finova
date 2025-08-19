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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createLiability } from "@/lib/actions/liability.actions";

const LIABILITY_CATEGORIES = [
  "Credit Card",
  "Student Loan",
  "Mortgage",
  "Car Loan",
  "Personal Loan",
  "Business Loan",
  "Medical Debt",
  "Tax Debt",
  "Other",
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY"];

interface CreateLiabilityFormData {
  name: string;
  category: string;
  amount: string;
  currency: string;
  institution: string;
  accountNumber: string;
  dueDate: string;
  interestRate: string;
  monthlyPayment: string;
  remainingBalance: string;
  originalAmount: string;
  notes: string;
}

const initialFormData: CreateLiabilityFormData = {
  name: "",
  category: "",
  amount: "",
  currency: "USD",
  institution: "",
  accountNumber: "",
  dueDate: "",
  interestRate: "",
  monthlyPayment: "",
  remainingBalance: "",
  originalAmount: "",
  notes: "",
};

interface CreateLiabilityDialogProps {
  onLiabilityCreated?: () => void;
}

export function CreateLiabilityDialog({ onLiabilityCreated }: CreateLiabilityDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLiabilityFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CreateLiabilityFormData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateLiabilityFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (formData.interestRate && (parseFloat(formData.interestRate) < 0 || parseFloat(formData.interestRate) > 100)) {
      newErrors.interestRate = "Interest rate must be between 0% and 100%";
    }

    if (formData.monthlyPayment && parseFloat(formData.monthlyPayment) < 0) {
      newErrors.monthlyPayment = "Monthly payment must be non-negative";
    }

    if (formData.remainingBalance && parseFloat(formData.remainingBalance) < 0) {
      newErrors.remainingBalance = "Remaining balance must be non-negative";
    }

    if (formData.originalAmount && parseFloat(formData.originalAmount) < 0) {
      newErrors.originalAmount = "Original amount must be non-negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateLiabilityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const liabilityData = {
        name: formData.name.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        institution: formData.institution.trim() || undefined,
        accountNumber: formData.accountNumber.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
        monthlyPayment: formData.monthlyPayment ? parseFloat(formData.monthlyPayment) : undefined,
        remainingBalance: formData.remainingBalance ? parseFloat(formData.remainingBalance) : undefined,
        originalAmount: formData.originalAmount ? parseFloat(formData.originalAmount) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      await createLiability(liabilityData);

      toast({
        title: "Success",
        description: "Liability created successfully",
      });

      // Reset form and close dialog
      setFormData(initialFormData);
      setErrors({});
      setOpen(false);

      // Notify parent component to refresh the list
      if (onLiabilityCreated) {
        onLiabilityCreated();
      }
    } catch (error) {
      console.error("Error creating liability:", error);
      toast({
        title: "Error",
        description: "Failed to create liability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="button-blue-bg hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Add Liability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Liability</DialogTitle>
          <DialogDescription>
            Add a new financial liability to track your debt obligations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Chase Credit Card"
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
                  {LIABILITY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
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
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)}
                placeholder="0.00"
                className={errors.interestRate ? "border-red-500" : ""}
              />
              {errors.interestRate && (
                <p className="text-sm text-red-500">{errors.interestRate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="e.g., Chase Bank"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="Last 4 digits"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyPayment">Monthly Payment</Label>
              <Input
                id="monthlyPayment"
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyPayment}
                onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
                placeholder="0.00"
                className={errors.monthlyPayment ? "border-red-500" : ""}
              />
              {errors.monthlyPayment && (
                <p className="text-sm text-red-500">{errors.monthlyPayment}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remainingBalance">Remaining Balance</Label>
              <Input
                id="remainingBalance"
                type="number"
                step="0.01"
                min="0"
                value={formData.remainingBalance}
                onChange={(e) => handleInputChange("remainingBalance", e.target.value)}
                placeholder="0.00"
                className={errors.remainingBalance ? "border-red-500" : ""}
              />
              {errors.remainingBalance && (
                <p className="text-sm text-red-500">{errors.remainingBalance}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalAmount">Original Amount</Label>
              <Input
                id="originalAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalAmount}
                onChange={(e) => handleInputChange("originalAmount", e.target.value)}
                placeholder="0.00"
                className={errors.originalAmount ? "border-red-500" : ""}
              />
              {errors.originalAmount && (
                <p className="text-sm text-red-500">{errors.originalAmount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this liability..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="button-blue-bg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Liability"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
