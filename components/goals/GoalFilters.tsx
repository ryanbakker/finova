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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { getCategoriesByType } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";

export function GoalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    router.push(`?${params.toString()}`);
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
  const clearFilters = () => {
    router.push("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    nameFilter ||
    selectedCategory !== "all" ||
    selectedPriority !== "all" ||
    selectedStatus !== "all" ||
    minAmount ||
    maxAmount;

  return (
    <Card>
      <CardHeader className="pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="mr-1 h-4 w-4" />
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name-filter">Goal Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-filter"
                  placeholder="Search goals..."
                  value={nameFilter}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

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

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {nameFilter && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    <span>Name: {nameFilter}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNameChange("")}
                      className="h-auto p-0 text-blue-800 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedCategory !== "all" && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    <span>Category: {selectedCategory}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCategoryChange("all")}
                      className="h-auto p-0 text-green-800 hover:text-green-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedPriority !== "all" && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                    <span>Priority: {selectedPriority}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePriorityChange("all")}
                      className="h-auto p-0 text-yellow-800 hover:text-yellow-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedStatus !== "all" && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                    <span>Status: {selectedStatus}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange("all")}
                      className="h-auto p-0 text-purple-800 hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {minAmount && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                    <span>Min: ${minAmount}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMinAmountChange("")}
                      className="h-auto p-0 text-orange-800 hover:text-orange-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {maxAmount && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                    <span>Max: ${maxAmount}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMaxAmountChange("")}
                      className="h-auto p-0 text-red-800 hover:text-red-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
