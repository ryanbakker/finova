"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReportContextForm } from "./ReportContextForm";
import { ReportContext } from "@/lib/services/ai.service";
import { toast } from "sonner";

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

interface AIReportGeneratorProps {
  onReportGenerated?: (report: Report) => void;
}

export function AIReportGenerator({
  onReportGenerated,
}: AIReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<
    "summary" | "detailed" | "custom"
  >("detailed");
  const [customPrompt, setCustomPrompt] = useState("");
  const [dateRange, setDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [context, setContext] = useState<ReportContext>({});
  const [showContextForm, setShowContextForm] = useState(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Feature access control removed - AI reports are now available to all users

  const generateReport = async () => {
    console.log(`[FRONTEND] Starting report generation`, {
      reportType,
      hasCustomPrompt: !!customPrompt,
      hasDateRange: !!(dateRange.startDate && dateRange.endDate),
      hasContext: Object.keys(context).length > 0,
      timestamp: new Date().toISOString(),
    });

    setIsGenerating(true);
    setError(null);

    // Show toast notification for generation start
    toast("Report Generation Started", {
      description:
        "Your AI financial report is being generated. This may take a few moments.",
    });

    try {
      const requestBody = {
        type: reportType,
        customPrompt: customPrompt || undefined,
        dataRange:
          dateRange.startDate && dateRange.endDate
            ? {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
              }
            : undefined,
        context: Object.keys(context).length > 0 ? context : undefined,
      };

      console.log(`[FRONTEND] Sending report generation request`, {
        requestBody,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`[FRONTEND] Report generation request completed`, {
        status: response.status,
        ok: response.ok,
        timestamp: new Date().toISOString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[FRONTEND] Report generation request failed`, {
          status: response.status,
          errorText,
          timestamp: new Date().toISOString(),
        });
        throw new Error("Failed to generate report");
      }

      const data = await response.json();
      const newReport = data.report;

      console.log(`[FRONTEND] Report generation response received`, {
        reportId: newReport.id,
        status: newReport.status,
        type: newReport.type,
        timestamp: new Date().toISOString(),
      });

      // Add pending report to the list immediately
      setRecentReports((prev) => [newReport, ...prev]);
      onReportGenerated?.(newReport);

      console.log(`[FRONTEND] Report added to recent reports list`, {
        reportId: newReport.id,
        totalReports: recentReports.length + 1,
        timestamp: new Date().toISOString(),
      });

      // Poll for completion
      pollReportStatus(newReport.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate report";

      console.error(`[FRONTEND] Report generation failed`, {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      setError(errorMessage);
      // Show error toast
      toast.error("Report Generation Failed", {
        description: errorMessage,
      });
    } finally {
      console.log(`[FRONTEND] Report generation process completed`, {
        isGenerating: false,
        timestamp: new Date().toISOString(),
      });
      setIsGenerating(false);
    }
  };

  const pollReportStatus = async (reportId: string) => {
    const maxAttempts = 90; // 90 seconds max
    let attempts = 0;

    console.log(`[FRONTEND] Starting report status polling`, {
      reportId,
      maxAttempts,
      timestamp: new Date().toISOString(),
    });

    const poll = async () => {
      try {
        attempts++;
        console.log(
          `[FRONTEND] Polling report status (attempt ${attempts}/${maxAttempts})`,
          {
            reportId,
            timestamp: new Date().toISOString(),
          }
        );

        const response = await fetch(`/api/reports/${reportId}`);

        if (response.ok) {
          const data = await response.json();
          const report = data.report;

          console.log(`[FRONTEND] Report status poll response received`, {
            reportId,
            status: report.status,
            attempt: attempts,
            timestamp: new Date().toISOString(),
          });

          setRecentReports((prev) =>
            prev.map((r) => (r.id === reportId ? report : r))
          );

          if (report.status === "completed") {
            console.log(`[FRONTEND] Report generation completed successfully`, {
              reportId,
              attempt: attempts,
              timestamp: new Date().toISOString(),
            });

            // Show completion toast
            toast.success("Report Generation Complete", {
              description: "Your AI financial report is ready to view.",
            });
            return;
          } else if (report.status === "failed") {
            console.error(`[FRONTEND] Report generation failed`, {
              reportId,
              attempt: attempts,
              timestamp: new Date().toISOString(),
            });

            setError("Report generation failed");
            // Show failure toast
            toast.error("Report Generation Failed", {
              description:
                "There was an error generating your report. Please try again.",
            });
            return;
          } else {
            console.log(`[FRONTEND] Report still generating`, {
              reportId,
              status: report.status,
              attempt: attempts,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          console.warn(`[FRONTEND] Report status poll request failed`, {
            reportId,
            status: response.status,
            attempt: attempts,
            timestamp: new Date().toISOString(),
          });
        }

        if (attempts < maxAttempts) {
          console.log(`[FRONTEND] Scheduling next poll attempt`, {
            reportId,
            nextAttempt: attempts + 1,
            delay: 5000,
            timestamp: new Date().toISOString(),
          });
          setTimeout(poll, 5000);
        } else {
          console.error(`[FRONTEND] Report generation timed out`, {
            reportId,
            maxAttempts,
            timestamp: new Date().toISOString(),
          });

          setError("Report generation timed out");
          // Show timeout toast
          toast.error("Report Generation Timed Out", {
            description:
              "The report generation took longer than expected. Please try again.",
          });
        }
      } catch (err) {
        console.error(`[FRONTEND] Error during report status polling`, {
          reportId,
          attempt: attempts,
          error: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
          timestamp: new Date().toISOString(),
        });

        setError("Failed to check report status");
        // Show error toast
        toast.error("Report Status Check Failed", {
          description:
            "Failed to check report status. Please refresh the page.",
        });
      }
    };

    poll();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generating":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dashboard-page-card-title">
            <Sparkles className="h-5 w-5 text-sky-800 hidden md:block" />
            AI Financial Report Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive financial reports powered by AI analysis of
            your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(value: "summary" | "detailed" | "custom") =>
                  setReportType(value)
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="custom">Custom Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range (Optional)</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 cursor-pointer">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.startDate
                        ? format(dateRange.startDate, "MMM dd")
                        : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.startDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 cursor-pointer">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.endDate
                        ? format(dateRange.endDate, "MMM dd")
                        : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.endDate}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {reportType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">Custom Analysis Request</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Describe what specific analysis you'd like the AI to perform on your financial data..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse md:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => setShowContextForm(!showContextForm)}
              className={cn(
                "flex-1 cursor-pointer",
                showContextForm && "bg-neutral-900 text-white"
              )}
            >
              Personalise Report
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 transition-transform duration-200",
                  showContextForm && "rotate-180"
                )}
              />
            </Button>
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-1 cursor-pointer bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 hover:via-indigo-600 hover:from-indigo-600 transition-colors dark:text-white disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Context Form */}
      {showContextForm && (
        <ReportContextForm
          context={context}
          onChange={setContext}
          onClose={() => setShowContextForm(false)}
        />
      )}

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-gray-500">
                        {(() => {
                          const date = new Date(report.createdAt);
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const year = date.getFullYear().toString().slice(-2);
                          const hours = date.getHours();
                          const minutes = date
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");
                          const ampm = hours >= 12 ? "PM" : "AM";
                          const displayHours = hours % 12 || 12;
                          return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    {report.insights?.financialHealthScore && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        {report.insights.financialHealthScore}/100
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Display */}
      {selectedReport && selectedReport.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedReport.title}</span>
              <div className="flex items-center gap-2">
                {selectedReport.insights?.financialHealthScore && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Health Score: {selectedReport.insights.financialHealthScore}
                    /100
                  </Badge>
                )}
                <Badge variant="secondary">
                  {selectedReport.metadata.model || "AI Generated"}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Generated on{" "}
              {(() => {
                const date = new Date(selectedReport.metadata.generatedAt);
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const year = date.getFullYear().toString().slice(-2);
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Financial Health Score */}
            {selectedReport.insights?.financialHealthScore && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Financial Health Score</Label>
                  <span className="text-sm font-medium">
                    {selectedReport.insights.financialHealthScore}/100
                  </span>
                </div>
                <Progress
                  value={selectedReport.insights.financialHealthScore}
                  className="h-2"
                />
                <p className="text-xs text-gray-500">
                  {selectedReport.insights.financialHealthScore >= 80
                    ? "Excellent"
                    : selectedReport.insights.financialHealthScore >= 60
                    ? "Good"
                    : selectedReport.insights.financialHealthScore >= 40
                    ? "Fair"
                    : "Needs Improvement"}
                </p>
              </div>
            )}

            {/* Key Insights */}
            {selectedReport.insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedReport.insights.keyFindings &&
                  selectedReport.insights.keyFindings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">
                        Key Findings
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {selectedReport.insights.keyFindings.map(
                          (finding, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {selectedReport.insights.recommendations &&
                  selectedReport.insights.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-700">
                        Recommendations
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {selectedReport.insights.recommendations.map(
                          (rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {selectedReport.insights.riskFactors &&
                  selectedReport.insights.riskFactors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-700">Risk Factors</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedReport.insights.riskFactors.map(
                          (risk, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Report Content */}
            <div className="space-y-4">
              <h4 className="font-medium">Detailed Report</h4>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedReport.content}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
