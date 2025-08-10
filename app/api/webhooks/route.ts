import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  console.log("=== WEBHOOK ROUTE CALLED ===");
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("Missing SIGNING_SECRET environment variable");
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  console.log("SIGNING_SECRET exists:", !!SIGNING_SECRET);

  try {
    const wh = new Webhook(SIGNING_SECRET);
    console.log("Webhook instance created");

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    console.log("Headers received:", {
      svix_id: !!svix_id,
      svix_timestamp: !!svix_timestamp,
      svix_signature: !!svix_signature,
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing Svix headers:", {
        svix_id,
        svix_timestamp,
        svix_signature,
      });
      return new Response("Error: Missing Svix headers", {
        status: 400,
      });
    }

    // Get body - read it once and store it
    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("Webhook payload received:", payload);
    console.log("Event type:", payload.type);
    console.log("User ID:", payload.data?.id);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error: Could not verify webhook:", err);
      return new Response("Error: Verification error", {
        status: 400,
      });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Processing webhook: ${eventType} for user ${id}`);

    if (evt.type === "user.created") {
      console.log("Processing user.created event");
      console.log("User data:", evt.data);

      const userInfo = evt.data;

      // Check if user has email addresses
      if (!userInfo.email_addresses || userInfo.email_addresses.length === 0) {
        console.error("User has no email addresses:", userInfo);
        return NextResponse.json(
          {
            error: "User has no email addresses",
          },
          { status: 400 }
        );
      }

      const user = {
        clerkId: userInfo.id,
        email: userInfo.email_addresses[0].email_address,
        username: userInfo.username || `user_${userInfo.id.slice(-8)}`, // Fallback username
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        photo: userInfo.image_url || "",
      };

      console.log("Creating user with data:", user);

      try {
        const newUser = await createUser(user);
        console.log("User created successfully:", newUser);

        if (newUser) {
          // Update Clerk user metadata with MongoDB user ID
          try {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(userInfo.id, {
              publicMetadata: {
                userId: newUser._id,
              },
            });
            console.log(
              "Updated Clerk user metadata with MongoDB ID:",
              newUser._id
            );
          } catch (metadataError) {
            console.error("Failed to update Clerk metadata:", metadataError);
          }
        }

        return NextResponse.json({ message: "OK", user: newUser });
      } catch (createError) {
        console.error("Failed to create user:", createError);
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
      console.log("Processing user.updated event");
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || `user_${id.slice(-8)}`,
        photo: image_url || "",
      };

      try {
        const updatedUser = await updateUser(id, user);
        console.log("User updated successfully:", updatedUser);
        return NextResponse.json({ message: "OK", user: updatedUser });
      } catch (updateError) {
        console.error("Failed to update user:", updateError);
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
      console.log("Processing user.deleted event");
      const { id } = evt.data;

      try {
        const deletedUser = await deleteUser(id!);
        console.log("User deleted successfully:", deletedUser);
        return NextResponse.json({ message: "OK", user: deletedUser });
      } catch (deleteError) {
        console.error("Failed to delete user:", deleteError);
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

    console.log(`Webhook processed successfully: ${eventType} for user ${id}`);
    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
