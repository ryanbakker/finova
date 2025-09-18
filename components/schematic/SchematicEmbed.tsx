"use client";

import { useEffect, useCallback } from "react";
import {
  SchematicEmbed as SchematicEmbedComponent,
  EmbedProvider,
} from "@schematichq/schematic-components";
import { usePlanContext } from "@/hooks/use-plan-context";

const SchematicEmbed = ({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) => {
  const { triggerRefresh } = usePlanContext();

  const updatePlanDirectly = useCallback(
    async (planData: { plan: string; status?: string }) => {
      try {
        const response = await fetch("/api/users/update-plan-manual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: planData.plan,
            status: planData.status || "active",
          }),
        });

        if (response.ok) {
          console.log(
            "[SCHEMATIC] Plan updated successfully via direct API call"
          );
          triggerRefresh();
        } else {
          console.error(
            "[SCHEMATIC] Failed to update plan via direct API call"
          );
        }
      } catch (error) {
        console.error("[SCHEMATIC] Error updating plan:", error);
      }
    },
    [triggerRefresh]
  );

  useEffect(() => {
    // Listen for plan changes from Schematic
    const handlePlanChange = (event: CustomEvent) => {
      console.log("[SCHEMATIC] Plan change detected:", event.detail);

      // Trigger a refresh of the plan status
      triggerRefresh();

      // Optionally, you can also make a direct API call to update the plan
      // This provides a fallback in case webhooks don't work
      if (event.detail?.plan) {
        updatePlanDirectly(event.detail);
      }
    };

    // Listen for custom events from Schematic
    window.addEventListener(
      "schematic-plan-change",
      handlePlanChange as EventListener
    );

    // Also listen for postMessage events (common pattern for iframe communication)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "schematic-plan-change") {
        console.log("[SCHEMATIC] Plan change via postMessage:", event.data);
        triggerRefresh();

        if (event.data?.plan) {
          updatePlanDirectly(event.data);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "schematic-plan-change",
        handlePlanChange as EventListener
      );
      window.removeEventListener("message", handleMessage);
    };
  }, [triggerRefresh, updatePlanDirectly]);

  return (
    <EmbedProvider>
      <SchematicEmbedComponent accessToken={accessToken} id={componentId} />
    </EmbedProvider>
  );
};

export default SchematicEmbed;
