"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

// Asset data structure
interface Asset {
  id: string;
  name: string;
  institution: string;
  amount: string;
  change: string;
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconText: string;
  };
}

const assetsData: Asset[] = [
  {
    id: "1",
    name: "Savings Account",
    institution: "Bank of America",
    amount: "$15,420",
    change: "+2.1%",
    icon: "🏦",
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      iconText: "text-emerald-600",
    },
  },
  {
    id: "2",
    name: "Investment Portfolio",
    institution: "Vanguard 401(k)",
    amount: "$42,800",
    change: "+8.5%",
    icon: "📈",
    color: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconText: "text-blue-600",
    },
  },
  {
    id: "3",
    name: "Home Equity",
    institution: "Primary Residence",
    amount: "$125,000",
    change: "+5.2%",
    icon: "🏠",
    color: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconText: "text-purple-600",
    },
  },
  {
    id: "4",
    name: "Emergency Fund",
    institution: "High-Yield Savings",
    amount: "$8,500",
    change: "+3.8%",
    icon: "💰",
    color: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900",
      iconText: "text-orange-600",
    },
  },
];

export function FinancialAssets() {
  return (
    <Card className="container-color h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <CardTitle className="text-sky-900">Financial Assets</CardTitle>
            <CardDescription>
              Track your individual financial assets and investments
            </CardDescription>
          </div>
          <Button>
            Assets
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Total Assets Summary */}
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-950/20 rounded-lg border border-neutral-200 dark:border-neutral-800">
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
          <ul className="space-y-3 category-breakdown-scroll max-h-[280px] overflow-y-auto bg-neutral-50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {assetsData.map((asset) => (
              <li
                key={asset.id}
                className={`flex items-center justify-between p-3 ${asset.color.bg} rounded-lg border ${asset.color.border}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${asset.color.iconBg} rounded-full flex items-center justify-center`}
                  >
                    <span
                      className={`${asset.color.iconText} font-semibold text-sm`}
                    >
                      {asset.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {asset.institution}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${asset.color.text}`}>
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
