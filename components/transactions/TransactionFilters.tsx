"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  Coins,
  Tag,
} from "lucide-react";
import { Account, Category } from "@/lib/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";

interface TransactionFiltersProps {
  accounts: Account[];
  categories: Category[];
  table?: {
    getAllColumns: () => Array<{
      id: string;
      getCanHide: () => boolean;
      getIsVisible: () => boolean;
      toggleVisibility: (value: boolean) => void;
    }>;
  };
  isLoading?: boolean;
}

export function TransactionFilters({
  accounts,
  categories,
  table,
  isLoading = false,
}: TransactionFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current values from URL search params
  const descriptionFilter = searchParams.get("description") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const selectedAccount = searchParams.get("account") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedType = searchParams.get("type") || "all";

  // Local state for debounced search
  const [localDescriptionFilter, setLocalDescriptionFilter] = useState(descriptionFilter);

  // Parse date range from URL params
  const dateRange =
    dateFrom && dateTo
      ? { from: new Date(dateFrom), to: new Date(dateTo) }
      : undefined;

  const hasActiveFilters =
    descriptionFilter ||
    dateRange ||
    selectedAccount !== "all" ||
    selectedCategory !== "all" ||
    selectedType !== "all";

  // Debounced search function
  const debouncedSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        if (value) {
          params.set("description", value);
        } else {
          params.delete("description");
        }
        router.push(`${pathname}?${params.toString()}`);
      }, 800);

      return () => clearTimeout(timeoutId);
    },
    [searchParams, router, pathname]
  );

  // Update local state when URL changes
  useEffect(() => {
    setLocalDescriptionFilter(descriptionFilter);
  }, [descriptionFilter]);

  // Handle description input change
  const handleDescriptionChange = (value: string) => {
    setLocalDescriptionFilter(value);
    debouncedSearch(value);
  };

  // Update URL with new filter values
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Helper function to get account type icon
  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case "checking":
        return <CreditCard className="h-4 w-4" />;
      case "savings":
        return <PiggyBank className="h-4 w-4" />;
      case "credit":
        return <CreditCard className="h-4 w-4" />;
      case "investment":
        return <TrendingUp className="h-4 w-4" />;
      case "cash":
        return <Coins className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  // Show skeleton if data is loading
  if (isLoading || !accounts || !categories) {
    return (
      <div className="space-y-4">
        {/* Basic Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Basic Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions by description..."
            value={localDescriptionFilter}
            onChange={(e) => handleDescriptionChange(e.target.value)}
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
            <label className="text-sm font-medium text-muted-foreground">
              Date Range
            </label>
            <DateRangePicker
              value={dateRange}
              onChange={(range) => {
                // Update the URL with the new date range
                if (range) {
                  updateURL({
                    dateFrom: range.from.toISOString().split("T")[0],
                    dateTo: range.to.toISOString().split("T")[0],
                  });
                } else {
                  updateURL({
                    dateFrom: null,
                    dateTo: null,
                  });
                }
              }}
              placeholder="Select date range"
              name="date"
              className="shadow-sm cursor-pointer"
            />
          </div>

          {/* Account Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Account
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {selectedAccount !== "all" ? (
                      <>
                        {getAccountIcon(
                          accounts.find((a) => a.id === selectedAccount)
                            ?.type || "checking"
                        )}
                        <span>
                          {accounts.find((a) => a.id === selectedAccount)
                            ?.name || "All Accounts"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4" />
                        <span>All Accounts</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={selectedAccount === "all"}
                  onCheckedChange={() => updateURL({ account: null })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  All Accounts
                </DropdownMenuCheckboxItem>
                {accounts.map((account) => (
                  <DropdownMenuCheckboxItem
                    key={account.id}
                    checked={selectedAccount === account.id}
                    onCheckedChange={() => updateURL({ account: account.id })}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {account.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    {selectedCategory !== "all" ? (
                      <>
                        <span className="text-lg">
                          {
                            categories.find((c) => c.id === selectedCategory)
                              ?.icon
                          }
                        </span>
                        <span>
                          {categories.find((c) => c.id === selectedCategory)
                            ?.name || "All Categories"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4" />
                        <span>All Categories</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={selectedCategory === "all"}
                  onCheckedChange={() => updateURL({ category: null })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  All Categories
                </DropdownMenuCheckboxItem>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => updateURL({ category: category.id })}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Transaction Type Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Transaction Type
            </label>
            <div className="flex gap-2 mt-0.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateURL({ type: null })}
                className={`transaction-type-button cursor-pointer ${
                  !selectedType || selectedType === "all"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white !shadow-sm"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateURL({ type: "income" })}
                className={`transaction-type-button cursor-pointer ${
                  selectedType === "income"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white !shadow-sm"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                Income
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateURL({ type: "expense" })}
                className={`transaction-type-button cursor-pointer ${
                  selectedType === "expense"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white !shadow-sm"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                Expense
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {descriptionFilter && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Description: {descriptionFilter}
            </span>
          )}
          {dateRange && (
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              Date: {dateRange.from.toLocaleDateString()} -{" "}
              {dateRange.to.toLocaleDateString()}
            </span>
          )}
          {selectedAccount !== "all" && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
              {getAccountIcon(
                accounts.find((a) => a.id === selectedAccount)?.type ||
                  "checking"
              )}
              Account: {accounts.find((a) => a.id === selectedAccount)?.name}
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
              <span className="text-sm">
                {categories.find((c) => c.id === selectedCategory)?.icon}
              </span>
              Category:{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
          {selectedType !== "all" && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
              Type: {selectedType === "income" ? "Income" : "Expense"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
