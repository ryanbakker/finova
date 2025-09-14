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
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

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

    // Trigger report generation in background
    generateReportInBackground(report._id.toString(), userId, params);

    revalidatePath("/");
    revalidatePath("/reports");

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
    console.error("Error creating report:", error);
    throw new Error("Failed to create report");
  }
}

export async function getReportsByUserId(
  limit: number = 10,
  offset: number = 0,
  type?: string
): Promise<{ reports: ReportResponse[]; total: number; hasMore: boolean }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const query: { userId: string; type?: string } = { userId };
    if (type) {
      query.type = type;
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await Report.countDocuments(query);

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

    return {
      reports: formattedReports,
      total,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
}

export async function getReportById(
  reportId: string
): Promise<ReportResponse | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const report = await Report.findOne({
      _id: reportId,
      userId,
    }).lean();

    if (!report) {
      return null;
    }

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
    console.error("Error fetching report:", error);
    throw new Error("Failed to fetch report");
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: User not authenticated");
    }

    await connectToDB();

    const report = await Report.findOneAndDelete({
      _id: reportId,
      userId,
    });

    if (!report) {
      throw new Error("Report not found");
    }

    revalidatePath("/");
    revalidatePath("/reports");
  } catch (error) {
    console.error("Error deleting report:", error);
    throw new Error("Failed to delete report");
  }
}

// Background function to generate report
async function generateReportInBackground(
  reportId: string,
  userId: string,
  params: CreateReportParams
) {
  try {
    // Import here to avoid circular dependencies
    const { getDashboardData } = await import(
      "@/lib/services/dashboard.service"
    );

    // Fetch financial data
    const dashboardData = await getDashboardData();

    // Generate basic report content
    const reportContent = generateBasicReport(
      dashboardData,
      params.type,
      params.customPrompt
    );

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      title: reportContent.title,
      content: reportContent.content,
      status: "completed",
      insights: reportContent.insights,
      "metadata.tokensUsed": 0,
    });

    revalidatePath("/");
    revalidatePath("/reports");

    console.log(`Report ${reportId} generated successfully`);
  } catch (error) {
    console.error(`Error generating report ${reportId}:`, error);

    // Update report status to failed
    await Report.findByIdAndUpdate(reportId, {
      status: "failed",
      content: "Failed to generate report. Please try again.",
    });

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
