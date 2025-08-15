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
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (asc: boolean) => void;
  };
  children: React.ReactNode;
  className?: string;
}

const SortableHeader = ({
  column,
  children,
  className = "",
}: SortableHeaderProps) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={`h-auto p-0 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
        isSorted ? "table-header-sorted" : ""
      } ${className}`}
    >
      {children}
      {isSorted === "asc" ? (
        <MoveUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : isSorted === "desc" ? (
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

export const createColumns = (): ColumnDef<Transaction>[] => [
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
    accessorKey: "payee",
    header: ({ column }) => (
      <SortableHeader column={column}>Payee</SortableHeader>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortableHeader column={column}>Amount</SortableHeader>
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
    accessorKey: "date",
    header: ({ column }) => (
      <SortableHeader column={column}>Date</SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <SortableHeader column={column}>Account</SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const account = row.getValue("account") as { name: string };
      return account?.name || "Unknown";
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <SortableHeader column={column}>Category</SortableHeader>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const category = row.getValue("category") as { name: string };
      return category?.name || "Unknown";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    enableHiding: true,
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
