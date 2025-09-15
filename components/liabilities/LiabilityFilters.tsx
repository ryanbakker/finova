"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { Liability } from "@/lib/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Search, Filter, ChevronDown } from "lucide-react";

interface LiabilityFiltersProps {
  table?: Table<Liability>;
}

const liabilityCategories = [
  "All Categories",
  "Mortgage",
  "Vehicle Loan",
  "Credit Card",
  "Personal Loan",
  "Education Loan",
  "Business Loan",
  "Line of Credit",
  "Other",
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function LiabilityFilters({ table }: LiabilityFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);

  // Get current filter values from URL
  const nameFilter = searchParams.get("name") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const minAmount = searchParams.get("minAmount") || "";
  const maxAmount = searchParams.get("maxAmount") || "";

  // Count active filters
  const activeFiltersCount = [
    nameFilter,
    categoryFilter !== "all",
    statusFilter !== "all",
    minAmount,
    maxAmount,
  ].filter(Boolean).length;

  // Update URL with new filter values
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to first page when filtering
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear specific filter
  const clearFilter = (filterName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Apply filters to table (only if table is provided)
  useEffect(() => {
    if (!table) return;

    if (nameFilter) {
      table.getColumn("name")?.setFilterValue(nameFilter);
    } else {
      table.getColumn("name")?.setFilterValue("");
    }

    if (categoryFilter !== "all") {
      table.getColumn("category")?.setFilterValue(categoryFilter);
    } else {
      table.getColumn("category")?.setFilterValue("");
    }

    if (statusFilter !== "all") {
      table.getColumn("isActive")?.setFilterValue(statusFilter === "active");
    } else {
      table.getColumn("isActive")?.setFilterValue("");
    }

    if (minAmount || maxAmount) {
      table.getColumn("currentValue")?.setFilterValue({
        min: minAmount ? parseFloat(minAmount) : undefined,
        max: maxAmount ? parseFloat(maxAmount) : undefined,
      });
    } else {
      table.getColumn("currentValue")?.setFilterValue("");
    }
  }, [table, nameFilter, categoryFilter, statusFilter, minAmount, maxAmount]);

  // Helper to format column names for display
  const formatColumnName = (columnId: string) => {
    const columnNames: Record<string, string> = {
      select: "Select",
      name: "Name",
      category: "Category",
      amount: "Amount",
      currentValue: "Current Amount",
      interestRate: "Interest Rate",
      monthlyPayment: "Monthly Payment",
      dueDate: "Due Date",
      isActive: "Status",
      actions: "Actions",
    };
    return (
      columnNames[columnId] ||
      columnId.charAt(0).toUpperCase() + columnId.slice(1)
    );
  };

  return (
    <div className="space-y-4">
      {/* Top bar with search, Columns, Filters toggle, Clear */}
      <div className="flex gap-3 md:gap-0 md:items-center md:space-x-2 flex-col md:flex-row">
        <div className="relative flex-1 w-full">
          <Label htmlFor="liability-name-filter" className="sr-only">
            Search by name
          </Label>
          <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="liability-name-filter"
            placeholder="Search liabilities..."
            value={nameFilter}
            onChange={(e) => updateFilters({ name: e.target.value })}
            className="pl-10 w-full text-sm"
          />
          {nameFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => clearFilter("name")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer shadow-sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {formatColumnName(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-1 cursor-pointer ${
            isExpanded || activeFiltersCount > 0
              ? "bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 text-white border-sky-600 hover:from-sky-600 hover:via-sky-600 hover:to-sky-700 hover:border-sky-700 hover:text-white"
              : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 h-2 w-2 rounded-full bg-white"></span>
          )}
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={categoryFilter}
              onValueChange={(v) => updateFilters({ category: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {liabilityCategories
                  .filter((category) => category !== "All Categories")
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(v) => updateFilters({ status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Amount */}
          <div className="space-y-2">
            <Label htmlFor="min-amount">Min Amount</Label>
            <Input
              id="min-amount"
              placeholder="Min $"
              value={minAmount}
              onChange={(e) => updateFilters({ minAmount: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Max Amount */}
          <div className="space-y-2">
            <Label htmlFor="max-amount">Max Amount</Label>
            <Input
              id="max-amount"
              placeholder="Max $"
              value={maxAmount}
              onChange={(e) => updateFilters({ maxAmount: e.target.value })}
              className="text-sm"
            />
          </div>
        </div>
      )}

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {nameFilter && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Name: {nameFilter}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => clearFilter("name")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {categoryFilter !== "all" && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Category: {categoryFilter}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => clearFilter("category")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {statusFilter !== "all" && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Status: {statusFilter === "active" ? "Active" : "Inactive"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => clearFilter("status")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {(minAmount || maxAmount) && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Amount: {minAmount || "0"} - {maxAmount || "∞"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => {
                  clearFilter("minAmount");
                  clearFilter("maxAmount");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
