# 🔍 Complete Project Flow Analysis

## 📋 Executive Summary

**Project**: Student Attendance Management System  
**Database**: TiDB Cloud (MySQL-compatible)  
**Framework**: Next.js 14 (App Router)  
**ORM**: Prisma  
**Authentication**: JWT (JSON Web Tokens)  
**CI/CD**: Jenkins → SonarQube → Nexus → Deployment  

**Status**: ✅ All components configured and ready

---

## 🗄️ Database Configuration

### ✅ TiDB Cloud Setup

**Connection Details:**
- **Host**: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
- **Port**: `4000`
- **Database**: `test`
- **Username**: `3NEjqDkMJVJsKVk.root`
- **Password**: `RSuUmf5m3RphWqOq` ✅ Configured
- **SSL**: Required (`sslaccept=strict`)

**Connection String:**
```env
DATABASE_URL="mysql://3NEjqDkMJVJsKVk.root:RSuUmf5m3RphWqOq@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

**⚠️ Important**: Ensure your IP address is whitelisted in TiDB Cloud Security settings.

---

## 🔄 Complete Application Flow

### 1. **User Registration Flow**

```
User → /register → POST /api/auth/register
  ↓
Validate Input (email, password, role, etc.)
  ↓
Hash Password (bcrypt)
  ↓
Create User (status: PENDING)
  ↓
Create Role-Specific Record (Student/Teacher)
  ↓
Return Success (pending approval)
  ↓
Admin receives notification
```

**Key Files:**
- `app/register/page.tsx` - Registration form
- `app/api/auth/register/route.ts` - Registration API
- `prisma/schema.prisma` - User model

**Database Tables:**
- `users` - Main user table
- `students` - Student-specific data
- `teachers` - Teacher-specific data

---

### 2. **Admin Approval Flow**

```
Admin → /admin/users → GET /api/admin/users/pending
  ↓
View Pending Users List
  ↓
Admin → POST /api/admin/users/approve
  ↓
Update User Status (PENDING → APPROVED/REJECTED)
  ↓
Create Notification for User
  ↓
User can now login
```

**Key Files:**
- `app/admin/users/page.tsx` - Pending users list
- `app/api/admin/users/pending/route.ts` - Get pending users
- `app/api/admin/users/approve/route.ts` - Approve/reject user

---

### 3. **Authentication Flow**

#### **Login Process:**
```
User → /login → POST /api/auth/login
  ↓
Validate Email & Password
  ↓
Check User Status (must be APPROVED)
  ↓
Verify Password (bcrypt.compare)
  ↓
Generate JWT Token
  ↓
Set Cookie (httpOnly, secure in production)
  ↓
Redirect to Role-Based Dashboard
```

#### **Token Structure:**
```typescript
{
  userId: number
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}
```

#### **Middleware Protection:**
```
Request → middleware.ts
  ↓
Check for Token Cookie
  ↓
Verify Token (JWT)
  ↓
Check Role-Based Access
  ↓
