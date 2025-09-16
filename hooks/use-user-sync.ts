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

          // User sync completed successfully (no external services to sync)
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
