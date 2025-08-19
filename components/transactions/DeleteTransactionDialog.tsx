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
import {
  Calendar,
  DollarSign,
  Tag,
  User,
  CreditCard,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { deleteTransaction } from "@/lib/actions/transaction.actions";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  onSuccess,
}: DeleteTransactionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!transaction) return null;

  const handleConfirm = async () => {
    if (!transaction) return;

    setIsDeleting(true);

    try {
      await deleteTransaction(transaction.id);

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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
      label: "Description",
      value: <span className="font-medium">{transaction.description}</span>,
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
      value: <span className="font-medium">{transaction.accountName}</span>,
    },
    {
      icon: Tag,
      label: "Category",
      value: <span className="font-medium">{transaction.category.name}</span>,
    },
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
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Transaction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
