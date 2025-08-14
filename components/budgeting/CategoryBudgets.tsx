import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryData {
  name: string;
  value: number;
  budget: number;
}

interface CategoryBudgetsProps {
  categoryData: CategoryData[];
  isLoading?: boolean;
}

export function CategoryBudgets({
  categoryData,
  isLoading = false,
}: CategoryBudgetsProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage > 80) return "#ef4444"; // red
    if (percentage > 60) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-sky-500">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="w-full h-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-sky-500">
      <CardHeader>
        <CardTitle className="text-sky-700">Category Budgets</CardTitle>
        <CardDescription>
          Individual spending limits by category with visual progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((category) => {
            const percentage = (category.value / category.budget) * 100;

            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${category.value.toLocaleString()} / $
                    {category.budget.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="w-full h-2"
                  style={
                    {
                      "--progress-background": "#e5e7eb",
                      "--progress-foreground": getProgressColor(percentage),
                    } as React.CSSProperties
                  }
                />
                <div className="text-xs text-muted-foreground">
                  ${(category.budget - category.value).toLocaleString()}{" "}
                  remaining
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
