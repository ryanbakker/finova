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

  // Define transaction details to map over
  const transactionDetails = [
    {
      icon: DollarSign,
      label: "Amount",
      value: (
        <span
          className={`text-lg font-bold ${
            transaction.amount >= 0
              ? "text-green-600"
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {formatAmount(transaction.amount)}
        </span>
      ),
    },
    {
      icon: User,
      label: "Payee",
      value: <span className="font-medium">{transaction.payee}</span>,
    },
    {
      icon: Calendar,
      label: "Date",
      value: (
        <span className="font-medium">{formatDate(transaction.date)}</span>
      ),
    },
    {
      icon: CreditCard,
      label: "Account",
      value: <span className="font-medium">{transaction.account.name}</span>,
    },
    {
      icon: Tag,
      label: "Category",
      value: <span className="font-medium">{transaction.category.name}</span>,
    },
    ...(transaction.status
      ? [
          {
            icon: Building2,
            label: "Status",
            value: (
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
            ),
          },
        ]
      : []),
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col gap-1">
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <Trash2 className="h-5 w-5" />
            Delete Transaction
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning */}
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700 dark:text-red-300 font-medium">
            This action will permanently remove the transaction.
          </span>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3 py-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Transaction to be deleted:
          </div>

          {/* Map over transaction details */}
          {transactionDetails.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-slate-500/10 rounded-md p-2">
                    <IconComponent className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="font-medium">{detail.label}</span>
                </div>
                {detail.value}
              </div>
            );
          })}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer dark:text-white"
            onClick={handleConfirm}
          >
            Delete Transaction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
