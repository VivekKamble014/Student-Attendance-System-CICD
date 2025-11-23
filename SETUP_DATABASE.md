# Database Setup Guide

## Quick Setup Steps

### 1. Check if MySQL is Running

**macOS (Homebrew):**
```bash
brew services list | grep mysql
# If not running:
brew services start mysql
```

**macOS (System):**
```bash
sudo /usr/local/mysql/support-files/mysql.server start
```

**Linux:**
```bash
sudo service mysql start
# or
sudo systemctl start mysql
```

**Windows:**
- Open Services (services.msc)
- Find MySQL service
- Start it

### 2. Create Database and User

Connect to MySQL:
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS attendance_db;
CREATE USER IF NOT EXISTS 'attendance_user'@'localhost' IDENTIFIED BY 'attendance_password';
GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Update .env File

Edit `.env` file and set:
```env
DATABASE_URL="mysql://attendance_user:attendance_password@localhost:3306/attendance_db"
```

**Or if using root:**
```env
DATABASE_URL="mysql://root:your_root_password@localhost:3306/attendance_db"
```

### 4. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

### 5. Verify Database Connection

```bash
npm run check-db
```

Should show: ✅ Database connection successful!

### 6. Create Admin User

```bash
npm run create-admin admin@example.com admin123 "Admin User" IT
```

## Using Docker (Alternative)

If you prefer Docker:

```bash
# Start MySQL with Docker Compose
docker-compose up -d mysql

# Wait a few seconds for MySQL to start
sleep 10

# Run migrations
npx prisma migrate dev

# Create admin
npm run create-admin admin@example.com admin123 "Admin User" IT
```

## Troubleshooting

### "Access denied for user"
- Check username and password in DATABASE_URL
- Verify user has privileges: `SHOW GRANTS FOR 'attendance_user'@'localhost';`

### "Unknown database"
- Create database: `CREATE DATABASE attendance_db;`

### "Can't connect to MySQL server"
- Check if MySQL is running
- Verify port (default: 3306)
- Check firewall settings

### "Environment variable not found"
- Make sure .env file exists
- Check DATABASE_URL is set correctly
- No quotes needed in .env file value

## Test Connection

```bash
# Test with MySQL client
mysql -u attendance_user -p attendance_db

# Or use Prisma Studio
npx prisma studio
```

