import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, AlertTriangle, AlertOctagon, Bell } from "lucide-react";

interface CategoryData {
  name: string;
  value: number;
  budget: number;
}

interface BudgetAlertsProps {
  categoryData: CategoryData[];
}

export function BudgetAlerts({ categoryData }: BudgetAlertsProps) {
  const overBudgetCategories = categoryData.filter(
    (category) => category.value / category.budget > 0.8
  );

  return (
    <Card className="border-l-4 border-l-red-500 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span>Budget Alerts</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Stay informed about your spending patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-1">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {/* Alert - Red */}
          {overBudgetCategories.length > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
              <AlertOctagon className="h-4 w-4 text-red-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-red-800 text-xs truncate">
                  {overBudgetCategories[0]?.name} Budget
                </p>
                <p className="text-xs text-red-700">
                  {Math.round(
                    (overBudgetCategories[0]?.value /
                      overBudgetCategories[0]?.budget) *
                      100
                  )}
                  % used
                </p>
              </div>
            </div>
          )}

          {/* Warning - Amber */}
          <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-amber-800 text-xs truncate">
                Entertainment Budget
              </p>
              <p className="text-xs text-amber-700">
                75% used - approaching limit
              </p>
            </div>
          </div>

          {/* Notice - Blue */}
          <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-lg">
            <Bell className="h-4 w-4 text-sky-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sky-800 text-xs truncate">
                Emergency Fund Goal
              </p>
              <p className="text-xs text-sky-700">85% to $10,000 goal</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
