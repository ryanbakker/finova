import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  borderColor?: string;
  bgGradientFrom?: string;
  dataValueColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  borderColor,
  bgGradientFrom,
  dataValueColor,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={`h-25 col-span-1 border-l-4 bg-gradient-to-r to-white ${borderColor} bg-gradient-to-br ${bgGradientFrom} to-white ${className}`}
    >
      <CardHeader className="px-5 pt-4 pb-0">
        <CardTitle className="text-sm font-medium text-sky-900">
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
