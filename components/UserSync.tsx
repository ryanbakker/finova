"use client";

import { useUserSync } from "@/hooks/use-user-sync";

export function UserSync() {
  // This component uses the useUserSync hook to automatically sync users
  // with MongoDB when they sign in. It doesn't render anything visible.
  useUserSync();

  return null;
}