Allow/Redirect Based on Role
```

**Key Files:**
- `app/login/page.tsx` - Login form
- `app/api/auth/login/route.ts` - Login API
- `middleware.ts` - Route protection
- `lib/auth.ts` - JWT utilities
- `lib/auth-edge.ts` - Edge-compatible auth

---

### 4. **Role-Based Access Control (RBAC)**

#### **Admin Access:**
- ✅ Full CRUD on all entities
- ✅ User approval/rejection
- ✅ Dashboard with statistics
- ✅ All admin routes: `/admin/*`

#### **Teacher Access:**
- ✅ Read Students
- ✅ Create/Read/Update/Delete Attendance
- ✅ View own dashboard
- ✅ Teacher routes: `/teacher/*`

#### **Student Access:**
- ✅ View own attendance
- ✅ View own dashboard
- ✅ Student routes: `/student/*`

**Middleware Routes:**
```typescript
'/dashboard/:path*'
'/admin/:path*'      // Admin only
'/teacher/:path*'    // Teacher + Admin
'/student/:path*'    // Student only
'/api/protected/:path*'
```

---

### 5. **Attendance Management Flow**

#### **Mark Attendance (Teacher/Admin):**
```
Teacher → /teacher/attendance → POST /api/attendance/bulk
  ↓
Select Class, Date, Students
  ↓
Mark Present/Absent for each student
  ↓
Create Attendance Records
  ↓
Return Success
```

#### **View Attendance:**
```
User → GET /api/attendance
  ↓
Filter by date, class, student (based on role)
  ↓
Return Attendance Records with Student/Teacher info
```

#### **Update/Delete Attendance:**
```
Admin/Teacher → PUT/DELETE /api/attendance/[id]
  ↓
Verify Permissions
  ↓
Update/Delete Record
  ↓
Return Success
```

**Key Files:**
- `app/teacher/attendance/page.tsx` - Mark attendance
- `app/admin/attendance/page.tsx` - Admin attendance
- `app/api/attendance/route.ts` - Attendance API
- `app/api/attendance/bulk/route.ts` - Bulk attendance
- `app/api/attendance/[id]/route.ts` - Update/Delete

**Database Table:**
- `attendance` - Attendance records

---

### 6. **Student Management Flow**

#### **Create Student (Admin/Teacher):**
```
Admin → /admin/students → POST /api/students
  ↓
Validate Input (rollNo, class, department)
  ↓
Create User (role: STUDENT, status: APPROVED)
  ↓
Create Student Record
  ↓
Return Success
```

#### **List Students:**
```
GET /api/students
  ↓
Filter by class, department, search
  ↓
Return Students with User info
```

**Key Files:**
- `app/admin/students/page.tsx` - Student management
- `app/api/students/route.ts` - Student API
- `app/api/students/[id]/route.ts` - Update/Delete

---

### 7. **Dashboard Flow**

#### **Admin Dashboard:**
```
GET /api/dashboard/stats
  ↓
Calculate Statistics:
  - Total Students
  - Total Teachers
  - Pending Users
  - Total Attendance Records
  - Recent Activity
  ↓
Return Statistics
```

#### **Teacher Dashboard:**
```
GET /api/attendance (filtered by teacher)
  ↓
Calculate Personal Statistics
  ↓
Return Recent Attendance Records
```

#### **Student Dashboard:**
```
GET /api/student/attendance (filtered by student)
  ↓
Calculate Attendance Percentage
  ↓
Return Personal Statistics
```

**Key Files:**
- `app/admin/dashboard/page.tsx` - Admin dashboard
- `app/teacher/dashboard/page.tsx` - Teacher dashboard
- `app/student/dashboard/page.tsx` - Student dashboard
- `app/api/dashboard/stats/route.ts` - Statistics API

---

## 🏗️ Project Architecture

### **Frontend Structure:**
```
app/
├── page.tsx              # Landing page
├── login/                # Login page
├── register/             # Registration page
├── dashboard/            # General dashboard (redirects)
├── admin/                # Admin pages
│   ├── dashboard/        # Admin dashboard
│   ├── students/         # Student management
│   ├── teachers/         # Teacher management
│   ├── attendance/       # Attendance management
│   ├── departments/      # Department management
│   ├── classes/          # Class management
│   └── users/            # User approval
├── teacher/              # Teacher pages
│   ├── dashboard/        # Teacher dashboard
│   ├── attendance/       # Mark attendance
│   └── students/        # View students
└── student/              # Student pages
    ├── dashboard/        # Student dashboard
    └── attendance/      # View own attendance
```

### **Backend Structure:**
```
app/api/
├── auth/                 # Authentication
│   ├── login/           # POST - Login
│   ├── register/       # POST - Register
│   ├── logout/         # POST - Logout
│   └── me/             # GET - Current user
├── admin/               # Admin endpoints
│   └── users/          # User management
├── students/           # Student CRUD
├── teachers/           # Teacher CRUD
├── attendance/         # Attendance CRUD
├── departments/       # Department CRUD
├── classes/           # Class CRUD
├── dashboard/         # Statistics
└── notifications/     # Notifications
```

### **Library Structure:**
```
lib/
├── db.ts              # Prisma client
├── auth.ts            # JWT authentication (Node.js)
├── auth-edge.ts       # JWT authentication (Edge)
└── middleware-api.ts  # API middleware utilities
```

---

## 🔐 Security Implementation

### **1. Password Security:**
- ✅ **Hashing**: bcrypt with salt rounds (10)
- ✅ **Validation**: Password strength requirements
- ✅ **Storage**: Never stored in plain text

### **2. Authentication:**
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **HttpOnly Cookies**: Prevents XSS attacks
- ✅ **Secure Cookies**: In production (HTTPS)
- ✅ **Token Verification**: On every protected route

### **3. Authorization:**
- ✅ **Role-Based Access**: Middleware enforces roles
- ✅ **API Protection**: `requireAuth()` and `adminOnly()` helpers
- ✅ **Route Protection**: Middleware blocks unauthorized access

### **4. Input Validation:**
- ✅ **Email Validation**: Format checking
- ✅ **Password Validation**: Strength requirements
- ✅ **SQL Injection**: Prisma ORM prevents SQL injection
- ✅ **XSS Protection**: Next.js built-in protection

---

## 🚀 CI/CD Pipeline Flow

### **Jenkins Pipeline Stages:**

```
1. Checkout
   ↓
2. Install Tools (Node.js, SonarQube Scanner, Docker)
   ↓
3. Install Dependencies (npm install)
   ↓
4. Lint (npm run lint)
   ↓
5. SonarQube Analysis
   ↓
6. Wait for Quality Gate
   ↓
7. Build Docker Image
   ↓
8. Push to Nexus
   ↓
9. Deploy
```

**Key Files:**
- `Jenkinsfile` - Complete pipeline definition
- `Dockerfile` - Docker image build
- `docker-compose.yml` - Deployment configuration
- `sonar-project.properties` - SonarQube configuration

**Configuration:**
- **Docker Image**: `2401084-vivek-kamble`
- **Nexus Registry**: `nexus.imcc.com:8082`
- **SonarQube**: `http://sonarqube.imcc.com`
- **Project Key**: `2401084-Student-Attendance-System-CICD`

---

## 📊 Database Schema

### **Core Tables:**

1. **users**
   - id, email, password, fullName, role, status, department, mobile
   - Relations: student, teacher, notifications

2. **students**
   - id, userId, rollNo, class, department, status
   - Relations: user, attendance

3. **teachers**
   - id, userId, department
   - Relations: user, attendance

4. **attendance**
   - id, studentId, teacherId, date, status, remarks
   - Relations: student, teacher

5. **departments**
   - id, name, code

6. **classes**
   - id, name, department

7. **notifications**
   - id, userId, message, read, createdAt
   - Relations: user

---

## 🔄 Data Flow Examples

### **Example 1: Student Registration**
```
1. User fills registration form
2. POST /api/auth/register
3. Validate input
4. Hash password
5. Create user (status: PENDING)
6. Create student record
7. Return success
8. Admin sees in pending users
9. Admin approves
10. User can login
```

### **Example 2: Mark Attendance**
```
1. Teacher selects class and date
2. GET /api/students (filtered by class)
3. Teacher marks present/absent
4. POST /api/attendance/bulk
5. Create attendance records
6. Return success
7. Students can view their attendance
```

### **Example 3: View Dashboard**
```
1. User logs in
2. Middleware verifies token
3. Redirect to role-based dashboard
4. GET /api/dashboard/stats (or role-specific)
5. Calculate statistics
6. Display dashboard
```

---

## ✅ Configuration Status

### **Environment Variables:**
- ✅ `DATABASE_URL` - TiDB Cloud configured
- ✅ `JWT_SECRET` - Configured
- ✅ `NEXT_PUBLIC_APP_URL` - Configured
- ✅ `NODE_ENV` - Set to development
- ✅ CI/CD variables - All configured

### **Database:**
- ✅ TiDB Cloud credentials configured
- ⚠️ **Action Required**: Whitelist IP in TiDB Cloud
- ⚠️ **Action Required**: Run migrations

### **CI/CD:**
- ✅ Jenkins pipeline configured
- ✅ SonarQube configured
- ✅ Nexus configured
- ✅ Docker image name: `2401084-vivek-kamble`

---

## 🎯 Next Steps

### **1. Database Setup:**
```bash
# Test connection (after IP whitelist)
npm run check-db

# Run migrations
npx prisma migrate deploy

# Create admin user
npm run create-admin-vivek
```

### **2. Start Application:**
```bash
# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

### **3. Test Flow:**
1. Register a new user
2. Login as admin
3. Approve pending user
4. Login as approved user
5. Test attendance marking
6. View dashboards

---

## 📝 Important Notes

### **Database Connection:**
- ⚠️ **IP Whitelist**: Your IP must be whitelisted in TiDB Cloud
- ✅ **SSL Required**: Connection uses `sslaccept=strict`
- ✅ **Credentials**: All configured in `.env`

### **Authentication:**
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **Cookies**: HttpOnly, Secure in production
- ✅ **Middleware**: Protects all routes

### **Security:**
- ✅ **Password Hashing**: bcrypt with salt
- ✅ **SQL Injection**: Prevented by Prisma
- ✅ **XSS Protection**: Next.js built-in
- ✅ **CSRF Protection**: Next.js built-in

---

## 🔍 Verification Checklist

- [x] **.env file** - Perfect configuration
- [x] **TiDB Cloud** - Credentials configured
- [ ] **IP Whitelist** - Add your IP to TiDB Cloud
- [ ] **Database Connection** - Test with `npm run check-db`
- [ ] **Migrations** - Run `npx prisma migrate deploy`
- [ ] **Admin User** - Create with `npm run create-admin-vivek`
- [x] **CI/CD Pipeline** - Jenkinsfile configured
- [x] **SonarQube** - Configuration complete
- [x] **Nexus** - Configuration complete

---

## 📚 Documentation Files

- `TIDB_CLOUD_SETUP.md` - TiDB Cloud setup guide
- `TIDB_QUICK_START.md` - Quick start guide
- `TIDB_SETUP_COMPLETE.md` - Complete setup summary
- `ENV_FILE_GUIDE.md` - Environment variables guide
- `COMPLETE_PROJECT_FLOW_ANALYSIS.md` - This file

---

**Status**: ✅ **Complete Project Flow Analyzed!** 🎉

All components are configured and ready. Just whitelist your IP in TiDB Cloud and run migrations!

