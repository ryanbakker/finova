import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardData } from "./dashboard.service";

// Mock the auth function
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => ({ userId: "test-user-id" })),
}));

// Mock the action functions
vi.mock("../actions/transaction.actions", () => ({
  getUserTransactions: vi.fn(() =>
    Promise.resolve([
      {
        _id: "1",
        date: new Date().toISOString(),
        amount: 100,
        type: "income",
        description: "Salary",
        category: { name: "Salary" },
      },
      {
        _id: "2",
        date: new Date().toISOString(),
        amount: 50,
        type: "expense",
        description: "Groceries",
        category: { name: "Food" },
      },
    ])
  ),
  getTransactionStats: vi.fn(() =>
    Promise.resolve({
      totalIncome: 100,
      totalExpenses: 50,
      totalTransactions: 2,
      averageAmount: 75,
    })
  ),
}));

vi.mock("../actions/asset.actions", () => ({
  getUserAssets: vi.fn(() =>
    Promise.resolve([{ currentValue: 1000, value: 1000 }])
  ),
}));

vi.mock("../actions/budget.actions", () => ({
  getUserBudgets: vi.fn(() =>
    Promise.resolve([
      { category: "Food", amount: 200, spent: 50, isActive: true },
    ])
  ),
}));

vi.mock("../actions/bill.actions", () => ({
  getUserBills: vi.fn(() =>
    Promise.resolve([
      { name: "Rent", dueDate: new Date(Date.now() + 86400000), amount: 1000 },
    ])
  ),
}));

vi.mock("../actions/goal.actions", () => ({
  getGoalsByUserId: vi.fn(() =>
    Promise.resolve([
      {
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 5000,
        status: "active",
        priority: "high",
        targetDate: "2024-12-31",
      },
    ])
  ),
}));

vi.mock("../actions/liability.actions", () => ({
  getLiabilitiesByUserId: vi.fn(() => Promise.resolve([{ amount: 500 }])),
}));

describe("Dashboard Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it("should handle empty data gracefully", async () => {
    // Mock empty responses
    vi.mocked(
      require("../actions/transaction.actions").getUserTransactions
    ).mockResolvedValue([]);
    vi.mocked(
      require("../actions/asset.actions").getUserAssets
    ).mockResolvedValue([]);
    vi.mocked(
      require("../actions/budget.actions").getUserBudgets
    ).mockResolvedValue([]);
    vi.mocked(
      require("../actions/bill.actions").getUserBills
    ).mockResolvedValue([]);
    vi.mocked(
      require("../actions/goal.actions").getGoalsByUserId
    ).mockResolvedValue([]);
    vi.mocked(
      require("../actions/liability.actions").getLiabilitiesByUserId
    ).mockResolvedValue([]);

    const result = await getDashboardData();

    expect(result.metrics.totalIncome).toBe(0);
    expect(result.metrics.totalExpenses).toBe(0);
    expect(result.metrics.netWorth).toBe(0);
    expect(result.recentTransactions).toHaveLength(0);
    expect(result.upcomingBills).toHaveLength(0);
  });
});
