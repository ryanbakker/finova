"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportContext } from "@/lib/services/ai.service";
import {
  getContextPreset,
  getPresetNames,
} from "@/lib/services/contextPresets";
import { User, Target, TrendingUp, Sparkles } from "lucide-react";

interface ContextDemoProps {
  onGenerateWithContext: (context: ReportContext) => void;
}

export function ContextDemo({ onGenerateWithContext }: ContextDemoProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    const context = getContextPreset(presetName);
    if (context) {
      onGenerateWithContext(context);
    }
  };

  const renderContextPreview = (context: ReportContext) => {
    if (!context || Object.keys(context).length === 0) {
      return <div className="text-gray-500 text-sm">No context selected</div>;
    }

    return (
      <div className="space-y-3">
        {context.userProfile && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <User className="h-3 w-3" />
              Profile
            </h4>
            <div className="space-y-1">
              {context.userProfile.lifeStage && (
                <Badge variant="outline" className="text-xs">
                  {context.userProfile.lifeStage.replace("_", " ")}
                </Badge>
              )}
              {context.userProfile.riskTolerance && (
                <Badge variant="outline" className="text-xs">
                  {context.userProfile.riskTolerance}
                </Badge>
              )}
              {context.userProfile.incomeLevel && (
                <Badge variant="outline" className="text-xs">
                  {context.userProfile.incomeLevel} income
                </Badge>
              )}
            </div>
            {context.userProfile.financialGoals &&
              context.userProfile.financialGoals.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Goals:{" "}
                  {context.userProfile.financialGoals.slice(0, 2).join(", ")}
                  {context.userProfile.financialGoals.length > 2 && "..."}
                </div>
              )}
          </div>
        )}

        {context.reportFocus && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Focus
            </h4>
            <div className="space-y-1">
              {context.reportFocus.timeHorizon && (
                <Badge variant="outline" className="text-xs">
                  {context.reportFocus.timeHorizon.replace("_", " ")} term
                </Badge>
              )}
              {context.reportFocus.urgency && (
                <Badge variant="outline" className="text-xs">
                  {context.reportFocus.urgency} urgency
                </Badge>
              )}
            </div>
            {context.reportFocus.primaryAreas &&
              context.reportFocus.primaryAreas.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Focus:{" "}
                  {context.reportFocus.primaryAreas.slice(0, 2).join(", ")}
                  {context.reportFocus.primaryAreas.length > 2 && "..."}
                </div>
              )}
          </div>
        )}

        {context.marketContext && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Market
            </h4>
            <div className="space-y-1">
              {context.marketContext.interestRates && (
                <Badge variant="outline" className="text-xs">
                  {context.marketContext.interestRates} rates
                </Badge>
              )}
              {context.marketContext.marketVolatility && (
                <Badge variant="outline" className="text-xs">
                  {context.marketContext.marketVolatility} volatility
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Context Demo
        </CardTitle>
        <CardDescription>
          See how different contexts personalize your financial reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium">Select a Context</h3>
            <div className="space-y-2">
              {getPresetNames().map((presetName) => (
                <Button
                  key={presetName}
                  variant={
                    selectedPreset === presetName ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePresetSelect(presetName)}
                  className="w-full justify-start"
                >
                  {presetName
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Context Preview</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {selectedPreset ? (
                renderContextPreview(getContextPreset(selectedPreset)!)
              ) : (
                <div className="text-gray-500 text-sm">
                  Select a context to see preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            <strong>How it works:</strong> Each context provides specific
            instructions to the AI about your life stage, financial goals, risk
            tolerance, and current market conditions. This allows the AI to
            generate personalized recommendations, use appropriate benchmarks,
            and tailor advice to your specific situation.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
