# Quick Start Guide

## Fix: Prisma Client Not Initialized Error

If you see this error:
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

### Quick Fix (3 steps):

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Set up your .env file** (if not done):
   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   ```

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Complete Setup (First Time):

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run setup
# OR manually: cp .env.example .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Create admin user
npm run create-admin admin@example.com admin123 "Admin User" IT

# 6. Start development server
npm run dev
```

### Automatic Prisma Generation

The `npm run dev` command now automatically runs `prisma generate` before starting the server, so you shouldn't see this error again.

However, if you:
- Clone the repo fresh
- Delete node_modules
- Update Prisma schema

You should run `npx prisma generate` manually first.

### Verify Prisma Client

Check if Prisma Client is generated:
```bash
ls node_modules/@prisma/client/index.js
```

If the file exists, Prisma Client is ready! ✅

