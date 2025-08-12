"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export function FinancialAssets() {
  return (
    <Card className="border-l-4 border-l-emerald-500 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-emerald-700">Financial Assets</CardTitle>
        <CardDescription>
          Track your individual financial assets and investments
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="space-y-4">
          {/* Add Asset Button */}
          <button className="w-full p-3 border-2 border-dashed border-emerald-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
            <div className="flex items-center justify-center space-x-2 text-emerald-600">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add New Asset</span>
            </div>
          </button>

          {/* Sample Assets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold text-sm">
                    🏦
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Savings Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bank of America
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-emerald-600">
                  $15,420
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +2.1%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    📈
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Investment Portfolio
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vanguard 401(k)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">
                  $42,800
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +8.5%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    🏠
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Home Equity
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Primary Residence
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-purple-600">
                  $125,000
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +5.2%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">
                    💰
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    Emergency Fund
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    High-Yield Savings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-orange-600">
                  $8,500
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +3.8%
                </div>
              </div>
            </div>
          </div>

          {/* Total Assets Summary */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Assets
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                $191,720
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                This month
              </span>
              <span className="text-sm font-medium text-emerald-600">
                +$4,850
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
