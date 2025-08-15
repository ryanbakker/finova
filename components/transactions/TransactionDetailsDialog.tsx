"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
} from "lucide-react";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
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

export function TransactionDetailsDialog({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  // Define transaction detail configurations
  const transactionDetails = [
    {
      key: "amount",
      label: "Amount",
      icon: DollarSign,
      value: formatAmount(transaction.amount),
      customValue: (
        <span
          className={`text-lg font-bold ${
            transaction.amount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatAmount(transaction.amount)}
        </span>
      ),
      show: true,
    },
    {
      key: "payee",
      label: "Payee",
      icon: User,
      value: transaction.payee,
      show: true,
    },
    {
      key: "date",
      label: "Date",
      icon: Calendar,
      value: formatDate(transaction.date),
      show: true,
    },
    {
      key: "account",
      label: "Account",
      icon: CreditCard,
      value: transaction.account.name,
      show: true,
    },
    {
      key: "category",
      label: "Category",
      icon: Tag,
      value: transaction.category.name,
      show: true,
    },
    {
      key: "status",
      label: "Status",
      icon: Building2,
      value: transaction.status,
      customValue: transaction.status && (
        <Badge
          variant={transaction.status === "completed" ? "default" : "secondary"}
          className={
            transaction.status === "completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : ""
          }
        >
          {transaction.status}
        </Badge>
      ),
      show: !!transaction.status,
    },
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col gap-1">
          <AlertDialogTitle>Transaction Details</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          {transactionDetails
            .filter((detail) => detail.show)
            .map((detail) => (
              <div
                key={detail.key}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-slate-500/10 rounded-md p-2">
                    <detail.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="font-medium">{detail.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {detail.customValue || (
                    <span className="font-medium">{detail.value}</span>
                  )}
                </div>
              </div>
            ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="cursor-pointer bg-sky-500 text-white hover:text-white hover:bg-sky-600 transition-all"
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
