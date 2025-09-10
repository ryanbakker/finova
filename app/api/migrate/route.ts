import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  migrateToEventLedger,
  rollbackMigration,
  regenerateMonthlySummaries,
} from "@/lib/migrations/migrate-to-event-ledger";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "migrate") {
      const result = await migrateToEventLedger();
      return NextResponse.json(result);
    } else if (action === "rollback") {
      const result = await rollbackMigration();
      return NextResponse.json(result);
    } else if (action === "regenerate") {
      const result = await regenerateMonthlySummaries();
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'migrate', 'rollback', or 'regenerate'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error running migration:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
