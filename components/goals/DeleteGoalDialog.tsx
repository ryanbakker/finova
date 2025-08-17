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
import { FinancialGoal } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface DeleteGoalDialogProps {
  goal: FinancialGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteGoalDialog({
  goal,
  isOpen,
  onClose,
  onConfirm,
}: DeleteGoalDialogProps) {
  if (!goal) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Delete Financial Goal</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the goal "{goal.name}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Goal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
