# ✅ TiDB Cloud Setup - Complete Guide

## 🎯 What We've Set Up

✅ **TiDB Cloud Connection Configuration**  
✅ **Automated Setup Scripts**  
✅ **Admin User Creation Script**  
✅ **Comprehensive Documentation**  

---

## 📋 Step-by-Step Instructions

### **STEP 1: Get Your TiDB Cloud Password** 🔑

1. **Go to TiDB Cloud**: https://tidbcloud.com
2. **Select your cluster**: Cluster0
3. **Click "Connect"** button
4. **Find your password**:
   - It's shown as `<PASSWORD>` in the connection string
   - Click the **eye icon** 👁️ to reveal it
   - Or click **"Reset Password"** if you forgot it
5. **Copy the password** (you'll need it in the next step)

**Your Connection Details:**
- **Host**: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
- **Port**: `4000`
- **Database**: `test`
- **Username**: `3NEjqDkMJVJsKVk.root`
- **Password**: `<YOUR_ACTUAL_PASSWORD>` ← Get this from TiDB Cloud

---

### **STEP 2: Update .env File with Your Password** 📝

**Option A: Automated (Easiest)**
```bash
npm run setup-tidb
```
Enter your password when prompted.

**Option B: Quick Script**
```bash
bash update-env-tidb.sh YOUR_ACTUAL_PASSWORD
```

**Option C: Manual Edit**
1. Open `.env` file in your editor
2. Find this line:
   ```env
   DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:<YOUR_PASSWORD>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
   ```
3. Replace `<YOUR_PASSWORD>` with your actual TiDB Cloud password
4. Save the file

**Example:**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:MyActualPassword123@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

---

### **STEP 3: Test Database Connection** ✅

```bash
npm run check-db
```

**Expected Output:**
```
🔍 Checking database connection...
DATABASE_URL: Set ✓
✅ Database connection successful!
✅ Database query successful!
✅ Found X tables in database
```

**If it fails:**
- Check your password is correct in `.env`
- Verify your IP (`58.84.60.14`) is whitelisted in TiDB Cloud
- Check TiDB Cloud cluster is running

---

### **STEP 4: Run Database Migrations** 🗄️

This creates all necessary tables in your TiDB database:

```bash
npx prisma migrate deploy
```

**For development (creates migration files):**
```bash
npx prisma migrate dev --name init
```

**Expected Output:**
```
✅ Migration completed successfully!
```

---

### **STEP 5: Create Admin User** 👤

**Easy way (pre-configured for Vivek):**
```bash
npm run create-admin-vivek
```

**Or manually:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@142003" "Vivek Kamble" "IT"
```

**Expected Output:**
```
✅ Admin user created successfully!
📧 Email: Vivek@gmail.com
🔑 Password: Vivek@142003
```

---

### **STEP 6: Start the Application** 🚀

```bash
npm run dev
```

**Expected Output:**
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

### **STEP 7: Login and Test** 🔐

1. **Open browser**: http://localhost:3000/login
2. **Enter credentials**:
   - Email: `Vivek@gmail.com`
   - Password: `Vivek@142003`
3. **Click "Login"**
4. **You should be redirected to Admin Dashboard!** ✅

---

## 📊 Verify Everything Works

### Check Database Connection
```bash
npm run check-db
```

### View Database Tables
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Check Admin User
In Prisma Studio, go to `users` table and verify:
- ✅ Email: `Vivek@gmail.com`
- ✅ Role: `ADMIN`
- ✅ Status: `APPROVED`

---

## 🔧 Troubleshooting

### ❌ "Access denied for user"

**Solution:**
1. Check password in `.env` file
2. Verify username: `3NEjqDkMJVJsKVk.root`
3. Reset password in TiDB Cloud if needed

### ❌ "Can't connect to MySQL server"

**Solution:**
1. **Whitelist your IP** in TiDB Cloud:
   - Go to: TiDB Cloud → Cluster → Security → IP Access List
   - Add your IP: `58.84.60.14`
2. Verify cluster is running
3. Check firewall settings

### ❌ "Unknown database 'test'"

**Solution:**
1. Database `test` should exist in TiDB Cloud
2. If not, create it via TiDB Cloud console
3. Or update DATABASE_URL to use existing database

### ❌ "SSL connection error"

**Solution:**
1. TiDB Cloud requires TLS/SSL
2. Connection string includes `?sslaccept=strict` ✅
3. If still fails, check TiDB Cloud SSL settings

### ❌ "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### ❌ "Admin user already exists"

**Solution:**
- User with email `Vivek@gmail.com` already exists
- Use different email or delete existing user
- Or login with existing credentials

---

## 📝 Complete Command Reference

```bash
# 1. Setup TiDB connection (enter password when prompted)
npm run setup-tidb

# 2. Test connection
npm run check-db

# 3. Run migrations
npx prisma migrate deploy

# 4. Create admin user
npm run create-admin-vivek

# 5. Start application
npm run dev

# 6. Login at http://localhost:3000/login
```

---

## ✅ Success Checklist

Before you start, make sure:

- [ ] **TiDB Cloud cluster is running**
- [ ] **Your IP is whitelisted** in TiDB Cloud (IP: `58.84.60.14`)
- [ ] **Password obtained** from TiDB Cloud dashboard
- [ ] **`.env` file updated** with actual password
- [ ] **Database connection test passes** (`npm run check-db`)
- [ ] **Migrations completed** successfully
- [ ] **Admin user created** (`Vivek@gmail.com`)
- [ ] **Application starts** without errors
- [ ] **Can login** with admin credentials

---

## 🎯 What's Next?

1. **Explore Admin Dashboard**:
   - Create departments
   - Create classes
   - Add teachers
   - Add students

2. **Test Features**:
   - Mark attendance
   - View reports
   - Manage users

3. **Deploy to Production**:
   - Update `.env` for production
   - Use production TiDB Cloud cluster
   - Configure CI/CD pipeline

---

## 📚 Additional Resources

- **Full Setup Guide**: See `TIDB_CLOUD_SETUP.md`
- **Quick Start**: See `TIDB_QUICK_START.md`
- **TiDB Cloud Docs**: https://docs.pingcap.com/tidbcloud/

---

## 🔐 Security Notes

1. **Never commit `.env` file** to Git ✅ (already in .gitignore)
2. **Use strong passwords** for TiDB Cloud
3. **Whitelist only necessary IPs** in TiDB Cloud
4. **Enable TLS/SSL** for all connections ✅ (already configured)
5. **Rotate passwords** regularly

---

## 📞 Need Help?

If you encounter issues:

1. **Check Troubleshooting** section above
2. **Verify TiDB Cloud** cluster status
3. **Check application logs**: `npm run dev` output
4. **Verify `.env` file** has correct credentials
5. **Test connection**: `npm run check-db`

---

## 🎉 Summary

**Everything is ready!** You just need to:

1. ✅ Get your TiDB Cloud password
2. ✅ Update `.env` file with the password
3. ✅ Run: `npm run check-db` (test connection)
4. ✅ Run: `npx prisma migrate deploy` (create tables)
5. ✅ Run: `npm run create-admin-vivek` (create admin)
6. ✅ Run: `npm run dev` (start app)
7. ✅ Login at http://localhost:3000/login

**Login Credentials:**
- **Email**: `Vivek@gmail.com`
- **Password**: `Vivek@142003`

---

**Status**: ✅ **Perfect Setup Complete!** 🚀

All scripts and configurations are ready. Just add your TiDB Cloud password and you're good to go!

