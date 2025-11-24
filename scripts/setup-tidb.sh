#!/bin/bash

# TiDB Cloud Setup Script
# This script helps you set up TiDB Cloud database connection

set -e

echo "🚀 TiDB Cloud Database Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env file from template..."
    cp .env.example .env 2>/dev/null || touch .env
fi

# Backup existing .env
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo ""
echo "📋 TiDB Cloud Connection Details:"
echo "   Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
echo "   Port: 4000"
echo "   Database: test"
echo "   Username: 3NEjqDkMJVJsKVk.root"
echo ""

# Ask for password
read -sp "Enter your TiDB Cloud password: " TIDB_PASSWORD
echo ""

if [ -z "$TIDB_PASSWORD" ]; then
    echo "⚠️  No password provided. You'll need to update .env manually."
    TIDB_PASSWORD="<YOUR_PASSWORD>"
fi

# Update DATABASE_URL in .env
if grep -q "^DATABASE_URL=" .env; then
    # Replace existing DATABASE_URL
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${TIDB_PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"|" .env
    else
        # Linux
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${TIDB_PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"|" .env
    fi
else
    # Add DATABASE_URL if it doesn't exist
    echo "" >> .env
    echo "# Database Configuration - TiDB Cloud" >> .env
    echo "DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${TIDB_PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"" >> .env
fi

echo "✅ DATABASE_URL updated in .env file"
echo ""

# Check if JWT_SECRET exists
if ! grep -q "^JWT_SECRET=" .env; then
    echo "⚠️  JWT_SECRET not found. Adding default..."
    echo "JWT_SECRET=\"your-super-secret-jwt-key-change-in-production-min-32-characters\"" >> .env
fi

# Check if NEXT_PUBLIC_APP_URL exists
if ! grep -q "^NEXT_PUBLIC_APP_URL=" .env; then
    echo "⚠️  NEXT_PUBLIC_APP_URL not found. Adding default..."
    echo "NEXT_PUBLIC_APP_URL=\"http://localhost:3000\"" >> .env
fi

echo ""
echo "✅ .env file configured!"
echo ""
echo "📋 Next steps:"
echo "   1. Test connection: npm run check-db"
echo "   2. Run migrations: npx prisma migrate deploy"
echo "   3. Create admin: npm run create-admin Vivek@gmail.com \"Vivek@142003\" \"Vivek Kamble\" \"IT\""
echo ""

