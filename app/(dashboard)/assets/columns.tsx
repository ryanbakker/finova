"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Asset } from "@/lib/types";
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
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { getAssetCategoryIcon } from "@/lib/utils/categoryUtils";

// Action handlers interface
interface ActionHandlers {
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
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

// Helper function to get change badge
const getChangeBadge = (asset: Asset) => {
  if (!asset.changeAmount || !asset.changePercentage) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">
        No change
      </span>
    );
  }

  const isPositive = asset.changeAmount >= 0;
  const changeText = `${isPositive ? "+" : ""}${formatCurrency(
    asset.changeAmount,
    asset.currency
  )} (${isPositive ? "+" : ""}${asset.changePercentage}%)`;

  return (
    <div className="flex items-center space-x-1">
      {isPositive ? (
        <TrendingUp className="h-3 w-3 text-green-600" />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-600" />
      )}
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isPositive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {changeText}
      </span>
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (categoryName: string) => {
  const IconComponent = getAssetCategoryIcon(categoryName);
  if (!IconComponent) return null;

  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
      <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
  );
};

export const createColumns = (
  sortStates: Record<string, "asc" | "desc" | false>,
  toggleSorting: (columnId: string) => void
): ColumnDef<Asset>[] => [
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
        Asset Name
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div className="flex items-center space-x-3">
          {getCategoryIcon(asset.category)}
          <div>
            <div className="font-medium text-sm">{asset.name}</div>
            {asset.institution && (
              <div className="text-xs text-muted-foreground">
                {asset.institution}
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
    accessorKey: "currentValue",
    header: () => (
      <SortableHeader
        columnId="currentValue"
        sortState={sortStates.currentValue || false}
        onToggleSort={toggleSorting}
      >
        Current Value
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div className="text-left">
          <div className="flex items-center justify-start space-x-2 min-h-[1.5rem]">
            <div className="font-medium text-sm leading-none">
              {formatCurrency(
                asset.currentValue || asset.value,
                asset.currency
              )}
            </div>
            {asset.changeAmount !== undefined && (
              <div className="text-xs leading-none">
                {getChangeBadge(asset)}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchaseDate",
    header: () => (
      <SortableHeader
        columnId="purchaseDate"
        sortState={sortStates.purchaseDate || false}
        onToggleSort={toggleSorting}
      >
        Purchase Date
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const purchaseDate = row.getValue("purchaseDate") as string;
      if (!purchaseDate) {
        return <div className="text-sm text-muted-foreground">N/A</div>;
      }
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(purchaseDate)}</span>
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
      const asset = row.original;

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
                globalActionHandlers?.onView(asset);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onEdit(asset);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Asset
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                globalActionHandlers?.onDelete(asset);
              }}
              className="cursor-pointer text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Asset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
