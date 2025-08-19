import { Account, Category } from "@/lib/types";

export const sampleAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "checking",
    balance: 5000,
    currency: "AUD",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 15000,
    currency: "AUD",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: -2500,
    currency: "AUD",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Investment Portfolio",
    type: "investment",
    balance: 50000,
    currency: "AUD",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Food & Dining",
    icon: "🍽️",
  },
  {
    id: "2",
    name: "Transportation",
    icon: "🚗",
  },
  {
    id: "3",
    name: "Shopping",
    icon: "🛍️",
  },
  {
    id: "4",
    name: "Entertainment",
    icon: "🎬",
  },
  {
    id: "5",
    name: "Healthcare",
    icon: "🏥",
  },
  {
    id: "6",
    name: "Utilities",
    icon: "💡",
  },
  {
    id: "7",
    name: "Housing",
    icon: "🏠",
  },
  {
    id: "8",
    name: "Income",
    icon: "💰",
  },
  {
    id: "9",
    name: "Transfer",
    icon: "↔️",
  },
];
