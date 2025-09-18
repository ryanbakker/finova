"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (isLoaded && user) {
      const syncUser = async () => {
        try {
          setSyncStatus("syncing");
          console.log(`[USER_SYNC] Starting user synchronization`, {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            timestamp: new Date().toISOString(),
          });

          // Check if user exists in our database
          const response = await fetch(`/api/users/check?clerkId=${user.id}`);

          if (!response.ok) {
            // If user doesn't exist, create them
            console.log(
              `[USER_SYNC] User not found in database, creating user`,
              {
                userId: user.id,
              }
            );

            const createResponse = await fetch("/api/users/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                username: user.username || `user_${user.id.slice(-8)}`,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                photo: user.imageUrl || "",
                companyId: user.id, // For now, use user ID as company ID (single-user companies)
                subscription: {
                  plan: (user.publicMetadata as any)?.plan || "free",
                  status: "active",
                },
              }),
            });

            if (!createResponse.ok) {
              throw new Error("Failed to create user");
            }

            console.log(`[USER_SYNC] User created successfully`);
          } else {
            console.log(`[USER_SYNC] User already exists in database`);
          }

          setSyncStatus("success");
          console.log(
            `[USER_SYNC] User synchronization completed successfully`,
            {
              userId: user.id,
              timestamp: new Date().toISOString(),
            }
          );
        } catch (error) {
          setSyncStatus("error");
          const message =
            error instanceof Error ? error.message : String(error);
          console.error(`[USER_SYNC] User synchronization failed`, {
            userId: user?.id ?? "unknown",
            error: message,
            timestamp: new Date().toISOString(),
          });
        }
      };

      syncUser();
    }
  }, [isLoaded, user]);

  return { user, isLoaded, syncStatus };
}
