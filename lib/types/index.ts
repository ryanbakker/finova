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
  userId: string;
  date: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    budget?: number;
  };
  description: string;
  merchant?: string;
  accountId: string;
  accountName: string;
  isRecurring: boolean;
  recurringId?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Bill = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  category: {
    name: string;
    icon: string;
  };
  isRecurring: boolean;
  icon?: React.ReactNode;
  status: "paid" | "unpaid" | "overdue";
  accountId?: string;
  accountName?: string;
  notes?: string;
  frequency?: "monthly" | "quarterly" | "yearly" | "weekly";
  createdAt: string;
  updatedAt: string;
};

export type ValueHistoryEntry = {
  id: string;
  userId: string;
  itemId: string;
  itemType: "ASSET" | "LIABILITY";
  value: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

export type AssetValueHistoryEntry = {
  value: number;
  createdAt: string;
};

export type LiabilityAmountHistoryEntry = {
  amount: number;
  createdAt: string;
};

export type MonthlyNetWorthSummary = {
  id: string;
  userId: string;
  year: number;
  month: number;
  averageNetWorth: number;
  averageAssets: number;
  averageLiabilities: number;
  monthName: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  changeAmount: number;
  changePercentage: number;
  description?: string;
  institution?: string;
  currency?: string;
  isActive?: boolean;
  value?: number;
  purchaseDate?: string;
  accountNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Liability = {
  id: string;
  userId: string;
  name: string;
  category: {
    name: string;
    icon: string;
  };
  currentValue: number;
  changeAmount: number;
  changePercentage: number;
  description?: string;
  institution?: string;
  currentAmount?: number;
  amount?: number;
  currency?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FinancialGoal = {
  id?: string;
  _id?: string;
  userId: string;
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
  id?: string;
  _id?: string;
  category: {
    name: string;
    icon: string;
  };
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
