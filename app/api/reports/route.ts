import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Report } from "@/database/models/report.model";
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
        model: "basic",
      },
    });

    await report.save();

    // Generate report in background
    generateReportAsync(report._id.toString(), userId, type, customPrompt);

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
  customPrompt?: string
) {
  try {
    // Fetch financial data
    const dashboardData = await getDashboardData();

    // Generate basic report content
    const reportContent = generateBasicReport(
      dashboardData,
      type,
      customPrompt
    );

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      title: reportContent.title,
      content: reportContent.content,
      status: "completed",
      insights: reportContent.insights,
      "metadata.tokensUsed": 0,
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
