"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bill } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { getBillCategoryIcon } from "@/lib/utils/categoryUtils";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowUpDown,
  Calendar,
} from "lucide-react";

// Action handlers interface
interface ActionHandlers {
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
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
      onClick={() => onToggleSort(columnId)}
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

// Helper function to format date to desired format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format date to DD/MM/YY (Australian format)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};

// Helper function to get days until due
const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get status badge
const getStatusBadge = (bill: Bill) => {
  const daysUntilDue = getDaysUntilDue(bill.dueDate);

  if (bill.status === "paid") {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
        Paid
      </span>
    );
  }

  if (daysUntilDue < 0) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
        Overdue
      </span>
    );
  }

  if (daysUntilDue <= 7) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
        Due Soon
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
      Upcoming
    </span>
  );
};

export const createColumns = (
  sortStates: Record<string, "asc" | "desc" | false>,
  onToggleSort: (columnId: string) => void
): ColumnDef<Bill>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="ml-1"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ml-1"
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
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
        sortState={sortStates.name || false}
        onToggleSort={onToggleSort}
      >
        Bill Name
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const bill = row.original;
      const IconComponent = getBillCategoryIcon(bill.category);

      return (
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-muted">
            {IconComponent ? (
              <IconComponent className="h-4 w-4" />
            ) : (
              <span className="text-muted-foreground text-sm">📄</span>
            )}
          </div>
          <span className="font-medium">{bill.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => (
      <SortableHeader
        columnId="amount"
        sortState={sortStates.amount || false}
        onToggleSort={onToggleSort}
      >
        Amount
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
  },
  {
    accessorKey: "dueDate",
    header: () => (
      <SortableHeader
        columnId="dueDate"
        sortState={sortStates.dueDate || false}
        onToggleSort={onToggleSort}
      >
        Due Date
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string;
      const daysUntilDue = getDaysUntilDue(dueDate);
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{formatDate(dueDate)}</div>
            <div className="text-xs text-muted-foreground">
              {daysUntilDue < 0
                ? `${Math.abs(daysUntilDue)} days overdue`
                : daysUntilDue === 0
                ? "Due today"
                : `${daysUntilDue} days left`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => (
      <SortableHeader
        columnId="category"
        sortState={sortStates.category || false}
        onToggleSort={onToggleSort}
      >
        Category
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-full">
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <SortableHeader
        columnId="status"
        sortState={sortStates.status || false}
        onToggleSort={onToggleSort}
      >
        Status
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const bill = row.original;
      return getStatusBadge(bill);
    },
  },
  {
    accessorKey: "isRecurring",
    header: () => (
      <SortableHeader
        columnId="isRecurring"
        sortState={sortStates.isRecurring || false}
        onToggleSort={onToggleSort}
      >
        Recurring
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const isRecurring = row.getValue("isRecurring") as boolean;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isRecurring
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {isRecurring ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              data-action="button"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuItem
              className="cursor-pointer"
              data-action="button"
              onClick={() => globalActionHandlers?.onView(bill)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              data-action="button"
              onClick={() => globalActionHandlers?.onEdit(bill)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="dark:bg-red-900/40 bg-red-600/20 text-red-500 font-medium dark:hover:bg-red-700/40 dark:hover:text-red-500 cursor-pointer hover:!bg-red-500/50 hover:!text-red-500 transition-all"
              data-action="button"
              onClick={() => globalActionHandlers?.onDelete(bill)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
