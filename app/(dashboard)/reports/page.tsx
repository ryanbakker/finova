"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Loader2,
  Calendar,
  Gauge,
} from "lucide-react";
import {
  AIReportGenerator,
  ReportViewer,
  ReportFilters,
} from "@/components/reports";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { DashboardFooter } from "@/components/DashboardFooter";
import { toast } from "sonner";
import { triggerReportsRefresh } from "@/lib/utils/reports-events";

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

function ReportsList({
  reports,
  onViewReport: _onViewReport,
  onDeleteReport: _onDeleteReport,
  onBulkDeleteReports,
  isLoading,
  onGenerateQuickReport,
  onRefresh,
}: {
  reports: Report[];
  onViewReport: (report: Report) => void;
  onDeleteReport: (reportId: string) => void;
  onBulkDeleteReports: (reportIds: string[]) => Promise<void>;
  isLoading: boolean;
  onGenerateQuickReport: () => void;
  onRefresh: () => void;
}) {
  const [tableReady, setTableReady] = useState(false);
  const [tableRef, setTableRef] = useState<any>(null);
  const columns = createColumns({}, () => {});

  const handleTableReady = useCallback((table: any) => {
    setTableRef(table);
    setTableReady(true);
  }, []);

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No reports yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Generate your first AI-powered financial report to get started with
          personalized insights and analysis.
        </p>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={onGenerateQuickReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Your First Report
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      {tableReady && tableRef ? (
        <ReportFilters
          table={tableRef}
          isLoading={isLoading}
          onBulkDelete={onBulkDeleteReports}
        />
      ) : (
        <div className="w-full p-4 text-center text-muted-foreground bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg animate-in fade-in duration-300">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mx-auto mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        onRefresh={onRefresh}
        onTableReady={handleTableReady}
      />
    </div>
  );
}

// Utility function to deduplicate reports by ID
const deduplicateReports = (reports: Report[]): Report[] => {
  const seen = new Set<string>();
  return reports.filter((report) => {
    if (seen.has(report.id)) {
      console.warn("Removing duplicate report:", report.id);
      return false;
    }
    seen.add(report.id);
    return true;
  });
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      const fetchedReports = data.reports || [];
      setReports(deduplicateReports(fetchedReports));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportGenerated = (newReport: Report) => {
    setReports((prev) => {
      const updatedReports = [newReport, ...prev];
      return deduplicateReports(updatedReports);
    });

    // Trigger global refresh event to sync sidebar
    triggerReportsRefresh();
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
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

      // Update local state after successful deletion
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }

      // Trigger global refresh event to sync sidebar
      triggerReportsRefresh();

      // Show success toast
      toast.success("Report Deleted", {
        description: "The report has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      // Show error toast with more specific error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete the report. Please try again.";
      toast.error("Delete Failed", {
        description: errorMessage,
      });
    }
  };

  const handleBulkDeleteReports = async (reportIds: string[]) => {
    try {
      // Delete reports in parallel
      const deletePromises = reportIds.map(async (reportId) => {
        const response = await fetch(`/api/reports/${reportId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            console.warn("Failed to parse error response as JSON:", jsonError);
          }
          throw new Error(errorMessage);
        }
        return reportId;
      });

      await Promise.all(deletePromises);

      // Update local state after successful deletion
      setReports((prev) => prev.filter((r) => !reportIds.includes(r.id)));

      // Clear selected report if it was deleted
      if (selectedReport && reportIds.includes(selectedReport.id)) {
        setSelectedReport(null);
      }

      // Trigger global refresh event to sync sidebar
      triggerReportsRefresh();

      // Show success toast
      toast.success("Reports Deleted", {
        description: `${reportIds.length} report${
          reportIds.length !== 1 ? "s" : ""
        } deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting reports:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete the reports. Please try again.";
      toast.error("Bulk Delete Failed", {
        description: errorMessage,
      });
      throw error; // Re-throw so the UI can handle it
    }
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    fetchReports(); // Refresh the list
  };

  const generateQuickReport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Show toast notification for generation start
      toast("Quick Report Generation Started", {
        description:
          "Your AI financial report is being generated. This may take a few moments.",
      });

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "summary",
          context: {
            userProfile: {
              lifeStage: "established",
              riskTolerance: "moderate",
            },
            reportFocus: {
              timeHorizon: "medium_term",
              urgency: "low",
              primaryAreas: [
                "Overall financial health",
                "Key metrics summary",
                "General recommendations",
              ],
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quick report");
      }

      const data = await response.json();
      const newReport = data.report;

      handleReportGenerated(newReport);

      // Poll for completion and show the report when ready
      pollQuickReportStatus(newReport.id);
    } catch (_err) {
      setError(
        _err instanceof Error ? _err.message : "Failed to generate quick report"
      );
      // Show error toast
      toast.error("Quick Report Generation Failed", {
        description:
          _err instanceof Error
            ? _err.message
            : "Failed to generate quick report",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pollQuickReportStatus = async (reportId: string) => {
    const maxAttempts = 90; // 90 seconds max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (response.ok) {
          const data = await response.json();
          const report = data.report;

          setReports((prev) => {
            // Update existing report or add new one if not found
            const existingIndex = prev.findIndex((r) => r.id === reportId);
            let updatedReports;
            if (existingIndex >= 0) {
              // Update existing report
              updatedReports = [...prev];
              updatedReports[existingIndex] = report;
            } else {
              // Add new report if not found (shouldn't happen in normal flow)
              updatedReports = [report, ...prev];
            }
            return deduplicateReports(updatedReports);
          });

          if (report.status === "completed") {
            // Show completion toast
            toast.success("Quick Report Generation Complete", {
              description: "Your AI financial report is ready to view.",
            });
            return;
          } else if (report.status === "failed") {
            setError("Quick report generation failed");
            // Show failure toast
            toast.error("Quick Report Generation Failed", {
              description:
                "There was an error generating your quick report. Please try again.",
            });
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setError("Quick report generation timed out");
          // Show timeout toast
          toast.error("Quick Report Generation Timed Out", {
            description:
              "The report generation took longer than expected. Please try again.",
          });
        }
      } catch (_err) {
        setError("Failed to check quick report status");
        // Show error toast
        toast.error("Quick Report Status Check Failed", {
          description:
            "Failed to check report status. Please refresh the page.",
        });
      }
    };

    poll();
  };

  // Calculate stats
  const totalReports = reports.length;
  const completedReports = reports.filter((r) => r.status === "completed");
  const reportsWithHealthScores = completedReports.filter(
    (r) => r.insights?.financialHealthScore !== undefined
  );
  const avgHealthScore =
    reportsWithHealthScores.length > 0
      ? Math.round(
          reportsWithHealthScores.reduce(
            (sum, r) => sum + (r.insights?.financialHealthScore || 0),
            0
          ) / reportsWithHealthScores.length
        )
      : null;

  // Get health score trend
  const healthScoreTrend =
    reportsWithHealthScores.length >= 2
      ? (reportsWithHealthScores[0].insights?.financialHealthScore || 0) -
        (reportsWithHealthScores[reportsWithHealthScores.length - 1].insights
          ?.financialHealthScore || 0)
      : 0;
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const lastGenerated =
    reports.length > 0 ? formatDate(reports[0].createdAt) : null;

  if (selectedReport) {
    return (
      <ReportViewer
        reportId={selectedReport.id}
        onBack={handleBackToList}
        onDelete={handleDeleteReport}
      />
    );
  }

  return (
    <div className="space-y-6 page-content">
      {/* Header */}
      <div className="flex gap-5 md:gap-0 justify-between flex-col md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Financial Reports</h1>
          <h2 className="page-sub-title">
            AI-powered insights and analysis of your financial data to help you
            make informed decisions.
          </h2>
        </div>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={generateQuickReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-4 w-4" />
              Quick Report
            </>
          )}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
              {totalReports}
            </div>
            <p className="text-xs text-muted-foreground">
              AI-generated reports
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Health Score
            </CardTitle>
            <Gauge className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
              {avgHealthScore !== null ? avgHealthScore : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {avgHealthScore !== null ? (
                <>
                  {avgHealthScore >= 80
                    ? "Excellent"
                    : avgHealthScore >= 60
                    ? "Good"
                    : avgHealthScore >= 40
                    ? "Fair"
                    : "Needs Improvement"}
                  {healthScoreTrend !== 0 && (
                    <span
                      className={`ml-1 ${
                        healthScoreTrend > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ({healthScoreTrend > 0 ? "+" : ""}
                      {healthScoreTrend})
                    </span>
                  )}
                </>
              ) : (
                "Financial health rating"
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/30 dark:to-neutral-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Generated
            </CardTitle>
            <Calendar className="h-6 w-6 opacity-80 text-sky-600 dark:text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">
              {lastGenerated || "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastGenerated ? "Most recent report" : "No reports yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <AIReportGenerator onReportGenerated={handleReportGenerated} />

      {/* Reports List */}
      <Card className="dashboard-table-container">
        <CardHeader>
          <CardTitle className="dashboard-page-card-title">
            Recent Reports
          </CardTitle>
          <CardDescription className="dashboard-page-card-description">
            Your AI-generated financial reports and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Error loading reports
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button
                onClick={fetchReports}
                variant="outline"
                className="cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <ReportsList
              reports={reports}
              onViewReport={handleViewReport}
              onDeleteReport={handleDeleteReport}
              onBulkDeleteReports={handleBulkDeleteReports}
              isLoading={isLoading}
              onGenerateQuickReport={generateQuickReport}
              onRefresh={fetchReports}
            />
          )}
        </CardContent>
      </Card>

      <DashboardFooter />
    </div>
  );
}
