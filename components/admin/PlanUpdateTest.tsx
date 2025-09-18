"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlanStatus } from "@/hooks/use-plan-status";
import { useUser } from "@clerk/nextjs";

export function PlanUpdateTest() {
  const { user } = useUser();
  const { isPremium, isPro, isLoading, refresh } = usePlanStatus();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handlePlanUpdate = async () => {
    if (!selectedPlan) {
      setMessage("Please select a plan");
      return;
    }

    setIsUpdating(true);
    setMessage("");

    try {
      const response = await fetch("/api/users/update-plan-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          status: "active",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Plan updated to ${selectedPlan} successfully!`);
        refresh(); // Refresh the plan status
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please sign in to test plan updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Plan Update Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Current Plan Status:</h3>
          <div className="space-y-1 text-sm">
            <p>User ID: {user.id}</p>
            <p>Is Premium: {isPremium ? "Yes" : "No"}</p>
            <p>Is Pro: {isPro ? "Yes" : "No"}</p>
            <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Update Plan:</h3>
          <div className="flex gap-2">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handlePlanUpdate}
              disabled={isUpdating || !selectedPlan}
            >
              {isUpdating ? "Updating..." : "Update Plan"}
            </Button>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>
            This component allows you to manually update your plan for testing
            purposes.
          </p>
          <p>
            Use this to test if the plan update functionality works correctly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
