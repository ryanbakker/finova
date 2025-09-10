# Finova Architecture: Event Ledger Pattern for Net Worth Tracking

## Overview

This document describes the new architecture for tracking assets, liabilities, and calculating net worth using an event ledger pattern. This approach provides better scalability, performance, and data integrity compared to the previous embedded history approach.

## Architecture Changes

### 1. Data Models

#### ValueHistory Collection (Event Ledger)

- **Purpose**: Centralized ledger for all value changes across assets and liabilities
- **Structure**:
  ```typescript
  {
    userId: string;
    itemId: string; // ID of the asset or liability
    itemType: "ASSET" | "LIABILITY";
    value: number;
    timestamp: Date;
  }
  ```

#### MonthlyNetWorthSummary Collection

- **Purpose**: Pre-calculated monthly averages for efficient graph rendering
- **Structure**:
  ```typescript
  {
    userId: string;
    year: number;
    month: number; // 1-12
    averageNetWorth: number;
    averageAssets: number;
    averageLiabilities: number;
  }
  ```

#### Simplified Asset Model

- **Removed**: Embedded `valueHistory` array, complex fields
- **Kept**: Core fields with derived values
- **Structure**:
  ```typescript
  {
    userId: string;
    name: string;
    category: string;
    currentValue: number;      // Most up-to-date value
    changeAmount: number;      // Change from original
    changePercentage: number;  // Percentage change
    description?: string;
  }
  ```

#### Simplified Liability Model

- **Removed**: Embedded `amountHistory` array, complex fields
- **Kept**: Core fields with derived values
- **Structure**:
  ```typescript
  {
    userId: string;
    name: string;
    category: string;
    currentValue: number;      // Most up-to-date value
    changeAmount: number;      // Change from original
    changePercentage: number;  // Percentage change
    description?: string;
  }
  ```

### 2. Services

#### NetWorthService

- **getCurrentNetWorth()**: Get current net worth from asset/liability documents
- **getMonthlyNetWorthHistory()**: Get monthly averages from pre-calculated summaries
- **updateItemValue()**: Update value and create history entry
- **recalculateCurrentMonthAverage()**: Real-time current month recalculation
- **generateMonthlySummary()**: Batch processing for historical months

### 3. API Endpoints

#### GET /api/net-worth

- **Purpose**: Fetch net worth data and monthly history
- **Query Parameters**: `range` (6M, 1Y, 2Y)
- **Response**: Current net worth + monthly history

#### POST /api/net-worth/update-value

- **Purpose**: Update asset or liability value
- **Body**: `{ itemId, itemType, newValue, timestamp? }`
- **Response**: Success/error status

#### POST /api/migrate

- **Purpose**: Run migration or rollback
- **Body**: `{ action: "migrate" | "rollback" }`
- **Response**: Migration status

## Benefits

### 1. Scalability

- **Unbounded Growth**: No document size limits for history
- **Efficient Queries**: Indexed queries on timestamp and itemId
- **Memory Efficient**: No need to load entire history arrays

### 2. Performance

- **Fast Graph Rendering**: Pre-calculated monthly summaries
- **Optimized Queries**: Compound indexes for common query patterns
- **Reduced Data Transfer**: Only current values in main documents

### 3. Data Integrity

- **Single Source of Truth**: All history in one collection
- **Consistent Calculations**: Centralized calculation logic
- **Audit Trail**: Complete history of all changes

### 4. Flexibility

- **Easy Analysis**: Query history across all items
- **Custom Time Ranges**: Generate summaries for any period
- **Real-time Updates**: Immediate recalculation of current month

## Migration Process

### 1. Run Migration

```bash
curl -X POST /api/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "migrate"}'
```

### 2. Migration Steps

1. **Extract History**: Move embedded history to ValueHistory collection
2. **Update Models**: Convert to new simplified structure
3. **Generate Summaries**: Calculate monthly averages for all users
4. **Verify Data**: Ensure data integrity

### 3. Rollback (if needed)

```bash
curl -X POST /api/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "rollback"}'
```

## Usage Examples

### Update Asset Value

```typescript
const result = await updateItemValue(userId, {
  itemId: "asset_123",
  itemType: "ASSET",
  newValue: 15000,
  timestamp: new Date(),
});
```

### Get Monthly History

```typescript
const netWorthData = await getMonthlyNetWorthHistory(userId, 12);
// Returns: { currentNetWorth, currentAssets, currentLiabilities, monthlyHistory }
```

### Generate Historical Summary

```typescript
await generateMonthlySummary(userId, 2024, 8);
// Generates August 2024 summary
```

## Database Indexes

### ValueHistory Collection

- `{ userId: 1, itemType: 1, timestamp: -1 }`
- `{ userId: 1, itemId: 1, timestamp: -1 }`
- `{ userId: 1, timestamp: -1 }`
- `{ itemId: 1, timestamp: -1 }`

### MonthlyNetWorthSummary Collection

- `{ userId: 1, year: -1, month: -1 }`
- `{ userId: 1, createdAt: -1 }`
- `{ userId: 1, year: 1, month: 1 }` (unique)

## Future Enhancements

### 1. Scheduled Jobs

- **Monthly Summary Generation**: Cron job to generate previous month's summary
- **Data Cleanup**: Archive old history entries
- **Performance Monitoring**: Track query performance

### 2. Advanced Analytics

- **Trend Analysis**: Calculate growth rates and trends
- **Goal Tracking**: Compare against financial goals
- **Forecasting**: Predict future net worth

### 3. Real-time Features

- **WebSocket Updates**: Real-time net worth updates
- **Push Notifications**: Value change alerts
- **Live Charts**: Real-time chart updates

## Monitoring and Maintenance

### 1. Performance Monitoring

- Monitor query performance on ValueHistory collection
- Track monthly summary generation time
- Monitor API response times

### 2. Data Maintenance

- Regular cleanup of old history entries
- Archive completed monthly summaries
- Monitor collection sizes and growth

### 3. Error Handling

- Graceful fallback for missing data
- Retry logic for failed calculations
- Comprehensive error logging

