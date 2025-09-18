import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

import {
  createUser,
  deleteUser,
  updateUser,
  updateUserSubscription,
  getUsersByCompanyId,
  updateUsersByCompanyId,
} from "@/lib/actions/user.actions";
import { updateCompanySubscription } from "@/lib/actions/company.actions";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  const headerPayload = await headers();

  // Check if this is a Schematic webhook (different signature verification)
  const schematicSignature = headerPayload.get("schematic-signature");
  if (schematicSignature) {
    return handleSchematicWebhook(req);
  }

  if (!SIGNING_SECRET) {
    return NextResponse.json(
      {
        error:
          "Missing SIGNING_SECRET. Add it from the Clerk Dashboard to your .env.local as SIGNING_SECRET.",
      },
      { status: 500 }
    );
  }

  try {
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers (synchronously)
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing Svix headers", {
        status: 400,
      });
    }

    // Get raw body - required for Svix signature verification
    const body = await req.text();

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (_err) {
      return new Response("Error: Verification error", {
        status: 400,
      });
    }

    // const { id } = evt.data;
    const eventType = evt.type;

    if (evt.type === "user.created") {
      const userInfo = evt.data;

      // Check if user has email addresses
      if (!userInfo.email_addresses || userInfo.email_addresses.length === 0) {
        return NextResponse.json(
          {
            error: "User has no email addresses",
          },
          { status: 400 }
        );
      }

      // Extract subscription information from Clerk metadata
      const publicMetadata = userInfo.public_metadata as {
        plan?: string;
        subscription?: {
          plan?: string;
          status?: string;
          currentPeriodEnd?: string;
          cancelAtPeriodEnd?: boolean;
        };
      };
      const subscription = {
        plan: (publicMetadata?.plan ||
          publicMetadata?.subscription?.plan ||
          "free") as "free" | "premium" | "pro",
        status: (publicMetadata?.subscription?.status || "active") as
          | "active"
          | "inactive"
          | "cancelled"
          | "past_due",
        currentPeriodEnd: publicMetadata?.subscription?.currentPeriodEnd
          ? new Date(publicMetadata.subscription.currentPeriodEnd)
          : undefined,
        cancelAtPeriodEnd:
          publicMetadata?.subscription?.cancelAtPeriodEnd || false,
      };

      const user = {
        clerkId: userInfo.id,
        email: userInfo.email_addresses[0].email_address,
        username: userInfo.username || `user_${userInfo.id.slice(-8)}`, // Fallback username
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        photo: userInfo.image_url || "",
        companyId: userInfo.id, // Use user ID as company ID for single-user companies
        subscription,
      };

      try {
        const newUser = await createUser(user);

        if (newUser) {
          // Update Clerk user metadata with MongoDB user ID
          try {
            const client = await clerkClient();
            await client.users.updateUserMetadata(userInfo.id, {
              publicMetadata: {
                userId: newUser._id,
              },
            });
          } catch (_metadataError) {
            // Failed to update Clerk metadata
          }
        }

        return NextResponse.json({ message: "OK", user: newUser });
      } catch (createError) {
        return NextResponse.json(
          {
            error: "Failed to create user",
            details:
              createError instanceof Error
                ? createError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    if (evt.type === "user.updated") {
      const {
        id,
        image_url,
        first_name,
        last_name,
        username,
        public_metadata,
      } = evt.data;

      // Extract subscription information from Clerk metadata
      const metadata = public_metadata as
        | {
            plan?: string;
            subscription?: {
              plan?: string;
              status?: string;
              currentPeriodEnd?: string;
              cancelAtPeriodEnd?: boolean;
            };
          }
        | undefined;
      const subscription = metadata
        ? {
            plan: (metadata?.plan || metadata?.subscription?.plan || "free") as
              | "free"
              | "premium"
              | "pro",
            status: (metadata?.subscription?.status || "active") as
              | "active"
              | "inactive"
              | "cancelled"
              | "past_due",
            currentPeriodEnd: metadata?.subscription?.currentPeriodEnd
              ? new Date(metadata.subscription.currentPeriodEnd)
              : undefined,
            cancelAtPeriodEnd:
              metadata?.subscription?.cancelAtPeriodEnd || false,
          }
        : undefined;

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || `user_${id.slice(-8)}`,
        photo: image_url || "",
        ...(subscription && { subscription }),
      };

      try {
        const updatedUser = await updateUser(id, user);
        return NextResponse.json({ message: "OK", user: updatedUser });
      } catch (updateError) {
        return NextResponse.json(
          {
            error: "Failed to update user",
            details:
              updateError instanceof Error
                ? updateError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      try {
        const deletedUser = await deleteUser(id!);
        return NextResponse.json({ message: "OK", user: deletedUser });
      } catch (deleteError) {
        return NextResponse.json(
          {
            error: "Failed to delete user",
            details:
              deleteError instanceof Error
                ? deleteError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleSchematicWebhook(req: Request) {
  try {
    const body = await req.text();
    const webhookData = JSON.parse(body);

    console.log("[SCHEMATIC_WEBHOOK] Received webhook:", {
      type: webhookData.type,
      timestamp: new Date().toISOString(),
      fullPayload: webhookData, // Add full payload for debugging
    });

    // Handle different Schematic webhook events
    switch (webhookData.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.cancelled":
      case "subscription.renewed":
        await handleSchematicSubscriptionChange(webhookData);
        break;

      case "customer.created":
      case "customer.updated":
        await handleSchematicCustomerChange(webhookData);
        break;

      default:
        console.log(
          `[SCHEMATIC_WEBHOOK] Unhandled event type: ${webhookData.type}`
        );
    }

    return NextResponse.json({
      message: "Schematic webhook processed successfully",
    });
  } catch (error) {
    console.error("[SCHEMATIC_WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      {
        error: "Failed to process Schematic webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleSchematicSubscriptionChange(webhookData: unknown) {
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
        "[SCHEMATIC_WEBHOOK] No customer ID found in subscription data",
        { receivedData: data }
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

    // In Schematic, the customer ID is the company ID
    const companyId = data.data?.customer?.id;

    console.log(
      `[SCHEMATIC_WEBHOOK] Updating company subscription for company ${companyId}:`,
      subscription
    );
    console.log(
      `[SCHEMATIC_WEBHOOK] Full webhook data:`,
      JSON.stringify(webhookData, null, 2)
    );

    // Update company subscription in database
    const updatedCompany = await updateCompanySubscription(
      companyId,
      subscription
    );

    if (updatedCompany) {
      console.log(
        `[SCHEMATIC_WEBHOOK] Company subscription updated successfully for company ${companyId}`
      );

      // Update all users in this company with the new subscription
      try {
        // First, try to find users by companyId
        const companyUsers = await getUsersByCompanyId(companyId);

        if (companyUsers && companyUsers.length > 0) {
          console.log(
            `[SCHEMATIC_WEBHOOK] Found ${companyUsers.length} users for company ${companyId}`
          );

          // Update all users in the company
          const updateResult = await updateUsersByCompanyId(
            companyId,
            subscription
          );

          console.log(
            `[SCHEMATIC_WEBHOOK] Updated ${
              updateResult?.modifiedCount || 0
            } users for company ${companyId}`
          );

          // Update Clerk metadata for each user
          const client = await clerkClient();
          for (const user of companyUsers) {
            try {
              await client.users.updateUserMetadata(user.clerkId, {
                publicMetadata: {
                  plan: subscription.plan,
                  subscription: {
                    plan: subscription.plan,
                    status: subscription.status,
                    currentPeriodEnd:
                      subscription.currentPeriodEnd?.toISOString(),
                    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                  },
                },
              });

              console.log(
                `[SCHEMATIC_WEBHOOK] Updated Clerk metadata for user ${user.clerkId}`
              );
            } catch (clerkError: unknown) {
              if ((clerkError as { status?: number })?.status === 404) {
                console.log(
                  `[SCHEMATIC_WEBHOOK] User ${user.clerkId} not found in Clerk, skipping metadata update`
                );
              } else {
                console.error(
                  `[SCHEMATIC_WEBHOOK] Error updating Clerk metadata for user ${user.clerkId}:`,
                  clerkError
                );
              }
            }
          }
        } else {
          // Fallback: Try the company ID as a direct user ID (legacy behavior)
          console.log(
            `[SCHEMATIC_WEBHOOK] No users found with companyId ${companyId}, trying as direct user ID`
          );

          const clerkId = companyId;
          const updatedUser = await updateUserSubscription(
            clerkId,
            subscription
          );

          if (updatedUser) {
            console.log(
              `[SCHEMATIC_WEBHOOK] Successfully updated user subscription in database for user ${clerkId}`
            );

            // Update Clerk user metadata with new subscription info
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
                      currentPeriodEnd:
                        subscription.currentPeriodEnd?.toISOString(),
                      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                    },
                  },
                });

                console.log(
                  `[SCHEMATIC_WEBHOOK] Updated Clerk metadata for user ${clerkId}`
                );
              } catch (clerkError: unknown) {
                if ((clerkError as { status?: number })?.status === 404) {
                  console.log(
                    `[SCHEMATIC_WEBHOOK] User ${clerkId} not found in Clerk, skipping metadata update`
                  );
                } else {
                  console.error(
                    `[SCHEMATIC_WEBHOOK] Error checking user in Clerk:`,
                    clerkError
                  );
                }
              }
            } catch (metadataError) {
              console.error(
                `[SCHEMATIC_WEBHOOK] Failed to update Clerk metadata:`,
                metadataError
              );
            }
          } else {
            console.error(
              `[SCHEMATIC_WEBHOOK] Failed to update user subscription in database for user ${clerkId}. User may not exist.`
            );

            console.warn(
              `[SCHEMATIC_WEBHOOK] Company subscription updated but no users found to update. This may indicate a user-company relationship issue.`
            );
          }
        }

        console.log(
          `[SCHEMATIC_WEBHOOK] Successfully processed subscription change for company ${companyId}`
        );
      } catch (userUpdateError) {
        console.error(
          `[SCHEMATIC_WEBHOOK] Failed to update user subscription:`,
          userUpdateError
        );
        // Don't throw here - company was updated successfully
      }
    } else {
      console.error(
        `[SCHEMATIC_WEBHOOK] Failed to update company subscription for company ${companyId}`
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

async function handleSchematicCustomerChange(webhookData: unknown) {
  try {
    const data = webhookData as { data?: { id: string } };

    if (!data?.data?.id) {
      console.error(
        "[SCHEMATIC_WEBHOOK] No customer ID found in customer data"
      );
      return;
    }

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
