// Check environment variables
// Run this with: node check-env.js

require('dotenv').config();

console.log('Environment Variables Check:');
console.log('============================');

const requiredVars = [
  'MONGODB_URL',
  'SIGNING_SECRET',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    if (varName.includes('SECRET') || varName.includes('KEY')) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...${value.substring(value.length - 4)}`);
    } else if (varName === 'MONGODB_URL') {
      // Mask MongoDB URL
      const masked = value.replace(/(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/, '$1***:***@');
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\nMongoDB URL Analysis:');
console.log('=====================');

const mongoUrl = process.env.MONGODB_URL;
if (mongoUrl) {
  console.log('Protocol:', mongoUrl.startsWith('mongodb+srv://') ? 'mongodb+srv (Atlas)' : 'mongodb (local)');
  console.log('Has SSL params:', mongoUrl.includes('ssl=true') || mongoUrl.includes('tls=true'));
  console.log('Has retryWrites:', mongoUrl.includes('retryWrites=true'));
  console.log('Has w=majority:', mongoUrl.includes('w=majority'));
  
  // Suggest improvements
  if (mongoUrl.includes('mongodb+srv://') && !mongoUrl.includes('ssl=true')) {
    console.log('\n💡 Suggestion: Add SSL parameters to your MongoDB Atlas connection string:');
    console.log('   Add ?ssl=true&tls=true to the end of your connection string');
  }
} else {
  console.log('❌ MONGODB_URL is not set');
}
