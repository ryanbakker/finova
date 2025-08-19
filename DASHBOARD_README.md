# Dashboard System Documentation

## Overview

The dashboard has been completely refactored to pull, calculate, and display real user data instead of hardcoded sample data. It now serves as a comprehensive financial overview that aggregates data from all other pages in the application.

## Architecture

### 1. Dashboard Service (`lib/services/dashboard.service.ts`)

The core service that fetches and calculates all dashboard metrics:

- **Data Sources**: Fetches data from all major entities (transactions, assets, budgets, bills, goals, liabilities)
- **Real-time Calculations**: Calculates current month metrics, net worth, budget progress, etc.
- **Error Handling**: Gracefully handles missing data with fallback values
- **Performance**: Uses Promise.all for parallel data fetching

### 2. Dashboard Components

All dashboard components have been updated to accept real data as props:

- **MetricCard**: Displays current month income, expenses, savings, and net income
- **NetWorthSummary**: Shows net worth, total assets, and total liabilities with trend chart
- **IncomeVsSpendingChart**: Displays monthly spending trends using real transaction data
- **BudgetSnapshot**: Shows budget progress for each category
- **FinancialGoals**: Displays active financial goals with progress bars
- **CategoryBreakdownChart**: Shows spending breakdown by category
- **FinancialAssets**: Lists user assets (placeholder for now)

### 3. Data Flow

```
User Dashboard → Dashboard Service → Action Functions → Database Models
     ↓
Real-time Metrics, Charts, and Lists
```

## Key Features

### Real-time Metrics

- **Current Month**: Income, expenses, savings, net income
- **Net Worth**: Total assets minus total liabilities
- **Budget Progress**: Real-time tracking of budget vs. actual spending
- **Financial Goals**: Progress tracking for savings goals

### Dynamic Charts

- **Income vs Spending**: Monthly trends based on actual transaction data
- **Category Breakdown**: Current month spending by category
- **Net Worth Trend**: Historical net worth progression

### Smart Lists

- **Recent Transactions**: Last 5 financial activities
- **Upcoming Bills**: Bills due in next 30 days
- **Budget Alerts**: Categories approaching or exceeding budget limits

## Data Sources

### Transactions

- Fetches user transactions for current month calculations
- Calculates income vs. expenses
- Provides recent activity feed
- Generates category breakdown data

### Assets & Liabilities

- Calculates net worth
- Provides asset allocation overview
- Tracks debt obligations

### Budgets

- Real-time budget progress tracking
- Spending vs. budgeted amounts
- Budget alerts and warnings

### Bills

- Upcoming payment reminders
- Due date tracking
- Payment amount information

### Financial Goals

- Progress tracking
- Target vs. current amounts
- Priority-based sorting

## Error Handling

The dashboard gracefully handles:

- Missing or empty data
- Database connection issues
- Authentication failures
- Partial data availability

All components fall back to empty states or default values when data is unavailable.

## Performance Optimizations

1. **Parallel Data Fetching**: Uses Promise.all for concurrent API calls
2. **Lazy Loading**: Components only render when data is available
3. **Efficient Calculations**: Processes data once and distributes to components
4. **Smart Caching**: Leverages Next.js revalidation for fresh data

## Usage

### For Users

The dashboard automatically loads when users visit the home page. It displays:

- Current financial status
- Recent activity
- Upcoming obligations
- Progress toward goals

### For Developers

To add new metrics or data sources:

1. **Update Dashboard Service**: Add new data fetching and calculations
2. **Update Interfaces**: Extend DashboardData interface
3. **Update Components**: Pass new data as props
4. **Add Error Handling**: Ensure graceful fallbacks

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Customizable Widgets**: User-configurable dashboard layout
- **Advanced Analytics**: AI-powered financial insights
- **Export Functionality**: PDF/CSV report generation
- **Mobile Optimization**: Responsive design improvements

## Testing

The dashboard service includes comprehensive tests:

- Data fetching validation
- Calculation accuracy
- Error handling scenarios
- Empty data fallbacks

Run tests with: `pnpm test`

## Security

- **User Isolation**: Users can only see their own data
- **Authentication Required**: All dashboard data requires valid user session
- **Data Validation**: Input sanitization and type checking
- **Rate Limiting**: Prevents abuse of dashboard endpoints
