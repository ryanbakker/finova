import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";
import { Report } from "@/database/models/report.model";

// GET /api/reports/[id] - Get a specific report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[API] GET /api/reports/[id] - Request started`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
    });

    const authResult = await auth();
    userId = authResult.userId;

    if (!userId) {
      console.warn(
        `[API] GET /api/reports/[id] - Unauthorized access attempt`,
        {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get("user-agent"),
          ip:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip"),
        }
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      console.warn(`[API] GET /api/reports/[id] - Missing report ID`, {
        userId,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    console.log(`[API] GET /api/reports/[id] - User authenticated`, {
      userId,
      reportId: id,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    const report = await Report.findOne({
      _id: id,
      userId,
    }).lean();

    if (!report) {
      console.warn(`[API] GET /api/reports/[id] - Report not found`, {
        userId,
        reportId: id,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const responseTime = Date.now() - startTime;
    console.log(`[API] GET /api/reports/[id] - Report fetched successfully`, {
      userId,
      reportId: id,
      status: report.status,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      report: {
        id: report._id,
        title: report.title,
        content: report.content,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        insights: report.insights,
        metadata: report.metadata,
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[API] GET /api/reports/[id] - Error occurred`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[id] - Delete a specific report by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    console.log(`[API] DELETE /api/reports/[id] - Request started`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
    });

    const authResult = await auth();
    userId = authResult.userId;

    if (!userId) {
      console.warn(
        `[API] DELETE /api/reports/[id] - Unauthorized access attempt`,
        {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get("user-agent"),
          ip:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip"),
        }
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      console.warn(`[API] DELETE /api/reports/[id] - Missing report ID`, {
        userId,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    console.log(`[API] DELETE /api/reports/[id] - User authenticated`, {
      userId,
      reportId: id,
      timestamp: new Date().toISOString(),
    });

    await connectToDB();

    const report = await Report.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!report) {
      console.warn(`[API] DELETE /api/reports/[id] - Report not found`, {
        userId,
        reportId: id,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const responseTime = Date.now() - startTime;
    console.log(
      `[API] DELETE /api/reports/[id] - Report deleted successfully`,
      {
        userId,
        reportId: id,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[API] DELETE /api/reports/[id] - Error occurred`, {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
