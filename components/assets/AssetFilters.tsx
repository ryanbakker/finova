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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

interface AssetFiltersProps<TData extends Asset> {
  table?: Table<TData>;
}

export function AssetFilters<TData extends Asset>({
  table,
}: AssetFiltersProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
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
    <div className="flex flex-col">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center space-x-4 w-full">
        {/* Search by name */}
        <div className="flex-1 min-w-0 max-w-none">
          <Label htmlFor="name-filter" className="sr-only">
            Search by name
          </Label>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name-filter"
              placeholder="Search assets..."
              value={nameFilter}
              onChange={(e) => handleNameFilter(e.target.value)}
              className="pl-10 w-full min-w-0"
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
        </div>

        {/* Category filter */}
        <div className="w-48">
          <Label htmlFor="category-filter" className="sr-only">
            Filter by category
          </Label>
          <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {assetCategories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status filter */}
        <div className="w-32">
          <Label htmlFor="status-filter" className="sr-only">
            Filter by status
          </Label>
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

        {/* Value range filters */}
        <div className="flex items-center space-x-2">
          <div className="w-24">
            <Label htmlFor="min-value" className="sr-only">
              Minimum value
            </Label>
            <Input
              id="min-value"
              placeholder="Min $"
              value={minValueFilter}
              onChange={(e) => handleMinValueFilter(e.target.value)}
              className="text-sm"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="w-24">
            <Label htmlFor="max-value" className="sr-only">
              Maximum value
            </Label>
            <Input
              id="max-value"
              placeholder="Max $"
              value={maxValueFilter}
              onChange={(e) => handleMaxValueFilter(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Column Visibility Dropdown */}
        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle column visibility"
                title="Show/hide table columns"
              >
                Columns{" "}
                <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="animate-in fade-in-0 zoom-in-95"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
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

        {/* Clear filters button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Assets</SheetTitle>
              <SheetDescription>
                Narrow down your assets by various criteria
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-4">
              {/* Search by name */}
              <div className="space-y-2">
                <Label htmlFor="mobile-name-filter">Search by name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile-name-filter"
                    placeholder="Search assets..."
                    value={nameFilter}
                    onChange={(e) => handleNameFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category filter */}
              <div className="space-y-2">
                <Label htmlFor="mobile-category-filter">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {assetCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <Label htmlFor="mobile-status-filter">Status</Label>
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

              {/* Value range filters */}
              <div className="space-y-2">
                <Label>Value Range</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Min $"
                      value={minValueFilter}
                      onChange={(e) => handleMinValueFilter(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="flex-1">
                    <Input
                      placeholder="Max $"
                      value={maxValueFilter}
                      onChange={(e) => handleMaxValueFilter(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

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
