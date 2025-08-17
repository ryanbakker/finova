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

type FormField = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "text" | "number" | "date" | "select";
  field: keyof Transaction;
  placeholder?: string;
  step?: string;
  validation?: (
    value: string | number | Account | Category | undefined
  ) => string;
  renderValue?: (
    value: string | number | Account | Category | undefined
  ) => React.ReactNode;
  getValue?: (
    value: string | number | Account | Category | undefined
  ) => string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => string | number;
  options?: Array<{ value: string; label: string | React.ReactNode }>;
  onValueChange?: (value: string) => Account | Category | string;
};

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

  // Form fields configuration
  const formFields: FormField[] = [
    {
      id: "amount",
      label: "Amount",
      icon: DollarSign,
      type: "number" as const,
      step: "0.01",
      placeholder: "Enter amount",
      field: "amount" as keyof Transaction,
      validation: (value: string | number | Account | Category | undefined) =>
        !value || value === 0 ? "Amount is required and cannot be zero" : "",
      renderValue: (value: string | number | Account | Category | undefined) =>
        typeof value === "number" &&
        value && (
          <p
            className={`text-sm font-medium ${
              value >= 0
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }`}
          >
            {formatAmount(value)}
          </p>
        ),
    },
    {
      id: "payee",
      label: "Payee",
      icon: User,
      type: "text" as const,
      placeholder: "Enter payee name",
      field: "payee" as keyof Transaction,
      validation: (value: string | number | Account | Category | undefined) =>
        typeof value === "string" && !value?.trim() ? "Payee is required" : "",
    },
    {
      id: "date",
      label: "Date",
      icon: Calendar,
      type: "date" as const,
      field: "date" as keyof Transaction,
      validation: (value: string | number | Account | Category | undefined) =>
        typeof value === "string" && !value ? "Date is required" : "",
      getValue: (value: string | number | Account | Category | undefined) =>
        typeof value === "string" && value ? formatDateForInput(value) : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
    },
    {
      id: "account",
      label: "Account",
      icon: CreditCard,
      type: "select" as const,
      field: "account" as keyof Transaction,
      validation: (value: string | number | Account | Category | undefined) =>
        typeof value === "object" && value && "id" in value && !value.id
          ? "Account is required"
          : "",
      options: accounts.map((account) => ({
        value: account.id,
        label: `${account.name} (${account.type})`,
      })),
      onValueChange: (value: string) => {
        const account = accounts.find((acc) => acc.id === value);
        return account || value;
      },
    },
    {
      id: "category",
      label: "Category",
      icon: Tag,
      type: "select" as const,
      field: "category" as keyof Transaction,
      validation: (value: string | number | Account | Category | undefined) =>
        typeof value === "object" && value && "id" in value && !value.id
          ? "Category is required"
          : "",
      options: categories.map((category) => ({
        value: category.id,
        label: (
          <span className="flex items-center gap-2">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </span>
        ),
      })),
      onValueChange: (value: string) => {
        const category = categories.find((cat) => cat.id === value);
        return category || value;
      },
    },
    {
      id: "status",
      label: "Status",
      icon: Building2,
      type: "select" as const,
      field: "status" as keyof Transaction,
      options: [
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
      ],
    },
  ];

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

    formFields.forEach((field) => {
      if (field.validation) {
        const error = field.validation(formData[field.field]);
        if (error) {
          newErrors[field.field] = error;
        }
      }
    });

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
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                <field.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                {field.label}
              </Label>

              {field.type === "select" ? (
                <Select
                  value={
                    field.field === "account"
                      ? formData.account?.id || ""
                      : field.field === "category"
                      ? formData.category?.id || ""
                      : (formData[field.field] as string) || ""
                  }
                  onValueChange={(value) => {
                    const processedValue = field.onValueChange
                      ? field.onValueChange(value)
                      : value;
                    handleInputChange(field.field, processedValue);
                  }}
                >
                  <SelectTrigger
                    className={errors[field.field] ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  step={field.step}
                  value={
                    field.getValue
                      ? field.getValue(formData[field.field])
                      : (formData[field.field] as string) || ""
                  }
                  onChange={(e) => {
                    const value = field.onChange
                      ? field.onChange(e)
                      : field.type === "number"
                      ? parseFloat(e.target.value) || 0
                      : e.target.value;
                    handleInputChange(field.field, value);
                  }}
                  className={errors[field.field] ? "border-red-500" : ""}
                  placeholder={field.placeholder}
                />
              )}

              {errors[field.field] && (
                <p className="text-sm text-red-500">{errors[field.field]}</p>
              )}

              {field.renderValue && field.renderValue(formData[field.field])}
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleSave}
            className="bg-sky-600 hover:bg-sky-700 cursor-pointer dark:text-white"
          >
            Save Changes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
