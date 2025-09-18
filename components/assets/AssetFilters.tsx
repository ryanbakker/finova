"use client";

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Asset } from "@/lib/types";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategoriesByType } from "@/constants";
import { getCategoryIcon } from "@/lib/categories";

interface AssetFiltersProps<TData extends Asset> {
  table?: Table<TData>;
}

export function AssetFilters<TData extends Asset>({
  table,
}: AssetFiltersProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current filter values from URL
  const nameFilter = searchParams.get("name") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const minValueFilter = searchParams.get("minValue") || "";
  const maxValueFilter = searchParams.get("maxValue") || "";

  // Get asset categories
  const assetCategories = getCategoriesByType("assets");

  // Function to format column names for display
  const formatColumnName = (columnId: string) => {
    const columnNames: Record<string, string> = {
      select: "Select",
      name: "Name",
      category: "Category",
      currentValue: "Current Value",
      purchaseDate: "Purchase Date",
      isActive: "Status",
      actions: "Actions",
    };
    return (
      columnNames[columnId] ||
      columnId.charAt(0).toUpperCase() + columnId.slice(1)
    );
  };

  // Count active filters
  const activeFiltersCount = [
    nameFilter,
    categoryFilter !== "all",
    statusFilter !== "all",
    minValueFilter,
    maxValueFilter,
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

  // Handle individual filter changes
  const handleNameFilter = (value: string) => {
    updateFilters({ name: value });
  };

  const handleCategoryFilter = (value: string) => {
    updateFilters({ category: value });
  };

  const handleStatusFilter = (value: string) => {
    updateFilters({ status: value });
  };

  const handleMinValueFilter = (value: string) => {
    updateFilters({ minValue: value });
  };

  const handleMaxValueFilter = (value: string) => {
    updateFilters({ maxValue: value });
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Clear specific filter
  const clearFilter = (filterName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    router.push(`${pathname}?${params.toString()}`);
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
  }, [nameFilter, categoryFilter, statusFilter, table]);

  return (
    <div className="space-y-4">
      {/* Top bar with search, Filters toggle, Columns, Clear */}
      <div className="flex gap-3 md:gap-0 md:items-center md:space-x-2 flex-col md:flex-row">
        <div className="relative flex-1 w-full">
          <Label htmlFor="name-filter" className="sr-only">
            Search by name
          </Label>
          <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name-filter"
            placeholder="Search assets..."
            value={nameFilter}
            onChange={(e) => handleNameFilter(e.target.value)}
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
                      {formatColumnName(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
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
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {assetCategories.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  return (
                    <SelectItem key={category.name} value={category.name}>
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min value */}
          <div className="space-y-2">
            <Label htmlFor="min-value">Min Value</Label>
            <Input
              id="min-value"
              placeholder="Min $"
              value={minValueFilter}
              onChange={(e) => handleMinValueFilter(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Max value */}
          <div className="space-y-2">
            <Label htmlFor="max-value">Max Value</Label>
            <Input
              id="max-value"
              placeholder="Max $"
              value={maxValueFilter}
              onChange={(e) => handleMaxValueFilter(e.target.value)}
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

          {(minValueFilter || maxValueFilter) && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Value: {minValueFilter || "0"} - {maxValueFilter || "∞"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => {
                  clearFilter("minValue");
                  clearFilter("maxValue");
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
