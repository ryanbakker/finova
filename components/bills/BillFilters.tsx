"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategoriesByType } from "@/constants";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BillFiltersProps {
  table?: {
    getAllColumns: () => Array<{
      id: string;
      getCanHide: () => boolean;
      getIsVisible: () => boolean;
      toggleVisibility: (value: boolean) => void;
    }>;
  };
}

export function BillFilters({ table }: BillFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get bill categories and statuses
  const billCategories = getCategoriesByType("bills").map((cat) => cat.name);
  const billStatuses = ["paid", "unpaid", "overdue"];

  // Get current filter values from URL
  const nameFilter = searchParams.get("name") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const selectedRecurring = searchParams.get("recurring") || "all";

  // Convert string dates to Date objects for the date range picker
  const getDateRange = useCallback(() => {
    if (dateFrom && dateTo) {
      return {
        from: new Date(dateFrom),
        to: new Date(dateTo),
      };
    }
    return undefined;
  }, [dateFrom, dateTo]);

  const [localFilters, setLocalFilters] = useState({
    name: nameFilter,
    dateRange: getDateRange(),
    category: selectedCategory,
    status: selectedStatus,
    recurring: selectedRecurring,
  });

  // Update local filters when URL params change
  useEffect(() => {
    setLocalFilters({
      name: nameFilter,
      dateRange: getDateRange(),
      category: selectedCategory,
      status: selectedStatus,
      recurring: selectedRecurring,
    });
  }, [
    nameFilter,
    dateFrom,
    dateTo,
    selectedCategory,
    selectedStatus,
    selectedRecurring,
    getDateRange,
  ]);

  const updateFilters = (newFilters: Partial<typeof localFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);

    // Build new URL with filters
    const params = new URLSearchParams(searchParams);

    // Handle name filter
    if (updatedFilters.name) {
      params.set("name", updatedFilters.name);
    } else {
      params.delete("name");
    }

    // Handle date range filter
    if (updatedFilters.dateRange?.from && updatedFilters.dateRange?.to) {
      params.set(
        "dateFrom",
        updatedFilters.dateRange.from.toISOString().split("T")[0]
      );
      params.set(
        "dateTo",
        updatedFilters.dateRange.to.toISOString().split("T")[0]
      );
    } else {
      params.delete("dateFrom");
      params.delete("dateTo");
    }

    // Handle other filters
    if (updatedFilters.category !== "all") {
      params.set("category", updatedFilters.category);
    } else {
      params.delete("category");
    }

    if (updatedFilters.status !== "all") {
      params.set("status", updatedFilters.status);
    } else {
      params.delete("status");
    }

    if (updatedFilters.recurring !== "all") {
      params.set("recurring", updatedFilters.recurring);
    } else {
      params.delete("recurring");
    }

    // Reset to first page when filtering
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      name: "",
      dateRange: undefined,
      category: "all",
      status: "all",
      recurring: "all",
    });
    router.push("");
  };

  const hasActiveFilters = Object.values(localFilters).some((value) => {
    if (value === undefined || value === "") return false;
    if (value === "all") return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Basic Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills by name..."
            value={localFilters.name}
            onChange={(e) => updateFilters({ name: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 ${
            isExpanded || hasActiveFilters
              ? "bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 text-white border-sky-600 hover:from-sky-600 hover:via-sky-600 hover:to-sky-700 hover:border-sky-700 hover:text-white"
              : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 h-2 w-2 rounded-full bg-white"></span>
          )}
        </Button>
        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer shadow-sm"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {hasActiveFilters && (
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
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <DateRangePicker
              value={localFilters.dateRange}
              onChange={(dateRange) => updateFilters({ dateRange })}
              placeholder="Select date range"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={localFilters.category}
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {billCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => updateFilters({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {billStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Filter */}
          <div className="space-y-2">
            <Label htmlFor="recurring">Recurring</Label>
            <Select
              value={localFilters.recurring}
              onValueChange={(value) => updateFilters({ recurring: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All bills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="yes">Recurring Only</SelectItem>
                <SelectItem value="no">One-time Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {localFilters.name && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Name: {localFilters.name}
            </span>
          )}
          {localFilters.dateRange &&
            localFilters.dateRange.from &&
            localFilters.dateRange.to && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Date: {format(localFilters.dateRange.from, "MM/dd/yyyy")} to{" "}
                {format(localFilters.dateRange.to, "MM/dd/yyyy")}
              </span>
            )}
          {localFilters.category !== "all" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Category: {localFilters.category}
            </span>
          )}
          {localFilters.status !== "all" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Status: {localFilters.status}
            </span>
          )}
          {localFilters.recurring !== "all" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              {localFilters.recurring === "yes"
                ? "Recurring Only"
                : "One-time Only"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
