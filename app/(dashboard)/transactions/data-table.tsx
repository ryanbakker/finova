"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  RowSelectionState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Receipt } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  TransactionDetailsDialog,
  EditTransactionDialog,
  DeleteTransactionDialog,
  TransactionFilters,
  TransactionTableSkeleton,
} from "@/components/transactions";
import { setGlobalActionHandlers } from "./columns";
import { Transaction } from "@/lib/types";
import { getCategoriesByType } from "@/constants";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortStates?: Record<string, "asc" | "desc" | false>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  sortStates,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const pageSize = 20;
  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const descriptionFilter = searchParams.get("description") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const selectedAccount = searchParams.get("account") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedType = searchParams.get("type") || "all";

  // Get categories and accounts for filters
  const categories = getCategoriesByType("expenses").map((cat, index) => ({
    ...cat,
    id: `cat-${index + 1}`,
  }));
  const accounts = [
    {
      id: "chase-checking",
      name: "Chase Checking",
      type: "checking" as const,
      balance: 0,
      currency: "USD",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "chase-savings",
      name: "Chase Savings",
      type: "savings" as const,
      balance: 0,
      currency: "USD",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "chase-credit",
      name: "Chase Credit Card",
      type: "credit" as const,
      balance: 0,
      currency: "USD",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, description, amount, date, and actions
      setColumnVisibility({
        select: true,
        description: true,
        amount: true,
        date: true,
        accountName: false,
        "category.name": false,
        type: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        description: true,
        amount: true,
        date: true,
        accountName: true,
        "category.name": true,
        type: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  // Set global action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewTransaction,
      onEdit: handleEditTransaction,
      onDelete: handleDeleteTransaction,
    });
  }, []);

  const handleSaveTransaction = () => {
    // TODO: Implement actual update logic here
    console.log("Transaction updated successfully");

    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement actual deletion logic here
    console.log("Transaction deleted successfully");

    // For now, just close the dialog
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  // Apply custom filters and sorting based on URL search params
  const filteredAndSortedData = useMemo(() => {
    let filtered = data as Transaction[];

    // Description filter
    if (descriptionFilter) {
      filtered = filtered.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(descriptionFilter.toLowerCase())
      );
    }

    // Date range filter
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    // Account filter
    if (selectedAccount !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.accountId === selectedAccount
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.category.id === selectedCategory
      );
    }

    // Transaction type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((transaction) => {
        if (selectedType === "income") {
          return transaction.amount > 0;
        } else {
          return transaction.amount < 0;
        }
      });
    }

    // Apply custom sorting
    if (sortStates) {
      const activeSort = Object.entries(sortStates).find(
        ([, state]) => state !== false
      );
      if (activeSort) {
        const [columnId, sortDirection] = activeSort;

        filtered = [...filtered].sort((a, b) => {
          let aValue: unknown = a[columnId as keyof Transaction];
          let bValue: unknown = b[columnId as keyof Transaction];

          // Handle nested objects
          if (columnId === "accountName") {
            aValue = a.accountName || "";
            bValue = b.accountName || "";
          } else if (columnId === "category.name") {
            aValue = a.category.name || "";
            bValue = b.category.name || "";
          }

          // Handle dates
          if (columnId === "date") {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }

          // Handle numbers
          if (columnId === "amount") {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }

          // Handle strings
          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = (bValue as string).toLowerCase();
          }

          if (sortDirection === "asc") {
            return (aValue as number) < (bValue as number)
              ? -1
              : (aValue as number) > (bValue as number)
              ? 1
              : 0;
          } else {
            return (aValue as number) > (bValue as number)
              ? -1
              : (aValue as number) < (bValue as number)
              ? 1
              : 0;
          }
        });
      }
    }

    return filtered;
  }, [
    data,
    descriptionFilter,
    dateFrom,
    dateTo,
    selectedAccount,
    selectedCategory,
    selectedType,
    sortStates,
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  // Reset to first page when filtered results change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const table = useReactTable({
    data: filteredAndSortedData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Disable built-in sorting since we handle it manually
    // getSortedRowModel: getSortedRowModel(),
    // onSortingChange: onSortingChange || setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      // Reset to first page when filtering
      setCurrentPage(1);
    },
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    // Set initial column visibility
    initialState: {
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize: pageSize,
        });
        setCurrentPage(newState.pageIndex + 1);
      }
    },
  });

  // Show skeleton only when loading
  if (isLoading) {
    return <TransactionTableSkeleton rowCount={8} isMobile={isMobile} />;
  }

  // Show empty state when no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full space-y-4">
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No transactions to show
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by adding your first transaction to track your spending and income
          </p>
        </div>
      </div>
    );
  }

  // Handle delete selected transactions
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedTransactions = selectedRows.map(
      (row) => row.original as Transaction
    );

    if (selectedTransactions.length === 0) {
      return;
    }

    // Show confirmation dialog
    const confirmMessage =
      selectedTransactions.length === 1
        ? `Are you sure you want to delete the transaction "${selectedTransactions[0].description}"?`
        : `Are you sure you want to delete ${selectedTransactions.length} selected transactions?`;

    if (window.confirm(confirmMessage)) {
      // TODO: Implement actual deletion logic here
      console.log("Deleting transactions:", selectedTransactions);

      // Clear selection after deletion
      setRowSelection({});

      // You would typically call an API endpoint here to delete the transactions
      // For now, we'll just log the action
    }
  };

  // Get selected count for display
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    table.setPageIndex(page - 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Transaction Filters */}
      <TransactionFilters
        accounts={accounts}
        categories={categories}
        table={table}
        isLoading={isLoading}
      />

      {/* Delete Selected Button */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {selectedCount} transaction{selectedCount === 1 ? "" : "s"}{" "}
              selected:
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-md border w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm">
        <Table className={`w-full ${isMobile ? "text-sm" : ""}`}>
          <TableHeader className="text-semibold !bg-white hover:!bg-white dark:!bg-neutral-950 dark:hover:!bg-neutral-950 rounded-t-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:!bg-white dark:hover:!bg-neutral-950"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`ml-0 ${
                        header.id === "select" ? "pl-2" : "pl-0"
                      } ${isMobile ? "py-1 px-2 text-sm" : "py-2 text-base"}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  onClick={(e) => {
                    // Don't open details if clicking on action buttons or checkboxes
                    if (
                      e.target instanceof Element &&
                      (e.target.closest('[data-action="button"]') ||
                        e.target.closest('input[type="checkbox"]'))
                    ) {
                      return;
                    }
                    handleViewTransaction(row.original as Transaction);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`text-left group-hover:bg-slate-50 dark:group-hover:bg-slate-800/30 ${
                        isMobile ? "py-1" : "py-2"
                      } ${cell.column.id !== "actions" ? "pl-2" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {filteredAndSortedData.length === 0 && data.length > 0
                    ? "No results found for your search criteria."
                    : data.length === 0
                    ? "No transactions available. Create your first transaction to get started!"
                    : "No transactions available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile columns info */}
      {isMobile && (
        <div className="text-xs text-muted-foreground text-center py-2">
          💡 Swipe to see more details • Tap row to view full transaction
        </div>
      )}

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        transaction={selectedTransaction}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleSaveTransaction}
        accounts={accounts}
        categories={categories}
      />

      {/* Delete Transaction Dialog */}
      <DeleteTransactionDialog
        transaction={selectedTransaction}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={handleConfirmDelete}
      />

      {/* Pagination and Row Selection Info */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-0">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(
                currentPage * pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="enabled:cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="enabled:cursor-pointer"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Row Selection Info when no pagination */}
      {totalPages <= 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Found {table.getFilteredRowModel().rows.length} results
          </div>
        </div>
      )}
    </div>
  );
}
