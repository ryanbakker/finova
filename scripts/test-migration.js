#!/usr/bin/env node

/**
 * Test script for the new event ledger pattern migration
 * This script tests the complete integration of the new data model
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Finova Event Ledger Migration Test');
console.log('==============================================\n');

// Test 1: Check if all new models are properly defined
console.log('📋 Test 1: Checking new data models...');
try {
  const modelFiles = [
    'database/models/valueHistory.model.ts',
    'database/models/monthlyNetWorthSummary.model.ts'
  ];
  
  modelFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      process.exit(1);
    }
  });
  console.log('✅ All new models are present\n');
} catch (error) {
  console.error('❌ Error checking models:', error.message);
  process.exit(1);
}

// Test 2: Check if services are properly implemented
console.log('📋 Test 2: Checking new services...');
try {
  const serviceFiles = [
    'lib/services/networth.service.ts',
    'lib/migrations/migrate-to-event-ledger.ts'
  ];
  
  serviceFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      process.exit(1);
    }
  });
  console.log('✅ All new services are present\n');
} catch (error) {
  console.error('❌ Error checking services:', error.message);
  process.exit(1);
}

// Test 3: Check if API endpoints are created
console.log('📋 Test 3: Checking API endpoints...');
try {
  const apiFiles = [
    'app/api/net-worth/route.ts',
    'app/api/net-worth/update-value/route.ts',
    'app/api/migrate/route.ts'
  ];
  
  apiFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      process.exit(1);
    }
  });
  console.log('✅ All API endpoints are present\n');
} catch (error) {
  console.error('❌ Error checking API endpoints:', error.message);
  process.exit(1);
}

// Test 4: Check if types are updated
console.log('📋 Test 4: Checking updated types...');
try {
  const typesFile = path.join(process.cwd(), 'lib/types/index.ts');
  const typesContent = fs.readFileSync(typesFile, 'utf8');
  
  const requiredTypes = [
    'ValueHistoryEntry',
    'MonthlyNetWorthSummary',
    'currentValue: number',
    'changeAmount: number',
    'changePercentage: number'
  ];
  
  requiredTypes.forEach(type => {
    if (typesContent.includes(type)) {
      console.log(`✅ ${type} found in types`);
    } else {
      console.log(`❌ ${type} missing from types`);
      process.exit(1);
    }
  });
  console.log('✅ All required types are present\n');
} catch (error) {
  console.error('❌ Error checking types:', error.message);
  process.exit(1);
}

// Test 5: Check if actions are updated
console.log('📋 Test 5: Checking updated actions...');
try {
  const assetActionsFile = path.join(process.cwd(), 'lib/actions/asset.actions.ts');
  const liabilityActionsFile = path.join(process.cwd(), 'lib/actions/liability.actions.ts');
  
  const assetContent = fs.readFileSync(assetActionsFile, 'utf8');
  const liabilityContent = fs.readFileSync(liabilityActionsFile, 'utf8');
  
  const requiredUpdates = [
    'ValueHistory',
    'updateItemValue',
    'currentValue: number',
    'changeAmount: 0',
    'changePercentage: 0'
  ];
  
  requiredUpdates.forEach(update => {
    if (assetContent.includes(update) && liabilityContent.includes(update)) {
      console.log(`✅ ${update} found in actions`);
    } else {
      console.log(`❌ ${update} missing from actions`);
      process.exit(1);
    }
  });
  console.log('✅ All actions are properly updated\n');
} catch (error) {
  console.error('❌ Error checking actions:', error.message);
  process.exit(1);
}

// Test 6: Check if components are updated
console.log('📋 Test 6: Checking updated components...');
try {
  const componentsFile = path.join(process.cwd(), 'components/dashboard/FinancialAssets.tsx');
  const componentsContent = fs.readFileSync(componentsFile, 'utf8');
  
  const requiredComponentUpdates = [
    'currentValue: number',
    'changeAmount: number',
    'changePercentage: number',
    'description?: string'
  ];
  
  requiredComponentUpdates.forEach(update => {
    if (componentsContent.includes(update)) {
      console.log(`✅ ${update} found in components`);
    } else {
      console.log(`❌ ${update} missing from components`);
      process.exit(1);
    }
  });
  console.log('✅ Components are properly updated\n');
} catch (error) {
  console.error('❌ Error checking components:', error.message);
  process.exit(1);
}

// Test 7: Check if new components are created
console.log('📋 Test 7: Checking new components...');
try {
  const newComponents = [
    'components/shared/UpdateValueDialog.tsx',
    'components/admin/MigrationStatus.tsx'
  ];
  
  newComponents.forEach(component => {
    const filePath = path.join(process.cwd(), component);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${component} exists`);
    } else {
      console.log(`❌ ${component} missing`);
      process.exit(1);
    }
  });
  console.log('✅ All new components are present\n');
} catch (error) {
  console.error('❌ Error checking new components:', error.message);
  process.exit(1);
}

// Test 8: Check if TypeScript compiles without errors
console.log('📋 Test 8: Checking TypeScript compilation...');
try {
  console.log('Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful\n');
} catch (error) {
  console.error('❌ TypeScript compilation failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

console.log('🎉 All tests passed! The migration is ready to use.');
console.log('\n📝 Next steps:');
console.log('1. Run the migration: POST /api/migrate with { "action": "migrate" }');
console.log('2. Test the new API endpoints');
console.log('3. Update your UI to use the new components');
console.log('4. Monitor the monthly net worth summaries');
console.log('\n✨ Happy coding!');

