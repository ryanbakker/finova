import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, AlertOctagon, Bell, CheckCircle } from "lucide-react";

interface CategoryData {
  name: string;
  value: number;
  budget: number;
  percentage: number;
}

interface BudgetAlertsProps {
  categoryData: CategoryData[];
  isLoading?: boolean;
}

export function BudgetAlerts({
  categoryData,
  isLoading = false,
}: BudgetAlertsProps) {
  // Filter categories by budget status
  const overBudgetCategories = categoryData.filter(
    (category) => category.percentage > 100
  );
  
  const warningCategories = categoryData.filter(
    (category) => category.percentage > 80 && category.percentage <= 100
  );
  
  const goodCategories = categoryData.filter(
    (category) => category.percentage <= 80
  );

  // Get the most critical alerts first
  const criticalAlerts = [
    ...overBudgetCategories.map(cat => ({
      type: 'critical' as const,
      category: cat.name,
      percentage: cat.percentage,
      message: `${Math.round(cat.percentage)}% used - OVER BUDGET`,
      color: 'red'
    })),
    ...warningCategories.map(cat => ({
      type: 'warning' as const,
      category: cat.name,
      percentage: cat.percentage,
      message: `${Math.round(cat.percentage)}% used - approaching limit`,
      color: 'amber'
    }))
  ];

  // Sort by severity (critical first, then by percentage)
  criticalAlerts.sort((a, b) => {
    if (a.type === 'critical' && b.type !== 'critical') return -1;
    if (a.type !== 'critical' && b.type === 'critical') return 1;
    return b.percentage - a.percentage;
  });

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-red-500 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 text-sm mb-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="pt-0 pb-1">
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg"
              >
                <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-red-500 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span>Budget Alerts</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {criticalAlerts.length > 0 
            ? `${criticalAlerts.length} alert${criticalAlerts.length !== 1 ? 's' : ''} need attention`
            : "All budgets are on track"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-1">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {criticalAlerts.length > 0 ? (
            criticalAlerts.map((alert, index) => (
              <div
                key={`${alert.category}-${index}`}
                className={`flex items-center space-x-2 p-2 border rounded-lg ${
                  alert.color === 'red'
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800'
                    : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800'
                }`}
              >
                {alert.color === 'red' ? (
                  <AlertOctagon className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`font-medium text-xs truncate ${
                    alert.color === 'red'
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-amber-800 dark:text-amber-200'
                  }`}>
                    {alert.category} Budget
                  </p>
                  <p className={`text-xs ${
                    alert.color === 'red'
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Show success message when no alerts
            <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-green-800 dark:text-green-200 text-xs truncate">
                  All Budgets On Track
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Great job managing your spending!
                </p>
              </div>
            </div>
          )}

          {/* Show summary of budget status */}
          {categoryData.length > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800 rounded-lg">
              <Bell className="h-4 w-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sky-800 dark:text-sky-200 text-xs truncate">
                  Budget Summary
                </p>
                <p className="text-xs text-sky-700 dark:text-sky-300">
                  {goodCategories.length} on track, {warningCategories.length} warnings, {overBudgetCategories.length} over budget
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
