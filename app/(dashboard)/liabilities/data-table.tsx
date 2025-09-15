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
import { Trash2, TrendingDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { setGlobalActionHandlers } from "./columns";
import { Liability } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LiabilityDetailsAndHistoryDialog,
  EditLiabilityDialog,
  DeleteLiabilityDialog,
  LiabilityTableSkeleton,
} from "../../../components/liabilities";
import {
  updateLiability,
  deleteLiability,
} from "@/lib/actions/liability.actions";
import { useToast } from "@/components/ui/use-toast";

interface DataTableProps<TData extends Liability, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortStates?: Record<string, "asc" | "desc" | false>;
  onTableReady?: (table: ReturnType<typeof useReactTable<TData>>) => void;
  onDataChange?: () => void;
}

export function DataTable<TData extends Liability, TValue>({
  columns,
  data,
  isLoading = false,
  sortStates,
  onTableReady,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { toast } = useToast();

  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const pageSize = 20;
  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const nameFilter = searchParams.get("name") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, name, amount, and actions
      setColumnVisibility({
        select: true,
        name: true,
        category: false,
        amount: true,
        interestRate: false,
        monthlyPayment: false,
        dueDate: false,
        isActive: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        name: true,
        category: true,
        amount: true,
        interestRate: true,
        monthlyPayment: true,
        dueDate: true,
        isActive: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLiability(null);
  };

  const handleViewLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    setIsDialogOpen(true);
  };

  const handleEditLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    setIsEditDialogOpen(true);
  };

  const handleDeleteLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    setIsDeleteDialogOpen(true);
  };

  // Set global action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewLiability,
      onEdit: handleEditLiability,
      onDelete: handleDeleteLiability,
    });
  }, []);

  const handleSaveLiability = async (updatedLiability: Liability) => {
    try {
      if (!updatedLiability.id) {
        toast({
          title: "Error",
          description: "Cannot update liability without ID",
          variant: "destructive",
        });
        return;
      }

      await updateLiability(updatedLiability.id, updatedLiability);

      toast({
        title: "Success",
        description: "Liability updated successfully",
      });

      // Close the dialog
      setIsEditDialogOpen(false);
      setSelectedLiability(null);

      // Notify parent to refresh data
      if (onDataChange) {
        onDataChange();
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update liability. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (liability: Liability) => {
    try {
      if (!liability.id) {
        toast({
          title: "Error",
          description: "Cannot delete liability without ID",
          variant: "destructive",
        });
        return;
      }

      await deleteLiability(liability.id);

      toast({
        title: "Success",
        description: "Liability deleted successfully",
      });

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setSelectedLiability(null);

      // Notify parent to refresh data
      if (onDataChange) {
        onDataChange();
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to delete liability. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Apply custom filters and sorting based on URL search params
  const filteredAndSortedData = useMemo(() => {
    let filtered = data as Liability[];

    // Name filter
    if (nameFilter) {
      filtered = filtered.filter((liability) =>
        liability.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (liability) => liability.category === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((liability) => {
        if (selectedStatus === "active") {
          return liability.isActive === true;
        } else {
          return liability.isActive === false;
        }
      });
    }

    // Amount range filter (use currentValue as primary)
    if (minAmount || maxAmount) {
      filtered = filtered.filter((liability) => {
        const amount =
          (liability.currentValue as number) ??
          (liability.currentAmount as number) ??
          (liability.amount as number) ??
          0;
        if (minAmount && maxAmount) {
          return amount >= Number(minAmount) && amount <= Number(maxAmount);
        } else if (minAmount) {
          return amount >= Number(minAmount);
        } else if (maxAmount) {
          return amount <= Number(maxAmount);
        }
        return true;
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
          let aValue: unknown = a[columnId as keyof Liability];
          let bValue: unknown = b[columnId as keyof Liability];

          // Handle dates
          if (
            columnId === "dueDate" ||
            columnId === "createdAt" ||
            columnId === "updatedAt"
          ) {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }

          // Handle numbers
          if (
            columnId === "currentValue" ||
            columnId === "amount" ||
            columnId === "interestRate" ||
            columnId === "monthlyPayment" ||
            columnId === "remainingBalance" ||
            columnId === "originalAmount"
          ) {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }

          // Handle booleans
          if (columnId === "isActive") {
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
    selectedCategory,
    selectedStatus,
    minAmount,
    maxAmount,
    sortStates,
  ]);

  const table = useReactTable({
    data: filteredAndSortedData as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  // Notify parent component when table is ready
  useEffect(() => {
    if (onTableReady && table) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

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

  // Handle delete selected liabilities
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedLiabilities = selectedRows.map(
      (row) => row.original as Liability
    );

    if (selectedLiabilities.length === 0) return;

    // Show confirmation dialog
    const confirmMessage =
      selectedLiabilities.length === 1
        ? `Are you sure you want to delete the liability "${selectedLiabilities[0].name}"?`
        : `Are you sure you want to delete ${selectedLiabilities.length} selected liabilities?`;

    if (window.confirm(confirmMessage)) {
      // TODO: Implement actual deletion logic here

      // Clear selection after deletion
      setRowSelection({});

      // You would typically call an API endpoint here to delete the liabilities
      // For now, we'll just log the action
    }
  };

  // Show skeleton only when loading
  if (isLoading) {
    return <LiabilityTableSkeleton rowCount={8} isMobile={isMobile} />;
  }

  // Show empty state when no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full space-y-4 -mt-4">
        <div className="text-center py-12">
          <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No liabilities to show
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by adding your first liability to track your financial
            obligations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 -mt-2">
      {/* Liability Filters moved to main page level */}

      {/* Delete Selected Button */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {selectedCount} liability{selectedCount === 1 ? "" : "ies"}{" "}
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

      <div className="dashboard-table-container">
        <Table className="dashboard-table">
          <TableHeader className="dashboard-table-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="dashboard-table-header-row"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`dashboard-table-head ${
                        header.id === "select"
                          ? "dashboard-table-head--select"
                          : ""
                      }`}
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
                  className="dashboard-table-row group"
                  onClick={(e) => {
                    // Don't open details if clicking on action buttons or checkboxes
                    if (
                      e.target instanceof Element &&
                      (e.target.closest('[data-action="button"]') ||
                        e.target.closest('input[type="checkbox"]'))
                    ) {
                      return;
                    }
                    handleViewLiability(row.original as Liability);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`dashboard-table-cell ${
                        cell.column.id !== "actions"
                          ? "dashboard-table-cell--padded"
                          : ""
                      }`}
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
                  className="dashboard-table-empty"
                >
                  {filteredAndSortedData.length === 0 && data.length > 0
                    ? "No results found for your search criteria."
                    : "No liabilities available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile columns info */}
      {isMobile && (
        <div className="text-xs text-muted-foreground text-center py-2">
          💡 Swipe to see more details • Tap row to view full liability
        </div>
      )}

      {/* Pagination and Row Selection Info */}
      {totalPages > 1 && (
        <div className="dashboard-pagination">
          <div className="selection">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="meta">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(
              currentPage * pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="controls">
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
              size="sm"
              className="enabled:cursor-pointer"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
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

      {/* Liability Details Dialog */}
      <LiabilityDetailsAndHistoryDialog
        liability={selectedLiability}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      {/* Edit Liability Dialog */}
      <EditLiabilityDialog
        liability={selectedLiability}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveLiability}
      />

      {/* Delete Liability Dialog */}
      <DeleteLiabilityDialog
        liability={selectedLiability}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
