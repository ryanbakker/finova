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
import { Asset } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AssetDetailsDialog,
  EditAssetDialog,
  DeleteAssetDialog,
  AssetFilters,
  AssetTableSkeleton,
} from "../../../components/assets";

interface DataTableProps<TData extends Asset, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortStates?: Record<string, "asc" | "desc" | false>;
  onTableReady?: (table: any) => void;
}

export function DataTable<TData extends Asset, TValue>({
  columns,
  data,
  isLoading = false,
  sortStates,
  onTableReady,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
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
  const minValue = searchParams.get("minValue");
  const maxValue = searchParams.get("maxValue");

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, name, currentValue, and actions
      setColumnVisibility({
        select: true,
        name: true,
        category: false,
        currentValue: true,
        purchaseDate: false,
        isActive: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        name: true,
        category: true,
        currentValue: true,
        purchaseDate: true,
        isActive: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteDialogOpen(true);
  };

  // Set global action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewAsset,
      onEdit: handleEditAsset,
      onDelete: handleDeleteAsset,
    });
  }, []);

  const handleSaveAsset = (updatedAsset: Asset) => {
    // TODO: Implement actual update logic here
    console.log("Updating asset:", updatedAsset);

    // For now, just close the dialog
    setIsEditDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleConfirmDelete = (asset: Asset) => {
    // TODO: Implement actual deletion logic here
    console.log("Deleting asset:", asset);

    // For now, just close the dialog
    setIsDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  // Apply custom filters and sorting based on URL search params
  const filteredAndSortedData = useMemo(() => {
    let filtered = data as Asset[];

    // Name filter
    if (nameFilter) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (asset) => asset.category === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((asset) => {
        if (selectedStatus === "active") {
          return asset.isActive === true;
        } else {
          return asset.isActive === false;
        }
      });
    }

    // Value range filter
    if (minValue || maxValue) {
      filtered = filtered.filter((asset) => {
        const currentValue = asset.currentValue || asset.value;
        if (minValue && maxValue) {
          return (
            currentValue >= Number(minValue) && currentValue <= Number(maxValue)
          );
        } else if (minValue) {
          return currentValue >= Number(minValue);
        } else if (maxValue) {
          return currentValue <= Number(maxValue);
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
          let aValue: unknown = a[columnId as keyof Asset];
          let bValue: unknown = b[columnId as keyof Asset];

          // Handle dates
          if (
            columnId === "purchaseDate" ||
            columnId === "createdAt" ||
            columnId === "updatedAt"
          ) {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }

          // Handle numbers
          if (
            columnId === "value" ||
            columnId === "currentValue" ||
            columnId === "changeAmount" ||
            columnId === "changePercentage"
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
    minValue,
    maxValue,
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

  // Handle delete selected assets
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedAssets = selectedRows.map((row) => row.original as Asset);

    if (selectedAssets.length === 0) return;

    // Show confirmation dialog
    const confirmMessage =
      selectedAssets.length === 1
        ? `Are you sure you want to delete the asset "${selectedAssets[0].name}"?`
        : `Are you sure you want to delete ${selectedAssets.length} selected assets?`;

    if (window.confirm(confirmMessage)) {
      // TODO: Implement actual deletion logic here
      console.log("Deleting assets:", selectedAssets);

      // Clear selection after deletion
      setRowSelection({});

      // You would typically call an API endpoint here to delete the assets
      // For now, we'll just log the action
    }
  };

  // Show skeleton if loading or no data
  if (isLoading || !data || data.length === 0) {
    return <AssetTableSkeleton rowCount={8} isMobile={isMobile} />;
  }

  return (
    <div className="w-full space-y-4 -mt-4">
      {/* Asset Filters moved to main page level */}

      {/* Delete Selected Button */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {selectedCount} asset{selectedCount === 1 ? "" : "s"} selected:
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
                    handleViewAsset(row.original as Asset);
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
                    : "No assets available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile columns info */}
      {isMobile && (
        <div className="text-xs text-muted-foreground text-center py-2">
          💡 Swipe to see more details • Tap row to view full asset
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

      {/* Asset Details Dialog */}
      <AssetDetailsDialog
        asset={selectedAsset}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      {/* Edit Asset Dialog */}
      <EditAssetDialog
        asset={selectedAsset}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveAsset}
      />

      {/* Delete Asset Dialog */}
      <DeleteAssetDialog
        asset={selectedAsset}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
