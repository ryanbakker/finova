import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface FinancialData {
  transactions: any[];
  assets: any[];
  liabilities: any[];
  budgets: any[];
  goals: any[];
  bills: any[];
  netWorth: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyData: any[];
}

export interface ReportGenerationOptions {
  type: "financial_summary";
  customPrompt?: string;
  dataRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async generateFinancialReport(
    financialData: FinancialData,
    options: ReportGenerationOptions
  ): Promise<{
    title: string;
    content: string;
    insights: {
      keyFindings: string[];
      recommendations: string[];
      riskFactors: string[];
    };
    tokensUsed: number;
  }> {
    try {
      const prompt = this.buildPrompt(financialData, options);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response to extract structured data
      const parsedResponse = this.parseGeminiResponse(text);

      return {
        title: parsedResponse.title,
        content: parsedResponse.content,
        insights: parsedResponse.insights,
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      };
    } catch (error) {
      console.error("Error generating report with Gemini:", error);
      throw new Error("Failed to generate financial report");
    }
  }

  private buildPrompt(
    data: FinancialData,
    options: ReportGenerationOptions
  ): string {
    const basePrompt = `You are a professional financial advisor AI. Generate a comprehensive financial overview report that provides a complete analysis of the user's financial situation. This should be a professional, detailed report suitable for financial planning and decision-making.

FINANCIAL DATA:
- Net Worth: $${data.netWorth.toLocaleString()}
- Total Income: $${data.totalIncome.toLocaleString()}
- Total Expenses: $${data.totalExpenses.toLocaleString()}
- Number of Transactions: ${data.transactions.length}
- Number of Assets: ${data.assets.length}
- Number of Liabilities: ${data.liabilities.length}
- Number of Goals: ${data.goals.length}
- Number of Bills: ${data.bills.length}

RECENT TRANSACTIONS (last 10):
${data.transactions
  .slice(0, 10)
  .map(
    (t) =>
      `- ${t.date}: ${t.type} $${t.amount} - ${t.description} (${t.category.name})`
  )
  .join("\n")}

ASSETS:
${data.assets
  .map((a) => `- ${a.name}: $${a.currentValue.toLocaleString()} (${a.type})`)
  .join("\n")}

LIABILITIES:
${data.liabilities
  .map((l) => `- ${l.name}: $${l.currentAmount.toLocaleString()} (${l.type})`)
  .join("\n")}

GOALS:
${data.goals
  .map(
    (g) =>
      `- ${
        g.name
      }: $${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()} (${
        g.status
      })`
  )
  .join("\n")}

UPCOMING BILLS:
${data.bills
  .map((b) => `- ${b.name}: $${b.amount.toLocaleString()} due ${b.dueDate}`)
  .join("\n")}

Please generate a comprehensive financial overview report with the following structure:

TITLE: [A descriptive title for the report]

CONTENT: [Main report content with detailed analysis]

KEY FINDINGS:
- [Finding 1]
- [Finding 2]
- [Finding 3]

RECOMMENDATIONS:
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

RISK FACTORS:
- [Risk 1]
- [Risk 2]
- [Risk 3]

The report should be:
- Professional and comprehensive
- Include detailed analysis of all financial aspects
- Provide actionable insights and recommendations
- Focus on financial health, spending patterns, goal progress, and risk assessment
- Be suitable for both personal financial planning and professional consultation
- Include specific recommendations for improvement and growth`;

    return basePrompt;
  }

  private parseGeminiResponse(text: string): {
    title: string;
    content: string;
    insights: {
      keyFindings: string[];
      recommendations: string[];
      riskFactors: string[];
    };
  } {
    // Extract title
    const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|$)/i);
    const title = titleMatch ? titleMatch[1].trim() : "Financial Report";

    // Extract content
    const contentMatch = text.match(
      /CONTENT:\s*([\s\S]*?)(?=KEY FINDINGS:|$)/i
    );
    const content = contentMatch ? contentMatch[1].trim() : text;

    // Extract key findings
    const findingsMatch = text.match(
      /KEY FINDINGS:\s*([\s\S]*?)(?=RECOMMENDATIONS:|$)/i
    );
    const keyFindings = findingsMatch
      ? findingsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.trim().substring(1).trim())
      : [];

    // Extract recommendations
    const recommendationsMatch = text.match(
      /RECOMMENDATIONS:\s*([\s\S]*?)(?=RISK FACTORS:|$)/i
    );
    const recommendations = recommendationsMatch
      ? recommendationsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.trim().substring(1).trim())
      : [];

    // Extract risk factors
    const riskFactorsMatch = text.match(/RISK FACTORS:\s*([\s\S]*?)$/i);
    const riskFactors = riskFactorsMatch
      ? riskFactorsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.trim().substring(1).trim())
      : [];

    return {
      title,
      content,
      insights: {
        keyFindings,
        recommendations,
        riskFactors,
      },
    };
  }
}

export const geminiService = new GeminiService();
