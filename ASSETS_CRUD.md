# Assets CRUD Functionality

This document describes the implementation of full CRUD (Create, Read, Update, Delete) functionality for assets in the Finova application.

## Overview

The assets system allows users to manage their financial assets, including:
- Cash and bank accounts
- Investment accounts
- Real estate
- Vehicles
- Collectibles
- Business assets
- And more

## Features

### ✅ User Authentication & Security
- **Defensive Coding**: Users can only access their own assets
- **Clerk Authentication**: Secure user authentication using Clerk
- **MongoDB Integration**: Data stored in MongoDB with proper indexing

### ✅ Full CRUD Operations
- **Create**: Add new assets with comprehensive form validation
- **Read**: View assets in table format with filtering and sorting
- **Update**: Edit existing assets with real-time validation
- **Delete**: Remove assets with confirmation dialogs

### ✅ Data Validation
- Required fields: name, category, value, currency
- Value validation (must be positive)
- Date validation for purchase dates
- Currency support (USD, EUR, GBP, CAD, AUD)

### ✅ User Experience
- Responsive design for mobile and desktop
- Loading states and error handling
- Toast notifications for success/error feedback
- Real-time data updates

## Database Schema

### Asset Model (`database/models/asset.model.ts`)
```typescript
interface IAsset {
  userId: string;           // User identifier (from Clerk)
  name: string;             // Asset name
  category: string;         // Asset category
  value: number;            // Original/purchase value
  currency: string;         // Currency code
  institution?: string;     // Financial institution
  accountNumber?: string;   // Account reference
  purchaseDate?: Date;      // Purchase date
  currentValue?: number;    // Current market value
  changeAmount?: number;    // Value change amount
  changePercentage?: number; // Value change percentage
  notes?: string;           // Additional notes
  isActive: boolean;        // Active status
  createdAt: Date;          // Creation timestamp
  updatedAt: Date;          // Last update timestamp
}
```

## API Endpoints

### Base URL: `/api/assets`

#### GET `/api/assets`
- **Purpose**: Retrieve all assets for authenticated user
- **Authentication**: Required (Clerk)
- **Response**: Array of user's assets

#### POST `/api/assets`
- **Purpose**: Create a new asset
- **Authentication**: Required (Clerk)
- **Body**: Asset creation data
- **Response**: Created asset object

#### GET `/api/assets/[id]`
- **Purpose**: Retrieve specific asset by ID
- **Authentication**: Required (Clerk)
- **Response**: Asset object (if authorized)

#### PUT `/api/assets/[id]`
- **Purpose**: Update existing asset
- **Authentication**: Required (Clerk)
- **Body**: Asset update data
- **Response**: Updated asset object

#### DELETE `/api/assets/[id]`
- **Purpose**: Delete asset
- **Authentication**: Required (Clerk)
- **Response**: Success message

#### GET `/api/assets/stats`
- **Purpose**: Get asset statistics and insights
- **Authentication**: Required (Clerk)
- **Response**: Aggregated asset data

## Frontend Components

### Main Components
1. **AssetsPage** (`app/(dashboard)/assets/page.tsx`)
   - Main assets page with table and insights views
   - Integrates all asset functionality

2. **CreateAssetDialog** (`components/assets/CreateAssetDialog.tsx`)
   - Form for creating new assets
   - Comprehensive validation and error handling

3. **EditAssetDialog** (`components/assets/EditAssetDialog.tsx`)
   - Form for editing existing assets
   - Pre-populated with current asset data

4. **DeleteAssetDialog** (`components/assets/DeleteAssetDialog.tsx`)
   - Confirmation dialog for asset deletion
   - Safety checks and user confirmation

5. **DataTable** (`app/(dashboard)/assets/data-table.tsx`)
   - Interactive table for viewing and managing assets
   - Sorting, filtering, and pagination

