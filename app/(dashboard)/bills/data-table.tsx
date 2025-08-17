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
import { Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { setGlobalActionHandlers } from "./columns";
import { Bill } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BillDetailsDialog,
  EditBillDialog,
  DeleteBillDialog,
  BillFilters,
  BillTableSkeleton,
} from "@/components/bills";

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

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const pageSize = 20;
  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const nameFilter = searchParams.get("name") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const selectedCategory = searchParams.get("category") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const selectedRecurring = searchParams.get("recurring") || "all";

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, name, amount, dueDate, and actions
      setColumnVisibility({
        select: true,
        name: true,
        amount: true,
        dueDate: true,
        category: false,
        status: false,
        isRecurring: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        name: true,
        amount: true,
        dueDate: true,
        category: true,
        status: true,
        isRecurring: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBill(null);
  };

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteDialogOpen(true);
  };

  // Set global action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewBill,
      onEdit: handleEditBill,
      onDelete: handleDeleteBill,
    });
  }, []);

  const handleSaveBill = (updatedBill: Bill) => {
    // TODO: Implement actual update logic here
    console.log("Updating bill:", updatedBill);

    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setSelectedBill(null);
  };

  const handleConfirmDelete = (bill: Bill) => {
    // TODO: Implement actual deletion logic here
    console.log("Deleting bill:", bill);

    // For now, just close the dialog
    setIsDeleteDialogOpen(false);
    setSelectedBill(null);
  };

  // Apply custom filters and sorting based on URL search params
  const filteredAndSortedData = useMemo(() => {
    let filtered = data as Bill[];

    // Name filter
    if (nameFilter) {
      filtered = filtered.filter((bill) =>
        bill.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Date range filter
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate >= fromDate && billDate <= toDate;
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((bill) => bill.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((bill) => bill.status === selectedStatus);
    }

    // Recurring filter
    if (selectedRecurring !== "all") {
      filtered = filtered.filter((bill) => {
        if (selectedRecurring === "yes") {
          return bill.isRecurring === true;
        } else {
          return bill.isRecurring === false;
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
          let aValue: unknown = a[columnId as keyof Bill];
          let bValue: unknown = b[columnId as keyof Bill];

          // Handle dates
          if (columnId === "dueDate") {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }

          // Handle numbers
          if (columnId === "amount") {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }

          // Handle booleans
          if (columnId === "isRecurring") {
            aValue = (aValue as boolean) ? 1 : 0;
            bValue = (bValue as boolean) ? 1 : 0;
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
    nameFilter,
    dateFrom,
    dateTo,
    selectedCategory,
    selectedStatus,
    selectedRecurring,
    sortStates,
  ]);

  const table = useReactTable({
    data: filteredAndSortedData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Disable built-in sorting since we handle it manually
    // getSortedRowModel: getSortedRowModel(),
    // onSortingChange: setSorting,
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

  // Handle delete selected bills
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedBills = selectedRows.map((row) => row.original as Bill);

    if (selectedBills.length === 0) return;

    // Show confirmation dialog
    const confirmMessage =
      selectedBills.length === 1
        ? `Are you sure you want to delete the bill "${selectedBills[0].name}"?`
        : `Are you sure you want to delete ${selectedBills.length} selected bills?`;

    if (window.confirm(confirmMessage)) {
      // TODO: Implement actual deletion logic here
      console.log("Deleting bills:", selectedBills);

      // Clear selection after deletion
      setRowSelection({});

      // You would typically call an API endpoint here to delete the bills
      // For now, we'll just log the action
    }
  };

  // Show skeleton if loading or no data
  if (isLoading || !data || data.length === 0) {
    return <BillTableSkeleton rowCount={8} isMobile={isMobile} />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Bill Filters */}
      <BillFilters table={table} />

      {/* Delete Selected Button */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {selectedCount} bill{selectedCount === 1 ? "" : "s"} selected:
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
                className="hover:!bg-white dark:hover:!bg-white"
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
                    handleViewBill(row.original as Bill);
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
                    : "No bills available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile columns info */}
      {isMobile && (
        <div className="text-xs text-muted-foreground text-center py-2">
          💡 Swipe to see more details • Tap row to view full bill
        </div>
      )}

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

      {/* Bill Details Dialog */}
      <BillDetailsDialog
        bill={selectedBill}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      {/* Edit Bill Dialog */}
      <EditBillDialog
        bill={selectedBill}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveBill}
        accounts={[]}
      />

      {/* Delete Bill Dialog */}
      <DeleteBillDialog
        bill={selectedBill}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
