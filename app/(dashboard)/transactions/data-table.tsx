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
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  TransactionDetailsDialog,
  EditTransactionDialog,
  DeleteTransactionDialog,
  TransactionFilters,
} from "@/components/transactions";
import { setGlobalActionHandlers } from "./columns";
import { Transaction } from "@/lib/types";
import {
  sampleAccounts,
  sampleCategories,
} from "@/database/test-data/sample-transactions";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const pageSize = 20;
  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const payeeFilter = searchParams.get("payee") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const selectedAccount = searchParams.get("account") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedType = searchParams.get("type") || "all";

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, payee, amount, date, and actions
      setColumnVisibility({
        select: true,
        payee: true,
        amount: true,
        date: true,
        account: false,
        category: false,
        status: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        payee: true,
        amount: true,
        date: true,
        account: true,
        category: true,
        status: true,
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

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    // TODO: Implement actual update logic here
    console.log("Updating transaction:", updatedTransaction);

    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = (transaction: Transaction) => {
    // TODO: Implement actual deletion logic here
    console.log("Deleting transaction:", transaction);

    // For now, just close the dialog
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  // Apply custom filters based on URL search params
  const filteredData = useMemo(() => {
    let filtered = data as Transaction[];

    // Payee filter
    if (payeeFilter) {
      filtered = filtered.filter((transaction) =>
        transaction.payee.toLowerCase().includes(payeeFilter.toLowerCase())
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
        (transaction) => transaction.account.id === selectedAccount
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

    return filtered;
  }, [
    data,
    payeeFilter,
    dateFrom,
    dateTo,
    selectedAccount,
    selectedCategory,
    selectedType,
  ]);

  const table = useReactTable({
    data: filteredData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
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
      sorting,
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

  // Handle delete selected transactions
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedTransactions = selectedRows.map(
      (row) => row.original as Transaction
    );

    if (selectedTransactions.length === 0) return;

    // Show confirmation dialog
    const confirmMessage =
      selectedTransactions.length === 1
        ? `Are you sure you want to delete the transaction "${selectedTransactions[0].payee}"?`
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

  const totalPages = Math.ceil(
    table.getFilteredRowModel().rows.length / pageSize
  );

  // Reset to first page when filtered results change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    table.setPageIndex(page - 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Transaction Filters */}
      <TransactionFilters
        accounts={sampleAccounts}
        categories={sampleCategories}
        table={table}
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
                  {filteredData.length === 0 && data.length > 0
                    ? "No results found for your search criteria."
                    : "No results."}
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
        onSave={handleSaveTransaction}
        accounts={sampleAccounts}
        categories={sampleCategories}
      />

      {/* Delete Transaction Dialog */}
      <DeleteTransactionDialog
        transaction={selectedTransaction}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
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
