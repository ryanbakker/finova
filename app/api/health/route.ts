import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/database/db";

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();

    // Check database connection
    await connectToDB();

    // Check environment variables
    const envCheck = {
      MONGODB_URL: !!process.env.MONGODB_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    };

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      authentication: userId ? "authenticated" : "not authenticated",
      database: "connected",
      environmentVariables: envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        error: error instanceof Error ? error.message : "Unknown error",
        environmentVariables: {
          MONGODB_URL: !!process.env.MONGODB_URL,
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
        },
      },
      { status: 500 }
    );
  }
}
