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
import { Table } from "@tanstack/react-table";
import { Liability } from "@/lib/types";

import { useRouter, useSearchParams } from "next/navigation";
import { X, Search, Filter as FilterIcon } from "lucide-react";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nameFilter, setNameFilter] = useState(searchParams.get("name") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [minAmount, setMinAmount] = useState(
    searchParams.get("minAmount") || ""
  );
  const [maxAmount, setMaxAmount] = useState(
    searchParams.get("maxAmount") || ""
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (nameFilter) params.set("name", nameFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (minAmount) params.set("minAmount", minAmount);
    if (maxAmount) params.set("maxAmount", maxAmount);

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newUrl);
  }, [nameFilter, categoryFilter, statusFilter, minAmount, maxAmount, router]);

  // Apply filters to table
  useEffect(() => {
    if (table) {
      // Name filter
      if (nameFilter) {
        table.getColumn("name")?.setFilterValue(nameFilter);
      } else {
        table.getColumn("name")?.setFilterValue("");
      }

      // Category filter
      if (categoryFilter !== "all") {
        table.getColumn("category")?.setFilterValue(categoryFilter);
      } else {
        table.getColumn("category")?.setFilterValue("");
      }

      // Status filter
      if (statusFilter !== "all") {
        table.getColumn("isActive")?.setFilterValue(statusFilter === "active");
      } else {
        table.getColumn("isActive")?.setFilterValue("");
      }

      // Amount range filter
      if (minAmount || maxAmount) {
        table.getColumn("amount")?.setFilterValue({
          min: minAmount ? parseFloat(minAmount) : undefined,
          max: maxAmount ? parseFloat(maxAmount) : undefined,
        });
      } else {
        table.getColumn("amount")?.setFilterValue("");
      }
    }
  }, [table, nameFilter, categoryFilter, statusFilter, minAmount, maxAmount]);

  const clearAllFilters = () => {
    setNameFilter("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setMinAmount("");
    setMaxAmount("");

    // Clear URL params
    router.push(window.location.pathname);
  };

  const hasActiveFilters =
    nameFilter ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    minAmount ||
    maxAmount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name Filter */}
        <div className="space-y-2">
          <Label htmlFor="name-filter">Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name-filter"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {liabilityCategories.map((category) => (
                <SelectItem
                  key={category}
                  value={category === "All Categories" ? "all" : category}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
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

        {/* Min Amount Filter */}
        <div className="space-y-2">
          <Label htmlFor="min-amount">Min Amount</Label>
          <Input
            id="min-amount"
            type="number"
            placeholder="0.00"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>

        {/* Max Amount Filter */}
        <div className="space-y-2">
          <Label htmlFor="max-amount">Max Amount</Label>
          <Input
            id="max-amount"
            type="number"
            placeholder="0.00"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {nameFilter && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              <span>Name: {nameFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNameFilter("")}
                className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {categoryFilter !== "all" && (
            <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
              <span>Category: {categoryFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCategoryFilter("all")}
                className="h-4 w-4 p-0 hover:bg-green-200 dark:hover:bg-green-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {statusFilter !== "all" && (
            <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
              <span>
                Status: {statusFilter === "active" ? "Active" : "Inactive"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="h-4 w-4 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {(minAmount || maxAmount) && (
            <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs">
              <span>
                Amount: {minAmount ? `≥${minAmount}` : ""}
                {minAmount && maxAmount ? " and " : ""}
                {maxAmount ? `≤${maxAmount}` : ""}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMinAmount("");
                  setMaxAmount("");
                }}
                className="h-4 w-4 p-0 hover:bg-orange-200 dark:hover:bg-orange-800"
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
