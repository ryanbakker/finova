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
import { useState, useEffect, useMemo } from "react";
import { setGlobalActionHandlers } from "./columns";
import { FinancialGoal } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  GoalDetailsDialog,
  EditGoalDialog,
  DeleteGoalDialog,
  GoalFilters,
  GoalTableSkeleton,
} from "../../../components/goals";

interface DataTableProps<TData extends FinancialGoal, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTableReady?: (table: any) => void;
  onDelete?: (goalId: string) => void;
}

export function DataTable<TData extends FinancialGoal, TValue>({
  columns,
  data,
  isLoading = false,

  onTableReady,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();

  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const nameFilter = searchParams.get("name") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedPriority = searchParams.get("priority") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, name, progress, and actions
      setColumnVisibility({
        select: true,
        name: true,
        progress: true,
        targetDate: false,
        priority: false,
        status: false,
        actions: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        name: true,
        progress: true,
        targetDate: true,
        priority: true,
        status: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleViewGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteGoal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveGoal = (goal: FinancialGoal) => {
    // TODO: Implement save logic
    console.log("Saving goal:", goal);
    handleCloseEditDialog();
  };

  const handleDeleteGoalConfirm = () => {
    if (selectedGoal && onDelete) {
      onDelete(selectedGoal.id);
      handleCloseDeleteDialog();
    }
  };

  // Set up global action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewGoal,
      onEdit: handleEditGoal,
      onDelete: handleDeleteGoal,
    });
  }, []);

  // Filter data based on search params
  const filteredData = useMemo(() => {
    let filtered = data;

    if (nameFilter) {
      filtered = filtered.filter((goal) =>
        goal.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((goal) => goal.category === selectedCategory);
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter((goal) => goal.priority === selectedPriority);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((goal) => goal.status === selectedStatus);
    }

    if (minAmount) {
      filtered = filtered.filter(
        (goal) => goal.targetAmount >= parseFloat(minAmount)
      );
    }

    if (maxAmount) {
      filtered = filtered.filter(
        (goal) => goal.targetAmount <= parseFloat(maxAmount)
      );
    }

    return filtered;
  }, [
    data,
    nameFilter,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    minAmount,
    maxAmount,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  });

  // Notify parent component when table is ready
  useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  if (isLoading) {
    return <GoalTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <GoalFilters />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleViewGoal(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No goals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <GoalDetailsDialog
        goal={selectedGoal}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      <EditGoalDialog
        goal={selectedGoal}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveGoal}
      />

      <DeleteGoalDialog
        goal={selectedGoal}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteGoalConfirm}
      />
    </div>
  );
}
