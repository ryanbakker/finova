"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FinancialGoal } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GoalDetailsDialog,
  EditGoalDialog,
  DeleteGoalDialog,
  GoalFilters,
  GoalTableSkeleton,
} from "@/components/goals";
import {
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Target,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Building2,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface GoalListProps {
  data: FinancialGoal[];
  isLoading?: boolean;
  onDelete?: (goalId: string) => void;
  onEdit?: (goal: FinancialGoal) => void;
}

const formatCurrency = (amount: number, currency: string = "AUD"): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

const getProgressColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-rose-600 dark:bg-rose-400";
  if (percentage >= 75) return "bg-amber-600 dark:bg-amber-400";
  return "bg-sky-500 dark:bg-sky-400";
};

const getCategoryIcon = (category: string) => {
  const common = "h-4 w-4 text-sky-500";
  const iconMap: Record<string, React.ReactNode> = {
    "Emergency Fund": <Shield className={common} />,
    Retirement: <Target className={common} />,
    "Home Purchase": <Home className={common} />,
    "Vehicle Purchase": <Car className={common} />,
    Education: <GraduationCap className={common} />,
    Travel: <Plane className={common} />,
    Wedding: <Heart className={common} />,
    "Business Startup": <Building2 className={common} />,
    "Investment Portfolio": <TrendingUp className={common} />,
    "Debt Payoff": <CreditCard className={common} />,
  };
  return iconMap[category] || <Target className={common} />;
};

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
  } as const;

  const mapping =
    (priorityMap as Record<string, { label: string; bgColor: string }>)[
      priority
    ] || priorityMap.medium;
  return (
    <Badge
      variant="outline"
      className={`${mapping.bgColor} border-opacity-60 bg-opacity-80`}
    >
      {mapping.label}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  if (status === "active") {
    return null;
  }
  const statusMap = {
    active: {
      label: "Active",
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    completed: {
      label: "Completed",
      bgColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    paused: {
      label: "Paused",
      bgColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
  } as const;

  const mapping =
    (statusMap as Record<string, { label: string; bgColor: string }>)[status] ||
    statusMap.active;
  return (
    <Badge
      variant="outline"
      className={`${mapping.bgColor} border-opacity-60 bg-opacity-80`}
    >
      {mapping.label}
    </Badge>
  );
};

export function GoalList({
  data,
  isLoading = false,
  onDelete,
  onEdit,
}: GoalListProps) {
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const searchParams = useSearchParams();

  const nameFilter = searchParams.get("name") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedPriority = searchParams.get("priority") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");

  const filteredData = useMemo(() => {
    let filtered = data;
    if (nameFilter) {
      filtered = filtered.filter((goal) =>
        goal.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((goal) => goal.category === selectedCategory);
    }
    if (selectedPriority !== "all") {
      filtered = filtered.filter((goal) => goal.priority === selectedPriority);
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((goal) => goal.status === selectedStatus);
    }
    if (minAmount) {
      filtered = filtered.filter(
        (goal) => goal.targetAmount >= parseFloat(minAmount)
      );
    }
    if (maxAmount) {
      filtered = filtered.filter(
        (goal) => goal.targetAmount <= parseFloat(maxAmount)
      );
    }
    return filtered;
  }, [
    data,
    nameFilter,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    minAmount,
    maxAmount,
  ]);

  const handleView = useCallback((goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDetailsOpen(true);
  }, []);

  const handleEdit = useCallback(
    (goal: FinancialGoal) => {
      if (onEdit) {
        onEdit(goal);
      } else {
        setSelectedGoal(goal);
        setIsEditOpen(true);
      }
    },
    [onEdit]
  );

  const handleDelete = useCallback((goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedGoal && onDelete) {
      const goalId = selectedGoal._id || selectedGoal.id;
      if (goalId) {
        onDelete(goalId);
        setIsDeleteOpen(false);
        setSelectedGoal(null);
      }
    }
  }, [selectedGoal, onDelete]);

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedGoal(null);
  }, []);

  const closeEdit = useCallback(() => {
    setIsEditOpen(false);
    setSelectedGoal(null);
  }, []);

  const closeDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setSelectedGoal(null);
  }, []);

  useEffect(() => {
    // Close dialogs if data becomes empty (e.g., after delete)
    if (!data || data.length === 0) {
      setIsDetailsOpen(false);
      setIsEditOpen(false);
      setIsDeleteOpen(false);
      setSelectedGoal(null);
    }
  }, [data]);

  if (isLoading) {
    return <GoalTableSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No goals to show
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by adding your first financial goal to track your
            progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoalFilters />

      <div className="rounded-md border bg-card">
        <div className="max-h-[600px] overflow-y-auto divide-y">
          {filteredData.map((goal) => {
            const percentage = getProgressPercentage(
              goal.currentAmount,
              goal.targetAmount
            );
            const barColor = getProgressColor(percentage);
            const daysUntilTarget = Math.ceil(
              (new Date(goal.targetDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={goal._id || goal.id || goal.name}
                className="group px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleView(goal)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-1 shrink-0">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{goal.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {goal.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {getPriorityBadge(goal.priority)}
                    {getStatusBadge(goal.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(goal);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(goal);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(goal);
                          }}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Goal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.currentAmount, goal.currency)}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(goal.targetDate)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(goal.targetAmount, goal.currency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{percentage}% Complete</span>
                    <span>
                      {daysUntilTarget > 0
                        ? `${daysUntilTarget} days left`
                        : `${Math.abs(daysUntilTarget)} days overdue`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GoalDetailsDialog
        goal={selectedGoal}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
      />
      <EditGoalDialog
        goal={selectedGoal}
        isOpen={isEditOpen}
        onClose={closeEdit}
        onSave={closeEdit}
      />
      <DeleteGoalDialog
        goal={selectedGoal}
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default GoalList;
