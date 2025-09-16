"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Report, IReport } from "@/database/models/report.model";
import { revalidatePath } from "next/cache";

export interface CreateReportParams {
  type: "financial_summary";
  customPrompt?: string;
  dataRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface ReportResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  insights?: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
  };
  metadata: {
    generatedAt: Date;
    dataRange?: {
      startDate: Date;
      endDate: Date;
    };
    prompt?: string;
    model?: string;
    tokensUsed?: number;
  };
}

export async function createReport(
  params: CreateReportParams
): Promise<ReportResponse> {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[REPORT_ACTIONS] Starting report creation`, {
      params,
      timestamp: new Date().toISOString(),
    });

    const { userId: authUserId } = await auth();
    userId = authUserId;

    if (!userId) {
      console.warn(`[REPORT_ACTIONS] Unauthorized access attempt`, {
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized: User not authenticated");
    }

    console.log(`[REPORT_ACTIONS] User authenticated`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[REPORT_ACTIONS] Database connected`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[REPORT_ACTIONS] Creating report record`, {
      userId,
      type: params.type,
      hasCustomPrompt: !!params.customPrompt,
      hasDataRange: !!params.dataRange,
      timestamp: new Date().toISOString(),
    });

    const report = new Report({
      userId,
      title: "Generating report...",
      content: "",
      type: params.type,
      status: "generating",
      metadata: {
        generatedAt: new Date(),
        dataRange: params.dataRange,
        prompt: params.customPrompt,
        model: "basic",
      },
    });

    await report.save();

    console.log(`[REPORT_ACTIONS] Report record created`, {
      userId,
      reportId: report._id,
      type: params.type,
      timestamp: new Date().toISOString(),
    });

    console.log(`[REPORT_ACTIONS] Triggering background report generation`, {
      userId,
      reportId: report._id,
      timestamp: new Date().toISOString(),
    });

    // Trigger report generation in background
    generateReportInBackground(report._id.toString(), userId, params);

    revalidatePath("/");
    revalidatePath("/reports");

    console.log(`[REPORT_ACTIONS] Cache revalidated`, {
      userId,
      reportId: report._id,
      timestamp: new Date().toISOString(),
    });

    const responseTime = Date.now() - startTime;
    console.log(`[REPORT_ACTIONS] Report creation completed successfully`, {
      userId,
      reportId: report._id,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      id: report._id.toString(),
      title: report.title,
      content: report.content,
      type: report.type,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      metadata: report.metadata,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[REPORT_ACTIONS] Error creating report`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to create report");
  }
}

