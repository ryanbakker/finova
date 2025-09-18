import { updateUserSubscription } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs/server";

export interface PlanUpdateData {
  plan: "free" | "premium" | "pro";
  status: "active" | "inactive" | "cancelled" | "past_due";
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export class PlanUpdateService {
  /**
   * Update user's plan and sync with Clerk metadata
   */
  static async updateUserPlan(
    clerkId: string,
    planData: PlanUpdateData
  ): Promise<{ success: boolean; user?: unknown; error?: string }> {
    try {
      console.log(
        `[PLAN_UPDATE_SERVICE] Updating plan for user ${clerkId}:`,
        planData
      );

      // Update user subscription in database
      const updatedUser = await updateUserSubscription(clerkId, planData);

      if (!updatedUser) {
        return {
          success: false,
          error: "Failed to update user subscription in database",
        };
      }

      // Update Clerk user metadata
      try {
        const client = await clerkClient();

        // Check if user exists in Clerk
        try {
          await client.users.getUser(clerkId);

          // User exists, update metadata
          await client.users.updateUserMetadata(clerkId, {
            publicMetadata: {
              plan: planData.plan,
              subscription: {
                plan: planData.plan,
                status: planData.status,
                currentPeriodEnd: planData.currentPeriodEnd?.toISOString(),
                cancelAtPeriodEnd: planData.cancelAtPeriodEnd,
              },
            },
          });

          console.log(
            `[PLAN_UPDATE_SERVICE] Updated Clerk metadata for user ${clerkId}`
          );
        } catch (clerkError: unknown) {
          if ((clerkError as { status?: number })?.status === 404) {
            console.log(
              `[PLAN_UPDATE_SERVICE] User ${clerkId} not found in Clerk, skipping metadata update`
            );
          } else {
            throw clerkError;
          }
        }
      } catch (metadataError) {
        console.error(
          `[PLAN_UPDATE_SERVICE] Failed to update Clerk metadata:`,
          metadataError
        );
        // Don't fail the entire operation if metadata update fails
      }

      console.log(
        `[PLAN_UPDATE_SERVICE] Successfully updated plan for user ${clerkId}`
      );

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error(
        `[PLAN_UPDATE_SERVICE] Error updating plan for user ${clerkId}:`,
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Map Schematic plan name to internal plan
   */
  static mapSchematicPlan(planName: string): "free" | "premium" | "pro" {
    const planMap: Record<string, "free" | "premium" | "pro"> = {
      free: "free",
      basic: "free",
      premium: "premium",
      pro: "pro",
      professional: "pro",
      enterprise: "pro",
    };

    return planMap[planName.toLowerCase()] || "free";
  }

  /**
   * Map Schematic status to internal status
   */
  static mapSchematicStatus(
    status: string
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

    return statusMap[status.toLowerCase()] || "active";
  }

  /**
   * Process Schematic webhook data and update user plan
   */
  static async processSchematicWebhook(
    webhookData: unknown
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const data = (
        webhookData as {
          data?: {
            customer?: { id: string };
            plan?: { name: string };
            status?: string;
            current_period_end?: number;
            cancel_at_period_end?: boolean;
          };
        }
      )?.data;

      if (!data?.customer?.id) {
        return {
          success: false,
          error: "No customer ID found in webhook data",
        };
      }

      const clerkId = data.customer.id;

      const planData: PlanUpdateData = {
        plan: this.mapSchematicPlan(data.plan?.name || "free"),
        status: this.mapSchematicStatus(data.status || "active"),
        currentPeriodEnd: data.current_period_end
          ? new Date(data.current_period_end * 1000)
          : undefined,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
      };

      const result = await this.updateUserPlan(clerkId, planData);

      if (result.success) {
        console.log(
          `[PLAN_UPDATE_SERVICE] Successfully processed Schematic webhook for user ${clerkId}`
        );
      } else {
        console.error(
          `[PLAN_UPDATE_SERVICE] Failed to process Schematic webhook for user ${clerkId}:`,
          result.error
        );
      }

      return result;
    } catch (error) {
      console.error(
        "[PLAN_UPDATE_SERVICE] Error processing Schematic webhook:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
