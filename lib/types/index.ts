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