### Supporting Components
- **AssetFilters**: Advanced filtering options
- **AssetInsights**: Charts and analytics
- **AssetDetailsDialog**: Detailed asset view

## Server Actions

### Asset Actions (`lib/actions/asset.actions.ts`)
- `createAsset()`: Create new asset
- `getUserAssets()`: Fetch user's assets
- `getAssetById()`: Fetch specific asset
- `updateAsset()`: Update existing asset
- `deleteAsset()`: Delete asset
- `getAssetStats()`: Get asset statistics
- `getAssetsByCategory()`: Get assets by category
- `toggleAssetStatus()`: Toggle asset active status

## Security Features

### User Isolation
- All database queries include `userId` filter
- Users can only access their own assets
- API routes validate user authentication

### Input Validation
- Server-side validation for all inputs
- Type checking and sanitization
- Required field validation

### Error Handling
- Comprehensive error handling
- User-friendly error messages
- Logging for debugging

## Usage Examples

### Creating an Asset
```typescript
import { createAsset } from "@/lib/actions/asset.actions";

const newAsset = await createAsset({
  name: "Tesla Stock",
  category: "Investment Account",
  value: 5000,
  currency: "USD",
  institution: "Robinhood",
  notes: "TSLA shares"
});
```

### Fetching User Assets
```typescript
import { getUserAssets } from "@/lib/actions/asset.actions";

const assets = await getUserAssets();
```

### Updating an Asset
```typescript
import { updateAsset } from "@/lib/actions/asset.actions";

const updatedAsset = await updateAsset({
  id: "asset_id_here",
  currentValue: 5500,
  changeAmount: 500,
  changePercentage: 10
});
```

## Database Indexes

The asset model includes optimized indexes for:
- `userId`: Primary user lookup
- `userId + category`: Category-based queries
- `userId + isActive`: Active asset filtering
- `userId + createdAt`: Chronological sorting

## Error Handling

### Common Error Scenarios
1. **Authentication Errors**: User not logged in
2. **Authorization Errors**: User trying to access other user's assets
3. **Validation Errors**: Invalid input data
4. **Database Errors**: Connection or query failures

### Error Response Format
```json
{
  "error": "Error message description",
  "status": 400
}
```

## Performance Considerations

### Optimization Strategies
- Database indexing for common queries
- Lean queries for read operations
- Efficient aggregation pipelines
- Client-side caching and state management

### Scalability
- User-specific data partitioning
- Efficient pagination
- Optimized database queries
- Responsive UI components

## Testing

### Manual Testing Checklist
- [ ] Create new asset with valid data
- [ ] Create asset with invalid data (should show errors)
- [ ] Edit existing asset
- [ ] Delete asset with confirmation
- [ ] Filter assets by category
- [ ] Sort assets by different columns
- [ ] Mobile responsiveness
- [ ] Error handling scenarios

### API Testing
- [ ] Test all endpoints with valid authentication
- [ ] Test endpoints without authentication (should fail)
- [ ] Test with invalid data (should return 400)
- [ ] Test with non-existent asset IDs (should return 404)

## Future Enhancements

### Potential Improvements
1. **Bulk Operations**: Import/export multiple assets
2. **Asset Valuation**: Real-time market data integration
3. **Document Upload**: Attach receipts, statements
4. **Asset History**: Track value changes over time
5. **Portfolio Analytics**: Advanced reporting and insights
6. **Asset Linking**: Connect assets to transactions
7. **Multi-currency Support**: Enhanced currency handling

## Troubleshooting

### Common Issues
1. **Assets not loading**: Check user authentication
2. **Create/Edit failing**: Validate required fields
3. **Permission errors**: Ensure user owns the asset
4. **Database connection**: Check MongoDB connection string

### Debug Steps
1. Check browser console for errors
2. Verify user authentication status
3. Check API endpoint responses
4. Validate database connection
5. Review server logs

## Support

For technical support or questions about the assets functionality, please refer to the development team or create an issue in the project repository.
