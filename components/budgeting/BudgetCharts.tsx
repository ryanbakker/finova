import { MonthlySpendingChart } from "./MonthlySpendingChart";
import { BudgetVsActualChart } from "./BudgetVsActualChart";
import { CategoryBreakdownChart } from "./CategoryBreakdownChart";
import { WeeklySpendingChart } from "./WeeklySpendingChart";

interface MonthlySpending {
  month: string;
  spent: number;
  budget: number;
}

interface DailySpending {
  day: string;
  amount: number;
}

interface BudgetVsActual {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
}

interface CategoryData {
  name: string;
  value: number;
  budget: number;
}

interface BudgetChartsProps {
  monthlySpending: MonthlySpending[];
  dailySpending: DailySpending[];
  budgetVsActual: BudgetVsActual[];
  categoryData: CategoryData[];
  monthlyBudget: number;
}

export function BudgetCharts({
  monthlySpending,
  dailySpending,
  budgetVsActual,
  categoryData,
  monthlyBudget,
}: BudgetChartsProps) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}
    >
      <MonthlySpendingChart
        monthlySpending={monthlySpending}
        monthlyBudget={monthlyBudget}
      />

      <BudgetVsActualChart budgetVsActual={budgetVsActual} />

      <CategoryBreakdownChart categoryData={categoryData} />

      <WeeklySpendingChart dailySpending={dailySpending} />
    </div>
  );
}
