# Liabilities CRUD Documentation

This document describes the complete CRUD (Create, Read, Update, Delete) functionality for liabilities in the Finova application.

## Overview

The liability management system provides a secure, user-authenticated way to manage financial liabilities including loans, credit cards, mortgages, and other debt obligations. All operations are protected by user authentication and ensure users can only access their own data.

## Database Model

### Liability Schema (`database/models/liability.model.ts`)

The liability model includes the following fields:

- **userId** (required): Clerk user ID for authentication
- **name** (required): Liability name (e.g., "Chase Credit Card")
- **category** (required): Liability category (e.g., "Credit Card", "Mortgage")
- **amount** (required): Total liability amount
- **currency** (required): Currency code (defaults to USD)
- **institution** (optional): Financial institution name
- **accountNumber** (optional): Account identifier
- **dueDate** (optional): Payment due date
- **interestRate** (optional): Annual interest rate percentage
- **monthlyPayment** (optional): Monthly payment amount
- **remainingBalance** (optional): Current outstanding balance
- **originalAmount** (optional): Original loan amount
- **notes** (optional): Additional notes
- **isActive** (required): Whether the liability is active
- **createdAt/updatedAt**: Timestamps

### Features

- **User Isolation**: Each liability is tied to a specific user ID
- **Data Validation**: Comprehensive input validation with meaningful error messages
- **Indexing**: Optimized database queries with compound indexes
- **Virtual Fields**: Calculated fields for total interest paid and progress percentage
- **Pre-save Hooks**: Automatic setting of default values

## API Endpoints

### Base URL: `/api/liabilities`

#### GET `/api/liabilities`
Retrieves all liabilities for the authenticated user.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `category`: Filter by category
- `isActive`: Filter by active status
- `search`: Text search across name, institution, and notes

**Response:**
```json
{
  "liabilities": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalCount": 100,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST `/api/liabilities`
Creates a new liability for the authenticated user.

**Request Body:**
```json
{
  "name": "Chase Credit Card",
  "category": "Credit Card",
  "amount": 5000,
  "currency": "USD",
  "institution": "Chase Bank",
  "interestRate": 18.99,
  "monthlyPayment": 150
}
```

**Response:** Created liability object (201 status)

### Individual Liability Operations

#### GET `/api/liabilities/[id]`
Retrieves a specific liability by ID (user must own the liability).

#### PUT `/api/liabilities/[id]`
Updates a specific liability (user must own the liability).

#### DELETE `/api/liabilities/[id]`
Deletes a specific liability (user must own the liability).

## Server Actions

### `lib/actions/liability.actions.ts`

Server-side functions for liability management:

- **`createLiability(params)`**: Creates a new liability
- **`getLiabilitiesByUserId()`**: Retrieves all user liabilities
- **`getLiabilityById(id)`**: Retrieves a specific liability
- **`updateLiability(id, updates)`**: Updates a liability
- **`deleteLiability(id)`**: Deletes a liability
- **`getLiabilityStats()`**: Retrieves aggregated statistics
- **`searchLiabilities(query, filters)`**: Advanced search with filters

### Security Features

- **Authentication Required**: All operations require valid Clerk authentication
- **User Isolation**: Users can only access their own liabilities
- **Input Validation**: Comprehensive validation of all inputs
- **SQL Injection Protection**: Uses Mongoose ODM for safe queries
- **Rate Limiting**: Built-in protection against abuse

## Frontend Components

### Main Page (`app/(dashboard)/liabilities/page.tsx`)

- **Real-time Data**: Loads liabilities from database on mount
- **Error Handling**: Toast notifications for success/error states
- **Data Refresh**: Automatic refresh after CRUD operations

### Create Dialog (`components/liabilities/CreateLiabilityDialog.tsx`)

- **Form Validation**: Client-side validation with error display
- **Category Selection**: Predefined liability categories
- **Currency Support**: Multiple currency options
- **Responsive Design**: Mobile-friendly form layout

### Edit Dialog (`components/liabilities/EditLiabilityDialog.tsx`)

- **Pre-populated Fields**: Loads existing liability data
- **Update Validation**: Ensures data integrity
- **Real-time Updates**: Immediate database updates

### Delete Dialog (`components/liabilities/DeleteLiabilityDialog.tsx`)

- **Confirmation Required**: Prevents accidental deletions
- **Data Verification**: Shows liability details before deletion
- **Soft Delete Support**: Ready for future soft delete implementation

### Data Table (`app/(dashboard)/liabilities/data-table.tsx`)

- **Sorting & Filtering**: Advanced data manipulation
- **Pagination**: Efficient handling of large datasets
- **Mobile Responsive**: Optimized for all screen sizes
- **Action Handlers**: Integrated CRUD operations

## Usage Examples

### Creating a Liability

```typescript
import { createLiability } from "@/lib/actions/liability.actions";

const newLiability = await createLiability({
  name: "Car Loan",
  category: "Car Loan",
  amount: 25000,
  currency: "USD",
  institution: "Local Bank",
  interestRate: 4.5,
  monthlyPayment: 450
});
```

### Updating a Liability

```typescript
import { updateLiability } from "@/lib/actions/liability.actions";

const updated = await updateLiability(liabilityId, {
  remainingBalance: 20000,
  notes: "Updated payment information"
});
```

### Deleting a Liability

```typescript
import { deleteLiability } from "@/lib/actions/liability.actions";

await deleteLiability(liabilityId);
```

## Error Handling

The system provides comprehensive error handling:

- **Validation Errors**: Detailed field-specific error messages
- **Authentication Errors**: Clear unauthorized access messages
- **Database Errors**: Graceful handling of connection issues
- **User Feedback**: Toast notifications for all operations

## Testing

A test script is available at `database/test-data/test-liabilities.ts` to verify:

- Database connectivity
- CRUD operations
- Data validation
- User isolation

Run with: `npx tsx database/test-data/test-liabilities.ts`

## Security Considerations

1. **User Authentication**: All endpoints require valid Clerk authentication
2. **Data Isolation**: Users can only access their own liabilities
3. **Input Sanitization**: All inputs are validated and sanitized
4. **Rate Limiting**: Built-in protection against abuse
5. **Audit Trail**: All operations are timestamped

## Performance Features

1. **Database Indexing**: Optimized queries with compound indexes
2. **Pagination**: Efficient handling of large datasets
3. **Caching**: Database connection pooling
4. **Lazy Loading**: Components load data only when needed

## Future Enhancements

- **Soft Deletes**: Preserve deleted liabilities for audit purposes
- **Bulk Operations**: Support for multiple liability updates
- **Payment Tracking**: Integration with transaction system
- **Reminder System**: Due date notifications
- **Export Functionality**: Data export in various formats
