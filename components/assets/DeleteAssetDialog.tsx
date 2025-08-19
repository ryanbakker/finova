"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asset } from "@/lib/types";
import { deleteAsset } from "@/lib/actions/asset.actions";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

interface DeleteAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteAssetDialog({
  asset,
  isOpen,
  onClose,
  onSuccess,
}: DeleteAssetDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  if (!asset) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await deleteAsset(asset.id);

      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-lg">Delete Asset</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              Are you sure you want to delete the asset{" "}
              <span className="font-semibold">&ldquo;{asset.name}&rdquo;</span>?
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              This will permanently remove the asset and all associated data
              from your account.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Asset Details:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Name:</span> {asset.name}
              </p>
              <p>
                <span className="font-medium">Category:</span> {asset.category}
              </p>
              <p>
                <span className="font-medium">Value:</span>{" "}
                {asset.currentValue || asset.value} {asset.currency}
              </p>
              {asset.institution && (
                <p>
                  <span className="font-medium">Institution:</span>{" "}
                  {asset.institution}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 min-w-[120px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Asset
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
