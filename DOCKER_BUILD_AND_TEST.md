# 🐳 Docker Build and Test Guide

## Quick Commands to Build and Run Docker Image

### Step 1: Build Docker Image Locally

```bash
# Clone your repository (if not already done)
git clone https://github.com/VivekKamble014/Student-Attendance-System-CICD.git
cd Student-Attendance-System-CICD

# Build Docker image
docker build -t 2401084-vivek-kamble:latest .

# Or with a specific tag
docker build -t 2401084-vivek-kamble:v1.0 .
```

### Step 2: Run Docker Container

```bash
# Run using docker-compose (recommended - includes MySQL)
docker-compose up -d

# Or run manually
docker run -d \
  --name attendance_app \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://attendance_user:attendance_password@host.docker.internal:3306/attendance_db" \
  -e JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-characters" \
  -e NODE_ENV="production" \
  2401084-vivek-kamble:latest
```

### Step 3: Verify Container is Running

```bash
# Check running containers
docker ps

# Check logs
docker logs attendance_app

# Test health endpoint
curl http://localhost:3000/api/health
```

### Step 4: Stop and Remove Container

```bash
# Stop container
docker stop attendance_app

# Remove container
docker rm attendance_app

# Or using docker-compose
docker-compose down
```

---

## 🚀 Complete Setup with Docker Compose

### 1. Create .env file

```bash
# Copy example
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required .env variables:**
```env
DATABASE_URL=mysql://attendance_user:attendance_password@mysql:3306/attendance_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=attendance_db
MYSQL_USER=attendance_user
MYSQL_PASSWORD=attendance_password
NODE_ENV=production
PORT=3000
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Run Database Migrations

```bash
# Run migrations
docker exec attendance_app npx prisma migrate deploy

# Or create admin user
docker exec attendance_app npm run create-admin admin@example.com admin123 "Admin User" IT
```

### 4. Access Application

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **MySQL**: localhost:3306

---

## 📤 Push to Nexus Registry

### 1. Tag Image for Nexus

```bash
# Tag image for Nexus
docker tag 2401084-vivek-kamble:latest nexus.imcc.com:8082/2401084-vivek-kamble:latest
docker tag 2401084-vivek-kamble:latest nexus.imcc.com:8082/2401084-vivek-kamble:v1.0
```

### 2. Login to Nexus

```bash
# Login to Nexus
docker login nexus.imcc.com:8082 -u student -p Imcc@2025
```

### 3. Push to Nexus

```bash
# Push image
docker push nexus.imcc.com:8082/2401084-vivek-kamble:latest
docker push nexus.imcc.com:8082/2401084-vivek-kamble:v1.0
```

### 4. Verify in Nexus

- Go to: http://nexus.imcc.com/
- Login: `student` / `Imcc@2025`
- Browse → docker-hosted
- You should see your image!

---

## 🔍 Test on SonarQube

### 1. Run SonarQube Analysis Locally

```bash
# Install SonarQube Scanner (if not installed)
# Download from: https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/

# Run analysis
sonar-scanner \
  -Dsonar.projectKey=2401084-vivek-kamble \
  -Dsonar.host.url=http://sonarqube.imcc.com \
  -Dsonar.login=YOUR_SONARQUBE_TOKEN
```

### 2. View Results

- Go to: http://sonarqube.imcc.com/
- Login: `student` / `Imccstudent@2025`
- Dashboard → Your project: `2401084-vivek-kamble`

---

## ✅ Verification Checklist

- [ ] Docker image builds successfully
- [ ] Container runs without errors
- [ ] Application accessible on http://localhost:3000
- [ ] Health endpoint responds
- [ ] Database connection works
- [ ] Image pushed to Nexus
- [ ] SonarQube analysis completed
- [ ] Quality gate passed

---

**Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD.git

