"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function useUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data with your backend or perform any necessary user synchronization
      // This is a placeholder implementation - customize based on your needs
      console.log("User loaded:", user.id);
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
}
