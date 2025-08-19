# Goals CRUD Functionality

This document describes the implementation of CRUD (Create, Read, Update, Delete) operations for financial goals in the Finova application.

## Overview

The goals system allows users to create, view, edit, and delete their financial goals with proper user authentication and data isolation. Each user can only access their own goals, ensuring data security.

## Features

### ✅ User Authentication

- Goals are tied to authenticated users via Clerk authentication
- Users can only access, modify, or delete their own goals
- Defensive coding prevents unauthorized access

### ✅ MongoDB Integration

- Goals are stored in MongoDB with proper indexing
- Automatic timestamps (createdAt, updatedAt)
- Efficient queries with compound indexes

### ✅ CRUD Operations

- **Create**: Add new financial goals with validation
- **Read**: View goals with filtering and sorting
- **Update**: Edit existing goals with real-time validation
- **Delete**: Remove goals with confirmation

### ✅ Data Validation

- Required field validation
- Business logic validation (e.g., current amount ≤ target amount)
- Form error handling and user feedback

### ✅ User Experience

- Toast notifications for success/error feedback
- Loading states and skeleton components
- Responsive design for mobile and desktop
- Real-time data updates

## Database Schema

```typescript
interface Goal {
  _id: ObjectId; // MongoDB ObjectId
  userId: string; // Clerk user ID
  name: string; // Goal name
  category: string; // Goal category
  targetAmount: number; // Target amount
  currentAmount: number; // Current progress
  currency: string; // Currency (AUD, USD, etc.)
  targetDate: Date; // Target completion date
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused";
  notes?: string; // Optional notes
  isActive: boolean; // Soft delete flag
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-updated
}
```

## API Endpoints

### Goal Actions (Server Actions)

- `createGoal(goalData)` - Create a new goal
- `getGoalsByUserId(userId)` - Get all goals for a user
- `getGoalById(goalId, userId)` - Get a specific goal
- `updateGoal(goalId, userId, updates)` - Update a goal
- `deleteGoal(goalId, userId)` - Delete a goal
- `deactivateGoal(goalId, userId)` - Soft delete a goal
- `getGoalStats(userId)` - Get goal statistics

## Security Features

### 🔒 User Isolation

- All queries include `userId` filter
- Goals are validated to belong to the requesting user
- No cross-user data access possible

### 🔒 Input Validation

- Server-side validation for all inputs
- Type checking and sanitization
- Business logic validation

### 🔒 Error Handling

- Graceful error handling with user-friendly messages
- No sensitive information leaked in error messages
- Proper logging for debugging

## Components

### Core Components

- `GoalsPage` - Main goals page with data table
- `EditGoalDialog` - Create/edit goal form
- `DataTable` - Goals data table with actions
- `GoalDetailsDialog` - View goal details
- `DeleteGoalDialog` - Confirm goal deletion

### UI Components

- `Toast` - User feedback notifications
- `GoalFilters` - Filter and search goals
- `GoalTableSkeleton` - Loading states

## Usage Examples

### Creating a Goal

```typescript
const newGoal = await createGoal({
  userId: user.id,
  name: "Emergency Fund",
  category: "Emergency Fund",
  targetAmount: 10000,
  currentAmount: 2500,
  currency: "AUD",
  targetDate: "2024-12-31",
  priority: "high",
  status: "active",
  notes: "Save for unexpected expenses",
  isActive: true,
});
```

### Updating a Goal

```typescript
const updatedGoal = await updateGoal(goalId, userId, {
  currentAmount: 5000,
  status: "active",
});
```

### Deleting a Goal

```typescript
await deleteGoal(goalId, userId);
```

## Performance Optimizations

### Database Indexes

- `userId` - Primary user lookup
- `userId + isActive` - Active goals query
- `userId + status` - Status filtering
- `userId + priority` - Priority sorting

### Client-Side Optimizations

- React Query for data caching
- Optimistic updates for better UX
- Debounced search and filtering
- Virtual scrolling for large datasets

## Error Handling

### Common Error Scenarios

- User not authenticated
- Goal not found or access denied
- Validation errors
- Database connection issues
- Network timeouts

### Error Recovery

- Automatic retry for transient errors
- User-friendly error messages
- Fallback to cached data when possible
- Graceful degradation of features

## Testing

### Unit Tests

- Goal model validation
- Action function testing
- Component rendering tests
- Form validation tests

### Integration Tests

- End-to-end CRUD operations
- User authentication flows
- Database operations
- API endpoint testing

## Future Enhancements

### Planned Features

- Goal progress tracking
- Milestone achievements
- Goal sharing and collaboration
- Advanced analytics and reporting
- Goal templates and suggestions

### Technical Improvements

- Real-time updates with WebSockets
- Offline support with service workers
- Advanced caching strategies
- Performance monitoring and optimization

## Troubleshooting

### Common Issues

1. **Goals not loading**: Check user authentication and database connection
2. **Permission errors**: Verify user ID matches goal ownership
3. **Validation errors**: Check required fields and business rules
4. **Performance issues**: Review database indexes and query optimization

### Debug Information

- Check browser console for client-side errors
- Review server logs for backend issues
- Verify MongoDB connection and indexes
- Test with different user accounts

## Dependencies

### Required Packages

- `@clerk/nextjs` - User authentication
- `mongoose` - MongoDB ODM
- `@radix-ui/react-toast` - Toast notifications
- `@tanstack/react-table` - Data table functionality

### Environment Variables

- `MONGODB_URL` - MongoDB connection string
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key

## Contributing

When contributing to the goals functionality:

1. Follow the existing code patterns
2. Add proper error handling
3. Include user authentication checks
4. Write comprehensive tests
5. Update this documentation
6. Follow security best practices

## Support

For issues or questions about the goals functionality:

1. Check this documentation
2. Review the code comments
3. Check the issue tracker
4. Contact the development team
