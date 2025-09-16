"use client";

import { useState } from "react";
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
import {
  FileText,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ReportCardProps {
  report: Report;
  onViewReport?: (report: Report) => void;
  onGenerateNew?: () => void;
  isGenerating?: boolean;
}

export function ReportCard({
  report,
  onViewReport,
  onGenerateNew,
  isGenerating = false,
}: ReportCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription className="text-sm">
                {(() => {
                  const date = new Date(report.createdAt);
                  const day = date.getDate().toString().padStart(2, "0");
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const year = date.getFullYear().toString().slice(-2);
                  return `${day}/${month}/${year}`;
                })()}{" "}
                • {report.type}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            <Badge className={cn("text-xs", getStatusColor(report.status))}>
              {report.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Financial Health Score */}
        {report.insights?.financialHealthScore &&
          report.status === "completed" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Financial Health
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      getHealthScoreColor(report.insights.financialHealthScore)
                    )}
                  >
                    {report.insights.financialHealthScore}/100
                  </span>
                  <span className="text-xs text-gray-500">
                    {getHealthScoreLabel(report.insights.financialHealthScore)}
                  </span>
                </div>
              </div>
              <Progress
                value={report.insights.financialHealthScore}
                className="h-2"
              />
            </div>
          )}

        {/* Key Insights Preview */}
        {report.insights && report.status === "completed" && (
          <div className="space-y-3">
            {report.insights.keyFindings &&
              report.insights.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Key Findings
                  </h4>
                  <div className="space-y-1">
                    {report.insights.keyFindings
                      .slice(0, 2)
                      .map((finding, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{finding}</span>
                        </div>
                      ))}
                    {report.insights.keyFindings.length > 2 && (
                      <p className="text-xs text-gray-500 ml-5">
                        +{report.insights.keyFindings.length - 2} more findings
                      </p>
                    )}
                  </div>
                </div>
              )}

            {report.insights.recommendations &&
              report.insights.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Top Recommendations
                  </h4>
                  <div className="space-y-1">
                    {report.insights.recommendations
                      .slice(0, 2)
                      .map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <TrendingUp className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{rec}</span>
                        </div>
                      ))}
                    {report.insights.recommendations.length > 2 && (
                      <p className="text-xs text-gray-500 ml-5">
                        +{report.insights.recommendations.length - 2} more
                        recommendations
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Generating State */}
        {report.status === "generating" && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              AI is analyzing your financial data...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This may take a few moments
            </p>
          </div>
        )}

        {/* Failed State */}
        {report.status === "failed" && (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">Report generation failed</p>
            <p className="text-xs text-gray-500 mt-1">Please try again</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {report.status === "completed" && onViewReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReport(report)}
              className="flex-1 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Report
            </Button>
          )}

          {report.status === "failed" && onGenerateNew && (
            <Button
              size="sm"
              onClick={onGenerateNew}
              className="flex-1 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}

          {isGenerating && (
            <Button size="sm" disabled className="flex-1">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
