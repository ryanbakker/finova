"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface PlanContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useUser();

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Listen for plan changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "plan-updated" && e.newValue) {
        const data = JSON.parse(e.newValue);
        if (data.userId === user?.id) {
          triggerRefresh();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user?.id]);

  // Listen for custom plan update events
  useEffect(() => {
    const handlePlanUpdate = (e: CustomEvent) => {
      if (e.detail?.userId === user?.id) {
        triggerRefresh();
      }
    };

    window.addEventListener("plan-updated", handlePlanUpdate as EventListener);
    return () =>
      window.removeEventListener(
        "plan-updated",
        handlePlanUpdate as EventListener
      );
  }, [user?.id]);

  return (
    <PlanContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
}
