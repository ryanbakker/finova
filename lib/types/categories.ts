// Base category interface
export interface FinancialCategory {
  name: string;
  icon: string;
}

// Category types for different financial data
export type IncomeCategory = FinancialCategory;
export type ExpenseCategory = FinancialCategory;
export type BillCategory = FinancialCategory;
export type AssetCategory = FinancialCategory;
export type LiabilityCategory = FinancialCategory;
export type GoalCategory = FinancialCategory;
export type BudgetCategory = FinancialCategory;

// Union type for all category types
export type AnyFinancialCategory =
  | IncomeCategory
  | ExpenseCategory
  | BillCategory
  | AssetCategory
  | LiabilityCategory
  | GoalCategory
  | BudgetCategory;

// Category type names
export type CategoryType =
  | "income"
  | "expenses"
  | "bills"
  | "assets"
  | "liabilities"
  | "goals"
  | "budgets";

// Helper type for the financial categories object
export interface FinancialCategories {
  income: IncomeCategory[];
  expenses: ExpenseCategory[];
  bills: BillCategory[];
  assets: AssetCategory[];
  liabilities: LiabilityCategory[];
  goals: GoalCategory[];
  budgets: BudgetCategory[];
}
