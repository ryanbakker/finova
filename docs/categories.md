# Financial Categories System

This document explains how to use the global financial categories system in the Finova application.

## Overview

The financial categories system provides a centralized way to categorize different types of financial data across the application. Categories are hardcoded and cannot be modified by users, ensuring consistency and data integrity.

## Category Types

The system includes seven main category types:

1. **Income** - For categorizing money received
2. **Expenses** - For categorizing money spent
3. **Bills** - For categorizing recurring bills and payments
4. **Assets** - For categorizing owned items of value
5. **Liabilities** - For categorizing debts and obligations
6. **Goals** - For categorizing financial goals
7. **Budgets** - For categorizing budget allocations

## Basic Usage

### Importing Categories

```typescript
import {
  financialCategories,
  getCategoriesByType,
  findCategoryByName,
} from "@/constants";
```

### Getting Categories by Type

```typescript
// Get all expense categories
const expenseCategories = getCategoriesByType("expenses");

// Get all income categories
const incomeCategories = getCategoriesByType("income");
```

### Finding a Specific Category

```typescript
// Find a specific category by name
const category = findCategoryByName("expenses", "Food & Dining");
if (category) {
  console.log(category.name); // "Food & Dining"
  console.log(category.icon); // "Utensils"
}
```

## Working with Icons

Since categories store icon names as strings, you need to resolve them to actual icon components when rendering.

### Using the Utility Functions

```typescript
import {
  getIconComponent,
  getCategoryWithIcon,
} from "@/lib/utils/categoryUtils";

// Get icon component directly
const IconComponent = getIconComponent("Home");

// Get category with resolved icon
const categoryWithIcon = getCategoryWithIcon("expenses", "Food & Dining");
if (categoryWithIcon) {
  const IconComponent = categoryWithIcon.iconComponent;
  // Use IconComponent in your JSX
}
```

### Manual Icon Resolution

```typescript
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName: string) => {
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
};

// In your component
const category = findCategoryByName("expenses", "Food & Dining");
if (category) {
  const IconComponent = getIconComponent(category.icon);
  return <IconComponent className="w-5 h-5" />;
}
```

## Component Examples

### Category Selector

```typescript
import React from "react";
import { getCategoriesByType } from "@/constants";
import { getIconComponent } from "@/lib/utils/categoryUtils";

export const CategorySelector: React.FC<{
  type: "income" | "expenses";
  onCategoryChange: (category: string) => void;
  selectedCategory?: string;
}> = ({ type, onCategoryChange, selectedCategory }) => {
  const categories = getCategoriesByType(type);

  return (
    <select
      value={selectedCategory || ""}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.name} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
```

### Category Display with Icons

```typescript
import React from "react";
import { findCategoryByName } from "@/constants";
import { getIconComponent } from "@/lib/utils/categoryUtils";

export const CategoryDisplay: React.FC<{
  type: "income" | "expenses";
  categoryName: string;
}> = ({ type, categoryName }) => {
  const category = findCategoryByName(type, categoryName);

  if (!category) return <span>Unknown Category</span>;

  const IconComponent = getIconComponent(category.icon);

  return (
    <div className="flex items-center space-x-2">
      <IconComponent className="w-4 h-4" />
      <span>{category.name}</span>
    </div>
  );
};
```

### Category Filter

```typescript
import React from "react";
import { getCategoriesByType } from "@/constants";
import { getIconComponent } from "@/lib/utils/categoryUtils";

export const CategoryFilter: React.FC<{
  type: "income" | "expenses";
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}> = ({ type, selectedCategories, onCategoryToggle }) => {
  const categories = getCategoriesByType(type);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon);
        const isSelected = selectedCategories.includes(category.name);

        return (
          <button
            key={category.name}
            onClick={() => onCategoryToggle(category.name)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${
              isSelected
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};
```

## Advanced Utilities

The `categoryUtils.ts` file provides additional helper functions:

### Search Categories

```typescript
import { searchCategories } from "@/lib/utils/categoryUtils";

// Search for categories containing "food"
const foodCategories = searchCategories("expenses", "food");
// Returns: ["Food & Dining"]
```

### Get Common Categories

```typescript
import { getCommonCategories } from "@/lib/utils/categoryUtils";

// Get first 6 categories for quick selection
const commonExpenses = getCommonCategories("expenses");
```

### Validate Categories

```typescript
import { isValidCategory } from "@/lib/utils/categoryUtils";

// Check if a category exists
const isValid = isValidCategory("expenses", "Food & Dining"); // true
const isInvalid = isValidCategory("expenses", "Invalid Category"); // false
```

## Category Structure

Each category has the following structure:

```typescript
interface FinancialCategory {
  name: string; // Human-readable category name
  icon: string; // Icon name (e.g., "Home", "DollarSign")
}
```

## Best Practices

1. **Always validate categories** before using them in forms or displays
2. **Use the utility functions** for icon resolution rather than manual imports
3. **Cache icon components** if you're rendering many categories in a list
4. **Provide fallback icons** for unknown category types
5. **Use consistent naming** when referencing categories in your code

## Adding New Categories

To add new categories, edit the `constants/index.ts` file:

```typescript
// Add to the appropriate category type
expenses: [
  // ... existing categories
  { name: "New Category", icon: "IconName" },
],
```

**Note**: Make sure the icon name exists in the Lucide React icon library.

## Performance Considerations

- Categories are loaded once when the constants file is imported
- Icon resolution happens on-demand when components render
- Consider memoizing icon components if you're rendering many categories
- The system is designed to be lightweight and efficient

## Type Safety

The system includes full TypeScript support:

```typescript
import { CategoryType, FinancialCategory } from "@/lib/types/categories";

// Type-safe category type
const categoryType: CategoryType = "expenses";

// Type-safe category object
const category: FinancialCategory = {
  name: "Food & Dining",
  icon: "Utensils",
};
```
