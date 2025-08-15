"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Transaction } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Building2,
  Tag,
  User,
  CreditCard,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: Transaction) => void;
}

// Helper function to format date to desired format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
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

export function DeleteTransactionDialog({
  transaction,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTransactionDialogProps) {
  if (!transaction) return null;

  const handleConfirm = () => {
    onConfirm(transaction);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col gap-1">
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Transaction
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning */}
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700 dark:text-red-300 font-medium">
            This action will permanently remove the transaction from your
            records.
          </span>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3 py-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Transaction to be deleted:
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-600" />
              <span className="font-medium">Amount</span>
            </div>
            <span
              className={`text-lg font-bold ${
                transaction.amount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatAmount(transaction.amount)}
            </span>
          </div>

          {/* Payee */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-600" />
              <span className="font-medium">Payee</span>
            </div>
            <span className="font-medium">{transaction.payee}</span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="font-medium">Date</span>
            </div>
            <span className="font-medium">{formatDate(transaction.date)}</span>
          </div>

          {/* Account */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-600" />
              <span className="font-medium">Account</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{transaction.account.name}</span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-600" />
              <span className="font-medium">Category</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{transaction.category.name}</span>
            </div>
          </div>

          {/* Status */}
          {transaction.status && (
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-600" />
                <span className="font-medium">Status</span>
              </div>
              <Badge
                variant={
                  transaction.status === "completed" ? "default" : "secondary"
                }
                className={
                  transaction.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : ""
                }
              >
                {transaction.status}
              </Badge>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
            onClick={handleConfirm}
          >
            Delete Transaction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
