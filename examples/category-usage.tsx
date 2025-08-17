import { createElement } from "react";
import { getCategoriesByType, findCategoryByName } from "../constants";
import { CategoryType } from "../lib/types/categories";
import * as LucideIcons from "lucide-react";

// Helper function to get icon component from icon name
const getIconComponent = (iconName: string) => {
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
};

// Example 1: Using categories in a transaction form
export const TransactionCategorySelector: React.FC<{
  type: "income" | "expenses";
  onCategoryChange: (category: string) => void;
  selectedCategory?: string;
}> = ({ type, onCategoryChange, selectedCategory }) => {
  const categories = getCategoriesByType(type);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <select
        value={selectedCategory || ""}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// Example 2: Displaying categories with icons in a budget breakdown
export const BudgetCategoryBreakdown: React.FC<{
  budgetData: { category: string; amount: number; spent: number }[];
}> = ({ budgetData }) => {
  return (
    <div className="space-y-4">
      {budgetData.map((item) => {
        const category = findCategoryByName("budgets", item.category);
        const percentage = (item.spent / item.amount) * 100;

        return (
          <div key={item.category} className="flex items-center space-x-3">
            {category &&
              createElement(getIconComponent(category.icon), {
                className: "w-5 h-5 text-gray-600",
              })}
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span>{item.category}</span>
                <span>
                  ${item.spent} / ${item.amount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    percentage > 100
                      ? "bg-red-500"
                      : percentage > 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Example 3: Category filter component for transactions
export const CategoryFilter: React.FC<{
  type: CategoryType;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}> = ({ type, selectedCategories, onCategoryToggle }) => {
  const categories = getCategoriesByType(type);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Filter by Category</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryToggle(category.name)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${
              selectedCategories.includes(category.name)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            {createElement(getIconComponent(category.icon), {
              className: "w-4 h-4",
            })}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Example 4: Category statistics display
export const CategoryStats: React.FC<{
  type: CategoryType;
  data: { category: string; amount: number }[];
  title: string;
}> = ({ type, data, title }) => {
  const categories = getCategoriesByType(type);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => {
          const category = findCategoryByName(type, item.category);

          return (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {category &&
                  createElement(getIconComponent(category.icon), {
                    className: "w-5 h-5 text-gray-600",
                  })}
                <span className="font-medium">{item.category}</span>
              </div>
              <span className="text-lg font-semibold">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Example 5: Quick category selection for common transactions
export const QuickCategorySelector: React.FC<{
  onCategorySelect: (category: string) => void;
}> = ({ onCategorySelect }) => {
  const commonExpenseCategories = getCategoriesByType("expenses").slice(0, 6);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Quick Select</label>
      <div className="grid grid-cols-3 gap-2">
        {commonExpenseCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className="flex flex-col items-center space-y-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {createElement(getIconComponent(category.icon), {
              className: "w-6 h-6 text-gray-600",
            })}
            <span className="text-xs text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Example 6: Category-based goal tracking
export const GoalCategoryTracker: React.FC<{
  goals: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    category: string;
  }[];
}> = ({ goals }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const category = findCategoryByName("goals", goal.category);
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;

        return (
          <div key={goal.name} className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              {category &&
                createElement(getIconComponent(category.icon), {
                  className: "w-6 h-6 text-blue-600",
                })}
              <div>
                <h4 className="font-semibold">{goal.name}</h4>
                <p className="text-sm text-gray-600">{goal.category}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>${goal.currentAmount.toLocaleString()}</span>
                <span>${goal.targetAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Example 7: Using categories in a data table
export const CategoryDataTable: React.FC<{
  type: CategoryType;
  data: any[];
  columns: { key: string; label: string }[];
}> = ({ type, data, columns }) => {
  const categories = getCategoriesByType(type);

  const getCategoryIcon = (categoryName: string) => {
    const category = findCategoryByName(type, categoryName);
    return category
      ? createElement(getIconComponent(category.icon), {
          className: "w-4 h-4",
        })
      : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.key === "category" ? (
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(row[column.key])}
                      <span>{row[column.key]}</span>
                    </div>
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
