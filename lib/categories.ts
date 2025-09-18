import {
  // Income icons
  DollarSign,
  Briefcase,
  TrendingUp,
  Building2,
  Home,
  PiggyBank,
  Coins,
  BarChart3,
  Gift,
  ArrowLeft,
  Plus,

  // Expense icons
  Utensils,
  Car,
  Zap,
  Heart,
  Gamepad2,
  ShoppingBag,
  GraduationCap,
  Plane,
  Shield,
  FileText,
  CreditCard,
  Scissors,
  HeartHandshake,
  Minus,

  // Bill icons
  Droplets,
  Wifi,
  Smartphone,
  Tv,
  Banknote,
  Trash2,

  // Asset icons
  Target,
  Gem,
  Star,
  Palette,

  // Liability icons

  // Goal icons
  Flag,
} from "lucide-react";

// Base category interface
export interface Category {
  name: string;
  icon: string;
  color?: string;
}

// Category type definitions
export type CategoryType =
  | "income"
  | "expenses"
  | "bills"
  | "assets"
  | "liabilities"
  | "goals"
  | "budgets";

// Centralized categories with Lucide icons
export const CATEGORIES = {
  income: [
    { name: "Salary", icon: "DollarSign" },
    { name: "Freelance", icon: "Briefcase" },
    { name: "Investment Returns", icon: "TrendingUp" },
    { name: "Business Income", icon: "Building2" },
    { name: "Rental Income", icon: "Home" },
    { name: "Interest", icon: "PiggyBank" },
    { name: "Dividends", icon: "Coins" },
    { name: "Capital Gains", icon: "BarChart3" },
    { name: "Gifts", icon: "Gift" },
    { name: "Refunds", icon: "ArrowLeft" },
    { name: "Other Income", icon: "Plus" },
  ],

  expenses: [
    { name: "Food & Dining", icon: "Utensils" },
    { name: "Transportation", icon: "Car" },
    { name: "Housing", icon: "Home" },
    { name: "Utilities", icon: "Zap" },
    { name: "Healthcare", icon: "Heart" },
    { name: "Entertainment", icon: "Gamepad2" },
    { name: "Shopping", icon: "ShoppingBag" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Travel", icon: "Plane" },
    { name: "Insurance", icon: "Shield" },
    { name: "Taxes", icon: "FileText" },
    { name: "Subscriptions", icon: "CreditCard" },
    { name: "Personal Care", icon: "Scissors" },
    { name: "Pets", icon: "Heart" },
    { name: "Gifts", icon: "Gift" },
    { name: "Charity", icon: "HeartHandshake" },
    { name: "Other Expenses", icon: "Minus" },
  ],

  bills: [
    { name: "Rent/Mortgage", icon: "Home" },
    { name: "Electricity", icon: "Zap" },
    { name: "Water", icon: "Droplets" },
    { name: "Gas", icon: "Zap" },
    { name: "Internet", icon: "Wifi" },
    { name: "Phone", icon: "Smartphone" },
    { name: "Cable TV", icon: "Tv" },
    { name: "Insurance", icon: "Shield" },
    { name: "Credit Card", icon: "CreditCard" },
    { name: "Loan Payment", icon: "Banknote" },
    { name: "Property Tax", icon: "Building2" },
    { name: "HOA Fees", icon: "Building2" },
    { name: "Garbage", icon: "Trash2" },
    { name: "Other Bills", icon: "FileText" },
  ],

  assets: [
    { name: "Cash", icon: "DollarSign" },
    { name: "Checking Account", icon: "CreditCard" },
    { name: "Savings Account", icon: "PiggyBank" },
    { name: "Investment Account", icon: "TrendingUp" },
    { name: "Retirement Account", icon: "Target" },
    { name: "Real Estate", icon: "Home" },
    { name: "Vehicle", icon: "Car" },
    { name: "Jewelry", icon: "Gem" },
    { name: "Collectibles", icon: "Star" },
    { name: "Business", icon: "Building2" },
    { name: "Cryptocurrency", icon: "Coins" },
    { name: "Precious Metals", icon: "Gem" },
    { name: "Art", icon: "Palette" },
    { name: "Other Assets", icon: "Plus" },
  ],

  liabilities: [
    { name: "Credit Card Debt", icon: "CreditCard" },
    { name: "Student Loan", icon: "GraduationCap" },
    { name: "Car Loan", icon: "Car" },
    { name: "Mortgage", icon: "Home" },
    { name: "Personal Loan", icon: "Banknote" },
    { name: "Business Loan", icon: "Building2" },
    { name: "Medical Debt", icon: "Heart" },
    { name: "Tax Debt", icon: "FileText" },
    { name: "Other Debt", icon: "Minus" },
  ],

  goals: [
    { name: "Emergency Fund", icon: "Shield" },
    { name: "Retirement", icon: "Target" },
    { name: "Home Purchase", icon: "Home" },
    { name: "Vehicle Purchase", icon: "Car" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Travel", icon: "Plane" },
    { name: "Wedding", icon: "Heart" },
    { name: "Business Startup", icon: "Building2" },
    { name: "Investment Portfolio", icon: "TrendingUp" },
    { name: "Debt Payoff", icon: "CreditCard" },
    { name: "Other Goals", icon: "Flag" },
  ],

  budgets: [
    { name: "Housing", icon: "Home" },
    { name: "Transportation", icon: "Car" },
    { name: "Food", icon: "Utensils" },
    { name: "Utilities", icon: "Zap" },
    { name: "Healthcare", icon: "Heart" },
    { name: "Entertainment", icon: "Gamepad2" },
    { name: "Shopping", icon: "ShoppingBag" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Insurance", icon: "Shield" },
    { name: "Savings", icon: "PiggyBank" },
    { name: "Debt Payment", icon: "CreditCard" },
    { name: "Other", icon: "Plus" },
  ],
} as const;

// Icon mapping object for easy lookup
export const CATEGORY_ICONS = {
  // Income icons
  DollarSign,
  Briefcase,
  TrendingUp,
  Building2,
  Home,
  PiggyBank,
  Coins,
  BarChart3,
  Gift,
  ArrowLeft,
  Plus,

  // Expense icons
  Utensils,
  Car,
  Zap,
  Heart,
  Gamepad2,
  ShoppingBag,
  GraduationCap,
  Plane,
  Shield,
  FileText,
  CreditCard,
  Scissors,
  HeartHandshake,
  Minus,

  // Bill icons
  Droplets,
  Wifi,
  Smartphone,
  Tv,
  Banknote,
  Trash2,

  // Asset icons
  Target,
  Gem,
  Star,
  Palette,

  // Goal icons
  Flag,
} as const;

// Helper functions
export const getCategoriesByType = (type: CategoryType): Category[] => {
  return (CATEGORIES[type] || []) as unknown as Category[];
};

export const getCategoryIcon = (iconName: string) => {
  return CATEGORY_ICONS[iconName as keyof typeof CATEGORY_ICONS] || FileText;
};

export const getCategoryByName = (
  type: CategoryType,
  name: string
): Category | undefined => {
  return getCategoriesByType(type).find((category) => category.name === name);
};

export const isValidCategory = (type: CategoryType, name: string): boolean => {
  return getCategoriesByType(type).some((category) => category.name === name);
};

// Get all category names for a specific type
export const getCategoryNamesByType = (type: CategoryType): string[] => {
  return getCategoriesByType(type).map((category) => category.name);
};

// Get categories with their icon components
export const getCategoriesWithIcons = (type: CategoryType) => {
  return getCategoriesByType(type).map((category) => ({
    ...category,
    iconComponent: getCategoryIcon(category.icon),
  }));
};
