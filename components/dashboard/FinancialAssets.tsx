"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoveRight,
  Building2,
  TrendingUp,
  Home,
  PiggyBank,
} from "lucide-react";

// Asset data structure
interface Asset {
  id: string;
  name: string;
  institution: string;
  amount: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
}

const assetsData: Asset[] = [
  {
    id: "1",
    name: "Savings Account",
    institution: "Bank of America",
    amount: "$15,420",
    change: "+2.1%",
    icon: Building2,
  },
  {
    id: "2",
    name: "Investment Portfolio",
    institution: "Vanguard 401(k)",
    amount: "$42,800",
    change: "+8.5%",
    icon: TrendingUp,
  },
  {
    id: "3",
    name: "Home Equity",
    institution: "Primary Residence",
    amount: "$125,000",
    change: "+5.2%",
    icon: Home,
  },
  {
    id: "4",
    name: "Emergency Fund",
    institution: "High-Yield Savings",
    amount: "$8,500",
    change: "+3.8%",
    icon: PiggyBank,
  },
];

export function FinancialAssets() {
  return (
    <Card className="container-color h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="card-title">Financial Assets</CardTitle>
            <CardDescription>
              Track your individual financial assets and investments
            </CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 text-white hover:from-sky-600 hover:via-sky-600 hover:text-white transition-colors cursor-pointer shadow-sm">
            Assets
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Total Assets Summary */}
        <div className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[250px] overflow-y-auto category-breakdown-scroll mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Total Assets
            </span>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              $191,720
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              This month
            </span>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              +$4,850
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Individual Assets
          </h3>
          {/* Mapped Assets */}
          <ul className="border border-gray-200 dark:border-neutral-600 rounded-sm bg-gray-50 dark:bg-neutral-900/40 p-3 max-h-[280px] overflow-y-auto category-breakdown-scroll space-y-3">
            {assetsData.map((asset) => (
              <li
                key={asset.id}
                className={`flex items-center justify-between p-3 rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 transition-colors dark:from-sky-950/50 dark:to-cyan-950/50 dark:border-sky-900/50 dark:hover:from-sky-900/50 dark:hover:to-cyan-900/50`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 dark:bg-sky-900/20`}
                  >
                    <asset.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-sky-900 dark:text-gray-100">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {asset.institution}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold text-sky-800`}>
                    {asset.amount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {asset.change}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
