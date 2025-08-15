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
import { Table } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionFiltersProps {
  accounts: Account[];
  categories: Category[];
  table?: Table<any>; // Properly type the table prop
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

  // Get current values from URL search params
  const payeeFilter = searchParams.get("payee") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const selectedAccount = searchParams.get("account") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedType = searchParams.get("type") || "all";

  // Local state for debounced search
  const [localPayeeFilter, setLocalPayeeFilter] = useState(payeeFilter);

  // Parse date range from URL params
  const dateRange =
    dateFrom && dateTo
      ? { from: new Date(dateFrom), to: new Date(dateTo) }
      : undefined;

  const hasActiveFilters =
    payeeFilter ||
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
          params.set("payee", value);
        } else {
          params.delete("payee");
        }
        router.push(`${pathname}?${params.toString()}`);
      }, 800);

      return () => clearTimeout(timeoutId);
    },
    [searchParams, router, pathname]
  );

  // Update local state when URL changes
  useEffect(() => {
    setLocalPayeeFilter(payeeFilter);
  }, [payeeFilter]);

  // Handle payee input change
  const handlePayeeChange = (value: string) => {
    setLocalPayeeFilter(value);
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
      <div className="space-y-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Filter icon */}
            <Skeleton className="h-6 w-20" /> {/* Filters title */}
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Payee Search */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-9 w-full" /> {/* Input */}
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Label */}
            <Skeleton className="h-9 w-full" /> {/* Date picker */}
          </div>

          {/* Account Filter */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-9 w-full" /> {/* Select */}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Label */}
            <Skeleton className="h-9 w-full" /> {/* Select */}
          </div>
        </div>

        {/* Transaction Type Filter */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" /> {/* Label */}
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-8 w-16" /> {/* All button */}
                <Skeleton className="h-8 w-20" /> {/* Income button */}
                <Skeleton className="h-8 w-20" /> {/* Expense button */}
              </div>
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <Skeleton className="h-4 w-24" /> {/* Columns label */}
              <Skeleton className="h-8 w-24" /> {/* Columns dropdown */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payee Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-100" />
            <Input
              placeholder="Search payee..."
              value={localPayeeFilter}
              onChange={(e) => handlePayeeChange(e.target.value)}
              className="pl-10 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-100"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Date
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
            className="shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-100 cursor-pointer"
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
                className="w-full justify-between shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {selectedAccount !== "all" ? (
                    <>
                      {getAccountIcon(
                        accounts.find((a) => a.id === selectedAccount)?.type ||
                          "checking"
                      )}
                      <span>
                        {accounts.find((a) => a.id === selectedAccount)?.name ||
                          "All Accounts"}
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
                className="w-full justify-between shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-100 cursor-pointer"
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
      </div>

      {/* Transaction Type Filter */}
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Transaction Type
            </label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateURL({ type: null })}
                className={`transaction-type-button cursor-pointer ${
                  !selectedType || selectedType === "all"
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm dark:bg-sky-500 dark:text-white dark:border-sky-500 dark:hover:bg-sky-600 dark:hover:border-sky-600 dark:hover:text-white"
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
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm dark:bg-sky-500 dark:text-white dark:border-sky-500 dark:hover:bg-sky-600 dark:hover:border-sky-600 dark:hover:text-white"
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
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm dark:bg-sky-500 dark:text-white dark:border-sky-500 dark:hover:bg-sky-600 dark:hover:border-sky-600 dark:hover:text-white"
                    : "hover:bg-sky-50 dark:hover:bg-sky-950 shadow-sm"
                }`}
              >
                Expense
              </Button>
            </div>
          </div>
          {table && (
            <div className="space-y-2 flex flex-col items-end">
              <label className="text-sm font-medium text-muted-foreground">
                Select Columns
              </label>
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
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {payeeFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-neutral-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Payee: {payeeFilter}
                <button
                  onClick={() => updateURL({ payee: null })}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-neutral-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-neutral-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                Date: {dateRange.from.toLocaleDateString()} -{" "}
                {dateRange.to.toLocaleDateString()}
                <button
                  onClick={() => updateURL({ dateFrom: null, dateTo: null })}
                  className="ml-1 hover:bg-green-200 dark:hover:bg-neutral-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedAccount !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-neutral-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                {getAccountIcon(
                  accounts.find((a) => a.id === selectedAccount)?.type ||
                    "checking"
                )}
                Account: {accounts.find((a) => a.id === selectedAccount)?.name}
                <button
                  onClick={() => updateURL({ account: null })}
                  className="ml-1 hover:bg-purple-200 dark:hover:bg-neutral-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-neutral-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                <span className="text-sm">
                  {categories.find((c) => c.id === selectedCategory)?.icon}
                </span>
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => updateURL({ category: null })}
                  className="ml-1 hover:bg-orange-200 dark:hover:bg-neutral-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-neutral-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                Type: {selectedType === "income" ? "Income" : "Expense"}
                <button
                  onClick={() => updateURL({ type: null })}
                  className="ml-1 hover:bg-indigo-200 dark:hover:bg-neutral-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
