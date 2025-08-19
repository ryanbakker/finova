"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Transaction, Account, Category } from "@/lib/types";
import {
  Calendar,
  DollarSign,
  Building2,
  Tag,
  User,
  CreditCard,
  Edit3,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { updateTransaction } from "@/lib/actions/transaction.actions";
import { toast } from "@/components/ui/use-toast";

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: Account[];
  categories: Category[];
}

export function EditTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onSuccess,
  accounts,
  categories,
}: EditTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    type: "expense" as "income" | "expense" | "transfer",
    category: "",
    description: "",
    merchant: "",
    accountId: "",
    isRecurring: false,
    tags: [] as string[],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  // Initialize form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().split("T")[0],
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category.id,
        description: transaction.description,
        merchant: transaction.merchant || "",
        accountId: transaction.accountId,
        isRecurring: transaction.isRecurring,
        tags: transaction.tags || [],
        notes: transaction.notes || "",
      });
      setErrors({});
      setNewTag("");
    }
  }, [transaction]);

  const resetForm = () => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().split("T")[0],
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category.id,
        description: transaction.description,
        merchant: transaction.merchant || "",
        accountId: transaction.accountId,
        isRecurring: transaction.isRecurring,
        tags: transaction.tags || [],
        notes: transaction.notes || "",
      });
    }
    setErrors({});
    setNewTag("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) === 0) {
      newErrors.amount = "Amount is required and must be non-zero";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.accountId) {
      newErrors.accountId = "Account is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find(
        (cat) => cat.id === formData.category
      );
      const selectedAccount = accounts.find(
        (acc) => acc.id === formData.accountId
      );

      if (!selectedCategory || !selectedAccount) {
        throw new Error("Invalid category or account selection");
      }

      const transactionData = {
        id: transaction.id,
        date: new Date(formData.date),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          icon: selectedCategory.icon,
          color: transaction.category.color || "#3B82F6",
        },
        description: formData.description.trim(),
        merchant: formData.merchant.trim() || undefined,
        accountId: selectedAccount.id,
        accountName: selectedAccount.name,
        isRecurring: formData.isRecurring,
        tags: formData.tags,
        notes: formData.notes.trim() || undefined,
      };

      await updateTransaction(transactionData);

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (!transaction) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Transaction
          </DialogTitle>
          <DialogDescription>
            Update the details of your financial transaction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "income" | "expense" | "transfer") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label htmlFor="account" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Account *
              </Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, accountId: value }))
                }
              >
                <SelectTrigger
                  className={errors.accountId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && (
                <p className="text-sm text-red-500">{errors.accountId}</p>
              )}
            </div>

            {/* Merchant */}
            <div className="space-y-2">
              <Label htmlFor="merchant" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Merchant
              </Label>
              <Input
                id="merchant"
                placeholder="Store, business, or person"
                value={formData.merchant}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, merchant: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Description *
            </Label>
            <Input
              id="description"
              placeholder="What was this transaction for?"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this transaction"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isRecurring: checked as boolean,
                }))
              }
            />
            <Label htmlFor="recurring">This is a recurring transaction</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
