"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Liability } from "@/lib/types";
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
  Building2,
  CreditCard,
  TrendingDown,
  DollarSign,
  FileText,
  Percent,
} from "lucide-react";

// Action handlers interface
interface ActionHandlers {
  onView: (liability: Liability) => void;
  onEdit: (liability: Liability) => void;
  onDelete: (liability: Liability) => void;
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
  switch (category.toLowerCase()) {
    case "mortgage":
      return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "vehicle loan":
      return (
        <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    case "credit card":
      return (
        <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      );
    case "personal loan":
      return (
        <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      );
    case "education loan":
      return (
        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      );
    case "business loan":
      return <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    case "line of credit":
      return (
        <CreditCard className="w-4 h-4 text-pink-600 dark:text-pink-400" />
      );
    default:
      return (
        <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      );
  }
};

export const createColumns = (
  sortStates: Record<string, "asc" | "desc" | false>,
  toggleSorting: (columnId: string) => void
): ColumnDef<Liability>[] => [
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
        className="ml-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-2"
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
        onToggleSort={toggleSorting}
      >
        Liability Name
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const liability = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            {getCategoryIcon(liability.category)}
          </div>
          <div>
            <div className="font-medium text-sm">{liability.name}</div>
            {liability.institution && (
              <div className="text-xs text-muted-foreground">
                {liability.institution}
              </div>
            )}
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
        onToggleSort={toggleSorting}
      >
        Category
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <SortableHeader
        columnId="amount"
        sortState={sortStates.amount || false}
        onToggleSort={toggleSorting}
      >
        Current Amount
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const liability = row.original;
      return (
        <div className="text-left">
          <div className="font-medium text-sm text-red-600 dark:text-red-400">
            {formatCurrency(liability.amount, liability.currency)}
          </div>
          {liability.remainingBalance &&
            liability.remainingBalance !== liability.amount && (
              <div className="text-xs text-muted-foreground">
                Remaining:{" "}
                {formatCurrency(liability.remainingBalance, liability.currency)}
              </div>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "interestRate",
    header: () => (
      <SortableHeader
        columnId="interestRate"
        sortState={sortStates.interestRate || false}
        onToggleSort={toggleSorting}
      >
        Interest Rate
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const interestRate = row.getValue("interestRate") as number;
      if (!interestRate) {
        return <div className="text-sm text-muted-foreground">N/A</div>;
      }
      return (
        <div className="flex items-center space-x-1">
          <Percent className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{interestRate.toFixed(2)}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "monthlyPayment",
    header: () => (
      <SortableHeader
        columnId="monthlyPayment"
        sortState={sortStates.monthlyPayment || false}
        onToggleSort={toggleSorting}
      >
        Monthly Payment
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const monthlyPayment = row.getValue("monthlyPayment") as number;
      if (!monthlyPayment) {
        return <div className="text-sm text-muted-foreground">N/A</div>;
      }
      return (
        <div className="text-sm">
          {formatCurrency(monthlyPayment, row.original.currency)}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: () => (
      <SortableHeader
        columnId="dueDate"
        sortState={sortStates.dueDate || false}
        onToggleSort={toggleSorting}
      >
        Due Date
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string;
      if (!dueDate) {
        return <div className="text-sm text-muted-foreground">N/A</div>;
      }
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(dueDate)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <SortableHeader
        columnId="isActive"
        sortState={sortStates.isActive || false}
        onToggleSort={toggleSorting}
      >
        Status
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const liability = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onView(liability);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onEdit(liability);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Liability
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onDelete(liability);
              }}
              className="cursor-pointer text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Liability
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
