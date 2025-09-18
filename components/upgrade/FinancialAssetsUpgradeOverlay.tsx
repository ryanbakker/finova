import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Lock, Wallet } from "lucide-react";
import Link from "next/link";

interface FinancialAssetsUpgradeOverlayProps {
  className?: string;
  children: React.ReactNode;
}

export function FinancialAssetsUpgradeOverlay({
  className,
  children,
}: FinancialAssetsUpgradeOverlayProps) {
  return (
    <div
      className={`relative col-span-4 h-full rounded-lg container-color !w-full flex-1 ${
        className || ""
      }`}
    >
      {children}
      <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
        <Card className="w-full max-w-sm mx-4 border-1 border-sky-200 border-dashed dark:border-sky-800 bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-950/50 dark:to-teal-950/50 shadow-none">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-sky-100 dark:bg-sky-900/50 rounded-full">
                <Wallet className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">
              Asset Management
            </h3>

            <p className="text-sm text-sky-700 dark:text-sky-300 mb-4">
              Track your financial assets and investments with detailed
              performance insights.
            </p>

            <div className="space-y-3">
              <Link href="/manage-plan">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Access
                </Button>
              </Link>

              <p className="text-xs text-sky-600 dark:text-sky-400 pt-1">
                Starting at $9.99/month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
