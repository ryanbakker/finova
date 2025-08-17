export type Account = {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment" | "cash";
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: Category;
  account: Account;
  payee: string;
  status?: "pending" | "completed" | "incomplete";
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  icon: React.ReactNode;
  status?: "paid" | "unpaid" | "overdue";
  account?: Account;
  notes?: string;
  frequency?: "monthly" | "quarterly" | "yearly" | "weekly";
};

export type Asset = {
  id: string;
  name: string;
  category: string;
  value: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  purchaseDate?: string;
  currentValue?: number;
  changeAmount?: number;
  changePercentage?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Liability = {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  dueDate?: string;
  interestRate?: number;
  monthlyPayment?: number;
  remainingBalance?: number;
  originalAmount?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FinancialGoal = {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused";
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  currency: string;
  period: "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
