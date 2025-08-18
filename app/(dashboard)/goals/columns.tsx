"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FinancialGoal } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowUpDown,
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

// Action handlers interface
interface ActionHandlers {
  onView: (goal: FinancialGoal) => void;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goal: FinancialGoal) => void;
}

// Global event system for actions
let globalActionHandlers: ActionHandlers | null = null;

export const setGlobalActionHandlers = (handlers: ActionHandlers) => {
  globalActionHandlers = handlers;
};

// Dynamic sortable header component
interface SortableHeaderProps {
  columnId: string;
  sortState: "asc" | "desc" | false;
  onToggleSort: (columnId: string) => void;
  children: React.ReactNode;
  className?: string;
}

const SortableHeader = ({
  columnId,
  sortState,
  onToggleSort,
  children,
  className = "",
}: SortableHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        onToggleSort(columnId);
      }}
      className={`h-auto p-0 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
        sortState ? "table-header-sorted" : ""
      } ${className}`}
    >
      {children}
      {sortState === "asc" ? (
        <MoveUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : sortState === "desc" ? (
        <MoveDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : (
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
      )}
    </Button>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "AUD"): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date to desired format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format date to DD/MM/YY (Australian format)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "Emergency Fund": <Shield className="h-4 w-4 text-blue-600" />,
    Retirement: <Target className="h-4 w-4 text-green-600" />,
    "Home Purchase": <Home className="h-4 w-4 text-purple-600" />,
    "Vehicle Purchase": <Car className="h-4 w-4 text-orange-600" />,
    Education: <GraduationCap className="h-4 w-4 text-indigo-600" />,
    Travel: <Plane className="h-4 w-4 text-cyan-600" />,
    Wedding: <Heart className="h-4 w-4 text-pink-600" />,
    "Business Startup": <Building2 className="h-4 w-4 text-gray-600" />,
    "Investment Portfolio": <TrendingUp className="h-4 w-4 text-emerald-600" />,
    "Debt Payoff": <CreditCard className="h-4 w-4 text-red-600" />,
  };

  return iconMap[category] || <Flag className="h-4 w-4 text-gray-600" />;
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

// Helper function to get progress color
const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  if (percentage >= 20) return "text-orange-600";
  return "text-red-600";
};

export const columns: ColumnDef<FinancialGoal>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <SortableHeader
        columnId="name"
        sortState={false}
        onToggleSort={() => {}}
        className="text-left"
      >
        Goal Name
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const goal = row.original;
      return (
        <div className="flex items-center space-x-3">
          {getCategoryIcon(goal.category)}
          <div>
            <div className="font-medium">{goal.name}</div>
            <div className="text-sm text-muted-foreground">{goal.category}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: () => (
      <SortableHeader
        columnId="progress"
        sortState={false}
        onToggleSort={() => {}}
        className="text-left"
      >
        Progress
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const goal = row.original;
      const percentage = getProgressPercentage(
        goal.currentAmount,
        goal.targetAmount
      );
      const progressColor = getProgressColor(percentage);

      return (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(goal.currentAmount, goal.currency)}
            </span>
            <span className={progressColor}>
              {formatCurrency(goal.targetAmount, goal.currency)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progressColor === "text-green-600"
                  ? "bg-green-600"
                  : progressColor === "text-blue-600"
                  ? "bg-blue-600"
                  : progressColor === "text-yellow-600"
                  ? "bg-yellow-600"
                  : progressColor === "text-orange-600"
                  ? "bg-orange-600"
                  : "bg-red-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground">
            {percentage}% Complete
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "targetDate",
    header: () => (
      <SortableHeader
        columnId="targetDate"
        sortState={false}
        onToggleSort={() => {}}
        className="text-left"
      >
        Target Date
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const goal = row.original;
      const daysUntilTarget = Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{formatDate(goal.targetDate)}</div>
            <div className="text-sm text-muted-foreground">
              {daysUntilTarget > 0
                ? `${daysUntilTarget} days left`
                : `${Math.abs(daysUntilTarget)} days overdue`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => (
      <SortableHeader
        columnId="priority"
        sortState={false}
        onToggleSort={() => {}}
        className="text-left"
      >
        Priority
      </SortableHeader>
    ),
    cell: ({ row }) => {
      return getPriorityBadge(row.original.priority);
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <SortableHeader
        columnId="status"
        sortState={false}
        onToggleSort={() => {}}
        className="text-left"
      >
        Status
      </SortableHeader>
    ),
    cell: ({ row }) => {
      return getStatusBadge(row.original.status);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const goal = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
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
                globalActionHandlers?.onView(goal);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onEdit(goal);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Goal
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onDelete(goal);
              }}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
