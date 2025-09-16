import { ReportContext } from "./ai.service";

export const contextPresets: Record<string, ReportContext> = {
  young_professional: {
    userProfile: {
      lifeStage: "young_professional",
      incomeLevel: "medium",
      riskTolerance: "moderate",
      financialGoals: [
        "Build emergency fund",
        "Start retirement savings",
        "Save for major purchase (car, house)",
        "Pay off student loans",
      ],
      concerns: [
        "Job security",
        "Student loan debt",
        "Affording major life expenses",
      ],
    },
    reportFocus: {
      timeHorizon: "medium_term",
      urgency: "medium",
      primaryAreas: [
        "Debt management",
        "Emergency fund building",
        "Basic investment strategy",
        "Budget optimization",
      ],
    },
  },

  established_professional: {
    userProfile: {
      lifeStage: "established",
      incomeLevel: "high",
      riskTolerance: "moderate",
      financialGoals: [
        "Maximize retirement contributions",
        "Diversify investment portfolio",
        "Plan for children's education",
        "Estate planning",
      ],
      concerns: [
        "Market volatility",
        "Tax optimization",
        "Wealth preservation",
      ],
    },
    reportFocus: {
      timeHorizon: "long_term",
      urgency: "low",
      primaryAreas: [
        "Investment strategy",
        "Tax planning",
        "Estate planning",
        "Wealth building",
      ],
    },
  },

  pre_retirement: {
    userProfile: {
      lifeStage: "pre_retirement",
      incomeLevel: "high",
      riskTolerance: "conservative",
      financialGoals: [
        "Maximize retirement savings",
        "Reduce investment risk",
        "Plan retirement income",
        "Healthcare planning",
      ],
      concerns: [
        "Market volatility",
        "Healthcare costs",
        "Retirement income adequacy",
      ],
    },
    reportFocus: {
      timeHorizon: "short_term",
      urgency: "high",
      primaryAreas: [
        "Retirement planning",
        "Risk management",
        "Income planning",
        "Healthcare costs",
      ],
    },
  },

  student: {
    userProfile: {
      lifeStage: "student",
      incomeLevel: "low",
      riskTolerance: "conservative",
      financialGoals: [
        "Minimize student debt",
        "Build basic emergency fund",
        "Learn financial basics",
        "Prepare for career transition",
      ],
      concerns: ["Student loan debt", "Limited income", "Future job prospects"],
    },
    reportFocus: {
      timeHorizon: "short_term",
      urgency: "medium",
      primaryAreas: [
        "Budget management",
        "Debt minimization",
        "Basic financial education",
        "Career planning",
      ],
    },
  },

  retired: {
    userProfile: {
      lifeStage: "retired",
      incomeLevel: "medium",
      riskTolerance: "conservative",
      financialGoals: [
        "Maintain retirement income",
        "Preserve wealth",
        "Healthcare cost management",
        "Estate planning",
      ],
      concerns: [
        "Healthcare costs",
        "Inflation impact",
        "Market volatility",
        "Longevity risk",
      ],
    },
    reportFocus: {
      timeHorizon: "short_term",
      urgency: "medium",
      primaryAreas: [
        "Income management",
        "Healthcare planning",
        "Estate planning",
        "Wealth preservation",
      ],
    },
  },
};

export function getContextPreset(presetName: string): ReportContext | null {
  return contextPresets[presetName] || null;
}

export function getPresetNames(): string[] {
  return Object.keys(contextPresets);
}

export function getPresetDescription(presetName: string): string {
  const descriptions: Record<string, string> = {
    young_professional:
      "Early career professional building financial foundation",
    established_professional: "Mid-career professional with growing wealth",
    pre_retirement: "Approaching retirement with focus on wealth preservation",
    student: "Student with limited income and focus on education",
    retired: "Retired individual managing retirement income and wealth",
  };

  return descriptions[presetName] || "Custom context";
}
