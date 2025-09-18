# Schematic Webhook Setup Guide

## Issue

Users are not having their subscription plan updated in the database when changing their plan using the Schematic component on manage-plan page.

## Root Cause

The webhook processing code is working correctly, but Schematic is not sending webhooks when users change their plans. This is likely due to webhook configuration issues.

## Solution

### 1. Configure Schematic Webhook Endpoint

In your Schematic dashboard, configure the webhook endpoint to point to:

**Primary Endpoint (Recommended):**

```
https://yourdomain.com/api/webhooks
```

**Alternative Endpoint:**

```
https://yourdomain.com/api/schematic/webhook
```

### 2. Enable Required Webhook Events

Make sure these webhook events are enabled in Schematic:

- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `subscription.renewed`
- `customer.created`
- `customer.updated`

### 3. Configure Customer ID Mapping

The webhook expects the customer ID to be the Clerk user ID. In Schematic:

1. Go to your Schematic project settings
2. Configure the customer ID to use the Clerk user ID
3. This should be set to the user's `id` field from Clerk

### 4. Test Webhook Configuration

Use the test script to verify webhook processing:

```bash
node test-schematic-webhook.js
```

### 5. Environment Variables

Ensure these environment variables are set:

```env
SCHEMATIC_API_KEY=your_schematic_api_key
NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY=your_schematic_publishable_key
NEXT_PUBLIC_SCHEMATIC_COMPONENT_ID=your_component_id
```

### 6. Debugging

Check the server logs for webhook activity:

```bash
# Look for these log messages:
# [SCHEMATIC_WEBHOOK] Received webhook: {...}
# [SCHEMATIC_WEBHOOK] Updating subscription for user {clerkId}: {...}
# [SCHEMATIC_WEBHOOK] Successfully updated subscription for user {clerkId}
```

### 7. Common Issues

1. **Webhook not being sent**: Check Schematic webhook configuration
2. **Customer ID mismatch**: Ensure customer ID is set to Clerk user ID
3. **Webhook events not enabled**: Enable all required events in Schematic
4. **Wrong endpoint**: Verify webhook URL is correct
5. **Authentication issues**: Check Schematic API key configuration

### 8. Verification Steps

1. Go to `/manage-plan` page
2. Change your plan using the Schematic component
3. Check server logs for webhook activity
4. Verify user's plan is updated in database
5. Check that user can access premium features

## Testing

The webhook processing has been tested and works correctly. The issue is with Schematic configuration, not the code.

## Next Steps

1. Configure Schematic webhook endpoint
2. Enable required webhook events
3. Set customer ID to Clerk user ID
4. Test plan changes
5. Monitor webhook logs
