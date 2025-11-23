# Student Attendance Management System

> A comprehensive, modern attendance management system for educational institutions built with Next.js, MySQL, Docker, and CI/CD integration.

## 🚀 Quick Start

### For Development
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

### For Production Deployment
📖 **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step deployment instructions.**

Quick deployment checklist:
- ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Use this to track your progress
- ✅ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete beginner-friendly guide

## 📚 Documentation

A comprehensive attendance management system built with Next.js, MySQL, and Docker. This system supports three user roles: Admin, Teacher, and Student, with role-based access control and automated CI/CD pipeline.

## Features

### 🔐 Authentication
- User registration with role selection (Student/Teacher)
- JWT-based authentication
- Admin approval workflow for new registrations
- Secure password hashing with bcrypt

### 👥 User Management
- **Admin**: Approve/reject pending user registrations
- **Teacher/Admin**: CRUD operations for students
- Search functionality for students

### 📅 Attendance Management
- **Teacher**: Mark attendance for classes (bulk operations)
- **Teacher**: View, update, and delete attendance records
- **Student**: View personal attendance history and statistics
- Filter attendance by date, class, or student

### 📊 Dashboards
- **Admin Dashboard**: Overview of total students, teachers, pending users, and attendance records
- **Teacher Dashboard**: Personal attendance records and recent activity
- **Student Dashboard**: Attendance percentage, statistics, and recent records

### 🏢 Department & Class Management
- **Admin**: Create, edit, and delete departments
- **Admin**: Create, edit, and delete classes

### 🔔 Notifications
- In-app notifications when admin approves user accounts

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Bootstrap 5, React Bootstrap
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Jenkins

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Docker and Docker Compose (for containerized deployment)
- Jenkins (for CI/CD pipeline)

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   cd Student-Attendance-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **Option 1: Automated setup (Recommended)**
   ```bash
   npm run setup
   ```
   This will create `.env` file from `.env.example` and generate secure secrets automatically.
   
   **Option 2: Manual setup**
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file and update the following required variables:
   ```env
   # Database Configuration
   DATABASE_URL="mysql://attendance_user:attendance_password@localhost:3306/attendance_db"
   
   # JWT Secret (IMPORTANT: Change this to a strong random string in production!)
   JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-characters"
   
   # Application URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
   
   **All Environment Variables:**
   - See `.env.example` for a complete list of all available environment variables
   - Required variables: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
   - Optional variables: MySQL credentials, Docker settings, Email config, etc.

4. **Set up the database**
   ```bash
   # IMPORTANT: Generate Prisma Client first (required before starting the app)
   npx prisma generate
   
   # Run migrations to create database tables
   npx prisma migrate dev
   
   # Or if you prefer to reset and start fresh:
   # npx prisma migrate reset
   ```
   
   **Note**: Prisma Client must be generated before running the app. The `npm run dev` command now automatically runs `prisma generate`, but it's recommended to run it manually first.

5. **Create an admin user**
   
   Option 1: Using the script (recommended)
   ```bash
   npm run create-admin [email] [password] [fullName] [department]
   # Example:
   npm run create-admin admin@example.com admin123 "Admin User" IT
   ```
   
   Option 2: Manually via SQL
   ```sql
   -- First, generate password hash using Node.js:
   -- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(h => console.log(h));"
   
   INSERT INTO users (email, password, full_name, role, status, department, created_at, updated_at)
   VALUES ('admin@example.com', '$2a$10$hashed_password_here', 'Admin User', 'ADMIN', 'APPROVED', 'IT', NOW(), NOW());
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker exec attendance_app npx prisma migrate deploy
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - MySQL: localhost:3306

### Jenkins CI/CD Setup

1. **Configure Jenkins**
   - Install Docker and Docker Compose plugins
   - Configure credentials if using Docker registry
   - Create a new pipeline job

2. **Configure Pipeline**
   - Point Jenkinsfile to your repository
   - Set up webhook for automatic builds on push

