"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Liability } from "@/lib/types";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteLiabilityDialogProps {
  liability: Liability | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (liability: Liability) => void;
}

export function DeleteLiabilityDialog({
  liability,
  isOpen,
  onClose,
  onConfirm,
}: DeleteLiabilityDialogProps) {
  if (!liability) return null;

  const handleConfirm = () => {
    onConfirm(liability);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete Liability</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this liability? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {liability.name}
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  {liability.category} • {liability.currency}{" "}
                  {liability.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              This will permanently remove the liability from your records. All
              associated data, including payment history and notes, will be
              lost.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Liability
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
