// Quick check script to verify Prisma Client is generated
// This is automatically run before dev/build

const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, 'node_modules', '@prisma', 'client', 'index.js');

if (!fs.existsSync(prismaClientPath)) {
  console.error('\n❌ Prisma Client not found!');
  console.error('Please run: npx prisma generate\n');
  process.exit(1);
}

console.log('✅ Prisma Client is ready');

