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

          // Sync user data with your backend or perform any necessary user synchronization
          // This is a placeholder implementation - customize based on your needs

          // Example: You could call an API endpoint to sync user data
          // const response = await fetch('/api/users/sync', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     clerkId: user.id,
          //     email: user.emailAddresses[0]?.emailAddress,
          //     firstName: user.firstName,
          //     lastName: user.lastName,
          //     imageUrl: user.imageUrl,
          //   }),
          // });

          // if (!response.ok) {
          //   throw new Error('Failed to sync user data');
          // }

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
          console.error(`[USER_SYNC] User synchronization failed`, {
            userId: user.id,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          });
        }
      };

      syncUser();
    }
  }, [isLoaded, user]);

  return { user, isLoaded, syncStatus };
}
