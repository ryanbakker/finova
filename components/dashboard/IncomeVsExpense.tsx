import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "@tremor/react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyData {
  category: string;
  income: number;
  expenses: number;
}

const exampleData: MonthlyData[] = [
  { category: "Salary", income: 5200, expenses: 0 },
  { category: "Freelance", income: 1200, expenses: 0 },
  { category: "Investments", income: 450, expenses: 0 },
  { category: "Side Hustle", income: 800, expenses: 0 },
  { category: "Housing", income: 0, expenses: 1800 },
  { category: "Transportation", income: 0, expenses: 320 },
  { category: "Food", income: 0, expenses: 750 },
  { category: "Utilities", income: 0, expenses: 280 },
  { category: "Entertainment", income: 0, expenses: 420 },
  { category: "Healthcare", income: 0, expenses: 180 },
  { category: "Shopping", income: 0, expenses: 350 },
  { category: "Insurance", income: 0, expenses: 220 },
];

export function IncomeVsExpense() {
  const totalIncome = exampleData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = exampleData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const netIncome = totalIncome - totalExpenses;
  const isPositive = netIncome >= 0;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Income vs. Expenses</CardTitle>
        <CardDescription>Monthly income and expense breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Income</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Expenses
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${
                isPositive
                  ? "bg-blue-50 dark:bg-blue-950/20"
                  : "bg-orange-50 dark:bg-orange-950/20"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <DollarSign
                  className={`h-5 w-5 ${
                    isPositive ? "text-blue-600" : "text-orange-600"
                  }`}
                />
              </div>
              <div
                className={`text-2xl font-bold ${
                  isPositive ? "text-blue-600" : "text-orange-600"
                }`}
              >
                ${Math.abs(netIncome).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {isPositive ? "Net Income" : "Net Loss"}
              </div>
            </div>
          </div>

          <div className="h-80">
            <BarChart
              data={exampleData}
              index="category"
              categories={["income", "expenses"]}
              colors={["emerald", "red"]}
              showLegend={true}
              showGridLines={true}
              showAnimation={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
