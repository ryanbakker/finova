"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Plus, RefreshCw } from "lucide-react";
import { ReportResponse } from "@/lib/actions/report.actions";
import { getReportsByUserId } from "@/lib/actions/report.actions";

interface ReportSidebarListProps {
  onGenerateReport: () => void;
  refreshTrigger?: number; // Add refresh trigger prop
  isGenerating?: boolean; // Add generating state prop
}

export function ReportSidebarList({
  onGenerateReport,
  refreshTrigger,
  isGenerating = false,
}: ReportSidebarListProps) {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  // Auto-refresh every 5 seconds if there are generating reports
  useEffect(() => {
    const hasGeneratingReports = reports.some(
      (report) => report.status === "generating"
    );

    if (hasGeneratingReports) {
      const interval = setInterval(() => {
        fetchReports();
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [reports]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { reports: fetchedReports } = await getReportsByUserId(5, 0);
      setReports(fetchedReports);
    } catch (_err) {
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "generating":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "financial_summary":
        return "Summary";
      case "spending_analysis":
        return "Spending";
      case "budget_review":
        return "Budget";
      case "goal_progress":
        return "Goals";
      case "custom":
        return "Custom";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <>
        <SidebarMenuSubButton asChild>
          <button onClick={onGenerateReport} className="text-xs font-medium">
            Generate Report
            <Plus className="w-[5px] h-[5px] scale-90" />
          </button>
        </SidebarMenuSubButton>
        <SidebarMenuSubButton className="text-neutral-500">
          <div className="flex items-center gap-2">
            <Spinner size="sm" className="text-neutral-500" />
            <span className="text-xs">Loading...</span>
          </div>
        </SidebarMenuSubButton>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SidebarMenuSubButton asChild>
          <button onClick={onGenerateReport} className="text-xs font-medium">
            Generate Report
            <Plus className="w-[5px] h-[5px] scale-90" />
          </button>
        </SidebarMenuSubButton>
        <SidebarMenuSubButton className="text-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">Error loading reports</span>
          </div>
        </SidebarMenuSubButton>
      </>
    );
  }

  return (
    <>
      <SidebarMenuSubButton asChild>
        <button
          onClick={onGenerateReport}
          disabled={isGenerating}
          className="text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-[5px] h-[5px] scale-90 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Report
              <Plus className="w-[5px] h-[5px] scale-90" />
            </>
          )}
        </button>
      </SidebarMenuSubButton>

      {reports.length > 0 && (
        <SidebarMenuSubButton asChild>
          <button
            onClick={fetchReports}
            className="text-xs text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </SidebarMenuSubButton>
      )}

      {reports.length === 0 ? (
        <SidebarMenuSubButton className="text-neutral-500">
          <span className="text-xs">No reports yet</span>
        </SidebarMenuSubButton>
      ) : (
        reports.map((report) => (
          <SidebarMenuSubButton key={report.id} asChild>
            <Link href={`/report/${report.id}`} className="text-xs">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getStatusIcon(report.status)}
                  <span className="truncate">
                    {getReportTypeLabel(report.type)} -{" "}
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                {report.status === "generating" && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    <Clock className="w-2 h-2 mr-1" />
                    Generating
                  </Badge>
                )}
              </div>
            </Link>
          </SidebarMenuSubButton>
        ))
      )}
    </>
  );
}
