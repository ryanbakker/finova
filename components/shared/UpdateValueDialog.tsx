"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UpdateValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemId: string;
  itemType: "ASSET" | "LIABILITY";
  currentValue: number;
  itemName: string;
}

export function UpdateValueDialog({
  isOpen,
  onClose,
  onSuccess,
  itemId,
  itemType,
  currentValue,
  itemName,
}: UpdateValueDialogProps) {
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newValue || isNaN(Number(newValue)) || Number(newValue) < 0) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid non-negative number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/net-worth/update-value", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          itemType,
          newValue: Number(newValue),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Value Updated",
          description: `Successfully updated ${itemName} value to $${Number(
            newValue
          ).toLocaleString()}`,
        });
        onSuccess();
        onClose();
        setNewValue("");
      } else {
        throw new Error(data.error || "Failed to update value");
      }
    } catch (error) {
      console.error("Error updating value:", error);
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update value",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNewValue("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Update {itemType === "ASSET" ? "Asset" : "Liability"} Value
          </DialogTitle>
          <DialogDescription>
            Update the current value for {itemName}. Current value: $
            {currentValue.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newValue" className="text-right">
                New Value
              </Label>
              <Input
                id="newValue"
                type="number"
                step="0.01"
                min="0"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-3"
                placeholder="Enter new value"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Value
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