export async function getReportsByUserId(
  limit: number = 10,
  offset: number = 0,
  type?: string
): Promise<{ reports: ReportResponse[]; total: number; hasMore: boolean }> {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[REPORT_ACTIONS] Starting get reports by user ID`, {
      limit,
      offset,
      type,
      timestamp: new Date().toISOString(),
    });

    const { userId: authUserId } = await auth();
    userId = authUserId;

    if (!userId) {
      console.warn(`[REPORT_ACTIONS] Unauthorized access attempt`, {
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized: User not authenticated");
    }

    console.log(`[REPORT_ACTIONS] User authenticated`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[REPORT_ACTIONS] Database connected`, {
      userId,
      timestamp: new Date().toISOString(),
    });

    const query: { userId: string; type?: string } = { userId };
    if (type) {
      query.type = type;
    }

    console.log(`[REPORT_ACTIONS] Querying reports`, {
      userId,
      query,
      limit,
      offset,
      timestamp: new Date().toISOString(),
    });

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Report.countDocuments(query);

    console.log(`[REPORT_ACTIONS] Reports queried successfully`, {
      userId,
      reportsCount: reports.length,
      total,
      hasMore: offset + limit < total,
      timestamp: new Date().toISOString(),
    });

    console.log(`[REPORT_ACTIONS] Formatting reports`, {
      userId,
      reportsCount: reports.length,
      timestamp: new Date().toISOString(),
    });

    const formattedReports: ReportResponse[] = reports.map((report) => ({
      id: String(report._id),
      title: report.title,
      content: report.content,
      type: report.type,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      insights: report.insights,
      metadata: report.metadata,
    }));

    const responseTime = Date.now() - startTime;
    console.log(
      `[REPORT_ACTIONS] Get reports by user ID completed successfully`,
      {
        userId,
        reportsCount: formattedReports.length,
        total,
        hasMore: offset + limit < total,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );

    return {
      reports: formattedReports,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[REPORT_ACTIONS] Error fetching reports by user ID`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to fetch reports");
  }
}

export async function getReportById(
  reportId: string
): Promise<ReportResponse | null> {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[REPORT_ACTIONS] Starting get report by ID`, {
      reportId,
      timestamp: new Date().toISOString(),
    });

    const { userId: authUserId } = await auth();
    userId = authUserId;

    if (!userId) {
      console.warn(`[REPORT_ACTIONS] Unauthorized access attempt`, {
        reportId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized: User not authenticated");
    }

    console.log(`[REPORT_ACTIONS] User authenticated`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[REPORT_ACTIONS] Database connected`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[REPORT_ACTIONS] Querying report by ID`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    const report = (await Report.findOne({
      _id: reportId,
      userId,
    }).lean()) as IReport | null;

    if (!report) {
      console.warn(`[REPORT_ACTIONS] Report not found`, {
        userId,
        reportId,
        timestamp: new Date().toISOString(),
      });
      return null;
    }

    console.log(`[REPORT_ACTIONS] Report found`, {
      userId,
      reportId,
      status: report.status,
      timestamp: new Date().toISOString(),
    });

    const responseTime = Date.now() - startTime;
    console.log(`[REPORT_ACTIONS] Get report by ID completed successfully`, {
      userId,
      reportId,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      id: String((report as unknown as IReport)._id),
      title: (report as unknown as IReport).title,
      content: (report as unknown as IReport).content,
      type: (report as unknown as IReport).type,
      status: (report as unknown as IReport).status,
      createdAt: (report as unknown as IReport).createdAt,
      updatedAt: (report as unknown as IReport).updatedAt,
      insights: (report as unknown as IReport).insights,
      metadata: (report as unknown as IReport).metadata,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[REPORT_ACTIONS] Error fetching report by ID`, {
      userId,
      reportId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to fetch report");
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[REPORT_ACTIONS] Starting delete report`, {
      reportId,
      timestamp: new Date().toISOString(),
    });

    const { userId: authUserId } = await auth();
    userId = authUserId;

    if (!userId) {
      console.warn(`[REPORT_ACTIONS] Unauthorized access attempt`, {
        reportId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized: User not authenticated");
    }

    console.log(`[REPORT_ACTIONS] User authenticated`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    console.log(`[REPORT_ACTIONS] Database connected`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[REPORT_ACTIONS] Deleting report`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    const report = await Report.findOneAndDelete({
      _id: reportId,
      userId,
    });

    if (!report) {
      console.warn(`[REPORT_ACTIONS] Report not found for deletion`, {
        userId,
        reportId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Report not found");
    }

    console.log(`[REPORT_ACTIONS] Report deleted successfully`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath("/");
    revalidatePath("/reports");

    console.log(`[REPORT_ACTIONS] Cache revalidated after deletion`, {
      userId,
      reportId,
      timestamp: new Date().toISOString(),
    });

    const responseTime = Date.now() - startTime;
    console.log(`[REPORT_ACTIONS] Delete report completed successfully`, {
      userId,
      reportId,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[REPORT_ACTIONS] Error deleting report`, {
      userId,
      reportId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to delete report");
  }
}

// Background function to generate report
async function generateReportInBackground(
  reportId: string,
  userId: string,
  params: CreateReportParams
) {
  const startTime = Date.now();

  try {
    console.log(`[REPORT_ACTIONS] Starting background report generation`, {
      reportId,
      userId,
      type: params.type,
      hasCustomPrompt: !!params.customPrompt,
      timestamp: new Date().toISOString(),
    });

    // Import here to avoid circular dependencies
    const { getDashboardData } = await import(
      "@/lib/services/dashboard.service"
    );

    console.log(`[REPORT_ACTIONS] Dashboard service imported`, {
      reportId,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Fetch financial data
    const dashboardData = await getDashboardData();

    console.log(
      `[REPORT_ACTIONS] Dashboard data fetched for background generation`,
      {
        reportId,
        userId,
        dataKeys: Object.keys(dashboardData),
        timestamp: new Date().toISOString(),
      }
    );

    // Generate basic report content
    const reportContent = generateBasicReport(
      dashboardData,
      params.type,
      params.customPrompt
    );

    console.log(`[REPORT_ACTIONS] Basic report content generated`, {
      reportId,
      userId,
      contentLength: reportContent.content.length,
      hasInsights: !!reportContent.insights,
      timestamp: new Date().toISOString(),
    });

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      title: reportContent.title,
      content: reportContent.content,
      status: "completed",
      insights: reportContent.insights,
      "metadata.tokensUsed": 0,
    });

    console.log(`[REPORT_ACTIONS] Report updated with generated content`, {
      reportId,
      userId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath("/");
    revalidatePath("/reports");

    const responseTime = Date.now() - startTime;
    console.log(
      `[REPORT_ACTIONS] Background report generation completed successfully`,
      {
        reportId,
        userId,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[REPORT_ACTIONS] Error in background report generation`, {
      reportId,
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    // Update report status to failed
    try {
      await Report.findByIdAndUpdate(reportId, {
        status: "failed",
        content: "Failed to generate report. Please try again.",
      });

      console.log(`[REPORT_ACTIONS] Report status updated to failed`, {
        reportId,
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error(
        `[REPORT_ACTIONS] Failed to update report status to failed`,
        {
          reportId,
          userId,
          updateError:
            updateError instanceof Error
              ? updateError.message
              : "Unknown error",
          timestamp: new Date().toISOString(),
        }
      );
    }

    revalidatePath("/");
    revalidatePath("/reports");
  }
}

// Generate basic report content without AI
function generateBasicReport(
  dashboardData: {
    metrics?: {
      netWorth?: number;
      totalIncome?: number;
      totalExpenses?: number;
    };
    assets?: Array<{
      name: string;
      currentValue?: number;
      type?: string;
      category?: string;
    }>;
    liabilities?: Array<{
      name: string;
      currentAmount?: number;
      type?: string;
    }>;
    recentTransactions?: Array<{
      time: string;
      type: string;
      amount: number;
      title: string;
    }>;
    financialGoals?: Array<{
      name: string;
      currentAmount?: number;
      targetAmount?: number;
    }>;
    upcomingBills?: Array<{
      name: string;
      amount?: number;
      dueDate: string;
    }>;
  },
  type: string,
  customPrompt?: string
) {
  const metrics = dashboardData.metrics || {};
  const assets = dashboardData.assets || [];
  const liabilities = dashboardData.liabilities || [];
  const recentTransactions = dashboardData.recentTransactions || [];
  const goals = dashboardData.financialGoals || [];
  const bills = dashboardData.upcomingBills || [];

  const netWorth = metrics.netWorth || 0;
  const totalIncome = metrics.totalIncome || 0;
  const totalExpenses = metrics.totalExpenses || 0;

  const title = `Financial Summary Report - ${new Date().toLocaleDateString()}`;

  let content = `# Financial Summary Report\n\n`;
  content += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;

  content += `## Overview\n`;
  content += `- **Net Worth:** $${netWorth.toLocaleString()}\n`;
  content += `- **Total Income:** $${totalIncome.toLocaleString()}\n`;
  content += `- **Total Expenses:** $${totalExpenses.toLocaleString()}\n`;
  content += `- **Savings Rate:** ${
    totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0
  }%\n\n`;

  if (assets.length > 0) {
    content += `## Assets (${assets.length})\n`;
    assets.forEach((asset) => {
      content += `- **${asset.name}:** $${
        asset.currentValue?.toLocaleString() || 0
      } (${asset.type || asset.category || "Unknown"})\n`;
    });
    content += `\n`;
  }

  if (liabilities.length > 0) {
    content += `## Liabilities (${liabilities.length})\n`;
    liabilities.forEach((liability) => {
      content += `- **${liability.name}:** $${
        liability.currentAmount?.toLocaleString() || 0
      } (${liability.type || "Unknown"})\n`;
    });
    content += `\n`;
  }

  if (goals.length > 0) {
    content += `## Financial Goals (${goals.length})\n`;
    goals.forEach((goal) => {
      const progress =
        goal.targetAmount && goal.targetAmount > 0
          ? (((goal.currentAmount || 0) / goal.targetAmount) * 100).toFixed(1)
          : 0;
      content += `- **${goal.name}:** $${
        goal.currentAmount?.toLocaleString() || 0
      } / $${goal.targetAmount?.toLocaleString() || 0} (${progress}%)\n`;
    });
    content += `\n`;
  }

  if (recentTransactions.length > 0) {
    content += `## Recent Transactions (Last ${Math.min(
      5,
      recentTransactions.length
    )})\n`;
    recentTransactions.slice(0, 5).forEach((transaction) => {
      content += `- ${transaction.time}: ${transaction.type} $${transaction.amount} - ${transaction.title}\n`;
    });
    content += `\n`;
  }

  if (bills.length > 0) {
    content += `## Upcoming Bills (${bills.length})\n`;
    bills.forEach((bill) => {
      content += `- **${bill.name}:** $${
        bill.amount?.toLocaleString() || 0
      } due ${bill.dueDate}\n`;
    });
    content += `\n`;
  }

  if (customPrompt) {
    content += `## Custom Analysis\n`;
    content += `*Note: Custom prompt analysis is not available in basic mode.*\n\n`;
  }

  const insights = {
    keyFindings: [
      `Net worth of $${netWorth.toLocaleString()}`,
      `Monthly income of $${totalIncome.toLocaleString()}`,
      `Monthly expenses of $${totalExpenses.toLocaleString()}`,
      `${assets.length} assets and ${liabilities.length} liabilities tracked`,
    ],
    recommendations: [
      "Review your spending patterns regularly",
      "Consider increasing your savings rate",
      "Monitor your financial goals progress",
      "Keep track of upcoming bills and payments",
    ],
    riskFactors: [
      "High debt-to-income ratio",
      "Low emergency fund",
      "Inconsistent savings habits",
    ],
  };

  return {
    title,
    content,
    insights,
  };
}
