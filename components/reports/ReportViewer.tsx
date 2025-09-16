"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  Trash2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { generateReportPDF } from "@/lib/utils/pdfGenerator";
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

interface ReportViewerProps {
  reportId: string;
  onBack?: () => void;
  onDelete?: (reportId: string) => void;
}

export function ReportViewer({
  reportId,
  onBack,
  onDelete,
}: ReportViewerProps) {
  const { theme } = useTheme();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!report || !onDelete) return;

    try {
      setIsDeleting(true);
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

      // Trigger global refresh event to sync sidebar
      triggerReportsRefresh();

      onDelete(reportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDownload = async () => {
    if (!report) return;

    setIsDownloading(true);
    try {
      console.log("Starting PDF generation for report:", report.title);
      await generateReportPDF(report);
      console.log("PDF generation completed successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.log("Falling back to markdown download");

      // Fallback to markdown download if PDF generation fails
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

      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={fetchReport}
            variant="outline"
            className="cursor-pointer"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {onBack && (
        <Button
          onClick={onBack}
          className="cursor-pointer button-blue-bg"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold text-sky-950 dark:text-sky-50 tracking-tight truncate max-w-{100vw} md:max-w-2xl whitespace-normal"
              title={report.title}
            >
              {report.title}
            </h1>
            <p className="text-gray-600">
              Generated on{" "}
              {(() => {
                const date = new Date(report.metadata.generatedAt);
                const day = date.getDate().toString().padStart(2, "0");
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const year = date.getFullYear().toString().slice(-2);
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12;
                return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
              })()}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isDownloading ? "Generating..." : "Download Markdown"}
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="cursor-pointer border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status Alert */}
      {report.status === "generating" && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Your AI report is being generated. This may take a few moments...
          </AlertDescription>
        </Alert>
      )}

      {report.status === "failed" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Report generation failed. Please try generating a new report.
          </AlertDescription>
        </Alert>
      )}

      {/* Financial Health Score */}
      {report.status === "completed" &&
        report.insights?.financialHealthScore && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dashboard-page-card-title">
                <TrendingUp className="h-5 w-5 hidden md:block" />
                Financial Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {report.insights.financialHealthScore}/100
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-sm",
                      getHealthScoreColor(report.insights.financialHealthScore)
                    )}
                  >
                    {getHealthScoreLabel(report.insights.financialHealthScore)}
                  </Badge>
                </div>
                <Progress
                  value={report.insights.financialHealthScore}
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        )}

      {/* Key Insights */}
      {report.status === "completed" && report.insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.insights.keyFindings &&
            report.insights.keyFindings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.insights.keyFindings.map((finding, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {report.insights.recommendations &&
            report.insights.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sky-700">
                    <TrendingUp className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.insights.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <TrendingUp className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {report.insights.riskFactors &&
            report.insights.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.insights.riskFactors.map((risk, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>
      )}

      {/* Report Content */}
      {report.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="dashboard-page-card-title">
              Detailed Analysis
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Comprehensive AI-generated financial analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`prose prose-sm max-w-none ${
                theme === "dark" ? "dark:prose-invert" : ""
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  [
                    rehypeHighlight,
                    {
                      detect: true,
                      ignoreMissing: true,
                    },
                  ],
                ]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 dark:text-gray-300">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre
                      className={`p-4 rounded-lg overflow-x-auto mb-4 ${
                        theme === "dark" ? "hljs-dark" : "hljs-light"
                      }`}
                    >
                      {children}
                    </pre>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-900 dark:text-gray-100">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                      {children}
                    </td>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800 dark:text-gray-200">
                      {children}
                    </em>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  hr: () => (
                    <hr className="my-6 border-gray-300 dark:border-gray-600" />
                  ),
                }}
              >
                {report.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generating State */}
      {report.status === "generating" && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Generating Your Report
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI is analyzing your financial data to create personalized
                insights...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{report?.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
