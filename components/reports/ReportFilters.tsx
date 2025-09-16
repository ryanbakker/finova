"use client";

import { useCallback, useEffect, useState } from "react";

// Report interface matching the one used in the data table
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  FileText,
  Sparkles,
  TrendingUp,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export interface ReportFiltersProps {
  table?: {
    getAllColumns: () => Array<{
      id: string;
      getCanHide: () => boolean;
      getIsVisible: () => boolean;
      toggleVisibility: (value: boolean) => void;
    }>;
    getSelectedRowModel: () => {
      rows: Array<{
        original: {
          id: string;
          title: string;
          status: string;
        };
      }>;
    };
  };
  isLoading?: boolean;
  value?: {
    title: string;
    type: string;
    status: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onChange?: (
    next: Partial<{
      title: string;
      type: string;
      status: string;
      dateFrom?: string | undefined;
      dateTo?: string | undefined;
    }>
  ) => void;
  onBulkDelete?: (reportIds: string[]) => Promise<void>;
}

export function ReportFilters({
  table,
  isLoading = false,
  value,
  onChange,
  onBulkDelete,
}: ReportFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Local state for filters
  const [filters, setFilters] = useState({
    title: "",
    type: "all",
    status: "all",
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  });

  // Initialize filters from URL params or props
  useEffect(() => {
    const newFilters = {
      title: value?.title || searchParams.get("title") || "",
      type: value?.type || searchParams.get("type") || "all",
      status: value?.status || searchParams.get("status") || "all",
      dateFrom: value?.dateFrom || searchParams.get("dateFrom") || undefined,
      dateTo: value?.dateTo || searchParams.get("dateTo") || undefined,
    };
    setFilters(newFilters);
  }, [searchParams, value]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams(searchParams);

      // Clear existing filter params
      params.delete("title");
      params.delete("type");
      params.delete("status");
      params.delete("dateFrom");
      params.delete("dateTo");

      // Add new filter params
      if (newFilters.title) params.set("title", newFilters.title);
      if (newFilters.type !== "all") params.set("type", newFilters.type);
      if (newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.dateFrom) params.set("dateFrom", newFilters.dateFrom);
      if (newFilters.dateTo) params.set("dateTo", newFilters.dateTo);

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string | undefined) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      updateURL(newFilters);
      onChange?.(newFilters);
    },
    [filters, updateURL, onChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      title: "",
      type: "all",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    onChange?.(clearedFilters);
  }, [updateURL, onChange]);

  // Track selected reports with state
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
  const selectedCount = selectedReports.length;
  const hasSelectedReports = selectedCount > 0;

  // Update selected reports when table selection changes
  useEffect(() => {
    if (table) {
      const updateSelection = () => {
        const rows = table.getSelectedRowModel().rows || [];
        const selectedReports = rows.map((row) => row.original as Report);
        console.log(
          "ReportFilters - selectedReports updated:",
          selectedReports
        );
        setSelectedReports(selectedReports);
      };

      // Initial update
      updateSelection();

      // Set up interval to check for selection changes
      const interval = setInterval(updateSelection, 100);

      return () => clearInterval(interval);
    }
  }, [table]);

  console.log("ReportFilters - hasSelectedReports:", hasSelectedReports);
  console.log("ReportFilters - onBulkDelete:", !!onBulkDelete);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (!onBulkDelete || selectedCount === 0) return;

    try {
      const reportIds = selectedReports.map((report) => report.id);
      await onBulkDelete(reportIds);
      setIsBulkDeleteDialogOpen(false);
      toast.success("Reports Deleted", {
        description: `${selectedCount} report${
          selectedCount !== 1 ? "s" : ""
        } deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting reports:", error);
      toast.error("Delete Failed", {
        description: "Failed to delete selected reports. Please try again.",
      });
    }
  }, [onBulkDelete, selectedReports, selectedCount]);

  // Count active filters
  const activeFiltersCount = [
    filters.title,
    filters.type !== "all",
    filters.status !== "all",
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Format column names for display
  const formatColumnName = (columnId: string) => {
    const columnNames: Record<string, string> = {
      select: "Select",
      type: "Report",
      createdAt: "Date",
      status: "Status",
      download: "Download",
      delete: "Delete",
    };
    return columnNames[columnId] || columnId;
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reports..."
              value={filters.title}
              onChange={(e) => handleFilterChange("title", e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Delete Button */}
          {hasSelectedReports && onBulkDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedCount})
            </Button>
          )}

          {/* Column Visibility */}
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
                        {formatColumnName(column.id)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-1 cursor-pointer ${
              isExpanded || activeFiltersCount > 0
                ? "bg-gradient-to-r from-sky-500 via-sky-500 to-sky-600 text-white border-sky-600 hover:from-sky-600 hover:via-sky-600 hover:to-sky-700 hover:border-sky-700 hover:text-white"
                : ""
            }`}
            disabled={isLoading}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 h-2 w-2 rounded-full bg-white"></span>
            )}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between cursor-pointer shadow-sm"
                    disabled={isLoading}
                  >
                    {filters.status === "all" ? "All Status" : filters.status}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "all"}
                    onCheckedChange={() => handleFilterChange("status", "all")}
                    className="cursor-pointer"
                  >
                    All Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "completed"}
                    onCheckedChange={() =>
                      handleFilterChange("status", "completed")
                    }
                    className="cursor-pointer"
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "generating"}
                    onCheckedChange={() =>
                      handleFilterChange("status", "generating")
                    }
                    className="cursor-pointer"
                  >
                    Generating
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "failed"}
                    onCheckedChange={() =>
                      handleFilterChange("status", "failed")
                    }
                    className="cursor-pointer"
                  >
                    Failed
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Report Type Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Report Type
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.type === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("type", "all")}
                  disabled={isLoading}
                  className="flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>All Types</span>
                </Button>
                <Button
                  variant={filters.type === "summary" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("type", "summary")}
                  disabled={isLoading}
                  className="flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>Summary</span>
                </Button>
                <Button
                  variant={filters.type === "detailed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("type", "detailed")}
                  disabled={isLoading}
                  className="flex items-center space-x-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Detailed</span>
                </Button>
                <Button
                  variant={filters.type === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("type", "custom")}
                  disabled={isLoading}
                  className="flex items-center space-x-1"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Custom</span>
                </Button>
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date Range
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <DatePicker
                    value={
                      filters.dateFrom ? new Date(filters.dateFrom) : undefined
                    }
                    onChange={(date) =>
                      handleFilterChange(
                        "dateFrom",
                        date?.toISOString().split("T")[0]
                      )
                    }
                    placeholder="From date"
                    disabled={isLoading}
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex-1">
                  <DatePicker
                    value={
                      filters.dateTo ? new Date(filters.dateTo) : undefined
                    }
                    onChange={(date) =>
                      handleFilterChange(
                        "dateTo",
                        date?.toISOString().split("T")[0]
                      )
                    }
                    placeholder="To date"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-muted-foreground">
              {activeFiltersCount > 0 ? (
                <span>
                  {activeFiltersCount} filter
                  {activeFiltersCount !== 1 ? "s" : ""} applied
                </span>
              ) : (
                <span>No filters applied</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Reports</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} selected report
              {selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
            {selectedCount > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">
                  Selected reports:
                </div>
                <ul className="list-disc list-inside text-sm max-h-32 overflow-y-auto space-y-1">
                  {selectedReports.slice(0, 10).map((report) => (
                    <li key={report.id} className="text-xs">
                      {report.title}
                    </li>
                  ))}
                  {selectedCount > 10 && (
                    <li className="text-xs text-muted-foreground">
                      ... and {selectedCount - 10} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete {selectedCount} Report{selectedCount !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