3. **Deploy**
   - Push to `main` branch triggers automatic build and deployment
   - Jenkins will build Docker image, run tests, and deploy

## Project Structure

```
Student-Attendance-System/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin endpoints
│   │   ├── students/     # Student management
│   │   ├── attendance/  # Attendance management
│   │   └── ...
│   ├── admin/            # Admin pages
│   ├── teacher/          # Teacher pages
│   ├── student/          # Student pages
│   └── ...
├── components/           # React components
├── lib/                  # Utility functions
│   ├── db.ts            # Prisma client
│   ├── auth.ts          # Authentication utilities
│   └── middleware-api.ts # API middleware
├── prisma/              # Prisma schema and migrations
├── Dockerfile           # Docker build configuration
├── docker-compose.yml   # Docker Compose configuration
├── Jenkinsfile          # Jenkins pipeline
└── package.json        # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/users/pending` - Get pending users
- `POST /api/admin/users/approve` - Approve/reject user

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `GET /api/students/[id]` - Get student
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Mark attendance
- `POST /api/attendance/bulk` - Mark bulk attendance
- `PUT /api/attendance/[id]` - Update attendance
- `DELETE /api/attendance/[id]` - Delete attendance

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Credentials

**Important**: Create an admin user manually after first setup. Use the SQL query provided in the Installation section.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:password@localhost:3306/attendance_db` |
| `JWT_SECRET` | Secret key for JWT token signing (min 32 characters) | `your-super-secret-jwt-key-change-in-production` |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | `http://localhost:3000` |

### Optional Variables

#### Database Configuration (for Docker)
- `MYSQL_ROOT_PASSWORD` - MySQL root password (default: `rootpassword`)
- `MYSQL_DATABASE` - Database name (default: `attendance_db`)
- `MYSQL_USER` - MySQL user (default: `attendance_user`)
- `MYSQL_PASSWORD` - MySQL password (default: `attendance_password`)

#### Application Settings
- `NODE_ENV` - Environment mode: `development` or `production` (default: `development`)
- `PORT` - Application port (default: `3000`)
- `HOSTNAME` - Hostname to bind to (default: `0.0.0.0`)
- `COOKIE_SECRET` - Secret for cookie signing

#### Docker Configuration
- `DOCKER_IMAGE` - Docker image name (default: `attendance-system`)
- `DOCKER_TAG` - Docker image tag (default: `latest`)

#### Jenkins CI/CD (Optional)
- `JENKINS_URL` - Jenkins server URL
- `DOCKER_REGISTRY` - Docker registry URL
- `DOCKER_USERNAME` - Docker registry username
- `DOCKER_PASSWORD` - Docker registry password

#### Email Configuration (Optional - for future features)
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (default: `587`)
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM` - Default sender email address

#### File Upload (Optional - for future features)
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: `5242880` = 5MB)
- `UPLOAD_DIR` - Directory for file uploads (default: `./uploads`)

### Setting Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your actual values

3. **For production**, ensure:
   - Use strong, random values for `JWT_SECRET` and `COOKIE_SECRET`
   - Use secure database passwords
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

4. **Generate secure secrets:**
   ```bash
   # Generate JWT secret (Node.js)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Or using OpenSSL
   openssl rand -hex 32
   ```

## Security Notes

- **Always change `JWT_SECRET`** in production - use a strong random string (min 32 characters)
- Use strong passwords for database credentials
- Never commit `.env` file to version control (already in `.gitignore`)
- Enable HTTPS in production
- Regularly update dependencies
- Review and configure CORS settings
- Use environment-specific `.env` files (`.env.local`, `.env.production`)

## Development

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

### Build for Production
```bash
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations

### Docker Issues
- Check container logs: `docker logs attendance_app`
- Verify ports are not in use
- Check Docker Compose configuration

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please open an issue on the repository.

# Student-Attendance-System-CICD
