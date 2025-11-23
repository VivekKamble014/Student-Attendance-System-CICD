#!/bin/bash

# Setup script for environment variables
# This script helps you set up your .env file

echo "🚀 Student Attendance System - Environment Setup"
echo "================================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
cp .env.example .env

echo "✅ Created .env file from .env.example"
echo ""

# Generate a random JWT secret
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "your-super-secret-jwt-key-change-in-production-min-32-characters")

# Generate a random cookie secret
COOKIE_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "your-cookie-secret-key-change-in-production")

# Update .env with generated secrets
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    sed -i '' "s|COOKIE_SECRET=.*|COOKIE_SECRET=\"$COOKIE_SECRET\"|" .env
else
    # Linux
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
    sed -i "s|COOKIE_SECRET=.*|COOKIE_SECRET=\"$COOKIE_SECRET\"|" .env
fi

echo "✅ Generated secure JWT_SECRET and COOKIE_SECRET"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and update the following if needed:"
echo "   - DATABASE_URL (if using external MySQL)"
echo "   - MYSQL_* variables (if using Docker)"
echo "   - NEXT_PUBLIC_APP_URL (for production)"
echo ""
echo "2. Run database migrations:"
echo "   npm run prisma:generate"
echo "   npm run prisma:migrate"
echo ""
echo "3. Create an admin user:"
echo "   npm run create-admin"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "✨ Setup complete! Don't forget to review and update .env file with your specific configuration."

