# Manual Testing Guide - Registration & Login

## Quick Test Steps

### 1. Start the Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to: http://localhost:3000

### 3. Test Registration

#### Test Student Registration:
1. Click "Create one now" or go to http://localhost:3000/register
2. Fill in the form:
   - Full Name: Test Student
   - Email: test.student@example.com
   - Password: test123456
   - Role: Select "Student"
   - Department: Computer Science
   - Roll Number: ROLL001
   - Class: A
   - Mobile: 1234567890 (optional)
3. Click "Create Account"
4. ✅ Should see: "Registration successful! Waiting for admin approval..."

#### Test Teacher Registration:
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Full Name: Test Teacher
   - Email: test.teacher@example.com
   - Password: teacher123456
   - Role: Select "Teacher"
   - Department: Computer Science
   - Mobile: 9876543210 (optional)
3. Click "Create Account"
4. ✅ Should see: "Registration successful! Waiting for admin approval..."

### 4. Test Login (After Admin Approval)

**Note**: New users need admin approval before they can login.

#### Option A: Create Admin User First
```bash
npm run create-admin admin@example.com admin123 "Admin User" IT
```

Then:
1. Login as admin: http://localhost:3000/login
   - Email: admin@example.com
   - Password: admin123
2. Go to Admin Dashboard → Pending Users
3. Approve the test user
4. Logout
5. Login with test user credentials

#### Option B: Use Automated Test Script
```bash
npm run test-auth
```

This will:
- Test registration
- Show you the credentials
- Test login (will fail until admin approval)

### 5. Verify Login Works

1. Go to http://localhost:3000/login
2. Enter approved user credentials
3. Click "Sign In"
4. ✅ Should redirect to dashboard
5. ✅ Should see user-specific dashboard based on role

## Expected Results

### Registration:
- ✅ Form validation works
- ✅ Password strength indicator works
- ✅ Role selection works
- ✅ Student-specific fields appear/disappear correctly
- ✅ Success message appears
- ✅ Redirects to login after 3 seconds

### Login:
- ✅ Email validation
- ✅ Password visibility toggle works
- ✅ Error messages for invalid credentials
- ✅ Error message for pending approval
- ✅ Successful login redirects to dashboard
- ✅ Token is stored in cookies

## Common Issues

### "User already exists"
- Use a different email address
- Or delete the user from database

### "Database connection failed"
- Check if MySQL is running
- Verify DATABASE_URL in .env
- Run: `npm run check-db`

### "Prisma Client not initialized"
- Run: `npx prisma generate`
- Restart the server

### Login fails with "pending approval"
- This is expected! User needs admin approval
- Login as admin and approve the user first

## Test Checklist

- [ ] Server starts without errors
- [ ] Registration page loads
- [ ] Form validation works
- [ ] Student registration succeeds
- [ ] Teacher registration succeeds
- [ ] Login page loads
- [ ] Login with invalid credentials shows error
- [ ] Login with pending user shows approval message
- [ ] Admin can approve users
- [ ] Approved user can login
- [ ] Dashboard loads after login
- [ ] Logout works

