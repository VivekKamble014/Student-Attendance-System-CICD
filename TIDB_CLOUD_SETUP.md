# 🚀 TiDB Cloud Database Setup - Step by Step Guide

## 📋 Overview

This guide will help you connect your Student Attendance System to TiDB Cloud database and create an admin user.

**TiDB Connection Details:**
- **Host**: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
- **Port**: `4000`
- **Database**: `test`
- **Username**: `3NEjqDkMJVJsKVk.root`
- **Password**: `<YOUR_PASSWORD>` (Get this from TiDB Cloud dashboard)

---

## ✅ Step 1: Get Your TiDB Cloud Password

1. **Go to TiDB Cloud Dashboard**: https://tidbcloud.com
2. **Navigate to your cluster**: Cluster0
3. **Click "Connect"** button
4. **Copy your password** from the connection string
   - It will be shown as `<PASSWORD>` in the connection string
   - Click the eye icon to reveal it, or reset it if needed

---

## ✅ Step 2: Update .env File

The `.env` file has been updated with the TiDB connection string template.

**Important**: Replace `<YOUR_PASSWORD>` with your actual TiDB Cloud password!

**Current connection string format:**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

**For TiDB Cloud with TLS (Recommended):**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

**If you need to specify SSL certificate path:**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict&sslcert=/etc/ssl/cert.pem"
```

---

## ✅ Step 3: Install Dependencies (if not already done)

```bash
npm install
```

This will automatically run `prisma generate` after installation.

---

## ✅ Step 4: Test Database Connection

```bash
npm run check-db
```

**Expected output:**
```
🔍 Checking database connection...
DATABASE_URL: Set ✓
✅ Database connection successful!
✅ Database query successful!
✅ Found X tables in database
```

**If connection fails:**
- Check your password in `.env` file
- Verify your IP address is whitelisted in TiDB Cloud
- Check TiDB Cloud cluster is running

---

## ✅ Step 5: Run Database Migrations

This will create all necessary tables in your TiDB database:

```bash
npx prisma migrate deploy
```

**Or for development:**
```bash
npx prisma migrate dev --name init
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "test", schema "public" at "gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000"

✅ Migration completed successfully!
```

---

## ✅ Step 6: Create Admin User

Create the admin user with the credentials you specified:

```bash
npm run create-admin Vivek@gmail.com "Vivek@142003" "Vivek Kamble" "IT"
```

**Or use the script directly:**
```bash
node scripts/create-admin.js Vivek@gmail.com "Vivek@142003" "Vivek Kamble" "IT"
```

**Expected output:**
```
Admin user created successfully!
Email: Vivek@gmail.com
Password: Vivek@142003
Please change the password after first login!
```

---

## ✅ Step 7: Verify Everything Works

### 7.1 Test Database Connection Again
```bash
npm run check-db
```

### 7.2 Start the Application
```bash
npm run dev
```

### 7.3 Login with Admin Credentials
1. Go to: http://localhost:3000/login
2. Email: `Vivek@gmail.com`
3. Password: `Vivek@142003`
4. Click "Login"

**You should be redirected to the admin dashboard!** ✅

---

## 🔧 Troubleshooting

### Issue: "Access denied for user"

**Solution:**
1. Check your password in `.env` file
2. Verify username is correct: `3NEjqDkMJVJsKVk.root`
3. Reset password in TiDB Cloud if needed

### Issue: "Can't connect to MySQL server"

**Solution:**
1. Check your IP address is whitelisted in TiDB Cloud
2. Go to TiDB Cloud → Cluster → Security → IP Access List
3. Add your current IP address: `58.84.60.14` (from the image)
4. Verify cluster is running

### Issue: "Unknown database 'test'"

**Solution:**
1. The database `test` should exist in TiDB Cloud
2. If not, create it via TiDB Cloud console or update DATABASE_URL to use an existing database

### Issue: "SSL connection error"

**Solution:**
1. TiDB Cloud requires TLS/SSL
2. Make sure your connection string includes `?sslaccept=strict`
3. If using certificate, ensure path is correct

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

---

## 📊 Verify Tables Created

You can use Prisma Studio to view your database:

```bash
npx prisma studio
```

This will open a browser at `http://localhost:5555` where you can:
- View all tables
- See the admin user you created
- Verify data structure

---

## 🔐 Security Notes

1. **Never commit `.env` file** to Git
2. **Use strong passwords** for TiDB Cloud
3. **Whitelist only necessary IPs** in TiDB Cloud
4. **Enable TLS/SSL** for all connections
5. **Rotate passwords** regularly

---

## 📝 Summary

After completing all steps:

✅ **Database**: Connected to TiDB Cloud  
✅ **Tables**: All tables created via migrations  
✅ **Admin User**: Created with email `Vivek@gmail.com`  
✅ **Application**: Ready to run with `npm run dev`  

**Login Credentials:**
- **Email**: `Vivek@gmail.com`
- **Password**: `Vivek@142003`

---

## 🚀 Next Steps

1. **Test the application**: Login and explore the admin dashboard
2. **Create more users**: Use the admin panel to create teachers and students
3. **Deploy**: When ready, update `.env` for production with production TiDB credentials

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify TiDB Cloud cluster status
3. Check application logs: `npm run dev` output
4. Verify `.env` file has correct credentials

---

**Status**: ✅ **Ready to connect to TiDB Cloud!** 🎉

