import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { updateUserSubscription } from "@/lib/actions/user.actions";
import { updateCompanySubscription } from "@/lib/actions/company.actions";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, status = "active" } = body;

    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 });
    }

    // Validate plan
    const validPlans = ["free", "premium", "pro"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be one of: free, premium, pro" },
        { status: 400 }
      );
    }

    // Create subscription object
    const subscription = {
      plan: plan as "free" | "premium" | "pro",
      status: status as "active" | "inactive" | "cancelled" | "past_due",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
    };

    console.log(
      `[MANUAL_PLAN_UPDATE] Updating plan for user ${user.id}:`,
      subscription
    );

    // Update company subscription first (company ID = user ID in this setup)
    const updatedCompany = await updateCompanySubscription(
      user.id,
      subscription
    );

    if (updatedCompany) {
      // Update user subscription in database to match company
      const updatedUser = await updateUserSubscription(user.id, subscription);

      if (updatedUser) {
        // Update Clerk user metadata with new subscription info
        try {
          const client = await clerkClient();
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              plan: subscription.plan,
              subscription: {
                plan: subscription.plan,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
                cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
              },
            },
          });

          console.log(
            `[MANUAL_PLAN_UPDATE] Updated Clerk metadata for user ${user.id}`
          );
        } catch (metadataError) {
          console.error(
            `[MANUAL_PLAN_UPDATE] Failed to update Clerk metadata:`,
            metadataError
          );
        }

        return NextResponse.json({
          message: "Plan updated successfully",
          user: updatedUser,
          company: updatedCompany,
        });
      } else {
        return NextResponse.json(
          { error: "Failed to update user subscription" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Failed to update company subscription" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[MANUAL_PLAN_UPDATE] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
