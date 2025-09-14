import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

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

      const user = {
        clerkId: userInfo.id,
        email: userInfo.email_addresses[0].email_address,
        username: userInfo.username || `user_${userInfo.id.slice(-8)}`, // Fallback username
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        photo: userInfo.image_url || "",
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
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || `user_${id.slice(-8)}`,
        photo: image_url || "",
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
