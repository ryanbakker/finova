"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Account, Category } from "@/lib/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";

interface TransactionFiltersProps {
  accounts: Account[];
  categories: Category[];
  table?: Table<any>; // Properly type the table prop
}

export function TransactionFilters({
  accounts,
  categories,
  table,
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
            Search Payee
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payee..."
              value={localPayeeFilter}
              onChange={(e) => handlePayeeChange(e.target.value)}
              className="pl-10 shadow-sm"
            />
          </div>
        </div>

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
            className="shadow-sm"
          />
        </div>

        {/* Account Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Account
          </label>
          <select
            name="account"
            value={selectedAccount}
            onChange={(e) =>
              updateURL({
                account: e.target.value === "all" ? null : e.target.value,
              })
            }
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) =>
              updateURL({
                category: e.target.value === "all" ? null : e.target.value,
              })
            }
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
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
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm"
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
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm"
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
                    ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600 hover:text-white shadow-sm"
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
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Payee: {payeeFilter}
                <button
                  onClick={() => updateURL({ payee: null })}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                Date: {dateRange.from.toLocaleDateString()} -{" "}
                {dateRange.to.toLocaleDateString()}
                <button
                  onClick={() => updateURL({ dateFrom: null, dateTo: null })}
                  className="ml-1 hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedAccount !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                Account: {accounts.find((a) => a.id === selectedAccount)?.name}
                <button
                  onClick={() => updateURL({ account: null })}
                  className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => updateURL({ category: null })}
                  className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800/50 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                Type: {selectedType === "income" ? "Income" : "Expense"}
                <button
                  onClick={() => updateURL({ type: null })}
                  className="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-full p-0.5"
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
