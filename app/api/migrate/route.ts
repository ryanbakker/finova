import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(_request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Migration functionality has been removed" },
      { status: 410 }
    );
  } catch (_error) {
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
