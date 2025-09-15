"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";

export interface TransactionFiltersProps {
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
  value?: {
    description: string;
    dateFrom?: string;
    dateTo?: string;
    account: string;
    category: string;
    type: string;
  };
  onChange?: (
    next: Partial<{
      description: string;
      dateFrom?: string | undefined;
      dateTo?: string | undefined;
      account: string;
      category: string;
      type: string;
    }>
  ) => void;
}

export function TransactionFilters({
  accounts,
  categories,
  table,
  isLoading = false,
  value,
  onChange,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Using two single-date pickers (From/To) instead of a range with presets

  // Get current values from URL search params
  const descriptionFilter = value?.description || "";
  const dateFrom = value?.dateFrom;
  const dateTo = value?.dateTo;
  const selectedAccount = value?.account || "all";
  const selectedCategory = value?.category || "all";
  const selectedType = value?.type || "all";

  // Local state for debounced search
  const [localDescriptionFilter, setLocalDescriptionFilter] =
    useState(descriptionFilter);

  // Parse From/To dates from URL params
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;

  const hasActiveFilters =
    descriptionFilter ||
    (fromDate && toDate) ||
    selectedAccount !== "all" ||
    selectedCategory !== "all" ||
    selectedType !== "all";

  // Debounced search function
  const debouncedSearch = useCallback(
    (text: string) => {
      const timeoutId = setTimeout(() => {
        onChange?.({ description: text });
      }, 800);
      return () => clearTimeout(timeoutId);
    },
    [onChange]
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
  const updateFilters = (updates: Record<string, string | null>) => {
    const next: Record<string, string | undefined> = {};
    Object.entries(updates).forEach(([key, val]) => {
      next[key] = val === null ? undefined : val;
    });
    onChange?.(next);
  };

  const clearAllFilters = () => {
    onChange?.({
      description: "",
      dateFrom: undefined,
      dateTo: undefined,
      account: "all",
      category: "all",
      type: "all",
    });
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
      <div className="flex gap-3 md:gap-0 md:items-center md:space-x-2 flex-col md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions by description..."
            value={localDescriptionFilter}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="pl-10 placeholder:text-sm md:placeholder:text-base"
          />
        </div>
        <Button
          variant="outline"
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
          {/* Date From / Date To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              From
            </label>
            <DatePicker
              value={fromDate}
              onChange={(newFrom) => {
                updateFilters({
                  dateFrom: newFrom
                    ? newFrom.toISOString().split("T")[0]
                    : null,
                });
              }}
              placeholder="From date"
              className="shadow-sm cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              To
            </label>
            <DatePicker
              value={toDate}
              onChange={(newTo) => {
                updateFilters({
                  dateTo: newTo ? newTo.toISOString().split("T")[0] : null,
                });
              }}
              placeholder="To date"
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
                  onCheckedChange={() => updateFilters({ account: null })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  All Accounts
                </DropdownMenuCheckboxItem>
                {accounts.map((account) => (
                  <DropdownMenuCheckboxItem
                    key={account.id}
                    checked={selectedAccount === account.id}
                    onCheckedChange={() =>
                      updateFilters({ account: account.id })
                    }
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
                  onCheckedChange={() => updateFilters({ category: null })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  All Categories
                </DropdownMenuCheckboxItem>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() =>
                      updateFilters({ category: category.id })
                    }
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
                onClick={() => updateFilters({ type: null })}
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
                onClick={() => updateFilters({ type: "income" })}
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
                onClick={() => updateFilters({ type: "expense" })}
                className={`transaction-type-button cursor-pointer ${
                  selectedType === "expense"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white !shadow-sm"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ type: "transfer" })}
                className={`transaction-type-button cursor-pointer ${
                  selectedType === "transfer"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white !shadow-sm"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                Transfer
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
            <button
              type="button"
              onClick={() => updateFilters({ description: null })}
              className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center gap-1 group"
            >
              <span>Description: {descriptionFilter}</span>
              <span className="ml-1 rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                ×
              </span>
            </button>
          )}
          {fromDate && toDate && (
            <button
              type="button"
              onClick={() => updateFilters({ dateFrom: null, dateTo: null })}
              className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1 group"
            >
              <span>
                Date: {fromDate.toLocaleDateString()} -{" "}
                {toDate.toLocaleDateString()}
              </span>
              <span className="ml-1 rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800">
                ×
              </span>
            </button>
          )}
          {selectedAccount !== "all" && (
            <button
              type="button"
              onClick={() => updateFilters({ account: null })}
              className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center gap-1 group"
            >
              <span className="mr-1">
                {getAccountIcon(
                  accounts.find((a) => a.id === selectedAccount)?.type ||
                    "checking"
                )}
              </span>
              <span>
                Account: {accounts.find((a) => a.id === selectedAccount)?.name}
              </span>
              <span className="ml-1 rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800">
                ×
              </span>
            </button>
          )}
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => updateFilters({ category: null })}
              className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full flex items-center gap-1 group"
            >
              <span className="text-sm mr-1">
                {categories.find((c) => c.id === selectedCategory)?.icon}
              </span>
              <span>
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
              <span className="ml-1 rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800">
                ×
              </span>
            </button>
          )}
          {selectedType !== "all" && (
            <button
              type="button"
              onClick={() => updateFilters({ type: null })}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full flex items-center gap-1 group"
            >
              <span>
                Type:{" "}
                {selectedType === "income"
                  ? "Income"
                  : selectedType === "expense"
                  ? "Expense"
                  : "Transfer"}
              </span>
              <span className="ml-1 rounded-full h-4 w-4 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800">
                ×
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
