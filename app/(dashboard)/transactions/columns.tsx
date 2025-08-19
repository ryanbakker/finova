"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowUpDown,
} from "lucide-react";

// Action handlers interface
interface ActionHandlers {
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
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

export const createColumns = (
  sortStates: Record<string, "asc" | "desc" | false>,
  onToggleSort: (columnId: string) => void
): ColumnDef<Transaction>[] => [
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
    accessorKey: "description",
    header: () => (
      <SortableHeader
        columnId="description"
        sortState={sortStates.description || false}
        onToggleSort={onToggleSort}
      >
        Description
      </SortableHeader>
    ),
    enableHiding: true,
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

      const getAmountStyle = (amount: number) => {
        if (amount > 0) {
          return "text-emerald-600 dark:text-emerald-400 font-semibold";
        } else if (amount < 0) {
          return "text-rose-600 dark:text-rose-400 font-semibold";
        } else {
          return "text-slate-600 dark:text-slate-400";
        }
      };

      return (
        <span className={getAmountStyle(amount)}>
          {new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <SortableHeader
        columnId="date"
        sortState={sortStates.date || false}
        onToggleSort={onToggleSort}
      >
        Date
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "accountName",
    header: () => (
      <SortableHeader
        columnId="accountName"
        sortState={sortStates.accountName || false}
        onToggleSort={onToggleSort}
      >
        Account
      </SortableHeader>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "category.name",
    header: () => (
      <SortableHeader
        columnId="category.name"
        sortState={sortStates["category.name"] || false}
        onToggleSort={onToggleSort}
      >
        Category
      </SortableHeader>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: () => (
      <SortableHeader
        columnId="type"
        sortState={sortStates.type || false}
        onToggleSort={onToggleSort}
      >
        Type
      </SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      if (!type) return "Unknown";

      const getTypeStyle = (type: string) => {
        switch (type.toLowerCase()) {
          case "income":
            return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
          case "expense":
            return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
          case "transfer":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
          default:
            return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800";
        }
      };

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeStyle(
            type
          )}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
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
              onClick={() => globalActionHandlers?.onView(transaction)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              data-action="button"
              onClick={() => globalActionHandlers?.onEdit(transaction)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="dark:bg-red-900/40 bg-red-600/20 text-red-500 font-medium dark:hover:bg-red-700/40 dark:hover:text-red-500 cursor-pointer hover:!bg-red-500/50 hover:!text-red-500 transition-all"
              data-action="button"
              onClick={() => globalActionHandlers?.onDelete(transaction)}
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
