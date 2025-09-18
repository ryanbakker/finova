"use client";

import { useState } from "react";
import { usePlanChange } from "@/hooks/use-plan-change";
import { usePlanStatus } from "@/hooks/use-plan-status";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function PlanChangeDemo() {
  const { isPremium, isPro, isLoading } = usePlanStatus();
  const { updatePlan, isUpdating, error, success } = usePlanChange();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | "pro">(
    "free"
  );

  const handlePlanChange = async (plan: "free" | "premium" | "pro") => {
    setSelectedPlan(plan);
    await updatePlan({
      plan,
      status: "active",
      currentPeriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  };

  if (isLoading) {
    return <div>Loading plan status...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Plan Change Demo</CardTitle>
        <CardDescription>
          Test the plan change functionality. This is for development/testing
          purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Status */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Plan:</span>
          <Badge
            variant={isPro ? "default" : isPremium ? "secondary" : "outline"}
          >
            {isPro ? "Pro" : isPremium ? "Premium" : "Free"}
          </Badge>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert>
            <AlertDescription>
              ✅ Plan updated successfully! The change has been applied to your
              account.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>❌ Error updating plan: {error}</AlertDescription>
          </Alert>
        )}

        {/* Plan Change Buttons */}
        <div className="space-y-2">
          <h4 className="font-medium">Change Plan:</h4>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedPlan === "free" ? "default" : "outline"}
              onClick={() => handlePlanChange("free")}
              disabled={isUpdating}
            >
              {isUpdating && selectedPlan === "free" ? "Updating..." : "Free"}
            </Button>
            <Button
              variant={selectedPlan === "premium" ? "default" : "outline"}
              onClick={() => handlePlanChange("premium")}
              disabled={isUpdating}
            >
              {isUpdating && selectedPlan === "premium"
                ? "Updating..."
                : "Premium"}
            </Button>
            <Button
              variant={selectedPlan === "pro" ? "default" : "outline"}
              onClick={() => handlePlanChange("pro")}
              disabled={isUpdating}
            >
              {isUpdating && selectedPlan === "pro" ? "Updating..." : "Pro"}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> This demo updates your plan in the database
            and Clerk metadata. In production, plan changes would be handled by
            Schematic webhooks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
