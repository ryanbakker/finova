"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowUpDown,
  Calendar,
  FileText,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
  Gauge,
  XCircle,
} from "lucide-react";

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

// Action handlers interface
interface ActionHandlers {
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onDelete: (report: Report) => void;
}

// Global event system for actions
let globalActionHandlers: ActionHandlers | null = null;

export const setGlobalActionHandlers = (handlers: ActionHandlers) => {
  globalActionHandlers = handlers;
};

// Dynamic sortable header component
interface SortableHeaderProps {
  columnId: string;
  sortState: "asc" | "desc" | false;
  onToggleSort: (columnId: string) => void;
  children: React.ReactNode;
  className?: string;
}

const SortableHeader = ({
  columnId,
  sortState,
  onToggleSort,
  children,
  className = "",
}: SortableHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onToggleSort(columnId)}
      className={`h-auto p-0 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
        sortState ? "table-header-sorted" : ""
      } ${className}`}
    >
      {children}
      {sortState === "asc" ? (
        <MoveUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : sortState === "desc" ? (
        <MoveDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : (
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
      )}
    </Button>
  );
};

// Helper function to format date and time to desired format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format date to DD/MM/YY (Australian format)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  // Format time to 12-hour AM/PM format
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const timeString = `${hours}:${minutes} ${ampm}`;

  return `${day}/${month}/${year} ${timeString}`;
};

// Helper function to get report type icon
const getReportTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "summary":
      return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "detailed":
      return (
        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      );
    case "custom":
      return (
        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      );
    default:
      return <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "generating":
      return <Loader2 className="h-4 w-4 animate-spin text-amber-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

// Helper function to get status badge
const _getStatusBadge = (status: string) => {
  switch (status) {
    case "generating":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
          Generating
        </span>
      );
    case "completed":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
          Complete
        </span>
      );
    case "failed":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 rounded-full">
          Failed
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">
          Unknown
        </span>
      );
  }
};

// Helper function to get type display text
const getTypeDisplayText = (type: string) => {
  switch (type.toLowerCase()) {
    case "summary":
      return "Financial Summary Report";
    case "detailed":
      return "Detailed Financial Analysis";
    case "custom":
      return "Custom Financial Report";
    default:
      return `${type} Report`;
  }
};

export const createColumns = (
  sortStates: Record<string, "asc" | "desc" | false>,
  toggleSorting: (columnId: string) => void
): ColumnDef<Report>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-2"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => (
      <SortableHeader
        columnId="title"
        sortState={sortStates.title || false}
        onToggleSort={toggleSorting}
      >
        Report Name
      </SortableHeader>
    ),
    maxSize: 300,
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="min-w-0 max-w-[300px]">
          <div className="font-medium text-sm truncate" title={report.title}>
            {report.title}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <SortableHeader
        columnId="type"
        sortState={sortStates.type || false}
        onToggleSort={toggleSorting}
      >
        Type
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex items-center space-x-2">
          {getReportTypeIcon(report.type)}
          <span className="text-sm font-medium">
            {getTypeDisplayText(report.type)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <SortableHeader
        columnId="createdAt"
        sortState={sortStates.createdAt || false}
        onToggleSort={toggleSorting}
      >
        Date
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(createdAt)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <SortableHeader
        columnId="status"
        sortState={sortStates.status || false}
        onToggleSort={toggleSorting}
      >
        Status
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex items-center justify-center">
          {getStatusIcon(report.status)}
        </div>
      );
    },
  },
  {
    accessorKey: "insights.financialHealthScore",
    header: () => (
      <SortableHeader
        columnId="healthScore"
        sortState={sortStates.healthScore || false}
        onToggleSort={toggleSorting}
      >
        Health Score
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const report = row.original;
      const healthScore = report.insights?.financialHealthScore;

      if (healthScore === undefined || healthScore === null) {
        return (
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">--</span>
          </div>
        );
      }

      const getHealthScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-blue-600 dark:text-blue-400";
        if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
      };

      const _getHealthScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Improvement";
      };

      return (
        <div className="flex items-center justify-center space-x-2">
          <Gauge className={`h-4 w-4 ${getHealthScoreColor(healthScore)}`} />
          <span
            className={`text-sm font-medium ${getHealthScoreColor(
              healthScore
            )}`}
          >
            {healthScore}
          </span>
        </div>
      );
    },
  },
  {
    id: "download",
    header: () => <span className="text-sm font-semibold">Download</span>,
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            data-action="button"
            onClick={(e) => {
              e.stopPropagation();
              globalActionHandlers?.onDownload(report);
            }}
            disabled={report.status !== "completed"}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download report</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "delete",
    header: () => <span className="text-sm font-semibold">Delete</span>,
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            data-action="button"
            onClick={(e) => {
              e.stopPropagation();
              globalActionHandlers?.onDelete(report);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete report</span>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
