"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Transaction, Account, Category } from "@/lib/types";
import {
  Calendar,
  DollarSign,
  Building2,
  Tag,
  User,
  CreditCard,
  Edit3,
} from "lucide-react";
import { useState, useEffect } from "react";

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
  accounts: Account[];
  categories: Category[];
}

// Helper function to format date for input field
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Helper function to format amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function EditTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onSave,
  accounts,
  categories,
}: EditTransactionDialogProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        id: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        category: transaction.category,
        account: transaction.account,
        payee: transaction.payee,
        status: transaction.status,
      });
      setErrors({});
    }
  }, [transaction]);

  const handleInputChange = (
    field: keyof Transaction,
    value: string | number | Account | Category | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.payee?.trim()) {
      newErrors.payee = "Payee is required";
    }

    if (!formData.amount || formData.amount === 0) {
      newErrors.amount = "Amount is required and cannot be zero";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.account?.id) {
      newErrors.account = "Account is required";
    }

    if (!formData.category?.id) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !transaction) return;

    const updatedTransaction: Transaction = {
      ...transaction,
      ...formData,
    } as Transaction;

    onSave(updatedTransaction);
    onClose();
  };

  if (!transaction) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader className="flex flex-col gap-1">
          <AlertDialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Transaction
          </AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to this transaction and click save to update.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-600" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount || ""}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || 0)
              }
              className={errors.amount ? "border-red-500" : ""}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
            {formData.amount && (
              <p
                className={`text-sm font-medium ${
                  (formData.amount || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatAmount(formData.amount)}
              </p>
            )}
          </div>

          {/* Payee */}
          <div className="space-y-2">
            <Label htmlFor="payee" className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-600" />
              Payee
            </Label>
            <Input
              id="payee"
              value={formData.payee || ""}
              onChange={(e) => handleInputChange("payee", e.target.value)}
              className={errors.payee ? "border-red-500" : ""}
              placeholder="Enter payee name"
            />
            {errors.payee && (
              <p className="text-sm text-red-500">{errors.payee}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date ? formatDateForInput(formData.date) : ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label htmlFor="account" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-600" />
              Account
            </Label>
            <Select
              value={formData.account?.id || ""}
              onValueChange={(value) => {
                const account = accounts.find((acc) => acc.id === value);
                handleInputChange("account", account);
              }}
            >
              <SelectTrigger className={errors.account ? "border-red-500" : ""}>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.account && (
              <p className="text-sm text-red-500">{errors.account}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-600" />
              Category
            </Label>
            <Select
              value={formData.category?.id || ""}
              onValueChange={(value) => {
                const category = categories.find((cat) => cat.id === value);
                handleInputChange("category", category);
              }}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-600" />
              Status
            </Label>
            <Select
              value={formData.status || ""}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleSave}
            className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
          >
            Save Changes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
