# 🚀 TiDB Cloud Quick Start Guide

## ⚡ Quick Setup (5 Minutes)

### Step 1: Get Your TiDB Password

1. Go to [TiDB Cloud Dashboard](https://tidbcloud.com)
2. Click on your cluster: **Cluster0**
3. Click **"Connect"** button
4. Find your password (click eye icon to reveal)
5. Copy the password

### Step 2: Update .env File

**Option A: Automated Setup (Recommended)**
```bash
npm run setup-tidb
```
This will prompt you for your password and update `.env` automatically.

**Option B: Manual Setup**
1. Open `.env` file
2. Find the line: `DATABASE_URL="mysql://..."`
3. Replace `<YOUR_PASSWORD>` with your actual TiDB Cloud password
4. Save the file

**Connection String Format:**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:YOUR_ACTUAL_PASSWORD@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

### Step 3: Test Connection

```bash
npm run check-db
```

**Expected Output:**
```
✅ Database connection successful!
```

### Step 4: Run Migrations

```bash
npx prisma migrate deploy
```

**Or for development:**
```bash
npx prisma migrate dev --name init
```

### Step 5: Create Admin User

```bash
npm run create-admin-vivek
```

**Or manually:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@142003" "Vivek Kamble" "IT"
```

### Step 6: Start Application

```bash
npm run dev
```

### Step 7: Login

1. Go to: http://localhost:3000/login
2. Email: `Vivek@gmail.com`
3. Password: `Vivek@142003`
4. Click "Login"

**✅ Done! You're now logged in as admin!**

---

## 📋 Complete Step-by-Step Commands

```bash
# 1. Get your TiDB password from TiDB Cloud dashboard
# 2. Update .env file with your password
# 3. Test connection
npm run check-db

# 4. Run migrations
npx prisma migrate deploy

# 5. Create admin user
npm run create-admin-vivek

# 6. Start app
npm run dev

# 7. Login at http://localhost:3000/login
```

---

## 🔧 Troubleshooting

### Connection Failed?

1. **Check Password**: Make sure password in `.env` is correct
2. **Check IP Whitelist**: Your IP (`58.84.60.14`) must be whitelisted in TiDB Cloud
3. **Check Cluster Status**: Ensure TiDB Cloud cluster is running

### Migration Failed?

1. **Check Connection**: Run `npm run check-db` first
2. **Check Database**: Ensure database `test` exists in TiDB Cloud
3. **Check Prisma**: Run `npx prisma generate` first

### Admin Creation Failed?

1. **Check Database**: Ensure migrations ran successfully
2. **Check Email**: User might already exist - try different email
3. **Check Connection**: Run `npm run check-db` to verify

---

## 📊 Verify Setup

### Check Database Connection
```bash
npm run check-db
```

### View Database in Prisma Studio
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Check Admin User
```bash
npx prisma studio
```
Then navigate to `users` table and verify:
- Email: `Vivek@gmail.com`
- Role: `ADMIN`
- Status: `APPROVED`

---

## ✅ Success Checklist

- [ ] TiDB password added to `.env` file
- [ ] Database connection test passes (`npm run check-db`)
- [ ] Migrations completed successfully
- [ ] Admin user created (`Vivek@gmail.com`)
- [ ] Application starts without errors
- [ ] Can login with admin credentials

---

## 🎯 Next Steps

1. **Explore Admin Dashboard**: Create departments, classes, teachers, students
2. **Test Features**: Mark attendance, view reports
3. **Deploy**: When ready, update `.env` for production

---

**Status**: ✅ **Ready to connect!** 🚀

