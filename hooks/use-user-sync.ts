"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function useUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    console.log("🔄 UserSync effect triggered:", { isLoaded, hasUser: !!user });

    if (isLoaded && user) {
      console.log("✅ User loaded successfully:", {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // Sync user data with your backend or perform any necessary user synchronization
      // This is a placeholder implementation - customize based on your needs
    } else if (isLoaded && !user) {
      console.log("❌ User not authenticated after loading");
    } else {
      console.log("⏳ User data still loading...");
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
}
