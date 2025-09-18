"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePlanContext } from "./use-plan-context";
import { getCompanyById } from "@/lib/actions/company.actions";

interface PlanStatus {
  isPremium: boolean;
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlanStatus(): PlanStatus {
  const { user } = useUser();
  const { refreshTrigger } = usePlanContext();
  const { triggerRefresh } = usePlanContext();
  const refresh = () => {
    triggerRefresh();
  };

  const [planStatus, setPlanStatus] = useState<PlanStatus>({
    isPremium: false,
    isPro: false,
    isLoading: true,
    error: null,
    refresh,
  });

  useEffect(() => {
    const checkPlan = async () => {
      if (!user?.id) {
        setPlanStatus({
          isPremium: false,
          isPro: false,
          isLoading: false,
          error: null,
          refresh,
        });
        return;
      }

      try {
        setPlanStatus((prev) => ({ ...prev, isLoading: true, error: null }));

        // First try to get company plan status from database
        try {
          const company = await getCompanyById(user.id);
          if (company?.subscription) {
            const plan = company.subscription.plan || "free";
            const status = company.subscription.status || "active";

            // Only consider active subscriptions
            const isActive = status === "active";

            setPlanStatus({
              isPremium: isActive && (plan === "premium" || plan === "pro"),
              isPro: isActive && plan === "pro",
              isLoading: false,
              error: null,
              refresh,
            });
            return;
          }
        } catch (companyError) {
          console.warn(
            "Failed to fetch company from database, trying user fallback"
          );
        }

        // Fallback: try to get plan status from user database
        try {
          const response = await fetch(`/api/users/check?clerkId=${user.id}`);
          if (response.ok) {
            const { user: dbUser } = await response.json();
            const plan = dbUser?.subscription?.plan || "free";
            const status = dbUser?.subscription?.status || "active";

            // Only consider active subscriptions
            const isActive = status === "active";

            setPlanStatus({
              isPremium: isActive && (plan === "premium" || plan === "pro"),
              isPro: isActive && plan === "pro",
              isLoading: false,
              error: null,
              refresh,
            });
            return;
          }
        } catch (dbError) {
          console.warn(
            "Failed to fetch user from database, falling back to metadata"
          );
        }

        // Fallback to Clerk metadata if database lookup fails
        const checkUserPlan = () => {
          // Check if user has plan information in their public metadata
          const userMetadata = user.publicMetadata as any;
          const userPlan =
            userMetadata?.plan || userMetadata?.subscription?.plan;
          const userStatus = userMetadata?.subscription?.status || "active";

          // Check for environment variable override (for development/testing)
          const envPlan = process.env.NEXT_PUBLIC_USER_PLAN;

          // Only consider active subscriptions
          const isActive = userStatus === "active";

          // Determine plan status
          const isPro =
            isActive &&
            (userPlan === "pro" ||
              envPlan === "pro" ||
              userPlan === "Pro" ||
              envPlan === "Pro");
          const isPremium =
            isActive &&
            (userPlan === "premium" ||
              envPlan === "premium" ||
              userPlan === "Premium" ||
              envPlan === "Premium" ||
              isPro);

          return {
            isPremium,
            isPro,
          };
        };

        const { isPremium, isPro } = checkUserPlan();

        setPlanStatus({
          isPremium,
          isPro,
          isLoading: false,
          error: null,
          refresh,
        });
      } catch (error) {
        console.error("Error checking plan status:", error);
        setPlanStatus({
          isPremium: false,
          isPro: false,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to check plan status",
          refresh,
        });
      }
    };

    checkPlan();
  }, [user?.id, refreshTrigger]);

  return planStatus;
}
