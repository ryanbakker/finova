# Budget CRUD Functionality

This document describes the implementation of CRUD (Create, Read, Update, Delete) operations for budgets in the Finova application.

## Overview

The budget system allows users to:
- Create budgets for different spending categories
- Set spending limits and time periods
- Track actual spending against budgets
- Automatically sync with transactions
- View budget insights and analytics

## Features

### User Authentication & Security
- **Defensive Coding**: All budget operations require user authentication
- **Data Isolation**: Users can only access their own budgets
- **Input Validation**: Comprehensive validation for all budget data
- **Conflict Prevention**: Prevents overlapping budgets for the same category and time period

### Budget Management
- **Flexible Periods**: Monthly, quarterly, or yearly budgets
- **Category-based**: Organized by spending categories
- **Date Ranges**: Start and end dates for budget periods
- **Active/Inactive**: Toggle budget status

### Automatic Syncing
- **Transaction Integration**: Budgets automatically update when transactions are added/modified/deleted
- **Real-time Updates**: Spending amounts stay current with actual transactions
- **Cross-page Updates**: Changes reflect immediately across all pages

## Database Schema

### Budget Model (`database/models/budget.model.ts`)
```typescript
interface IBudget {
  userId: string;           // Clerk user ID
  category: string;         // Budget category (e.g., "Food", "Transportation")
  amount: number;           // Budget limit
  spent: number;            // Current spending amount
  currency: string;         // Currency code (default: "USD")
  period: "monthly" | "quarterly" | "yearly";
  startDate: Date;          // Budget start date
  endDate: Date;            // Budget end date
  isActive: boolean;        // Budget status
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes for Performance
- `userId` + `category` + `period` (compound)
- `userId` + `startDate` + `endDate` (date range queries)
- `userId` + `isActive` (active budgets)

## API Endpoints

### Budgets Collection
- `GET /api/budgets` - Get all user budgets
- `POST /api/budgets` - Create new budget

### Individual Budget
- `GET /api/budgets/[id]` - Get specific budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### Budget Statistics
- `GET /api/budgets/stats` - Get budget analytics

## Server Actions

### Core Operations
- `createBudget()` - Create new budget with validation
- `getUserBudgets()` - Fetch all user budgets
- `getBudgetById()` - Get specific budget by ID
- `updateBudget()` - Update existing budget
- `deleteBudget()` - Delete budget
- `getBudgetStats()` - Get aggregated statistics

### Utility Functions
- `getBudgetsByPeriod()` - Filter budgets by time period
- `updateBudgetSpent()` - Manually update spending amount

## Transaction Integration

### Automatic Budget Updates
When transactions are created, updated, or deleted:

1. **Create Transaction**: Adds expense amount to relevant budget
2. **Update Transaction**: Recalculates budget impact (subtracts old, adds new)
3. **Delete Transaction**: Removes expense amount from budget

### Budget Matching Logic
- Matches by user ID and category
- Only affects active budgets
- Considers date ranges (budget must be active for transaction date)

## Frontend Components

### Main Page (`app/(dashboard)/budgeting/page.tsx`)
- **Real-time Data**: Loads budgets from database on mount
- **Statistics Display**: Shows budget totals and insights
- **CRUD Operations**: Create, edit, delete budgets
- **Error Handling**: Toast notifications for success/error states

### Budget Dialog (`components/budgeting/BudgetDialog.tsx`)
- **Form Validation**: Ensures required fields are filled
- **Date Handling**: Converts string dates to Date objects
- **Category Selection**: Dropdown with predefined categories
- **Error Display**: Shows validation errors to user

### Budget Table (`components/budgeting/BudgetTable.tsx`)
- **Progress Visualization**: Visual progress bars for budget status
- **Status Indicators**: Color-coded badges (On Track, Warning, Over Budget)
- **Action Buttons**: Edit and delete operations
- **Responsive Design**: Works on all device sizes

## Usage Examples

### Creating a Budget
```typescript
const newBudget = await createBudget({
  category: "Food & Dining",
  amount: 500,
  currency: "USD",
  period: "monthly",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
  isActive: true
});
```

### Updating Budget Spent Amount
```typescript
const updatedBudget = await updateBudgetSpent(
  budgetId,
  newSpentAmount
);
```

### Getting Budget Statistics
```typescript
const stats = await getBudgetStats();
// Returns: { totalBudgets, totalBudgetAmount, totalSpent, overBudgetCount, etc. }
```

## Error Handling

### Validation Errors
- **Duplicate Budgets**: Prevents overlapping budgets for same category/period
- **Invalid Dates**: Ensures start date is before end date
- **Missing Fields**: Required fields must be provided

### Authentication Errors
- **Unauthorized Access**: User must be logged in
- **Data Isolation**: Users can only access their own budgets
- **Invalid IDs**: Budget must exist and belong to user

### Database Errors
- **Connection Issues**: Handles MongoDB connection failures
- **Query Errors**: Graceful handling of database operation failures
- **Data Corruption**: Validation of data integrity

## Security Features

### User Authentication
- **Clerk Integration**: Uses Clerk for user authentication
- **Session Management**: Secure session handling
- **Token Validation**: Validates authentication tokens

### Data Protection
- **User Isolation**: MongoDB queries include userId filter
- **Input Sanitization**: All user inputs are validated
- **SQL Injection Prevention**: Uses Mongoose ODM for safety

### Access Control
- **Ownership Verification**: Users can only modify their own data
- **Permission Checks**: Validates user permissions before operations
- **Audit Trail**: Tracks creation and modification timestamps

## Performance Optimizations

### Database Indexes
- **Compound Indexes**: Optimized for common query patterns
- **Date Range Queries**: Efficient date-based filtering
- **User-specific Queries**: Fast user data retrieval

### Caching Strategy
- **Path Revalidation**: Next.js cache invalidation for real-time updates
- **Optimistic Updates**: UI updates before server confirmation
- **Efficient Queries**: Lean queries for read operations

### Frontend Optimization
- **Debounced Updates**: Prevents excessive API calls
- **Lazy Loading**: Components load only when needed
- **State Management**: Efficient React state updates

## Testing

### API Testing
- **Endpoint Validation**: Test all CRUD endpoints
- **Authentication**: Verify user access controls
- **Error Handling**: Test various error scenarios

### Integration Testing
- **Transaction Sync**: Verify budget-transaction integration
- **User Isolation**: Ensure data separation between users
- **Performance**: Test with large datasets

### Frontend Testing
- **Component Rendering**: Test all budget components
- **User Interactions**: Test CRUD operations
- **Error States**: Test error handling and display

## Future Enhancements

### Planned Features
- **Budget Templates**: Predefined budget categories
- **Recurring Budgets**: Automatic budget renewal
- **Budget Sharing**: Family/team budget collaboration
- **Advanced Analytics**: Machine learning insights

### Performance Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service worker caching
- **Mobile App**: Native mobile application

## Troubleshooting

### Common Issues
1. **Budget Not Updating**: Check transaction category matches budget category
2. **Authentication Errors**: Verify user is logged in
3. **Date Conflicts**: Ensure budget dates don't overlap
4. **Performance Issues**: Check database indexes and query optimization

### Debug Information
- **Console Logs**: Detailed error logging
- **API Responses**: Check network tab for API errors
- **Database Queries**: MongoDB query logging
- **User Context**: Verify user authentication state

## Support

For issues or questions about the budget functionality:
1. Check the console logs for error messages
2. Verify user authentication status
3. Check database connection and indexes
4. Review API endpoint responses
5. Contact the development team with specific error details
