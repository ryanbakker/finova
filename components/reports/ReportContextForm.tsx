"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  User,
  Target,
  TrendingUp,
  Zap,
  Lightbulb,
} from "lucide-react";
import { ReportContext } from "@/lib/services/ai.service";
import {
  getContextPreset,
  getPresetNames,
  getPresetDescription,
} from "@/lib/services/contextPresets";

interface ReportContextFormProps {
  context: ReportContext;
  onChange: (context: ReportContext) => void;
  onClose?: () => void;
}

export function ReportContextForm({
  context,
  onChange,
  onClose: _onClose,
}: ReportContextFormProps) {
  const [localContext, setLocalContext] = useState<ReportContext>(context);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const updateContext = (updates: Partial<ReportContext>) => {
    const newContext = { ...localContext, ...updates };
    setLocalContext(newContext);
    onChange(newContext);
  };

  const updateUserProfile = (
    updates: Partial<ReportContext["userProfile"]>
  ) => {
    updateContext({
      userProfile: { ...localContext.userProfile, ...updates },
    });
  };

  const updateReportFocus = (
    updates: Partial<ReportContext["reportFocus"]>
  ) => {
    updateContext({
      reportFocus: { ...localContext.reportFocus, ...updates },
    });
  };

  const updateMarketContext = (
    updates: Partial<ReportContext["marketContext"]>
  ) => {
    updateContext({
      marketContext: { ...localContext.marketContext, ...updates },
    });
  };

  const addFinancialGoal = () => {
    const currentGoals = localContext.userProfile?.financialGoals || [];
    updateUserProfile({
      financialGoals: [...currentGoals, ""],
    });
  };

  const updateFinancialGoal = (index: number, value: string) => {
    const currentGoals = localContext.userProfile?.financialGoals || [];
    const newGoals = [...currentGoals];
    newGoals[index] = value;
    updateUserProfile({ financialGoals: newGoals });
  };

  const removeFinancialGoal = (index: number) => {
    const currentGoals = localContext.userProfile?.financialGoals || [];
    const newGoals = currentGoals.filter((_, i) => i !== index);
    updateUserProfile({ financialGoals: newGoals });
  };

  const addConcern = () => {
    const currentConcerns = localContext.userProfile?.concerns || [];
    updateUserProfile({
      concerns: [...currentConcerns, ""],
    });
  };

  const updateConcern = (index: number, value: string) => {
    const currentConcerns = localContext.userProfile?.concerns || [];
    const newConcerns = [...currentConcerns];
    newConcerns[index] = value;
    updateUserProfile({ concerns: newConcerns });
  };

  const removeConcern = (index: number) => {
    const currentConcerns = localContext.userProfile?.concerns || [];
    const newConcerns = currentConcerns.filter((_, i) => i !== index);
    updateUserProfile({ concerns: newConcerns });
  };

  const addPrimaryArea = () => {
    const currentAreas = localContext.reportFocus?.primaryAreas || [];
    updateReportFocus({
      primaryAreas: [...currentAreas, ""],
    });
  };

  const updatePrimaryArea = (index: number, value: string) => {
    const currentAreas = localContext.reportFocus?.primaryAreas || [];
    const newAreas = [...currentAreas];
    newAreas[index] = value;
    updateReportFocus({ primaryAreas: newAreas });
  };

  const removePrimaryArea = (index: number) => {
    const currentAreas = localContext.reportFocus?.primaryAreas || [];
    const newAreas = currentAreas.filter((_, i) => i !== index);
    updateReportFocus({ primaryAreas: newAreas });
  };

  const addSpecificQuestion = () => {
    const currentQuestions = localContext.reportFocus?.specificQuestions || [];
    updateReportFocus({
      specificQuestions: [...currentQuestions, ""],
    });
  };

  const updateSpecificQuestion = (index: number, value: string) => {
    const currentQuestions = localContext.reportFocus?.specificQuestions || [];
    const newQuestions = [...currentQuestions];
    newQuestions[index] = value;
    updateReportFocus({ specificQuestions: newQuestions });
  };

  const removeSpecificQuestion = (index: number) => {
    const currentQuestions = localContext.reportFocus?.specificQuestions || [];
    const newQuestions = currentQuestions.filter((_, i) => i !== index);
    updateReportFocus({ specificQuestions: newQuestions });
  };

  const applyPreset = (presetName: string) => {
    const preset = getContextPreset(presetName);
    if (preset) {
      setLocalContext(preset);
      onChange(preset);
      setSelectedPreset(presetName);
    }
  };

  const clearContext = () => {
    const emptyContext: ReportContext = {};
    setLocalContext(emptyContext);
    onChange(emptyContext);
    setSelectedPreset("");
  };

  return (
    <Card className="bg-neutral-50 dark:bg-neutral-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-1 bg-sky-50 dark:bg-gray-900 rounded-lg p-3 w-full">
            <Lightbulb className="h-8 w-8 md:h-4 md:w-4 text-sky-800 dark:text-gray-300" />
            <p className="text-sm text-sky-800 dark:text-gray-300">
              Provide context to get more personalized and relevant financial
              insights.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <h3 className="font-medium">Quick Start Presets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {getPresetNames().map((presetName) => (
              <Button
                key={presetName}
                variant={selectedPreset === presetName ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(presetName)}
                className="justify-start text-left h-auto p-3 cursor-pointer"
              >
                <div>
                  <div className="font-medium capitalize">
                    {presetName.replace("_", " ")}
                  </div>
                  <div className="text-xs opacity-70 max-w-full whitespace-normal">
                    {getPresetDescription(presetName)}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearContext}
              className="text-xs cursor-pointer w-full md:w-auto"
            >
              Clear All
            </Button>
            <div className="text-xs text-gray-500 items-center hidden md:flex">
              Or customize manually below
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <h3 className="font-medium">Personal Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 28"
                value={localContext.userProfile?.age || ""}
                onChange={(e) =>
                  updateUserProfile({
                    age: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeStage">Life Stage (Optional)</Label>
              <Select
                value={localContext.userProfile?.lifeStage || ""}
                onValueChange={(value) =>
                  updateUserProfile({
                    lifeStage: value as
                      | "student"
                      | "young_professional"
                      | "established"
                      | "pre_retirement"
                      | "retired",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select life stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="young_professional">
                    Young Professional
                  </SelectItem>
                  <SelectItem value="established">
                    Established Professional
                  </SelectItem>
                  <SelectItem value="pre_retirement">Pre-Retirement</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeLevel">Income Level (Optional)</Label>
              <Select
                value={localContext.userProfile?.incomeLevel || ""}
                onValueChange={(value) =>
                  updateUserProfile({
                    incomeLevel: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select income level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Lower Income</SelectItem>
                  <SelectItem value="medium">Middle Income</SelectItem>
                  <SelectItem value="high">Higher Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskTolerance">Risk Tolerance (Optional)</Label>
              <Select
                value={localContext.userProfile?.riskTolerance || ""}
                onValueChange={(value) =>
                  updateUserProfile({
                    riskTolerance: value as
                      | "conservative"
                      | "moderate"
                      | "aggressive",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select risk tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Goals */}
          <div className="space-y-2">
            <Label>Financial Goals (Optional)</Label>
            <div className="space-y-2">
              {(localContext.userProfile?.financialGoals || []).map(
                (goal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Buy a house, Save for retirement"
                      value={goal}
                      onChange={(e) =>
                        updateFinancialGoal(index, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFinancialGoal(index)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addFinancialGoal}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Financial Goal
              </Button>
            </div>
          </div>

          {/* Concerns */}
          <div className="space-y-2">
            <Label>Key Concerns (Optional)</Label>
            <div className="space-y-2">
              {(localContext.userProfile?.concerns || []).map(
                (concern, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Job security, Market volatility"
                      value={concern}
                      onChange={(e) => updateConcern(index, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeConcern(index)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addConcern}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Concern
              </Button>
            </div>
          </div>
        </div>

        {/* Report Focus Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <h3 className="font-medium">Report Focus</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Time Horizon (Optional)</Label>
              <Select
                value={localContext.reportFocus?.timeHorizon || ""}
                onValueChange={(value) =>
                  updateReportFocus({
                    timeHorizon: value as
                      | "short_term"
                      | "medium_term"
                      | "long_term",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short_term">
                    Short Term (1-2 years)
                  </SelectItem>
                  <SelectItem value="medium_term">
                    Medium Term (3-10 years)
                  </SelectItem>
                  <SelectItem value="long_term">
                    Long Term (10+ years)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level (Optional)</Label>
              <Select
                value={localContext.reportFocus?.urgency || ""}
                onValueChange={(value) =>
                  updateReportFocus({
                    urgency: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General Planning</SelectItem>
                  <SelectItem value="medium">
                    Medium - Address Concerns
                  </SelectItem>
                  <SelectItem value="high">
                    High - Immediate Action Needed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Primary Areas */}
          <div className="space-y-2">
            <Label>Primary Areas of Focus (Optional)</Label>
            <div className="space-y-2">
              {(localContext.reportFocus?.primaryAreas || []).map(
                (area, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Debt management, Investment strategy"
                      value={area}
                      onChange={(e) => updatePrimaryArea(index, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePrimaryArea(index)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addPrimaryArea}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Focus Area
              </Button>
            </div>
          </div>

          {/* Specific Questions */}
          <div className="space-y-2">
            <Label>Specific Questions (Optional)</Label>
            <div className="space-y-2">
              {(localContext.reportFocus?.specificQuestions || []).map(
                (question, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      placeholder="e.g., Should I prioritize paying off debt or investing?"
                      value={question}
                      onChange={(e) =>
                        updateSpecificQuestion(index, e.target.value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSpecificQuestion(index)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addSpecificQuestion}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        </div>

        {/* Market Context Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <h3 className="font-medium">Market Context (Optional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interestRates">
                Interest Rate Environment (Optional)
              </Label>
              <Select
                value={localContext.marketContext?.interestRates || ""}
                onValueChange={(value) =>
                  updateMarketContext({
                    interestRates: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select interest rate environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Interest Rates</SelectItem>
                  <SelectItem value="medium">
                    Moderate Interest Rates
                  </SelectItem>
                  <SelectItem value="high">High Interest Rates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketVolatility">
                Market Volatility (Optional)
              </Label>
              <Select
                value={localContext.marketContext?.marketVolatility || ""}
                onValueChange={(value) =>
                  updateMarketContext({
                    marketVolatility: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select market volatility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Volatility</SelectItem>
                  <SelectItem value="medium">Moderate Volatility</SelectItem>
                  <SelectItem value="high">High Volatility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
