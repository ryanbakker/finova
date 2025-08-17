"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bill } from "@/lib/types";
import { RefreshCw, FileText } from "lucide-react";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

interface BillDetailsDialogProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BillDetailsDialog({
  bill,
  isOpen,
  onClose,
}: BillDetailsDialogProps) {
  if (!bill) return null;

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (bill: Bill) => {
    const daysUntilDue = getDaysUntilDue(bill.dueDate);

    if (bill.status === "paid") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:no-underline hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900/30 dark:hover:text-green-400">
          Paid
        </Badge>
      );
    }

    if (daysUntilDue < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:no-underline hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-400">
          Overdue
        </Badge>
      );
    }

    if (daysUntilDue <= 7) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:no-underline hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-orange-900/30 dark:hover:text-orange-400">
          Due Soon
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:no-underline hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
        Upcoming
      </Badge>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const daysUntilDue = getDaysUntilDue(bill.dueDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-muted">{bill.icon}</div>
            <span>{bill.name}</span>
          </DialogTitle>
          <DialogDescription>
            Bill details and payment information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            {getStatusBadge(bill)}
          </div>

          <Separator />

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Amount
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatAmount(bill.amount)}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Due Date
            </span>
            <div className="text-right">
              <div className="font-medium">{formatDate(bill.dueDate)}</div>
              <div className="text-xs text-muted-foreground">
                {daysUntilDue < 0
                  ? `${Math.abs(daysUntilDue)} days overdue`
                  : daysUntilDue === 0
                  ? "Due today"
                  : `${daysUntilDue} days left`}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Category
            </span>
            <Badge variant="secondary">{bill.category}</Badge>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Recurring
            </span>
            <div className="flex items-center space-x-2">
              {bill.isRecurring ? (
                <>
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {bill.frequency
                      ? bill.frequency.charAt(0).toUpperCase() +
                        bill.frequency.slice(1)
                      : "Monthly"}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">One-time</span>
              )}
            </div>
          </div>

          {/* Notes */}
          {bill.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Notes
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {bill.notes}
                </p>
              </div>
            </>
          )}

          {/* Account */}
          {bill.account && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Payment Account
                </span>
                <span className="text-sm font-medium">{bill.account.name}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
