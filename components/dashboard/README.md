# Dashboard Components

This folder contains the new dashboard components for the Finova financial dashboard. These components are designed to provide a comprehensive overview of the user's financial health.

## Components

### 1. NetWorthSummary

- **Purpose**: Displays the user's net worth with a large number, percentage change, and trend line chart
- **Features**:
  - Large net worth display with percentage change indicator
  - Assets vs. liabilities breakdown
  - 12-month trend line chart using Tremor UI
- **Usage**: `<NetWorthSummary />`

### 2. IncomeVsExpense

- **Purpose**: Shows monthly income vs. expenses with visual breakdown
- **Features**:
  - Summary cards for total income, expenses, and net income
  - Bar chart comparing income sources and expense categories
  - Color-coded indicators (green for income, red for expenses)
- **Usage**: `<IncomeVsExpense />`

### 3. BudgetSnapshot

- **Purpose**: Displays top budget categories with progress tracking
- **Features**:
  - Progress bars for each budget category
  - Color-coded status indicators (green, yellow, red)
  - Remaining budget calculations
  - Overall budget summary
- **Usage**: `<BudgetSnapshot />`

### 4. UpcomingBills

- **Purpose**: Lists upcoming bills and subscriptions with due dates
- **Features**:
  - Sorted by urgency (due date)
  - Color-coded urgency badges
  - Category icons for easy identification
  - Total due amount summary
- **Usage**: `<UpcomingBills />`

### 5. FinancialGoals

- **Purpose**: Tracks progress towards financial goals
- **Features**:
  - Progress bars for each goal
  - Priority level indicators
  - Target date tracking
  - Overall progress summary
- **Usage**: `<FinancialGoals />`

## Integration

To add these components to your dashboard page, import them and place them in the desired layout:

```tsx
import {
  NetWorthSummary,
  IncomeVsExpense,
  BudgetSnapshot,
  UpcomingBills,
  FinancialGoals
} from "@/components/dashboard";

// In your dashboard layout:
<NetWorthSummary />
<IncomeVsExpense />
<BudgetSnapshot />
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
  <UpcomingBills />
  <FinancialGoals />
</div>
```

## Layout Recommendations

- **NetWorthSummary**: Full width (col-span-4)
- **IncomeVsExpense**: Full width (col-span-4)
- **BudgetSnapshot**: Full width (col-span-4)
- **UpcomingBills**: Left side (col-span-3)
- **FinancialGoals**: Right side (col-span-4)

## Data Structure

All components include example data that can be replaced with real data from your backend. The data structures are defined in TypeScript interfaces within each component.

## Dependencies

- **Tremor UI**: For charts and graphs
- **Lucide React**: For icons
- **Shadcn/ui**: For base UI components (Card, Progress, Badge, etc.)

## Styling

Components use Tailwind CSS classes and follow the existing design system. Color schemes are consistent with the Finova brand (sky blue primary, semantic colors for status indicators).
