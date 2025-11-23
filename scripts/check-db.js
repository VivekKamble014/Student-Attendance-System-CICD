// Quick database connection check script
// Usage: node scripts/check-db.js

// Load environment variables
require('dotenv').config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗');
    
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query successful!');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    console.log(`✅ Found ${tables.length} tables in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check if MySQL is running');
    console.error('2. Verify DATABASE_URL in .env file');
    console.error('3. Ensure database exists');
    console.error('4. Run: npx prisma migrate dev');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

