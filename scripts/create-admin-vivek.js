// Script to create admin user for Vivek
// Usage: node scripts/create-admin-vivek.js

// Load environment variables
require('dotenv').config({ path: '.env' });

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables');
  console.error('\n💡 Solution:');
  console.error('1. Update .env file with TiDB Cloud connection string');
  console.error('2. Run: bash scripts/setup-tidb.sh');
  process.exit(1);
}

const prisma = new PrismaClient();

async function createVivekAdmin() {
  const email = 'Vivek@gmail.com';
  const password = 'Vivek@142003';
  const fullName = 'Vivek Kamble';
  const department = 'IT';

  try {
    console.log('🔍 Checking if admin user already exists...');

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('⚠️  Admin user already exists with this email!');
      console.log('   Email:', email);
      console.log('   Role:', existing.role);
      console.log('   Status:', existing.status);
      console.log('\n💡 To create a new admin, use a different email or delete the existing user.');
      process.exit(0);
    }

    console.log('🔐 Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Creating admin user...');
    // Create admin user
    const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        fullName,
          role: 'ADMIN',
          status: 'APPROVED',
        department
        }
    });

    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Full Name:', fullName);
    console.log('🏢 Department:', department);
    console.log('👑 Role: ADMIN');
    console.log('✅ Status: APPROVED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/login');
    console.log('⚠️  Please change the password after first login!');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Error creating admin user:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (error.code === 'P2002') {
      console.error('   Duplicate entry: User with this email already exists');
    } else if (error.code === 'P1001') {
      console.error('   Database connection failed!');
      console.error('   Please check:');
      console.error('   1. DATABASE_URL in .env file');
      console.error('   2. TiDB Cloud cluster is running');
      console.error('   3. Your IP is whitelisted in TiDB Cloud');
    } else {
      console.error('   ', error.message);
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createVivekAdmin();
