"use client";

import { useState, useEffect } from "react";
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
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { getCategoriesByType } from "@/constants";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function GoalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get filter values from URL search params
  const nameFilter = searchParams.get("name") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedPriority = searchParams.get("priority") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const minAmount = searchParams.get("minAmount") || "";
  const maxAmount = searchParams.get("maxAmount") || "";

  // Get goal categories
  const goalCategories = getCategoriesByType("goals");

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

  // Handle filter changes
  const handleNameChange = (value: string) => {
    updateFilters({ name: value });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value });
  };

  const handlePriorityChange = (value: string) => {
    updateFilters({ priority: value });
  };

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handleMinAmountChange = (value: string) => {
    updateFilters({ minAmount: value });
  };

  const handleMaxAmountChange = (value: string) => {
    updateFilters({ maxAmount: value });
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Clear a specific filter
  const clearFilter = (filterName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Check if any filters are active
  const hasActiveFilters = !!(
    nameFilter ||
    selectedCategory !== "all" ||
    selectedPriority !== "all" ||
    selectedStatus !== "all" ||
    minAmount ||
    maxAmount
  );

  const activeFiltersCount = [
    nameFilter,
    selectedCategory !== "all",
    selectedPriority !== "all",
    selectedStatus !== "all",
    minAmount,
    maxAmount,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Top bar with search, Filters toggle, Clear */}
      <div className="flex gap-3 md:gap-0 md:items-center md:space-x-2 flex-col md:flex-row">
        <div className="relative flex-1 w-full">
          <Label htmlFor="name-filter" className="sr-only">
            Search by name
          </Label>
          <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name-filter"
            placeholder="Search goals..."
            value={nameFilter}
            onChange={(e) => handleNameChange(e.target.value)}
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
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-1 cursor-pointer shadow-sm ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {goalCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority-filter">Priority</Label>
            <Select
              value={selectedPriority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-amount-filter">Min Amount</Label>
            <Input
              id="min-amount-filter"
              type="number"
              placeholder="0.00"
              value={minAmount}
              onChange={(e) => handleMinAmountChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-amount-filter">Max Amount</Label>
            <Input
              id="max-amount-filter"
              type="number"
              placeholder="0.00"
              value={maxAmount}
              onChange={(e) => handleMaxAmountChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
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

          {selectedCategory !== "all" && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Category: {selectedCategory}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => handleCategoryChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {selectedPriority !== "all" && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Priority: {selectedPriority}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => handlePriorityChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {selectedStatus !== "all" && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <span className="text-xs text-blue-800 dark:text-blue-200">
                Status: {selectedStatus}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                onClick={() => handleStatusChange("all")}
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
                  handleMinAmountChange("");
                  handleMaxAmountChange("");
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
