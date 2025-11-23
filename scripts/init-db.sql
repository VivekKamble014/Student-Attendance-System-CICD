-- Initialize Database Script
-- Run this after creating the database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- Note: Prisma will create all tables via migrations
-- This script is for reference or manual setup if needed

-- After running Prisma migrations, you can create an admin user:
-- Replace 'hashed_password' with a bcrypt hash of your password
-- You can generate it using: node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"

-- Example admin user (update password hash):
-- INSERT INTO users (email, password, full_name, role, status, department, created_at, updated_at)
-- VALUES ('admin@example.com', '$2a$10$hashed_password_here', 'Admin User', 'ADMIN', 'APPROVED', 'IT', NOW(), NOW());

