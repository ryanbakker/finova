"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertClose,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, TrendingUp, Target, CreditCard, Info } from "lucide-react";

interface GetStartedNoticeProps {
  onClose: () => void;
}

export function GetStartedNotice({ onClose }: GetStartedNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Alert className="border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 dark:border-sky-800 dark:from-sky-950/50 dark:to-cyan-950/50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-sky-900 dark:text-sky-100">
            Welcome to Finova! Let&apos;s get started
          </AlertTitle>
          <AlertDescription className="text-sky-800 dark:text-sky-200 mt-2">
            <p className="mb-3">
              Your dashboard is ready, get started by adding your first
              transaction, asset, or budget to start getting insights.
            </p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-2">
              <Link href="/transactions">
                <Button
                  variant="outline"
                  className="border-sky-300 bg-white hover:bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/50 hover:text-white w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </Link>
              <Link href="/assets">
                <Button
                  variant="outline"
                  className="border-sky-300 bg-white hover:bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/50 hover:text-white w-full md:w-auto"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </Link>
              <Link href="/budgeting">
                <Button
                  variant="outline"
                  className="border-sky-300 bg-white hover:bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/50 hover:text-white w-full md:w-auto"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Set Budget
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </div>
      </div>
      <AlertClose
        onClick={handleClose}
        className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 cursor-pointer"
      />
    </Alert>
  );
}
