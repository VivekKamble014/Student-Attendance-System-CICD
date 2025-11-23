# Troubleshooting Guide - Registration Errors

## Common Registration Errors and Solutions

### 500 Internal Server Error

If you're getting a 500 error during registration, follow these steps:

#### 1. Check Database Connection

```bash
# Run the database check script
npm run check-db
```

**If connection fails:**
- Verify MySQL is running: `mysql --version`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `mysql -u root -p` then `SHOW DATABASES;`
- Test connection: `mysql -u attendance_user -p attendance_db`

#### 2. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# If migrations fail, reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

#### 3. Check Environment Variables

Ensure `.env` file exists and contains:

```env
DATABASE_URL="mysql://attendance_user:attendance_password@localhost:3306/attendance_db"
JWT_SECRET="your-secret-key-here"
```

#### 4. Verify Prisma Client

```bash
# Regenerate Prisma Client
npx prisma generate

# Check Prisma Studio (opens database viewer)
npx prisma studio
```

### Common Error Messages

#### "Database connection failed"
- **Solution**: Check if MySQL service is running
- **Windows**: Services → MySQL → Start
- **Mac/Linux**: `sudo service mysql start` or `brew services start mysql`

#### "User already exists"
- **Solution**: Use a different email address or check existing users in database

#### "Roll number already exists"
- **Solution**: Use a different roll number for the student

#### "Validation failed"
- **Solution**: Check that all required fields are filled correctly
- Email must be valid format
- Password must be at least 6 characters
- All required fields must be provided

### Testing Registration

1. **Check API Health**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test Registration Endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "test123",
       "fullName": "Test User",
       "role": "STUDENT",
       "department": "IT",
       "rollNo": "12345",
       "class": "A"
     }'
   ```

### Database Setup from Scratch

If starting fresh:

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE attendance_db;
CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'attendance_password';
GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 2. Setup Prisma
npx prisma generate
npx prisma migrate dev --name init

# 3. Create admin user
npm run create-admin admin@example.com admin123 "Admin User" IT
```

### Still Having Issues?

1. Check server logs in terminal where `npm run dev` is running
2. Check browser console for client-side errors
3. Verify all dependencies are installed: `npm install`
4. Clear Next.js cache: `rm -rf .next`
5. Restart development server

### Production Deployment

For production:
- Use connection pooling
- Set proper DATABASE_URL
- Use strong JWT_SECRET
- Enable SSL for database connection
- Set up proper error logging

