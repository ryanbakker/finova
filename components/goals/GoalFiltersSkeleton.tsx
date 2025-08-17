import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function GoalFiltersSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-24" />
            <span className="text-muted-foreground">-</span>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
