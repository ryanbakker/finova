import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardData } from "./dashboard.service";

// Mock the auth function
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => ({ userId: "test-user-id" })),
}));

// Mock the database connection
vi.mock("@/database/db", () => ({
  connectToDB: vi.fn(() => Promise.resolve()),
}));

// Mock the database models
const mockTransaction = {
  find: vi.fn(),
  sort: vi.fn(),
  lean: vi.fn(),
};

const mockAsset = {
  find: vi.fn(),
  lean: vi.fn(),
};

const mockBudget = {
  find: vi.fn(),
  lean: vi.fn(),
};

const mockBill = {
  find: vi.fn(),
  sort: vi.fn(),
  lean: vi.fn(),
};

const mockGoal = {
  find: vi.fn(),
  lean: vi.fn(),
};

const mockLiability = {
  find: vi.fn(),
  lean: vi.fn(),
};

// Mock the model imports
vi.mock("@/database/models/transaction.model", () => ({
  Transaction: mockTransaction,
}));

vi.mock("@/database/models/asset.model", () => ({
  Asset: mockAsset,
}));

vi.mock("@/database/models/budget.model", () => ({
  Budget: mockBudget,
}));

vi.mock("@/database/models/bill.model", () => ({
  Bill: mockBill,
}));

vi.mock("@/database/models/goal.model", () => ({
  default: mockGoal,
}));

vi.mock("@/database/models/liability.model", () => ({
  default: mockLiability,
}));

describe("Dashboard Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Mock transactions with current month data
    mockTransaction.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            _id: "1",
            date: new Date(currentYear, currentMonth, 15).toISOString(),
            amount: 100,
            type: "income",
            description: "Salary",
            category: { name: "Salary" },
          },
          {
            _id: "2",
            date: new Date(currentYear, currentMonth, 20).toISOString(),
            amount: 50,
            type: "expense",
            description: "Groceries",
            category: { name: "Food" },
          },
        ]),
      }),
    });

    // Mock assets with current values
    mockAsset.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          currentValue: 1000,
          value: 1000,
          valueHistory: [
            {
              value: 1000,
              createdAt: new Date(currentYear, currentMonth - 1, 1),
            },
            { value: 1000, createdAt: new Date(currentYear, currentMonth, 1) },
          ],
        },
      ]),
    });

    // Mock budgets
    mockBudget.find.mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([
          { category: "Food", amount: 200, spent: 50, isActive: true },
        ]),
    });

    // Mock bills
    mockBill.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi
          .fn()
          .mockResolvedValue([
            {
              name: "Rent",
              dueDate: new Date(Date.now() + 86400000),
              amount: 1000,
            },
          ]),
      }),
    });

    // Mock goals
    mockGoal.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          name: "Emergency Fund",
          targetAmount: 10000,
          currentAmount: 5000,
          status: "active",
          priority: "high",
          targetDate: "2024-12-31",
        },
      ]),
    });

    // Mock liabilities
    mockLiability.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          amount: 500,
          currentAmount: 500,
          amountHistory: [
            {
              amount: 500,
              createdAt: new Date(currentYear, currentMonth - 1, 1),
            },
            { amount: 500, createdAt: new Date(currentYear, currentMonth, 1) },
          ],
        },
      ]),
    });
  });

  it("should fetch and calculate dashboard data correctly", async () => {
    const result = await getDashboardData();

    expect(result).toBeDefined();
    expect(result.metrics).toBeDefined();
    expect(result.metrics.totalIncome).toBeGreaterThanOrEqual(0);
    expect(result.metrics.totalExpenses).toBeGreaterThanOrEqual(0);
    expect(result.metrics.netWorth).toBeDefined();
    expect(result.recentTransactions).toBeDefined();
    expect(result.upcomingBills).toBeDefined();
    expect(result.budgetProgress).toBeDefined();
    expect(result.financialGoals).toBeDefined();
    expect(result.categoryBreakdown).toBeDefined();
    expect(result.netWorthHistory).toBeDefined();
  });

  it("should handle empty data gracefully", async () => {
    // Mock empty responses
    mockTransaction.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    });
    mockAsset.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    });
    mockBudget.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    });
    mockBill.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    });
    mockGoal.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    });
    mockLiability.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    });

    const result = await getDashboardData();

    expect(result.metrics.totalIncome).toBe(0);
    expect(result.metrics.totalExpenses).toBe(0);
    expect(result.metrics.netWorth).toBe(0);
    expect(result.recentTransactions).toHaveLength(0);
    expect(result.upcomingBills).toHaveLength(0);
    expect(result.netWorthHistory).toHaveLength(0);
  });

  it("should not include future dates in net worth history", async () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 86400000); // Tomorrow

    // Mock assets with future date in history
    mockAsset.find.mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          currentValue: 1000,
          value: 1000,
          valueHistory: [
            { value: 1000, createdAt: currentDate },
            { value: 1100, createdAt: futureDate }, // Future date
          ],
        },
      ]),
    });

    const result = await getDashboardData();

    // Check that no future dates are included in net worth history
    result.netWorthHistory.forEach((entry) => {
      const entryDate = new Date(entry.month);
      expect(entryDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());
    });
  });

  it("should calculate net worth correctly from assets and liabilities", async () => {
    const result = await getDashboardData();

    // Assets: 1000, Liabilities: 500, Net Worth should be 500
    expect(result.metrics.totalAssets).toBe(1000);
    expect(result.metrics.totalLiabilities).toBe(500);
    expect(result.metrics.netWorth).toBe(500);
  });
});
