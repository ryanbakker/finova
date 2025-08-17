"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FinancialGoal } from "@/lib/types";
import {
  Calendar,
  Target,
  TrendingUp,
  Flag,
  Shield,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Building2,
  CreditCard,
} from "lucide-react";

interface GoalDetailsDialogProps {
  goal: FinancialGoal | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "AUD"): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Emergency Fund": <Shield className="h-6 w-6 text-blue-600" />,
    Retirement: <Target className="h-6 w-6 text-green-600" />,
    "Home Purchase": <Home className="h-6 w-6 text-purple-600" />,
    "Vehicle Purchase": <Car className="h-6 w-6 text-orange-600" />,
    Education: <GraduationCap className="h-6 w-6 text-indigo-600" />,
    Travel: <Plane className="h-6 w-6 text-cyan-600" />,
    Wedding: <Heart className="h-6 w-6 text-pink-600" />,
    "Business Startup": <Building2 className="h-6 w-6 text-gray-600" />,
    "Investment Portfolio": <TrendingUp className="h-6 w-6 text-emerald-600" />,
    "Debt Payoff": <CreditCard className="h-6 w-6 text-red-600" />,
  };

  return iconMap[category] || <Flag className="h-6 w-6 text-gray-600" />;
};

// Helper function to get priority badge
const getPriorityBadge = (priority: string) => {
  const priorityMap = {
    low: {
      label: "Low",
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    medium: {
      label: "Medium",
      bgColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    high: {
      label: "High",
      bgColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };

  const { label, bgColor } =
    priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;

  return (
    <Badge
      variant="outline"
      className={`${bgColor} border-opacity-60 bg-opacity-80`}
    >
      {label}
    </Badge>
  );
};

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  const statusMap = {
    active: {
      label: "Active",
      bgColor: "bg-green-50 text-green-700 border-green-200",
    },
    completed: {
      label: "Completed",
      bgColor: "bg-slate-50 text-slate-700 border-slate-200",
    },
    paused: {
      label: "Paused",
      bgColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
  };

  const { label, bgColor } =
    statusMap[status as keyof typeof statusMap] || statusMap.active;

  return (
    <Badge
      variant="outline"
      className={`${bgColor} border-opacity-60 bg-opacity-80`}
    >
      {label}
    </Badge>
  );
};

// Helper function to calculate progress percentage
const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

// Helper function to get days until target
const getDaysUntilTarget = (targetDate: string): number => {
  return Math.ceil(
    (new Date(targetDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

export function GoalDetailsDialog({
  goal,
  isOpen,
  onClose,
}: GoalDetailsDialogProps) {
  if (!goal) return null;

  const progressPercentage = getProgressPercentage(
    goal.currentAmount,
    goal.targetAmount
  );
  const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getCategoryIcon(goal.category)}
            <span>{goal.name}</span>
          </DialogTitle>
          <DialogDescription>
            {goal.category} • {goal.notes}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Progress Overview</h3>
              <div className="flex space-x-2">
                {getPriorityBadge(goal.priority)}
                {getStatusBadge(goal.status)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Amount</span>
                <span className="font-medium">
                  {formatCurrency(goal.currentAmount, goal.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Amount</span>
                <span className="font-medium">
                  {formatCurrency(goal.targetAmount, goal.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  {formatCurrency(remainingAmount, goal.currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  Target Date: {formatDate(goal.targetDate)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {daysUntilTarget > 0
                    ? `${daysUntilTarget} days remaining`
                    : `${Math.abs(daysUntilTarget)} days overdue`}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Currency
                </label>
                <div className="font-medium">{goal.currency}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <div className="font-medium">
                  {new Date(goal.createdAt).toLocaleDateString("en-AU")}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {goal.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{goal.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
