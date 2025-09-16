"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Liability } from "@/lib/types";
import { DonutChart } from "@/components/DonutChart";
import LiabilityKeyMetrics from "./LiabilityKeyMetrics";

import {
  Building2,
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  TrendingUp,
  CreditCard,
  Home,
  Car,
  GraduationCap,
  Heart,
  FileText,
  Banknote,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface LiabilityInsightsProps {
  liabilities: Liability[];
  isLoading?: boolean;
}

interface _LiabilityAmountChartData {
  date: string;
  amount: number;
  quarter: number;
  year: number;
  quarterName: string;
  fullQuarter: string;
}

export function LiabilityInsights({
  liabilities,
  isLoading,
}: LiabilityInsightsProps) {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Credit Card Debt": "#8B5CF6", // purple
      "Student Loan": "#6366F1", // indigo
      "Car Loan": "#10B981", // green
      Mortgage: "#3B82F6", // blue
      "Personal Loan": "#F59E0B", // orange
      "Business Loan": "#14B8A6", // teal
      "Medical Debt": "#EF4444", // red
      "Tax Debt": "#6B7280", // gray
      "Other Debt": "#6B7280", // gray
    };
    return colors[category] || "#6B7280";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, LucideIcon> = {
      "Credit Card Debt": CreditCard,
      "Student Loan": GraduationCap,
      "Car Loan": Car,
      Mortgage: Home,
      "Personal Loan": Banknote,
      "Business Loan": Building2,
      "Medical Debt": Heart,
      "Tax Debt": FileText,
      "Other Debt": DollarSign,
    };
    const IconComponent = icons[category] || DollarSign;
    return <IconComponent className="h-4 w-4" />;
  };

  const getRiskIndicator = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          label: "High Risk",
        };
      case "medium":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          label: "Medium Risk",
        };
      case "low":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          label: "Low Risk",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-600",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          label: "Unknown Risk",
        };
    }
  };

  const insights = useMemo(() => {
    if (!liabilities || liabilities.length === 0) return null;

    // Note: The liability model doesn't have an isActive field, so we include all liabilities
    // If you want to add isActive functionality, update the database model first
    const activeLiabilities = liabilities; // Include all liabilities since isActive field doesn't exist in the model
    const totalAmount = activeLiabilities.reduce(
      (sum, l) => sum + l.currentValue,
      0
    );

    // Calculate total change amount and percentage
    const totalChangeAmount = activeLiabilities.reduce(
      (sum, l) => sum + (l.changeAmount || 0),
      0
    );
    const totalChangePercentage =
      totalAmount > 0 ? (totalChangeAmount / totalAmount) * 100 : 0;

    // Category breakdown with enhanced data
    const categoryBreakdown = activeLiabilities.reduce((acc, liability) => {
      const category = liability.category;
      if (!acc[category]) {
        acc[category] = {
          amount: 0,
          count: 0,
          color: getCategoryColor(category),
          changeAmount: 0,
          changePercentage: 0,
          avgAmount: 0,
        };
      }
      acc[category].amount += liability.currentValue;
      acc[category].count += 1;
      acc[category].changeAmount += liability.changeAmount || 0;
      return acc;
    }, {} as Record<string, { amount: number; count: number; color: string; changeAmount: number; changePercentage: number; avgAmount: number }>);

    // Calculate averages and percentages for categories
    Object.keys(categoryBreakdown).forEach((category) => {
      const data = categoryBreakdown[category];
      data.avgAmount = data.amount / data.count;
      data.changePercentage =
        data.amount > 0 ? (data.changeAmount / data.amount) * 100 : 0;
    });

    // Institution breakdown (using a fallback since institution field may not exist)
    const institutionBreakdown = activeLiabilities.reduce((acc, liability) => {
      const institution = liability.institution || "Not Specified";
      if (!acc[institution]) {
        acc[institution] = { amount: 0, count: 0 };
      }
      acc[institution].amount += liability.currentValue;
      acc[institution].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // Debt priority analysis (high interest, high balance)
    const priorityDebts = activeLiabilities
      .map((liability) => ({
        ...liability,
        priorityScore:
          (liability.currentValue / totalAmount) * 100 +
          (Math.abs(liability.changeAmount || 0) / liability.currentValue) *
            100,
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);

    // Debt consolidation opportunities (similar categories)
    const consolidationOpportunities = Object.entries(categoryBreakdown)
      .filter(([_, data]) => data.count > 1)
      .map(([category, data]) => ({
        category,
        totalAmount: data.amount,
        count: data.count,
        potentialSavings: data.amount * 0.02, // Assume 2% savings from consolidation
        color: data.color,
      }))
      .sort((a, b) => b.potentialSavings - a.potentialSavings);

    // Risk assessment by category
    const riskCategories = {
      high: ["Credit Card Debt", "Personal Loan", "Medical Debt"],
      medium: ["Car Loan", "Student Loan", "Business Loan"],
      low: ["Mortgage", "Tax Debt"],
    };

    const riskBreakdown = Object.keys(riskCategories).reduce(
      (acc, riskLevel) => {
        const categories =
          riskCategories[riskLevel as keyof typeof riskCategories];
        const riskLiabilities = activeLiabilities.filter((l) =>
          categories.includes(l.category)
        );
        acc[riskLevel] = {
          amount: riskLiabilities.reduce((sum, l) => sum + l.currentValue, 0),
          count: riskLiabilities.length,
          percentage:
            totalAmount > 0
              ? (riskLiabilities.reduce((sum, l) => sum + l.currentValue, 0) /
                  totalAmount) *
                100
              : 0,
        };
        return acc;
      },
      {} as Record<
        string,
        { amount: number; count: number; percentage: number }
      >
    );

    // Monthly payment estimation (rough calculation)
    const estimatedMonthlyPayment = totalAmount * 0.03; // Assume 3% monthly payment rate

    // Debt payoff timeline (assuming current payment rate)
    const estimatedPayoffMonths =
      estimatedMonthlyPayment > 0
        ? Math.ceil(totalAmount / estimatedMonthlyPayment)
        : 0;
    const estimatedPayoffYears = Math.ceil(estimatedPayoffMonths / 12);

    return {
      totalAmount,
      totalChangeAmount,
      totalChangePercentage,
      categoryBreakdown,
      institutionBreakdown,
      activeCount: activeLiabilities.length,
      totalCount: liabilities.length,
      priorityDebts,
      consolidationOpportunities,
      riskBreakdown,
      estimatedMonthlyPayment,
      estimatedPayoffMonths,
      estimatedPayoffYears,
    };
  }, [liabilities]);

  const formatCurrency = (amount: number, currency: string = "AUD"): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No liabilities found
        </h3>
        <p className="text-sm text-muted-foreground">
          Add some liabilities to see insights and analytics
        </p>
        {/* Debug info */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-md mx-auto">
          <h4 className="font-medium mb-2">Debug Info:</h4>
          <p className="text-xs text-muted-foreground">
            Liabilities count: {liabilities?.length || 0}
          </p>
          <p className="text-xs text-muted-foreground">
            Loading: {isLoading ? "Yes" : "No"}
          </p>
          {liabilities && liabilities.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Sample liability:</p>
              <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(liabilities[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  const chartData = Object.entries(insights.categoryBreakdown).map(
    ([category, data]) => ({
      name: category,
      value: data.amount,
      color: data.color,
    })
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <LiabilityKeyMetrics
        totalAmount={insights.totalAmount}
        activeCount={insights.activeCount}
        totalChangeAmount={insights.totalChangeAmount}
        totalChangePercentage={insights.totalChangePercentage}
        estimatedMonthlyPayment={insights.estimatedMonthlyPayment}
        estimatedPayoffYears={insights.estimatedPayoffYears}
        estimatedPayoffMonths={insights.estimatedPayoffMonths}
        categoryCount={Object.keys(insights.categoryBreakdown).length}
      />

      {/* Priority Debts */}
      {insights.priorityDebts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dashboard-page-card-title">
                Priority Debts
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <CardDescription className="dashboard-page-card-description">
              Focus on these debts first based on amount and change rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.priorityDebts.map((debt, index) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    {getCategoryIcon(debt.category)}
                    <div>
                      <div className="font-medium">{debt.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {debt.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(debt.currentValue)}
                    </div>
                    {debt.changeAmount !== 0 && (
                      <div
                        className={`text-xs flex items-center space-x-1 ${
                          debt.changeAmount > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {debt.changeAmount > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {debt.changeAmount > 0 ? "+" : ""}
                          {formatCurrency(debt.changeAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="dashboard-page-card-title">
              Risk Assessment
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <CardDescription className="dashboard-page-card-description">
            Categorize your debt by risk level to prioritize payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(insights.riskBreakdown).map(([riskLevel, data]) => {
              if (data.amount === 0) return null;
              const indicator = getRiskIndicator(riskLevel);
              const IconComponent = indicator.icon;

              return (
                <div
                  key={riskLevel}
                  className={`p-4 rounded-lg ${indicator.bgColor}`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`h-4 w-4 ${indicator.color}`} />
                    <span className={`font-medium ${indicator.color}`}>
                      {indicator.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(data.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {data.count} debt{data.count !== 1 ? "s" : ""} •{" "}
                    {data.percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Consolidation Opportunities */}
      {insights.consolidationOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dashboard-page-card-title">
                Consolidation Opportunities
              </CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <CardDescription className="dashboard-page-card-description">
              Consider consolidating multiple debts in the same category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.consolidationOpportunities
                .slice(0, 3)
                .map((opportunity) => (
                  <div
                    key={opportunity.category}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(opportunity.category)}
                      <div>
                        <div className="font-medium">
                          {opportunity.category}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {opportunity.count} debts •{" "}
                          {formatCurrency(opportunity.totalAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        Save ~{formatCurrency(opportunity.potentialSavings)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Potential savings
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dashboard-page-card-title">
                Liability Breakdown by Category
              </CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <CardDescription className="dashboard-page-card-description">
              Distribution of your liabilities across different categories with
              change indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutChart
                data={chartData}
                category="name"
                value="value"
                showLabel
                valueFormatter={formatCurrency}
              />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(insights.categoryBreakdown)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([category, data]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.count} debt{data.count !== 1 ? "s" : ""}
                        {data.changeAmount !== 0 && (
                          <span
                            className={`ml-1 ${
                              data.changeAmount > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            ({data.changeAmount > 0 ? "+" : ""}
                            {formatCurrency(data.changeAmount)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
