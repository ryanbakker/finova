"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Report } from "@/database/models/report.model";
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
        model: "gemini-1.5-flash",
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

    const query: any = { userId };
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
      id: report._id.toString(),
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
      id: report._id.toString(),
      title: report.title,
      content: report.content,
      type: report.type,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      insights: report.insights,
      metadata: report.metadata,
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
    const { geminiService, FinancialData } = await import(
      "@/lib/services/gemini.service"
    );
    const { getDashboardData } = await import(
      "@/lib/services/dashboard.service"
    );

    // Fetch financial data
    const dashboardData = await getDashboardData();

    const financialData: FinancialData = {
      transactions: dashboardData.recentTransactions || [],
      assets: dashboardData.assets || [],
      liabilities: dashboardData.liabilities || [],
      budgets: dashboardData.budgetProgress || [],
      goals: dashboardData.financialGoals || [],
      bills: dashboardData.upcomingBills || [],
      netWorth: dashboardData.metrics?.netWorth || 0,
      totalIncome: dashboardData.metrics?.totalIncome || 0,
      totalExpenses: dashboardData.metrics?.totalExpenses || 0,
      monthlyData: dashboardData.monthlyIncomeSpending || [],
    };

    // Generate report using Gemini
    const result = await geminiService.generateFinancialReport(financialData, {
      type: params.type,
      customPrompt: params.customPrompt,
      dataRange: params.dataRange,
    });

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      title: result.title,
      content: result.content,
      status: "completed",
      insights: result.insights,
      "metadata.tokensUsed": result.tokensUsed,
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
