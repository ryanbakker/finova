"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Liability } from "@/lib/types";
import {
  Calendar,
  Building2,
  CreditCard,
  Percent,
  DollarSign,
  FileText,
  Clock,
  TrendingDown,
} from "lucide-react";

interface LiabilityDetailsDialogProps {
  liability: Liability | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LiabilityDetailsDialog({
  liability,
  isOpen,
  onClose,
}: LiabilityDetailsDialogProps) {
  if (!liability) return null;

  const formatCurrency = (amount: number, currency: string = "AUD"): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getLiabilityCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "mortgage":
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case "vehicle loan":
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case "credit card":
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case "personal loan":
        return <DollarSign className="h-5 w-5 text-orange-600" />;
      case "education loan":
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case "business loan":
        return <Building2 className="h-5 w-5 text-teal-600" />;
      case "line of credit":
        return <CreditCard className="h-5 w-5 text-pink-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getLiabilityCategoryIcon(liability.category)}
            <span>{liability.name}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about your liability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <div className="flex items-center space-x-2">
                  {getLiabilityCategoryIcon(liability.category)}
                  <span className="text-sm">{liability.category}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div>{getStatusBadge(liability.isActive)}</div>
              </div>
              {liability.institution && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Institution
                  </label>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{liability.institution}</span>
                  </div>
                </div>
              )}
              {liability.accountNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </label>
                  <span className="text-sm font-mono">
                    {liability.accountNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Current Amount
                </label>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(liability.amount, liability.currency)}
                </div>
              </div>
              {liability.remainingBalance && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Remaining Balance
                  </label>
                  <div className="text-lg font-semibold">
                    {formatCurrency(
                      liability.remainingBalance,
                      liability.currency
                    )}
                  </div>
                </div>
              )}
              {liability.originalAmount && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Original Amount
                  </label>
                  <div className="text-sm">
                    {formatCurrency(
                      liability.originalAmount,
                      liability.currency
                    )}
                  </div>
                </div>
              )}
              {liability.interestRate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Interest Rate
                  </label>
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{liability.interestRate}%</span>
                  </div>
                </div>
              )}
              {liability.monthlyPayment && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Monthly Payment
                  </label>
                  <div className="text-sm">
                    {formatCurrency(
                      liability.monthlyPayment,
                      liability.currency
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liability.dueDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(liability.dueDate)}
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(liability.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {liability.notes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Additional Information
                  </label>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {liability.notes}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
