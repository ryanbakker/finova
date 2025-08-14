import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  borderColor?: string;
  bgGradientFrom?: string;
  dataValueColor?: string;
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  borderColor,
  bgGradientFrom,
  dataValueColor,
  className,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card
        className={`h-25 col-span-1 border-l-4 bg-gradient-to-r to-white ${borderColor} bg-gradient-to-r ${bgGradientFrom} to-white ${className}`}
      >
        <CardHeader className="px-5 pt-4 pb-0">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="px-5">
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`h-25 col-span-1 border-l-4 bg-gradient-to-r to-white ${borderColor} bg-gradient-to-r ${bgGradientFrom} to-white ${className}`}
    >
      <CardHeader className="px-5 pt-4 pb-0">
        <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <div className={`text-2xl font-bold ${dataValueColor}`}>
          {typeof value === "number" ? `$${value.toLocaleString()}` : value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
