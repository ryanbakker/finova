import { getCategoriesByType } from "@/constants";
import {
  Home,
  Zap,
  Droplets,
  Wifi,
  Smartphone,
  Tv,
  Shield,
  CreditCard,
  Banknote,
  Building2,
  Trash2,
  FileText,
  Car,
  Heart,
  Gamepad2,
  ShoppingBag,
  GraduationCap,
  Plane,
  HeartHandshake,
  Minus,
  Plus,
  DollarSign,
  Briefcase,
  TrendingUp,
  Building2 as Building2Icon,
  PiggyBank,
  Coins,
  BarChart3,
  Gift,
  ArrowLeft,
  Utensils,
  Scissors,
  Gem,
  Star,
  Palette,
  Target,
  Flag,
} from "lucide-react";

// Icon mapping for bill categories
const billCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Rent/Mortgage": Home,
  Electricity: Zap,
  Water: Droplets,
  Gas: Zap,
  Internet: Wifi,
  Phone: Smartphone,
  "Cable TV": Tv,
  Insurance: Shield,
  "Credit Card": CreditCard,
  "Loan Payment": Banknote,
  "Property Tax": Building2,
  "HOA Fees": Building2Icon,
  Garbage: Trash2,
  "Other Bills": FileText,
};

// Icon mapping for expense categories
const expenseCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Housing: Home,
  Utilities: Zap,
  Healthcare: Heart,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Education: GraduationCap,
  Travel: Plane,
  Insurance: Shield,
  Taxes: FileText,
  Subscriptions: CreditCard,
  "Personal Care": Scissors,
  Pets: Heart,
  Gifts: Gift,
  Charity: HeartHandshake,
  "Other Expenses": Minus,
};

// Icon mapping for income categories
const incomeCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Salary: DollarSign,
  Freelance: Briefcase,
  "Investment Returns": TrendingUp,
  "Business Income": Building2Icon,
  "Rental Income": Home,
  Interest: PiggyBank,
  Dividends: Coins,
  "Capital Gains": BarChart3,
  Gifts: Gift,
  Refunds: ArrowLeft,
  "Other Income": Plus,
};

// Icon mapping for asset categories
const assetCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Cash: DollarSign,
  "Checking Account": CreditCard,
  "Savings Account": PiggyBank,
  "Investment Account": TrendingUp,
  "Retirement Account": Target,
  "Real Estate": Home,
  Vehicle: Car,
  Jewelry: Gem,
  Collectibles: Star,
  Business: Building2Icon,
  Cryptocurrency: Coins,
  "Precious Metals": Gem,
  Art: Palette,
  "Other Assets": Plus,
};

// Icon mapping for liability categories
const liabilityCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Credit Card Debt": CreditCard,
  "Student Loan": GraduationCap,
  "Car Loan": Car,
  Mortgage: Home,
  "Personal Loan": Banknote,
  "Business Loan": Building2Icon,
  "Medical Debt": Heart,
  "Tax Debt": FileText,
  "Other Debt": Minus,
};

// Icon mapping for goal categories
const goalCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Emergency Fund": Shield,
  Retirement: Target,
  "Home Purchase": Home,
  "Vehicle Purchase": Car,
  Education: GraduationCap,
  Travel: Plane,
  Wedding: Heart,
  "Business Startup": Building2Icon,
  "Investment Portfolio": TrendingUp,
  "Debt Payoff": CreditCard,
  "Other Goals": Flag,
};

// Icon mapping for budget categories
const budgetCategoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Housing: Home,
  Transportation: Car,
  Food: Utensils,
  Utilities: Zap,
  Healthcare: Heart,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Education: GraduationCap,
  Insurance: Shield,
  Savings: PiggyBank,
  "Debt Payment": CreditCard,
  Other: Plus,
};

// Get icon for a specific category and type
export const getCategoryIcon = (
  type: keyof typeof import("@/constants").financialCategories,
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  const iconMappings: Record<
    string,
    Record<string, React.ComponentType<{ className?: string }>>
  > = {
    bills: billCategoryIcons,
    expenses: expenseCategoryIcons,
    income: incomeCategoryIcons,
    assets: assetCategoryIcons,
    liabilities: liabilityCategoryIcons,
    goals: goalCategoryIcons,
    budgets: budgetCategoryIcons,
  };

  return iconMappings[type]?.[categoryName] || null;
};

// Get icon component for a bill category
export const getBillCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return billCategoryIcons[categoryName] || null;
};

// Get icon component for an expense category
export const getExpenseCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return expenseCategoryIcons[categoryName] || null;
};

// Get icon component for an income category
export const getIncomeCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return incomeCategoryIcons[categoryName] || null;
};

// Get icon component for an asset category
export const getAssetCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return assetCategoryIcons[categoryName] || null;
};

// Get icon component for a liability category
export const getLiabilityCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return liabilityCategoryIcons[categoryName] || null;
};

// Get icon component for a goal category
export const getGoalCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return goalCategoryIcons[categoryName] || null;
};

// Get icon component for a budget category
export const getBudgetCategoryIcon = (
  categoryName: string
): React.ComponentType<{ className?: string }> | null => {
  return budgetCategoryIcons[categoryName] || null;
};

// Get all categories with their icons for a specific type
export const getCategoriesWithIcons = (
  type: keyof typeof import("@/constants").financialCategories
) => {
  const categories = getCategoriesByType(type);
  return categories.map((category) => ({
    ...category,
    iconComponent: getCategoryIcon(type, category.name),
  }));
};

// Validate if a category exists for a specific type
export const isValidCategory = (
  type: keyof typeof import("@/constants").financialCategories,
  categoryName: string
): boolean => {
  const categories = getCategoriesByType(type);
  return categories.some((cat) => cat.name === categoryName);
};

// Get default icon for unknown categories
export const getDefaultIcon = (): React.ComponentType<{
  className?: string;
}> => {
  return FileText;
};
