import { Transaction, Account, Category } from "../../lib/types";

// Sample accounts
export const sampleAccounts: Account[] = [
  {
    id: "acc-001",
    name: "Chase Checking",
    type: "checking",
    balance: 3247.89,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "acc-002",
    name: "Chase Savings",
    type: "savings",
    balance: 15420.5,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "acc-003",
    name: "Chase Credit Card",
    type: "credit",
    balance: -1247.32,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "acc-004",
    name: "Vanguard 401k",
    type: "investment",
    balance: 45678.9,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
];

// Sample categories
export const sampleCategories: Category[] = [
  { id: "cat-001", name: "Food & Dining", icon: "🍽️" },
  { id: "cat-002", name: "Transportation", icon: "🚗" },
  { id: "cat-003", name: "Shopping", icon: "🛍️" },
  { id: "cat-004", name: "Entertainment", icon: "🎬" },
  { id: "cat-005", name: "Healthcare", icon: "🏥" },
  { id: "cat-006", name: "Utilities", icon: "💡" },
  { id: "cat-007", name: "Housing", icon: "🏠" },
  { id: "cat-008", name: "Income", icon: "💰" },
  { id: "cat-009", name: "Investment", icon: "📈" },
  { id: "cat-010", name: "Education", icon: "📚" },
  { id: "cat-011", name: "Travel", icon: "✈️" },
  { id: "cat-012", name: "Insurance", icon: "🛡️" },
];

// Sample transactions for the last 3 months
export const sampleTransactions: Transaction[] = [
  // December 2024
  {
    id: "txn-001",
    date: "2024-12-15T10:30:00Z",
    amount: -45.67,
    category: sampleCategories[0], // Food & Dining
    account: sampleAccounts[0], // Chase Checking
    payee: "Starbucks",
    status: "completed",
  },
  {
    id: "txn-002",
    date: "2024-12-14T14:20:00Z",
    amount: -89.99,
    category: sampleCategories[2], // Shopping
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Amazon",
    status: "completed",
  },
  {
    id: "txn-003",
    date: "2024-12-13T08:15:00Z",
    amount: -35.0,
    category: sampleCategories[1], // Transportation
    account: sampleAccounts[0], // Chase Checking
    payee: "Shell Gas Station",
    status: "completed",
  },
  {
    id: "txn-004",
    date: "2024-12-12T19:00:00Z",
    amount: -125.0,
    category: sampleCategories[3], // Entertainment
    account: sampleAccounts[2], // Chase Credit Card
    payee: "AMC Theaters",
    status: "completed",
  },
  {
    id: "txn-005",
    date: "2024-12-10T09:00:00Z",
    amount: 4500.0,
    category: sampleCategories[7], // Income
    account: sampleAccounts[0], // Chase Checking
    payee: "TechCorp Inc",
    status: "completed",
  },
  {
    id: "txn-006",
    date: "2024-12-08T16:30:00Z",
    amount: -67.89,
    category: sampleCategories[0], // Food & Dining
    account: sampleAccounts[0], // Chase Checking
    payee: "Whole Foods Market",
    status: "completed",
  },
  {
    id: "txn-007",
    date: "2024-12-05T12:00:00Z",
    amount: -89.99,
    category: sampleCategories[2], // Shopping
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Target",
    status: "completed",
  },
  {
    id: "txn-008",
    date: "2024-12-03T07:30:00Z",
    amount: -1200.0,
    category: sampleCategories[6], // Housing
    account: sampleAccounts[0], // Chase Checking
    payee: "Rent Payment",
    status: "completed",
  },

  // November 2024
  {
    id: "txn-009",
    date: "2024-11-28T11:45:00Z",
    amount: -55.0,
    category: sampleCategories[0], // Food & Dining
    account: sampleAccounts[0], // Chase Checking
    payee: "Chipotle",
    status: "completed",
  },
  {
    id: "txn-010",
    date: "2024-11-25T15:20:00Z",
    amount: -200.0,
    category: sampleCategories[2], // Shopping
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Best Buy",
    status: "completed",
  },
  {
    id: "txn-011",
    date: "2024-11-22T08:00:00Z",
    amount: -45.0,
    category: sampleCategories[1], // Transportation
    account: sampleAccounts[0], // Chase Checking
    payee: "Uber",
    status: "completed",
  },
  {
    id: "txn-012",
    date: "2024-11-20T10:00:00Z",
    amount: 4500.0,
    category: sampleCategories[7], // Income
    account: sampleAccounts[0], // Chase Checking
    payee: "TechCorp Inc",
    status: "completed",
  },
  {
    id: "txn-013",
    date: "2024-11-18T14:30:00Z",
    amount: -89.99,
    category: sampleCategories[2], // Shopping
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Nike",
    status: "completed",
  },
  {
    id: "txn-014",
    date: "2024-11-15T19:00:00Z",
    amount: -75.0,
    category: sampleCategories[3], // Entertainment
    account: sampleAccounts[0], // Chase Checking
    payee: "Netflix",
    status: "completed",
  },
  {
    id: "txn-015",
    date: "2024-11-10T09:00:00Z",
    amount: -1200.0,
    category: sampleCategories[6], // Housing
    account: sampleAccounts[0], // Chase Checking
    payee: "Rent Payment",
    status: "completed",
  },
  {
    id: "txn-016",
    date: "2024-11-05T16:00:00Z",
    amount: -150.0,
    category: sampleCategories[5], // Utilities
    account: sampleAccounts[0], // Chase Checking
    payee: "Electric Company",
    status: "completed",
  },

  // October 2024
  {
    id: "txn-017",
    date: "2024-10-30T12:15:00Z",
    amount: -65.0,
    category: sampleCategories[0], // Food & Dining
    account: sampleAccounts[0], // Chase Checking
    payee: "Olive Garden",
    status: "completed",
  },
  {
    id: "txn-018",
    date: "2024-10-27T13:45:00Z",
    amount: -300.0,
    category: sampleCategories[2], // Shopping
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Apple Store",
    status: "completed",
  },
  {
    id: "txn-019",
    date: "2024-10-25T07:00:00Z",
    amount: -40.0,
    category: sampleCategories[1], // Transportation
    account: sampleAccounts[0], // Chase Checking
    payee: "Lyft",
    status: "completed",
  },
  {
    id: "txn-020",
    date: "2024-10-22T10:00:00Z",
    amount: 4500.0,
    category: sampleCategories[7], // Income
    account: sampleAccounts[0], // Chase Checking
    payee: "TechCorp Inc",
    status: "completed",
  },
  {
    id: "txn-021",
    date: "2024-10-20T15:30:00Z",
    amount: -120.0,
    category: sampleCategories[4], // Healthcare
    account: sampleAccounts[0], // Chase Checking
    payee: "CVS Pharmacy",
    status: "completed",
  },
  {
    id: "txn-022",
    date: "2024-10-18T19:00:00Z",
    amount: -95.0,
    category: sampleCategories[3], // Entertainment
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Spotify",
    status: "completed",
  },
  {
    id: "txn-023",
    date: "2024-10-15T09:00:00Z",
    amount: -1200.0,
    category: sampleCategories[6], // Housing
    account: sampleAccounts[0], // Chase Checking
    payee: "Rent Payment",
    status: "completed",
  },
  {
    id: "txn-024",
    date: "2024-10-10T14:00:00Z",
    amount: -250.0,
    category: sampleCategories[11], // Insurance
    account: sampleAccounts[0], // Chase Checking
    payee: "Geico Insurance",
    status: "completed",
  },
  {
    id: "txn-025",
    date: "2024-10-05T11:30:00Z",
    amount: -500.0,
    category: sampleCategories[8], // Investment
    account: sampleAccounts[0], // Chase Checking
    payee: "Vanguard",
    status: "completed",
  },
  {
    id: "txn-026",
    date: "2024-10-01T08:00:00Z",
    amount: -180.0,
    category: sampleCategories[10], // Travel
    account: sampleAccounts[2], // Chase Credit Card
    payee: "Airbnb",
    status: "completed",
  },
];

// Helper function to get transactions by date range
export const getTransactionsByDateRange = (
  startDate: string,
  endDate: string
): Transaction[] => {
  return sampleTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactionDate >= start && transactionDate <= end;
  });
};

// Helper function to get transactions by category
export const getTransactionsByCategory = (
  categoryId: string
): Transaction[] => {
  return sampleTransactions.filter(
    (transaction) => transaction.category.id === categoryId
  );
};

// Helper function to get transactions by account
export const getTransactionsByAccount = (accountId: string): Transaction[] => {
  return sampleTransactions.filter(
    (transaction) => transaction.account.id === accountId
  );
};

// Helper function to get total spending by category
export const getTotalSpendingByCategory = (): Record<string, number> => {
  const totals: Record<string, number> = {};

  sampleTransactions.forEach((transaction) => {
    if (transaction.amount < 0) {
      // Only count expenses
      const categoryName = transaction.category.name;
      totals[categoryName] =
        (totals[categoryName] || 0) + Math.abs(transaction.amount);
    }
  });

  return totals;
};

// Helper function to get monthly spending totals
export const getMonthlySpendingTotals = (): Record<string, number> => {
  const totals: Record<string, number> = {};

  sampleTransactions.forEach((transaction) => {
    if (transaction.amount < 0) {
      // Only count expenses
      const month = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM format
      totals[month] = (totals[month] || 0) + Math.abs(transaction.amount);
    }
  });

  return totals;
};
