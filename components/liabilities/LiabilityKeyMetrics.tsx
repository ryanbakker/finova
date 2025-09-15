"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
} from "lucide-react";

type Props = {
  totalAmount: number;
  activeCount: number;
  totalChangeAmount: number;
  totalChangePercentage: number;
  estimatedMonthlyPayment: number;
  estimatedPayoffYears: number;
  estimatedPayoffMonths: number;
  categoryCount: number;
};

export function LiabilityKeyMetrics({
  totalAmount,
  activeCount,
  totalChangeAmount,
  totalChangePercentage,
  estimatedMonthlyPayment,
  estimatedPayoffYears,
  estimatedPayoffMonths,
  categoryCount,
}: Props) {
  const formatCurrency = (amount: number, currency: string = "AUD"): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Liabilities
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {activeCount} active liabilities
          </p>
          {totalChangeAmount !== 0 && (
            <div className="flex items-center space-x-1 mt-1">
              {totalChangeAmount > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-600" />
              )}
              <span
                className={`text-xs ${
                  totalChangeAmount > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {totalChangeAmount > 0 ? "+" : ""}
                {formatCurrency(totalChangeAmount)}(
                {totalChangePercentage > 0 ? "+" : ""}
                {totalChangePercentage.toFixed(1)}%)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Est. Monthly Payment
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(estimatedMonthlyPayment)}
          </div>
          <p className="text-xs text-muted-foreground">3% of total debt</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payoff Timeline</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estimatedPayoffYears}y</div>
          <p className="text-xs text-muted-foreground">
            {estimatedPayoffMonths} months
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debt Categories</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground">Different types</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LiabilityKeyMetrics;
