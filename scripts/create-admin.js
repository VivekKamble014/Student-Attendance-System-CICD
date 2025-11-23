// Script to create an admin user
// Usage: node scripts/create-admin.js

// Load environment variables
require('dotenv').config({ path: '.env' });

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables');
  console.error('\n💡 Solution:');
  console.error('1. Create .env file: cp .env.example .env');
  console.error('2. Edit .env and set DATABASE_URL');
  console.error('3. Or run: npm run setup');
  process.exit(1);
}

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const fullName = process.argv[4] || 'Admin User';
  const department = process.argv[5] || 'IT';

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('Admin user already exists with this email!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

