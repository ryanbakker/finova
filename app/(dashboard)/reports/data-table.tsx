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
  Table as ReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { setGlobalActionHandlers } from "./columns";
import { ReportRowSkeleton } from "@/components/reports/ReportRowSkeleton";

// Report interface matching the one used in the page
interface Report {
  id: string;
  title: string;
  content: string;
  type: string;
  status: "generating" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  insights?: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
    financialHealthScore?: number;
    trends?: {
      spending: string;
      income: string;
      savings: string;
      netWorth: string;
    };
    opportunities?: string[];
    warnings?: string[];
  };
  metadata: {
    generatedAt: string;
    model?: string;
    tokensUsed?: number;
  };
}

interface DataTableProps<TData extends Report, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortStates?: Record<string, "asc" | "desc" | false>;
  onRefresh?: () => void;
  onTableReady?: (table: ReactTable<TData>) => void;
}

export function DataTable<TData extends Report, TValue>({
  columns,
  data,
  isLoading = false,
  sortStates: _sortStates,
  onRefresh,
  onTableReady,
}: DataTableProps<TData, TValue>) {
  const [_currentPage, _setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pageSize = 20;
  const isMobile = useIsMobile();

  // Get filter values from URL search params
  const titleFilter = searchParams.get("title") || "";
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const dateFromFilter = searchParams.get("dateFrom");
  const dateToFilter = searchParams.get("dateTo");

  // Set column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile: show select, title, type, status, download, and delete
      setColumnVisibility({
        select: true,
        title: true,
        type: true,
        createdAt: false,
        status: true,
        "insights.financialHealthScore": false,
        download: true,
        delete: true,
      });
    } else {
      // On medium+ devices: show all columns
      setColumnVisibility({
        select: true,
        title: true,
        type: true,
        createdAt: true,
        status: true,
        "insights.financialHealthScore": true,
        download: true,
        delete: true,
      });
    }
  }, [isMobile]);

  const handleViewReport = useCallback(
    (report: Report) => {
      router.push(`/reports/${report.id}`);
    },
    [router]
  );

  const handleDownloadReport = useCallback((report: Report) => {
    // Create a formatted report content matching ReportViewer format
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
    };

    const content = `
# ${report.title}

Generated on: ${formatDate(report.metadata.generatedAt)}
Model: ${report.metadata.model || "AI Generated"}

${report.content}
    `.trim();

    // Create a blob with the markdown content
    const blob = new Blob([content], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  const handleDeleteReport = useCallback((report: Report) => {
    setReportToDelete(report);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;

    // Debug logging
    console.log("Attempting to delete report:", {
      reportId: reportToDelete.id,
      reportTitle: reportToDelete.title,
      fullReport: reportToDelete,
    });

    if (!reportToDelete.id) {
      console.error("Report ID is undefined or null:", reportToDelete);
      throw new Error("Invalid report ID - cannot delete report");
    }

    try {
      const response = await fetch(`/api/reports/${reportToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          // If JSON parsing fails, use the status text
          console.warn("Failed to parse error response as JSON:", jsonError);
        }
        console.log("Final error message:", errorMessage);
        throw new Error(errorMessage);
      }

      // Refresh the data after successful deletion
      if (onRefresh) {
        onRefresh();
      }

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error("Error deleting report:", error);
      // Close the dialog even if there's an error
      setIsDeleteDialogOpen(false);
      setReportToDelete(null);
      // Re-throw the error so it can be handled by the parent component
      throw error;
    }
  };

  const cancelDeleteReport = () => {
    setIsDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  // Set up action handlers
  useEffect(() => {
    setGlobalActionHandlers({
      onView: handleViewReport,
      onDownload: handleDownloadReport,
      onDelete: handleDeleteReport,
    });
  }, [handleViewReport, handleDownloadReport, handleDeleteReport]);

  // Create sort states for columns
  const [localSortStates, setLocalSortStates] = useState<
    Record<string, "asc" | "desc" | false>
  >({});

  const toggleSorting = (columnId: string) => {
    setLocalSortStates((prev) => ({
      ...prev,
      [columnId]:
        prev[columnId] === "asc"
          ? "desc"
          : prev[columnId] === "desc"
          ? false
          : "asc",
    }));
  };

  // Create filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    // Apply filters
    if (titleFilter) {
      filtered = filtered.filter((report) =>
        report.title.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= fromDate
      );
    }

    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) <= toDate
      );
    }

    // Apply sorting
    Object.entries(localSortStates).forEach(([columnId, direction]) => {
      if (direction === false) return;

      filtered.sort((a, b) => {
        let aValue: unknown;
        let bValue: unknown;

        switch (columnId) {
          case "title":
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case "type":
            aValue = a.type.toLowerCase();
            bValue = b.type.toLowerCase();
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "status":
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          default:
            return 0;
        }

        if ((aValue as string | number) < (bValue as string | number))
          return direction === "asc" ? -1 : 1;
        if ((aValue as string | number) > (bValue as string | number))
          return direction === "asc" ? 1 : -1;
        return 0;
      });
    });

    return filtered;
  }, [
    data,
    localSortStates,
    titleFilter,
    typeFilter,
    statusFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  // Create columns with current sort states
  const columnsWithSorting = useMemo(() => {
    // Import the createColumns function dynamically to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createColumns } = require("./columns");
    return createColumns(localSortStates, toggleSorting);
  }, [localSortStates]);

  const table = useReactTable({
    data: filteredAndSortedData,
    columns: columnsWithSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  // Notify parent component when table is ready
  useEffect(() => {
    if (onTableReady && table) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border rounded-md">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          No reports
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by generating your first AI-powered financial report.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="border rounded-md">
          <div className="relative overflow-x-auto">
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
                  table.getRowModel().rows.map((row) => {
                    // Show loading skeleton for generating reports
                    if (row.original.status === "generating") {
                      return (
                        <ReportRowSkeleton
                          key={row.id}
                          showHealthScore={
                            columnVisibility[
                              "insights.financialHealthScore"
                            ] !== false
                          }
                          showDate={columnVisibility.createdAt !== false}
                        />
                      );
                    }

                    // Show normal row for completed/failed reports
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="dashboard-table-row group"
                        onClick={(e) => {
                          // Don't open details if clicking on action buttons or checkboxes
                          if (
                            e.target instanceof Element &&
                            (e.target.closest('[data-action="button"]') ||
                              e.target.closest('input[type="checkbox"]') ||
                              e.target.closest("button"))
                          ) {
                            return;
                          }
                          // Only redirect for completed reports
                          if (row.original.status === "completed") {
                            handleViewReport(row.original);
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={`dashboard-table-cell ${
                              cell.column.id !== "download" &&
                              cell.column.id !== "delete"
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
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-[70px] border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{reportToDelete?.title}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteReport}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await confirmDeleteReport();
                } catch (_error) {
                  // Error is already logged in confirmDeleteReport
                  // The dialog is already closed, so we don't need to do anything else here
                }
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
