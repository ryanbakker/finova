import { NextRequest, NextResponse } from "next/server";
import {
  updateUserSubscription,
  getUserById,
} from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      clerkId,
      plan,
      status = "active",
      currentPeriodEnd,
      cancelAtPeriodEnd = false,
    } = body;

    if (!clerkId || !plan) {
      return NextResponse.json(
        { error: "clerkId and plan are required" },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ["free", "premium", "pro"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Invalid plan. Must be one of: ${validPlans.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["active", "inactive", "cancelled", "past_due"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserById(clerkId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare subscription data
    const subscription = {
      plan: plan as "free" | "premium" | "pro",
      status: status as "active" | "inactive" | "cancelled" | "past_due",
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd)
        : undefined,
      cancelAtPeriodEnd,
    };

    console.log(
      `[UPDATE_PLAN] Updating plan for user ${clerkId}:`,
      subscription
    );

    // Update user subscription in database
    const updatedUser = await updateUserSubscription(clerkId, subscription);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user subscription" },
        { status: 500 }
      );
    }

    // Update Clerk user metadata (only if user exists in Clerk)
    try {
      const client = await clerkClient();

      // First check if user exists in Clerk
      try {
        await client.users.getUser(clerkId);

        // User exists, update metadata
        await client.users.updateUserMetadata(clerkId, {
          publicMetadata: {
            plan: subscription.plan,
            subscription: {
              plan: subscription.plan,
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            },
          },
        });

        console.log(`[UPDATE_PLAN] Updated Clerk metadata for user ${clerkId}`);
      } catch (clerkError: unknown) {
        if ((clerkError as { status?: number })?.status === 404) {
          console.log(
            `[UPDATE_PLAN] User ${clerkId} not found in Clerk, skipping metadata update`
          );
        } else {
          throw clerkError;
        }
      }
    } catch (metadataError) {
      console.error(
        `[UPDATE_PLAN] Failed to update Clerk metadata:`,
        metadataError
      );
      // Don't fail the request if metadata update fails
    }

    // Trigger plan refresh event for frontend
    try {
      // This will be handled by the frontend to refresh plan status
      console.log(
        `[UPDATE_PLAN] Plan updated successfully for user ${clerkId}`
      );
    } catch (eventError) {
      console.warn(
        "[UPDATE_PLAN] Failed to trigger plan refresh event:",
        eventError
      );
    }

    return NextResponse.json({
      message: "Plan updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[UPDATE_PLAN] Error updating plan:", error);
    return NextResponse.json(
      {
        error: "Failed to update plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
