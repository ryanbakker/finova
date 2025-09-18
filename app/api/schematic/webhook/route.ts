import { NextRequest, NextResponse } from "next/server";
import { updateUserSubscription } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the webhook for debugging
    console.log("[SCHEMATIC_WEBHOOK] Received webhook:", {
      type: body.type,
      timestamp: new Date().toISOString(),
    });

    // Handle different Schematic webhook events
    switch (body.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.cancelled":
      case "subscription.renewed":
        await handleSubscriptionChange(body);
        break;

      case "customer.created":
      case "customer.updated":
        await handleCustomerChange(body);
        break;

      default:
        console.log(`[SCHEMATIC_WEBHOOK] Unhandled event type: ${body.type}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("[SCHEMATIC_WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(webhookData: unknown) {
  try {
    const data = webhookData as {
      data?: {
        customer?: { id: string };
        plan?: { name: string };
        status?: string;
        current_period_end?: number;
        cancel_at_period_end?: boolean;
      };
    };

    if (!data?.data?.customer?.id) {
      console.error(
        "[SCHEMATIC_WEBHOOK] No customer ID found in subscription data"
      );
      return;
    }

    // Extract subscription information
    const subscription = {
      plan: mapSchematicPlanToInternal(data.data?.plan?.name || "free"),
      status: mapSchematicStatusToInternal(data.data?.status || "active"),
      currentPeriodEnd: data.data?.current_period_end
        ? new Date(data.data.current_period_end * 1000)
        : undefined,
      cancelAtPeriodEnd: data.data?.cancel_at_period_end || false,
    };

    // Find user by customer ID (assuming customer ID is the Clerk user ID)
    const clerkId = data.data?.customer?.id;

    console.log(
      `[SCHEMATIC_WEBHOOK] Updating subscription for user ${clerkId}:`,
      subscription
    );

    // Update user subscription in database
    const updatedUser = await updateUserSubscription(clerkId, subscription);

    if (updatedUser) {
      // Update Clerk user metadata with new subscription info
      try {
        const client = await clerkClient();
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

        console.log(
          `[SCHEMATIC_WEBHOOK] Updated Clerk metadata for user ${clerkId}`
        );
      } catch (metadataError) {
        console.error(
          `[SCHEMATIC_WEBHOOK] Failed to update Clerk metadata:`,
          metadataError
        );
      }

      console.log(
        `[SCHEMATIC_WEBHOOK] Successfully updated subscription for user ${clerkId}`
      );
    } else {
      console.error(
        `[SCHEMATIC_WEBHOOK] Failed to update subscription for user ${clerkId}`
      );
    }
  } catch (error) {
    console.error(
      "[SCHEMATIC_WEBHOOK] Error handling subscription change:",
      error
    );
    throw error;
  }
}

async function handleCustomerChange(webhookData: unknown) {
  try {
    const data = webhookData as { data?: { id: string } };

    if (!data?.data?.id) {
      console.error(
        "[SCHEMATIC_WEBHOOK] No customer ID found in customer data"
      );
      return;
    }

    // If customer is created/updated, we might want to sync their subscription
    // This is optional and depends on your Schematic setup
    console.log(
      `[SCHEMATIC_WEBHOOK] Customer ${data.data?.id} ${
        (webhookData as { type?: string })?.type
      }`
    );
  } catch (error) {
    console.error("[SCHEMATIC_WEBHOOK] Error handling customer change:", error);
    throw error;
  }
}

function mapSchematicPlanToInternal(
  schematicPlan: string
): "free" | "premium" | "pro" {
  const planMap: Record<string, "free" | "premium" | "pro"> = {
    free: "free",
    basic: "free",
    premium: "premium",
    pro: "pro",
    professional: "pro",
    enterprise: "pro",
  };

  return planMap[schematicPlan.toLowerCase()] || "free";
}

function mapSchematicStatusToInternal(
  schematicStatus: string
): "active" | "inactive" | "cancelled" | "past_due" {
  const statusMap: Record<
    string,
    "active" | "inactive" | "cancelled" | "past_due"
  > = {
    active: "active",
    trialing: "active",
    past_due: "past_due",
    cancelled: "cancelled",
    canceled: "cancelled",
    incomplete: "inactive",
    incomplete_expired: "inactive",
    unpaid: "inactive",
  };

  return statusMap[schematicStatus.toLowerCase()] || "active";
}
