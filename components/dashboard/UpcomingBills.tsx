import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CreditCard, Wifi, Zap, Home, Car } from "lucide-react";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  icon: React.ReactNode;
}

const exampleBills: Bill[] = [
  {
    id: "1",
    name: "Rent Payment",
    amount: 1800,
    dueDate: "2024-11-30",
    category: "Housing",
    isRecurring: true,
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "2",
    name: "Car Insurance",
    amount: 89.5,
    dueDate: "2024-12-02",
    category: "Transportation",
    isRecurring: true,
    icon: <Car className="h-4 w-4" />,
  },
  {
    id: "3",
    name: "Electric Bill",
    amount: 145.2,
    dueDate: "2024-12-05",
    category: "Utilities",
    isRecurring: true,
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "4",
    name: "Internet Service",
    amount: 79.99,
    dueDate: "2024-12-08",
    category: "Utilities",
    isRecurring: true,
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    id: "5",
    name: "Credit Card Payment",
    amount: 450,
    dueDate: "2024-12-12",
    category: "Credit",
    isRecurring: true,
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "6",
    name: "Phone Bill",
    amount: 65.0,
    dueDate: "2024-12-15",
    category: "Utilities",
    isRecurring: true,
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    id: "7",
    name: "Gym Membership",
    amount: 45.0,
    dueDate: "2024-12-20",
    category: "Entertainment",
    isRecurring: true,
    icon: <CreditCard className="h-4 w-4" />,
  },
];

interface UpcomingBillsProps {
  isLoading?: boolean;
}

export function UpcomingBills({ isLoading = false }: UpcomingBillsProps) {
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue <= 3) return "destructive";
    if (daysUntilDue <= 7) return "default";
    return "secondary";
  };

  const getUrgencyText = (daysUntilDue: number) => {
    if (daysUntilDue <= 0) return "Overdue";
    if (daysUntilDue === 1) return "Due tomorrow";
    if (daysUntilDue <= 3) return `Due in ${daysUntilDue} days`;
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  const sortedBills = [...exampleBills].sort((a, b) => {
    const daysA = getDaysUntilDue(a.dueDate);
    const daysB = getDaysUntilDue(b.dueDate);
    return daysA - daysB;
  });

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-3 h-3" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Bills & Subscriptions</CardTitle>
        <CardDescription>
          Track your upcoming payments and due dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedBills.map((bill) => {
            const daysUntilDue = getDaysUntilDue(bill.dueDate);
            const urgencyColor = getUrgencyColor(daysUntilDue);
            const urgencyText = getUrgencyText(daysUntilDue);

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted">{bill.icon}</div>
                  <div>
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {bill.category}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    ${bill.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <Badge variant={urgencyColor} className="text-xs">
                      {urgencyText}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Total Due This Month
              </span>
              <span className="font-medium">$2,614.69</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Recurring Bills</span>
              <span className="font-medium">
                {exampleBills.filter((bill) => bill.isRecurring).length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
