import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Report } from "@/database/models/report.model";
import { geminiService, FinancialData } from "@/lib/services/gemini.service";
import { getDashboardData } from "@/lib/services/dashboard.service";

// GET /api/reports - Get all reports for the user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

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

    return NextResponse.json({
      reports,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST /api/reports - Generate a new report
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, customPrompt, dataRange } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Report type is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Create initial report record
    const report = new Report({
      userId,
      title: "Generating report...",
      content: "",
      type,
      status: "generating",
      metadata: {
        generatedAt: new Date(),
        dataRange,
        prompt: customPrompt,
        model: "gemini-1.5-flash",
      },
    });

    await report.save();

    // Generate report in background
    generateReportAsync(
      report._id.toString(),
      userId,
      type,
      customPrompt,
      dataRange
    );

    return NextResponse.json({
      report: {
        id: report._id,
        title: report.title,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

// Background function to generate report
async function generateReportAsync(
  reportId: string,
  userId: string,
  type: string,
  customPrompt?: string,
  dataRange?: { startDate: string; endDate: string }
) {
  try {
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
      type: type as any,
      customPrompt,
      dataRange: dataRange
        ? {
            startDate: new Date(dataRange.startDate),
            endDate: new Date(dataRange.endDate),
          }
        : undefined,
    });

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      title: result.title,
      content: result.content,
      status: "completed",
      insights: result.insights,
      "metadata.tokensUsed": result.tokensUsed,
    });

    console.log(`Report ${reportId} generated successfully`);
  } catch (error) {
    console.error(`Error generating report ${reportId}:`, error);

    // Update report status to failed
    await Report.findByIdAndUpdate(reportId, {
      status: "failed",
      content: "Failed to generate report. Please try again.",
    });
  }
}
