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
import { Bill } from "@/lib/types";
import { deleteBill } from "@/lib/actions/bill.actions";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DeleteBillDialogProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bill: Bill) => void;
}

export function DeleteBillDialog({
  bill,
  isOpen,
  onClose,
  onConfirm,
}: DeleteBillDialogProps) {
  if (!bill) return null;

  const handleConfirm = async () => {
    try {
      await deleteBill(bill.id);

      toast({
        title: "Success",
        description: "Bill deleted successfully!",
      });

      onConfirm(bill);
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast({
        title: "Error",
        description: "Failed to delete bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete Bill</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this bill? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-muted">{bill.icon}</div>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  {bill.name}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Amount: ${bill.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            This will permanently remove the bill from your records. If this is
            a recurring bill, you may want to mark it as paid instead of
            deleting it.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
