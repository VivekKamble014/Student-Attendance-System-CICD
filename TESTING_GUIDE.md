# Testing Guide - Registration & Login

## ✅ Fixed Issues

1. **403 Forbidden Error** - Fixed by:
   - Auto-approving admin users in login API
   - Ensuring admin users can always login
   - Updated admin user status to APPROVED

2. **Admin Panel Not Showing** - Fixed by:
   - Improved dashboard redirect logic
   - Added credentials to fetch requests
   - Better error handling

3. **Toastify Notifications** - Added:
   - Success/error toasts for login
   - Success/error toasts for registration
   - Toast notifications for user approval
   - Toast notifications for logout

## 🧪 Test Registration & Login

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Test Admin Login
1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "Sign In"
4. ✅ Should see success toast
5. ✅ Should redirect to `/admin/dashboard`
6. ✅ Should see admin dashboard with stats

### Step 3: Test Registration
1. Go to: http://localhost:3000/register
2. Fill the form:
   - Full Name: Test Student
   - Email: test@example.com
   - Password: test123456
   - Role: Student
   - Department: Computer Science
   - Roll Number: ROLL001
   - Class: A
3. Click "Create Account"
4. ✅ Should see success toast
5. ✅ Should redirect to login after 3 seconds

### Step 4: Approve User (As Admin)
1. Login as admin
2. Go to "Pending Users" in sidebar
3. Find the test user
4. Click "Approve"
5. ✅ Should see success toast
6. ✅ User should disappear from pending list

### Step 5: Test Approved User Login
1. Logout from admin
2. Login with test user credentials
3. ✅ Should see success toast
4. ✅ Should redirect to student dashboard

## 🎯 Expected Behavior

### Login:
- ✅ Success toast appears
- ✅ Redirects to correct dashboard based on role
- ✅ Admin → `/admin/dashboard`
- ✅ Teacher → `/teacher/dashboard`
- ✅ Student → `/student/dashboard`

### Registration:
- ✅ Success toast appears
- ✅ Shows "Waiting for admin approval" message
- ✅ Auto-redirects to login after 3 seconds

### Admin Panel:
- ✅ Shows after admin login
- ✅ Displays stats cards
- ✅ Sidebar navigation works
- ✅ Can approve/reject users

## 🔍 Troubleshooting

### Still getting 403?
- Check admin user status in database
- Run: `npm run create-admin` again
- Verify DATABASE_URL in .env

### Dashboard not showing?
- Check browser console for errors
- Verify token is set in cookies
- Check `/api/auth/me` endpoint

### Toast notifications not showing?
- Check if ToastContainer is in layout
- Verify react-toastify CSS is imported
- Check browser console for errors

## 📝 Quick Test Commands

```bash
# Check database
npm run check-db

# Create admin (if needed)
npm run create-admin admin@example.com admin123 "Admin User" IT

# Test API
npm run test-auth
```

