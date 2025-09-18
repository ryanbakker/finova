"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { usePlanContext } from "./use-plan-context";

interface PlanChangeParams {
  plan: "free" | "premium" | "pro";
  status?: "active" | "inactive" | "cancelled" | "past_due";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

interface PlanChangeState {
  isUpdating: boolean;
  error: string | null;
  success: boolean;
}

export function usePlanChange() {
  const { user } = useUser();
  const { triggerRefresh } = usePlanContext();
  const [state, setState] = useState<PlanChangeState>({
    isUpdating: false,
    error: null,
    success: false,
  });

  const updatePlan = useCallback(
    async (params: PlanChangeParams) => {
      if (!user?.id) {
        setState((prev) => ({ ...prev, error: "User not authenticated" }));
        return false;
      }

      setState({ isUpdating: true, error: null, success: false });

      try {
        const response = await fetch("/api/users/update-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            ...params,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update plan");
        }

        const result = await response.json();

        setState({ isUpdating: false, error: null, success: true });

        // Refresh plan status to reflect the changes
        triggerRefresh();

        // Clear success state after 3 seconds
        setTimeout(() => {
          setState((prev) => ({ ...prev, success: false }));
        }, 3000);

        console.log("[PLAN_CHANGE] Plan updated successfully:", result);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setState({ isUpdating: false, error: errorMessage, success: false });
        console.error("[PLAN_CHANGE] Failed to update plan:", error);
        return false;
      }
    },
    [user?.id, triggerRefresh]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, success: false }));
  }, []);

  return {
    updatePlan,
    clearError,
    clearSuccess,
    ...state,
  };
}
