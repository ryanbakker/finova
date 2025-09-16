import { GoogleGenerativeAI } from "@google/generative-ai";
import { DashboardData } from "./dashboard.service";

export interface AIReportInsights {
  keyFindings: string[];
  recommendations: string[];
  riskFactors: string[];
  financialHealthScore: number;
  trends: {
    spending: string;
    income: string;
    savings: string;
    netWorth: string;
  };
  opportunities: string[];
  warnings: string[];
}

export interface AIReportContent {
  title: string;
  content: string;
  insights: AIReportInsights;
  executiveSummary: string;
  detailedAnalysis: string;
  actionItems: string[];
}

export interface ReportContext {
  userProfile?: {
    age?: number;
    incomeLevel?: "low" | "medium" | "high";
    lifeStage?:
      | "student"
      | "young_professional"
      | "established"
      | "pre_retirement"
      | "retired";
    riskTolerance?: "conservative" | "moderate" | "aggressive";
    financialGoals?: string[];
    concerns?: string[];
  };
  reportFocus?: {
    primaryAreas?: string[];
    timeHorizon?: "short_term" | "medium_term" | "long_term";
    urgency?: "low" | "medium" | "high";
    specificQuestions?: string[];
  };
  marketContext?: {
    economicConditions?: string;
    interestRates?: "low" | "medium" | "high";
    marketVolatility?: "low" | "medium" | "high";
  };
}

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.6,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
  }

  async generateReportTitle(
    dashboardData: DashboardData,
    reportType: "summary" | "detailed" | "custom" = "detailed",
    customPrompt?: string,
    context?: ReportContext
  ): Promise<string> {
    const startTime = Date.now();

    try {
      console.log(`[AI_SERVICE] Starting report title generation`, {
        reportType,
        hasCustomPrompt: !!customPrompt,
        hasContext: !!context,
        dataKeys: Object.keys(dashboardData),
        timestamp: new Date().toISOString(),
      });

      const financialData = this.prepareFinancialData(dashboardData);

      // Build a focused prompt for title generation
      const titlePrompt = this.buildTitlePrompt(
        financialData,
        reportType,
        customPrompt,
        context
      );

      console.log(`[AI_SERVICE] Title prompt built, calling AI model`, {
        reportType,
        promptLength: titlePrompt.length,
        model: "gemini-2.5-pro",
        timestamp: new Date().toISOString(),
      });

      const result = await this.model.generateContent(titlePrompt);
      const response = await result.response;
      const text = response.text();

      console.log(`[AI_SERVICE] AI title response received`, {
        reportType,
        responseLength: text.length,
        timestamp: new Date().toISOString(),
      });

      // Clean and validate the title
      const title = this.cleanAndValidateTitle(text, financialData);

      const responseTime = Date.now() - startTime;
      console.log(`[AI_SERVICE] Report title generation completed`, {
        reportType,
        responseTime: `${responseTime}ms`,
        generatedTitle: title,
        timestamp: new Date().toISOString(),
      });

      return title;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[AI_SERVICE] Error generating report title`, {
        reportType,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });

      // Fallback to a descriptive title based on data
      try {
        const fallbackData = this.prepareFinancialData(dashboardData);
        return this.generateFallbackTitle(fallbackData, reportType);
      } catch (fallbackError) {
        console.error(`[AI_SERVICE] Error in fallback title generation`, {
          error:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unknown error",
          timestamp: new Date().toISOString(),
        });
        return `Financial Report - ${new Date().toLocaleDateString()}`;
      }
    }
  }

  async generateFinancialReport(
    dashboardData: DashboardData,
    reportType: "summary" | "detailed" | "custom" = "detailed",
    customPrompt?: string,
    dataRange?: { startDate: Date; endDate: Date },
    context?: ReportContext
  ): Promise<AIReportContent> {
    const startTime = Date.now();

    try {
      console.log(`[AI_SERVICE] Starting financial report generation`, {
        reportType,
        hasCustomPrompt: !!customPrompt,
        hasDataRange: !!dataRange,
        hasContext: !!context,
        dataKeys: Object.keys(dashboardData),
        timestamp: new Date().toISOString(),
      });

      const financialData = this.prepareFinancialData(dashboardData, dataRange);

      console.log(`[AI_SERVICE] Financial data prepared`, {
        reportType,
        dataSize: JSON.stringify(financialData).length,
        coreMetrics: {
          netWorth: financialData.netWorth,
          totalAssets: financialData.totalAssets,
          totalLiabilities: financialData.totalLiabilities,
          monthlyIncome: financialData.monthlyIncome,
          monthlyExpenses: financialData.monthlyExpenses,
        },
        timestamp: new Date().toISOString(),
      });

      const prompt = this.buildPrompt(
        financialData,
        reportType,
        customPrompt,
        context
      );

      console.log(`[AI_SERVICE] Prompt built, calling AI model`, {
        reportType,
        promptLength: prompt.length,
        model: "gemini-2.5-pro",
        timestamp: new Date().toISOString(),
      });

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`[AI_SERVICE] AI model response received`, {
        reportType,
        responseLength: text.length,
        timestamp: new Date().toISOString(),
      });

      // Parse the AI response into structured content
      const parsedContent = this.parseAIResponse(text, financialData);

      const responseTime = Date.now() - startTime;
      console.log(`[AI_SERVICE] Financial report generation completed`, {
        reportType,
        responseTime: `${responseTime}ms`,
        contentLength: parsedContent.content.length,
        insightsCount: parsedContent.insights
          ? Object.keys(parsedContent.insights).length
          : 0,
        healthScore: parsedContent.insights?.financialHealthScore,
        timestamp: new Date().toISOString(),
      });

      return parsedContent;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[AI_SERVICE] Error generating AI report`, {
        reportType,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to generate AI-powered financial report");
    }
  }

  private prepareFinancialData(
    dashboardData: DashboardData,
    dataRange?: { startDate: Date; endDate: Date }
  ) {
    try {
      console.log(`[AI_SERVICE] Preparing financial data`, {
        hasDataRange: !!dataRange,
        dataRange: dataRange
          ? {
              startDate: dataRange.startDate.toISOString(),
              endDate: dataRange.endDate.toISOString(),
            }
          : null,
        timestamp: new Date().toISOString(),
      });

      const {
        metrics,
        assets,
        recentTransactions,
        financialGoals,
        budgetProgress,
        categoryBreakdown,
        monthlySpending,
        netWorthHistory,
      } = dashboardData;

      // Calculate additional metrics
      const savingsRate =
        metrics.totalIncome > 0
          ? ((metrics.totalIncome - metrics.totalExpenses) /
              metrics.totalIncome) *
            100
          : 0;

      const debtToIncomeRatio =
        metrics.totalIncome > 0
          ? (metrics.totalLiabilities / metrics.totalIncome) * 100
          : 0;

      console.log(`[AI_SERVICE] Calculated additional metrics`, {
        savingsRate: Math.round(savingsRate * 100) / 100,
        debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
        timestamp: new Date().toISOString(),
      });

      // Analyze spending patterns
      const topSpendingCategories = categoryBreakdown
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      console.log(`[AI_SERVICE] Analyzed spending patterns`, {
        topCategoriesCount: topSpendingCategories.length,
        topCategory: topSpendingCategories[0]?.category || "None",
        topCategoryAmount: topSpendingCategories[0]?.amount || 0,
        timestamp: new Date().toISOString(),
      });

      // Calculate monthly trends
      const monthlyTrends = this.calculateTrends(
        monthlySpending,
        netWorthHistory
      );

      // Analyze goal progress
      const goalAnalysis = this.analyzeGoals(financialGoals);

      // Budget analysis
      const budgetAnalysis = this.analyzeBudgets(budgetProgress);

      console.log(`[AI_SERVICE] Completed data analysis`, {
        trends: monthlyTrends,
        goalsTotal: goalAnalysis.total,
        goalsCompleted: goalAnalysis.completed,
        budgetsTotal: budgetAnalysis.total,
        budgetsOnTrack: budgetAnalysis.onTrack,
        timestamp: new Date().toISOString(),
      });

      const preparedData = {
        // Core metrics
        netWorth: metrics.netWorth,
        totalAssets: metrics.totalAssets,
        totalLiabilities: metrics.totalLiabilities,
        monthlyIncome: metrics.totalIncome,
        monthlyExpenses: metrics.totalExpenses,
        savings: metrics.savings,
        netIncome: metrics.netIncome,
        savingsRate: Math.round(savingsRate * 100) / 100,
        debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,

        // Asset breakdown
        assets: {
          total: assets.length,
          byCategory: this.groupAssetsByCategory(assets),
          totalValue: metrics.totalAssets,
          topAssets: assets
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, 5)
            .map((asset) => ({
              name: asset.name,
              value: asset.currentValue,
              category: asset.category,
              changePercentage: asset.changePercentage,
            })),
        },

        // Spending analysis
        spending: {
          totalMonthly: metrics.totalExpenses,
          topCategories: topSpendingCategories,
          averageMonthly:
            monthlySpending.reduce((sum, month) => sum + month.expenses, 0) /
            Math.max(monthlySpending.length, 1),
          trends: monthlyTrends.spending,
        },

        // Income analysis
        income: {
          totalMonthly: metrics.totalIncome,
          trends: monthlyTrends.income,
          netIncome: metrics.netIncome,
        },

        // Goals and budgets
        goals: goalAnalysis,
        budgets: budgetAnalysis,

        // Historical data
        netWorthHistory: netWorthHistory.slice(-12), // Last 12 months
        monthlySpendingHistory: monthlySpending.slice(-12),

        // Recent activity
        recentTransactions: recentTransactions.slice(0, 10),

        // Data range
        dataRange: dataRange
          ? {
              startDate: dataRange.startDate.toISOString().split("T")[0],
              endDate: dataRange.endDate.toISOString().split("T")[0],
            }
          : null,
      };

      console.log(`[AI_SERVICE] Financial data preparation completed`, {
        dataSize: JSON.stringify(preparedData).length,
        coreMetrics: {
          netWorth: preparedData.netWorth,
          totalAssets: preparedData.totalAssets,
          totalLiabilities: preparedData.totalLiabilities,
        },
        timestamp: new Date().toISOString(),
      });

      return preparedData;
    } catch (error) {
      console.error(`[AI_SERVICE] Error preparing financial data`, {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  private buildPrompt(
    financialData: any,
    reportType: string,
    customPrompt?: string,
    context?: ReportContext
  ): string {
    try {
      console.log(`[AI_SERVICE] Building prompt`, {
        reportType,
        hasCustomPrompt: !!customPrompt,
        hasContext: !!context,
        financialDataSize: JSON.stringify(financialData).length,
        timestamp: new Date().toISOString(),
      });

      // Build dynamic context instructions
      const contextInstructions = this.buildContextInstructions(context);

      // Build report type specific instructions
      const reportTypeInstructions =
        this.buildReportTypeInstructions(reportType);

      // Build market context awareness
      const marketContext = this.buildMarketContextInstructions(
        context?.marketContext
      );

      console.log(`[AI_SERVICE] Context instructions built`, {
        reportType,
        contextInstructionsLength: contextInstructions.length,
        reportTypeInstructionsLength: reportTypeInstructions.length,
        marketContextLength: marketContext.length,
        timestamp: new Date().toISOString(),
      });

      const basePrompt = `You are a professional financial advisor and analyst with expertise in personalized financial planning. Generate a comprehensive financial report based on the following user data. The report should be insightful, actionable, and tailored to the user's specific situation and needs.

**User Financial Data:**
${JSON.stringify(financialData, null, 2)}

${contextInstructions}

${reportTypeInstructions}

${marketContext}

**Report Requirements:**
1. Provide a clear executive summary tailored to the user's situation
2. Analyze financial health and trends with context-appropriate benchmarks
3. Identify key opportunities and risks specific to their profile
4. Give specific, actionable recommendations with clear next steps
5. **CRITICAL: Include a comprehensive financial health score (0-100) with detailed reasoning based on:**
   - Savings rate (target: 20%+ for excellent, 10%+ for good)
   - Debt-to-income ratio (target: <20% for excellent, <40% for good)
   - Net worth relative to income (target: >=12 months income for excellent)
   - Asset-liability balance (target: 3:1+ ratio for excellent)
   - Goal progress and budget management
6. Highlight spending patterns and areas for improvement
7. Assess progress toward financial goals with realistic timelines
8. Provide insights on asset allocation and debt management
9. Consider the user's life stage and risk tolerance in all recommendations
10. Address any specific concerns or questions mentioned

**Report Structure:**
- Executive Summary (personalized to user context)
- Financial Health Overview (with appropriate benchmarks)
- Income & Expense Analysis (context-aware insights)
- Asset & Liability Breakdown (risk-appropriate recommendations)
- Goal Progress Assessment (realistic timeline analysis)
- Spending Pattern Analysis (lifestyle-appropriate suggestions)
- Risk Assessment (tailored to user profile)
- Opportunities & Recommendations (actionable next steps)
- Action Items (prioritized by urgency and impact)

Please format your response as a JSON object with the following structure:
{
  "title": "Personalized Financial Report - [Date]",
  "executiveSummary": "Brief overview tailored to user's situation...",
  "content": "Detailed markdown-formatted report with personalized insights...",
  "insights": {
    "keyFindings": ["Contextual finding 1", "Contextual finding 2", ...],
    "recommendations": ["Personalized recommendation 1", "Personalized recommendation 2", ...],
    "riskFactors": ["Relevant risk 1", "Relevant risk 2", ...],
    "financialHealthScore": 75,
    "trends": {
      "spending": "Context-aware spending analysis...",
      "income": "Income trend analysis with benchmarks...",
      "savings": "Savings analysis with goals...",
      "netWorth": "Net worth analysis with projections..."
    },
    "opportunities": ["Relevant opportunity 1", "Relevant opportunity 2", ...],
    "warnings": ["Important warning 1", "Important warning 2", ...]
  },
  "actionItems": ["Prioritized action 1", "Prioritized action 2", ...]
}`;

      if (customPrompt) {
        const finalPrompt = `${basePrompt}\n\n**Custom Analysis Request:**\n${customPrompt}\n\nPlease incorporate this custom analysis into the report while maintaining the JSON structure and considering the user's context.`;

        console.log(`[AI_SERVICE] Custom prompt built`, {
          reportType,
          finalPromptLength: finalPrompt.length,
          customPromptLength: customPrompt.length,
          timestamp: new Date().toISOString(),
        });

        return finalPrompt;
      }

      console.log(`[AI_SERVICE] Standard prompt built`, {
        reportType,
        promptLength: basePrompt.length,
        timestamp: new Date().toISOString(),
      });

      return basePrompt;
    } catch (error) {
      console.error(`[AI_SERVICE] Error building prompt`, {
        reportType,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  private parseAIResponse(text: string, financialData: any): AIReportContent {
    try {
      console.log(`[AI_SERVICE] Parsing AI response`, {
        responseLength: text.length,
        timestamp: new Date().toISOString(),
      });

      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log(`[AI_SERVICE] JSON pattern found in response`, {
          jsonLength: jsonMatch[0].length,
          timestamp: new Date().toISOString(),
        });

        const parsed = JSON.parse(jsonMatch[0]);

        console.log(`[AI_SERVICE] JSON parsed successfully`, {
          hasTitle: !!parsed.title,
          hasContent: !!parsed.content,
          hasInsights: !!parsed.insights,
          hasExecutiveSummary: !!parsed.executiveSummary,
          hasActionItems: !!parsed.actionItems,
          insightsKeys: parsed.insights ? Object.keys(parsed.insights) : [],
          timestamp: new Date().toISOString(),
        });

        // Ensure health score is calculated if not provided by AI
        const insights =
          parsed.insights || this.generateFallbackInsights(financialData);
        if (!insights.financialHealthScore) {
          insights.financialHealthScore = this.calculateFinancialHealthScore({
            savingsRate: financialData.savingsRate || 0,
            debtToIncomeRatio: financialData.debtToIncomeRatio || 0,
            netWorth: financialData.netWorth || 0,
            totalAssets: financialData.totalAssets || 0,
            totalLiabilities: financialData.totalLiabilities || 0,
            monthlyIncome: financialData.monthlyIncome || 0,
            monthlyExpenses: financialData.monthlyExpenses || 0,
            goals: financialData.goals || {},
            budgets: financialData.budgets || {},
          });
        }

        return {
          title:
            parsed.title ||
            `Financial Report - ${new Date().toLocaleDateString()}`,
          content: parsed.content || text,
          insights,
          executiveSummary:
            parsed.executiveSummary || "Financial analysis completed.",
          detailedAnalysis: parsed.content || text,
          actionItems: parsed.actionItems || [],
        };
      } else {
        console.warn(
          `[AI_SERVICE] No JSON pattern found in response, using fallback`,
          {
            responseLength: text.length,
            timestamp: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error(
        `[AI_SERVICE] Failed to parse AI response as JSON, using fallback`,
        {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          responseLength: text.length,
          timestamp: new Date().toISOString(),
        }
      );
    }

    // Fallback: return the raw text with basic structure
    console.log(`[AI_SERVICE] Using fallback response structure`, {
      responseLength: text.length,
      timestamp: new Date().toISOString(),
    });

    const fallbackInsights = this.generateFallbackInsights(financialData);

    return {
      title: `Financial Report - ${new Date().toLocaleDateString()}`,
      content: text,
      insights: fallbackInsights,
      executiveSummary: "AI-generated financial analysis completed.",
      detailedAnalysis: text,
      actionItems: [],
    };
  }

  private generateFallbackInsights(financialData: any): AIReportInsights {
    const savingsRate = financialData.savingsRate || 0;
    const debtToIncomeRatio = financialData.debtToIncomeRatio || 0;
    const netWorth = financialData.netWorth || 0;
    const totalAssets = financialData.totalAssets || 0;
    const totalLiabilities = financialData.totalLiabilities || 0;
    const monthlyIncome = financialData.monthlyIncome || 0;
    const monthlyExpenses = financialData.monthlyExpenses || 0;

    // Calculate comprehensive financial health score
    let healthScore = this.calculateFinancialHealthScore({
      savingsRate,
      debtToIncomeRatio,
      netWorth,
      totalAssets,
      totalLiabilities,
      monthlyIncome,
      monthlyExpenses,
      goals: financialData.goals || {},
      budgets: financialData.budgets || {},
    });

    return {
      keyFindings: [
        `Net worth: $${netWorth.toLocaleString()}`,
        `Monthly savings rate: ${savingsRate.toFixed(1)}%`,
        `Debt-to-income ratio: ${debtToIncomeRatio.toFixed(1)}%`,
        `Total assets: $${financialData.totalAssets?.toLocaleString() || 0}`,
      ],
      recommendations: [
        "Review and optimize your spending categories",
        "Consider increasing your emergency fund",
        "Regularly monitor your financial goals progress",
        "Diversify your asset portfolio",
      ],
      riskFactors: [
        debtToIncomeRatio > 40
          ? "High debt-to-income ratio"
          : "Manageable debt levels",
        savingsRate < 10 ? "Low savings rate" : "Adequate savings rate",
        netWorth < 0 ? "Negative net worth" : "Positive net worth",
      ],
      financialHealthScore: healthScore,
      trends: {
        spending: "Analyze monthly spending patterns",
        income: "Monitor income stability and growth",
        savings: "Track savings rate improvements",
        netWorth: "Monitor net worth growth over time",
      },
      opportunities: [
        "Optimize high-spending categories",
        "Increase income through side hustles or career advancement",
        "Consider investment opportunities",
        "Refinance high-interest debt",
      ],
      warnings: [
        "Monitor cash flow regularly",
        "Maintain emergency fund",
        "Avoid lifestyle inflation",
        "Review insurance coverage",
      ],
    };
  }

  private groupAssetsByCategory(
    assets: any[]
  ): Record<string, { count: number; totalValue: number }> {
    return assets.reduce((acc, asset) => {
      const category = asset.category || "Other";
      if (!acc[category]) {
        acc[category] = { count: 0, totalValue: 0 };
      }
      acc[category].count++;
      acc[category].totalValue += asset.currentValue || 0;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);
  }

  private calculateTrends(monthlySpending: any[], netWorthHistory: any[]) {
    try {
      console.log(`[AI_SERVICE] Calculating trends`, {
        monthlySpendingDataPoints: monthlySpending.length,
        netWorthHistoryDataPoints: netWorthHistory.length,
        timestamp: new Date().toISOString(),
      });

      const spendingTrend = this.calculateTrend(
        monthlySpending.map((m) => m.expenses)
      );
      const incomeTrend = this.calculateTrend(
        netWorthHistory.map((h) => h.netWorth)
      );

      const trends = {
        spending:
          spendingTrend > 0
            ? "Increasing"
            : spendingTrend < 0
            ? "Decreasing"
            : "Stable",
        income:
          incomeTrend > 0
            ? "Growing"
            : incomeTrend < 0
            ? "Declining"
            : "Stable",
        savings: "To be analyzed",
        netWorth:
          incomeTrend > 0
            ? "Growing"
            : incomeTrend < 0
            ? "Declining"
            : "Stable",
      };

      console.log(`[AI_SERVICE] Trends calculated`, {
        spendingTrend: spendingTrend.toFixed(2),
        incomeTrend: incomeTrend.toFixed(2),
        trends,
        timestamp: new Date().toISOString(),
      });

      return trends;
    } catch (error) {
      console.error(`[AI_SERVICE] Error calculating trends`, {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      return {
        spending: "Unknown",
        income: "Unknown",
        savings: "Unknown",
        netWorth: "Unknown",
      };
    }
  }

  private calculateTrend(values: number[]): number {
    try {
      if (values.length < 2) {
        console.log(`[AI_SERVICE] Insufficient data for trend calculation`, {
          dataPoints: values.length,
          timestamp: new Date().toISOString(),
        });
        return 0;
      }

      const first = values[0];
      const last = values[values.length - 1];
      const trend = ((last - first) / first) * 100;

      console.log(`[AI_SERVICE] Trend calculated`, {
        dataPoints: values.length,
        firstValue: first,
        lastValue: last,
        trendPercentage: trend.toFixed(2),
        timestamp: new Date().toISOString(),
      });

      return trend;
    } catch (error) {
      console.error(`[AI_SERVICE] Error calculating trend`, {
        error: error instanceof Error ? error.message : "Unknown error",
        dataPoints: values.length,
        timestamp: new Date().toISOString(),
      });
      return 0;
    }
  }

  private analyzeGoals(goals: any[]) {
    try {
      console.log(`[AI_SERVICE] Analyzing goals`, {
        totalGoals: goals.length,
        timestamp: new Date().toISOString(),
      });

      const analysis = {
        total: goals.length,
        completed: goals.filter((g) => g.progress >= 100).length,
        onTrack: goals.filter((g) => g.progress >= 50 && g.progress < 100)
          .length,
        behind: goals.filter((g) => g.progress < 50).length,
        averageProgress:
          goals.length > 0
            ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
            : 0,
      };

      console.log(`[AI_SERVICE] Goals analysis completed`, {
        analysis,
        timestamp: new Date().toISOString(),
      });

      return analysis;
    } catch (error) {
      console.error(`[AI_SERVICE] Error analyzing goals`, {
        error: error instanceof Error ? error.message : "Unknown error",
        goalsCount: goals.length,
        timestamp: new Date().toISOString(),
      });

      return {
        total: 0,
        completed: 0,
        onTrack: 0,
        behind: 0,
        averageProgress: 0,
      };
    }
  }

  private analyzeBudgets(budgets: any[]) {
    try {
      console.log(`[AI_SERVICE] Analyzing budgets`, {
        totalBudgets: budgets.length,
        timestamp: new Date().toISOString(),
      });

      const analysis = {
        total: budgets.length,
        onTrack: budgets.filter((b) => b.percentage <= 80).length,
        atRisk: budgets.filter((b) => b.percentage > 80 && b.percentage <= 100)
          .length,
        overBudget: budgets.filter((b) => b.percentage > 100).length,
        averageUtilization:
          budgets.length > 0
            ? budgets.reduce((sum, b) => sum + b.percentage, 0) / budgets.length
            : 0,
      };

      console.log(`[AI_SERVICE] Budgets analysis completed`, {
        analysis,
        timestamp: new Date().toISOString(),
      });

      return analysis;
    } catch (error) {
      console.error(`[AI_SERVICE] Error analyzing budgets`, {
        error: error instanceof Error ? error.message : "Unknown error",
        budgetsCount: budgets.length,
        timestamp: new Date().toISOString(),
      });

      return {
        total: 0,
        onTrack: 0,
        atRisk: 0,
        overBudget: 0,
        averageUtilization: 0,
      };
    }
  }

  private buildContextInstructions(context?: ReportContext): string {
    if (!context) {
      return `**User Context:** No specific context provided. Provide general financial advice suitable for a broad audience.`;
    }

    let instructions = `**User Context & Profile:**\n`;

    // User Profile Context
    if (context.userProfile) {
      const profile = context.userProfile;
      instructions += `**Personal Profile:**\n`;

      if (profile.age) {
        instructions += `- Age: ${profile.age} years old\n`;
      }

      if (profile.lifeStage) {
        const stageDescriptions = {
          student:
            "Currently a student with limited income and focus on education expenses",
          young_professional:
            "Early career professional building financial foundation",
          established:
            "Mid-career professional with growing income and family responsibilities",
          pre_retirement:
            "Approaching retirement with focus on wealth preservation and income generation",
          retired:
            "Retired individual focused on income management and wealth preservation",
        };
        instructions += `- Life Stage: ${profile.lifeStage} - ${
          stageDescriptions[profile.lifeStage]
        }\n`;
      }

      if (profile.incomeLevel) {
        const incomeDescriptions = {
          low: "Lower income bracket requiring careful budgeting and cost optimization",
          medium: "Middle income bracket with moderate financial flexibility",
          high: "Higher income bracket with significant financial resources and investment opportunities",
        };
        instructions += `- Income Level: ${profile.incomeLevel} - ${
          incomeDescriptions[profile.incomeLevel]
        }\n`;
      }

      if (profile.riskTolerance) {
        const riskDescriptions = {
          conservative:
            "Conservative investor preferring low-risk, stable investments",
          moderate: "Moderate investor balancing growth and stability",
          aggressive:
            "Aggressive investor seeking higher returns with higher risk tolerance",
        };
        instructions += `- Risk Tolerance: ${profile.riskTolerance} - ${
          riskDescriptions[profile.riskTolerance]
        }\n`;
      }

      if (profile.financialGoals && profile.financialGoals.length > 0) {
        instructions += `- Financial Goals: ${profile.financialGoals.join(
          ", "
        )}\n`;
      }

      if (profile.concerns && profile.concerns.length > 0) {
        instructions += `- Key Concerns: ${profile.concerns.join(", ")}\n`;
      }
    }

    // Report Focus Context
    if (context.reportFocus) {
      const focus = context.reportFocus;
      instructions += `\n**Report Focus:**\n`;

      if (focus.primaryAreas && focus.primaryAreas.length > 0) {
        instructions += `- Primary Areas of Focus: ${focus.primaryAreas.join(
          ", "
        )}\n`;
      }

      if (focus.timeHorizon) {
        const horizonDescriptions = {
          short_term:
            "Focus on immediate financial needs and short-term goals (1-2 years)",
          medium_term:
            "Focus on medium-term financial planning and goals (3-10 years)",
          long_term:
            "Focus on long-term wealth building and retirement planning (10+ years)",
        };
        instructions += `- Time Horizon: ${focus.timeHorizon} - ${
          horizonDescriptions[focus.timeHorizon]
        }\n`;
      }

      if (focus.urgency) {
        const urgencyDescriptions = {
          low: "No immediate urgency - focus on general financial health and planning",
          medium:
            "Moderate urgency - address specific concerns and opportunities",
          high: "High urgency - focus on critical financial issues requiring immediate attention",
        };
        instructions += `- Urgency Level: ${focus.urgency} - ${
          urgencyDescriptions[focus.urgency]
        }\n`;
      }

      if (focus.specificQuestions && focus.specificQuestions.length > 0) {
        instructions += `- Specific Questions to Address: ${focus.specificQuestions.join(
          "; "
        )}\n`;
      }
    }

    instructions += `\n**Contextual Guidance:** Tailor all recommendations, benchmarks, and advice to match this user's specific profile, life stage, and circumstances. Use appropriate financial benchmarks and consider their risk tolerance in all suggestions.`;

    return instructions;
  }

  private buildReportTypeInstructions(reportType: string): string {
    const typeInstructions = {
      summary: `**Report Type: Summary Report**
- Provide a concise overview focusing on key metrics and top 3-5 recommendations
- Keep analysis brief but impactful
- Focus on immediate actionable insights
- Limit detailed analysis to most critical areas`,

      detailed: `**Report Type: Detailed Analysis**
- Provide comprehensive analysis across all financial areas
- Include detailed explanations and reasoning
- Offer multiple recommendations with pros/cons
- Include specific action steps and timelines
- Provide thorough risk assessment and opportunity analysis`,

      custom: `**Report Type: Custom Analysis**
- Focus on the specific custom request provided
- Provide in-depth analysis of requested areas
- Include specialized insights and recommendations
- Address specific concerns or questions raised
- Provide detailed explanations and supporting data`,
    };

    return (
      typeInstructions[reportType as keyof typeof typeInstructions] ||
      typeInstructions.detailed
    );
  }

  private buildMarketContextInstructions(
    marketContext?: ReportContext["marketContext"]
  ): string {
    if (!marketContext) {
      return `**Market Context:** No specific market context provided. Use general market assumptions.`;
    }

    let instructions = `**Current Market Context:**\n`;

    if (marketContext.economicConditions) {
      instructions += `- Economic Conditions: ${marketContext.economicConditions}\n`;
    }

    if (marketContext.interestRates) {
      const rateDescriptions = {
        low: "Low interest rate environment - favorable for borrowing, challenging for fixed income",
        medium: "Moderate interest rate environment - balanced opportunities",
        high: "High interest rate environment - good for savers, challenging for borrowers",
      };
      instructions += `- Interest Rate Environment: ${
        marketContext.interestRates
      } - ${rateDescriptions[marketContext.interestRates]}\n`;
    }

    if (marketContext.marketVolatility) {
      const volatilityDescriptions = {
        low: "Low market volatility - stable investment environment",
        medium: "Moderate market volatility - normal market fluctuations",
        high: "High market volatility - increased risk and opportunity",
      };
      instructions += `- Market Volatility: ${
        marketContext.marketVolatility
      } - ${volatilityDescriptions[marketContext.marketVolatility]}\n`;
    }

    instructions += `\n**Market-Aware Recommendations:** Consider these market conditions when providing investment advice, debt management suggestions, and risk assessments. Adjust recommendations to be appropriate for the current economic environment.`;

    return instructions;
  }

  private buildTitlePrompt(
    financialData: any,
    reportType: string,
    customPrompt?: string,
    context?: ReportContext
  ): string {
    const contextInfo = this.buildContextInstructions(context);
    const reportTypeInfo = this.buildReportTypeInstructions(reportType);

    const basePrompt = `You are a financial analyst creating a unique, descriptive title for a financial report. Based on the user's financial data and context, generate a compelling title that captures the essence of their financial situation and the report's focus.

**User Financial Data:**
${JSON.stringify(financialData, null, 2)}

${contextInfo}

${reportTypeInfo}

**Title Requirements:**
1. Be specific and descriptive (not generic like "Financial Report")
2. Include key financial metrics or insights (e.g., net worth, savings rate, debt levels)
3. Reflect the user's life stage and financial situation
4. Be 5-15 words long
5. Use professional but engaging language
6. Make it unique to this specific financial snapshot
7. Consider the report type (summary, detailed, custom)

**Examples of good titles:**
- "Strong Financial Foundation: $125K Net Worth with 18% Savings Rate"
- "Debt Reduction Progress: 40% Debt-to-Income Improvement"
- "Retirement Planning Analysis: $500K Portfolio Growth Strategy"
- "Young Professional's Financial Health: Building Emergency Fund"
- "Pre-Retirement Wealth Assessment: $1.2M Portfolio Review"

**Custom Analysis Focus:** ${
      customPrompt ? customPrompt : "General financial health assessment"
    }

Generate ONLY the title text, nothing else. No quotes, no additional text, just the title.`;

    return basePrompt;
  }

  private cleanAndValidateTitle(text: string, financialData: any): string {
    try {
      // Remove quotes, extra whitespace, and common prefixes
      let title = text
        .replace(/^["']|["']$/g, "") // Remove surrounding quotes
        .replace(/^Title:\s*/i, "") // Remove "Title:" prefix
        .replace(/^Report Title:\s*/i, "") // Remove "Report Title:" prefix
        .trim();

      // Ensure it's not too long or too short
      if (title.length > 100) {
        title = title.substring(0, 97) + "...";
      }

      if (title.length < 10) {
        // Fallback if title is too short
        return this.generateFallbackTitle(financialData, "summary");
      }

      // Ensure it starts with a capital letter
      title = title.charAt(0).toUpperCase() + title.slice(1);

      return title;
    } catch (error) {
      console.error(`[AI_SERVICE] Error cleaning title`, {
        originalText: text,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
      return this.generateFallbackTitle(financialData, "summary");
    }
  }

  private calculateFinancialHealthScore(data: {
    savingsRate: number;
    debtToIncomeRatio: number;
    netWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    goals: any;
    budgets: any;
  }): number {
    let score = 0;
    const maxScore = 100;

    // Savings Rate Component (25 points max)
    if (data.savingsRate >= 20) {
      score += 25; // Excellent savings rate
    } else if (data.savingsRate >= 15) {
      score += 20; // Very good savings rate
    } else if (data.savingsRate >= 10) {
      score += 15; // Good savings rate
    } else if (data.savingsRate >= 5) {
      score += 10; // Fair savings rate
    } else if (data.savingsRate > 0) {
      score += 5; // Poor but positive savings rate
    } else {
      score += 0; // No savings or negative
    }

    // Debt-to-Income Ratio Component (25 points max)
    if (data.debtToIncomeRatio <= 20) {
      score += 25; // Excellent debt management
    } else if (data.debtToIncomeRatio <= 30) {
      score += 20; // Very good debt management
    } else if (data.debtToIncomeRatio <= 40) {
      score += 15; // Good debt management
    } else if (data.debtToIncomeRatio <= 50) {
      score += 10; // Fair debt management
    } else if (data.debtToIncomeRatio <= 60) {
      score += 5; // Poor debt management
    } else {
      score += 0; // Very poor debt management
    }

    // Net Worth Component (20 points max)
    if (data.netWorth > 0) {
      if (data.netWorth >= data.monthlyIncome * 12) {
        score += 20; // Net worth >= annual income
      } else if (data.netWorth >= data.monthlyIncome * 6) {
        score += 15; // Net worth >= 6 months income
      } else if (data.netWorth >= data.monthlyIncome * 3) {
        score += 10; // Net worth >= 3 months income
      } else {
        score += 5; // Positive but low net worth
      }
    } else {
      score += 0; // Negative net worth
    }

    // Asset-Liability Balance Component (15 points max)
    if (data.totalAssets > 0 && data.totalLiabilities > 0) {
      const assetLiabilityRatio = data.totalAssets / data.totalLiabilities;
      if (assetLiabilityRatio >= 3) {
        score += 15; // Excellent asset-liability ratio
      } else if (assetLiabilityRatio >= 2) {
        score += 12; // Very good ratio
      } else if (assetLiabilityRatio >= 1.5) {
        score += 9; // Good ratio
      } else if (assetLiabilityRatio >= 1) {
        score += 6; // Fair ratio
      } else {
        score += 3; // Poor ratio
      }
    } else if (data.totalAssets > 0 && data.totalLiabilities === 0) {
      score += 15; // No liabilities, only assets
    } else {
      score += 0; // No assets or only liabilities
    }

    // Goal Progress Component (10 points max)
    if (data.goals && data.goals.total > 0) {
      const goalProgress = data.goals.averageProgress || 0;
      if (goalProgress >= 80) {
        score += 10; // Excellent goal progress
      } else if (goalProgress >= 60) {
        score += 8; // Very good progress
      } else if (goalProgress >= 40) {
        score += 6; // Good progress
      } else if (goalProgress >= 20) {
        score += 4; // Fair progress
      } else {
        score += 2; // Poor progress
      }
    } else {
      score += 5; // No goals set, neutral score
    }

    // Budget Management Component (5 points max)
    if (data.budgets && data.budgets.total > 0) {
      const budgetUtilization = data.budgets.averageUtilization || 0;
      if (budgetUtilization <= 80) {
        score += 5; // Excellent budget management
      } else if (budgetUtilization <= 90) {
        score += 4; // Very good budget management
      } else if (budgetUtilization <= 100) {
        score += 3; // Good budget management
      } else if (budgetUtilization <= 110) {
        score += 2; // Fair budget management
      } else {
        score += 1; // Poor budget management
      }
    } else {
      score += 2; // No budgets set, neutral score
    }

    // Ensure score is within bounds
    return Math.max(0, Math.min(maxScore, Math.round(score)));
  }

  private generateFallbackTitle(
    financialData: any,
    reportType: string
  ): string {
    const netWorth = financialData.netWorth || 0;
    const savingsRate = financialData.savingsRate || 0;
    const totalAssets = financialData.totalAssets || 0;
    const totalLiabilities = financialData.totalLiabilities || 0;

    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Generate descriptive title based on financial situation
    if (netWorth > 0 && savingsRate > 15) {
      return `Strong Financial Position: $${Math.round(
        netWorth / 1000
      )}K Net Worth - ${date}`;
    } else if (netWorth > 0 && savingsRate > 5) {
      return `Financial Health Review: $${Math.round(
        netWorth / 1000
      )}K Net Worth - ${date}`;
    } else if (totalLiabilities > totalAssets) {
      return `Debt Management Analysis: Building Financial Foundation - ${date}`;
    } else if (savingsRate < 5) {
      return `Financial Planning Assessment: Improving Savings Rate - ${date}`;
    } else {
      return `Financial Report: ${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Analysis - ${date}`;
    }
  }
}

export const aiService = new AIService();
