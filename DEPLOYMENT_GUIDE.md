# 🚀 Complete Deployment Guide
## Student Attendance Management System

This guide will walk you through deploying the Student Attendance Management System to your college server using GitHub, Docker, Jenkins, Nexus, and SonarQube.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your GitHub Repository](#step-1-prepare-your-github-repository)
3. [Step 2: Set Up Your College Server](#step-2-set-up-your-college-server)
4. [Step 3: Install Docker](#step-3-install-docker)
5. [Step 4: Install Jenkins](#step-4-install-jenkins)
6. [Step 5: Set Up Nexus Repository](#step-5-set-up-nexus-repository)
7. [Step 6: Set Up SonarQube](#step-6-set-up-sonarqube)
8. [Step 7: Configure Jenkins Pipeline](#step-7-configure-jenkins-pipeline)
9. [Step 8: Configure Environment Variables](#step-8-configure-environment-variables)
10. [Step 9: Deploy the Application](#step-9-deploy-the-application)
11. [Step 10: Post-Deployment](#step-10-post-deployment)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ A GitHub account and repository
- ✅ Access to your college server (Linux-based recommended)
- ✅ SSH access to the server
- ✅ Basic knowledge of Linux commands
- ✅ Admin/sudo access on the server

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it: `student-attendance-system`
4. Set visibility: **Private** (recommended) or **Public**
5. **DO NOT** initialize with README (we already have files)
6. Click **"Create repository"**

### 1.2 Push Your Code to GitHub

Open terminal in your project directory and run:

```bash
# Navigate to your project
cd /Users/vivek/Desktop/CICD/Student-Attendance-System

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Student Attendance Management System"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/student-attendance-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You may need to authenticate. Use a Personal Access Token if prompted.

### 1.3 Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Name it: `Jenkins-Deployment`
4. Select scopes: `repo` (full control)
5. Click **"Generate token"**
6. **Copy and save the token** (you won't see it again!)

---

## Step 2: Set Up Your College Server

### 2.1 Connect to Your Server

```bash
# Connect via SSH (replace with your server details)
ssh username@your-college-server-ip

# Example:
ssh admin@192.168.1.100
```

### 2.2 Update System Packages

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt upgrade -y

# For CentOS/RHEL
sudo yum update -y
```

### 2.3 Install Required Tools

```bash
# Install essential tools
sudo apt install -y curl wget git vim unzip

# Install Java (required for Jenkins, SonarQube, Nexus)
sudo apt install -y openjdk-17-jdk

# Verify Java installation
java -version
```

---

## Step 3: Install Docker

### 3.1 Install Docker

```bash
# Remove old versions (if any)
sudo apt remove docker docker-engine docker.io containerd runc

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker run hello-world
```

### 3.2 Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

**Important:** Log out and log back in for docker group changes to take effect.

---

## Step 4: Install Jenkins

### 4.1 Install Jenkins

```bash
# Add Jenkins repository key
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Add Jenkins repository
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update package list
sudo apt update

# Install Jenkins
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check Jenkins status
sudo systemctl status jenkins
```

### 4.2 Access Jenkins Web Interface

1. Open browser and go to: `http://your-server-ip:8080`
2. You'll see "Unlock Jenkins" page
3. Get the initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

4. Copy the password and paste it in Jenkins
5. Click **"Install suggested plugins"**
6. Wait for installation to complete
7. Create admin user:
   - Username: `admin` (or your choice)
   - Password: (create a strong password)
   - Email: your-email@college.edu
8. Click **"Save and Continue"**
9. Click **"Save and Finish"**
10. Click **"Start using Jenkins"**

### 4.3 Install Required Jenkins Plugins

1. In Jenkins, go to **"Manage Jenkins"** → **"Manage Plugins"**
2. Go to **"Available"** tab
3. Search and install these plugins:
   - ✅ **Docker Pipeline**
   - ✅ **Docker**
   - ✅ **GitHub Integration**
   - ✅ **SonarQube Scanner**
   - ✅ **Nexus Artifact Uploader**
   - ✅ **Pipeline**
   - ✅ **Blue Ocean** (optional, for better UI)
4. Click **"Install without restart"**
5. Wait for installation, then restart Jenkins:

```bash
sudo systemctl restart jenkins
```

---

## Step 5: Set Up Nexus Repository

### 5.1 Install Nexus via Docker

```bash
# Create directory for Nexus data
sudo mkdir -p /opt/nexus-data
sudo chown -R 200:200 /opt/nexus-data

# Run Nexus container
docker run -d \
  --name nexus \
  -p 8081:8081 \
  -v /opt/nexus-data:/nexus-data \
  sonatype/nexus3

# Check if Nexus is running
docker ps | grep nexus
```

### 5.2 Access Nexus

1. Wait 2-3 minutes for Nexus to start
2. Open browser: `http://your-server-ip:8081`
3. Click **"Sign in"** (top right)
4. Default credentials:
   - Username: `admin`
   - Password: Get it from:

```bash
docker exec nexus cat /nexus-data/admin.password
```

5. Click **"Sign in"**
6. You'll be prompted to change password - **change it!**
7. Click **"Next"** → **"Enable anonymous access"** (optional) → **"Finish"**

### 5.3 Create Docker Registry in Nexus

1. In Nexus, click **"Repositories"** (gear icon)
2. Click **"Create repository"**
3. Select **"docker (hosted)"**
4. Configure:
   - Name: `docker-hosted`
   - HTTP: Port `8082`
   - Allow anonymous pull: ✅ (if needed)
   - Enable Docker V1 API: ✅
5. Click **"Create repository"**
6. Note the repository URL: `http://your-server-ip:8082`

---

## Step 6: Set Up SonarQube

### 6.1 Install SonarQube via Docker

```bash
# Create directory for SonarQube data
sudo mkdir -p /opt/sonarqube-data
sudo chown -R 999:999 /opt/sonarqube-data

# Run SonarQube container
docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  -v /opt/sonarqube-data:/opt/sonarqube/data \
  sonarqube:lts-community

# Check if SonarQube is running
docker ps | grep sonarqube
```

### 6.2 Access SonarQube

1. Wait 2-3 minutes for SonarQube to start
2. Open browser: `http://your-server-ip:9000`
3. Default credentials:
   - Username: `admin`
   - Password: `admin`
4. You'll be prompted to change password - **change it!**
5. Click **"Skip"** for tutorial (you can do it later)

### 6.3 Create SonarQube Project

1. Click **"Create Project"** → **"Manually"**
2. Fill in:
   - Project key: `student-attendance-system`
   - Display name: `Student Attendance System`
3. Click **"Set Up"**
4. Select **"With Jenkins"**
5. Copy the **Project Key** and **Token** (you'll need these for Jenkins)

---

## Step 7: Configure Jenkins Pipeline

### 7.1 Configure Jenkins Credentials

1. In Jenkins, go to **"Manage Jenkins"** → **"Manage Credentials"**
2. Click **"(global)"** → **"Add Credentials"**

#### Add GitHub Credentials:
- Kind: **Secret text**
- Secret: (paste your GitHub Personal Access Token)
- ID: `github-token`
- Description: `GitHub Personal Access Token`
- Click **"OK"**

#### Add Docker Hub/Nexus Credentials:
- Kind: **Username with password**
- Username: `admin` (or your Nexus username)
- Password: (your Nexus password)
- ID: `nexus-credentials`
- Description: `Nexus Docker Registry`
- Click **"OK"**

#### Add SonarQube Credentials:
- Kind: **Secret text**
- Secret: (paste your SonarQube token from Step 6.3)
- ID: `sonar-token`
- Description: `SonarQube Token`
- Click **"OK"**

### 7.2 Configure SonarQube in Jenkins

1. Go to **"Manage Jenkins"** → **"Configure System"**
2. Scroll to **"SonarQube servers"**
3. Click **"Add SonarQube"**
4. Configure:
   - Name: `SonarQube`
   - Server URL: `http://your-server-ip:9000`
   - Server authentication token: Select `sonar-token` from dropdown
5. Click **"Save"**

### 7.3 Create Jenkins Pipeline Job

1. In Jenkins, click **"New Item"**
2. Enter name: `student-attendance-system`
3. Select **"Pipeline"**
4. Click **"OK"**

### 7.4 Configure Pipeline

1. Scroll to **"Pipeline"** section
2. Definition: **"Pipeline script from SCM"**
3. SCM: **"Git"**
4. Repository URL: `https://github.com/YOUR_USERNAME/student-attendance-system.git`
5. Credentials: Select `github-token` from dropdown
6. Branch: `*/main`
7. Script Path: `Jenkinsfile`
8. Click **"Save"**

---

## Step 8: Configure Environment Variables

### 8.1 Create .env File on Server

```bash
# Create project directory
sudo mkdir -p /opt/attendance-system
cd /opt/attendance-system

# Create .env file
sudo nano .env
```

### 8.2 Add Environment Variables

Paste the following (adjust values as needed):

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=attendance_db
MYSQL_USER=attendance_user
MYSQL_PASSWORD=your_secure_db_password_here
DATABASE_URL=mysql://attendance_user:your_secure_db_password_here@mysql:3306/attendance_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_change_this

# Next.js Configuration
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_APP_URL=http://your-server-ip:3000

# Nexus Configuration (for Jenkins)
NEXUS_URL=http://your-server-ip:8082
NEXUS_USERNAME=admin
NEXUS_PASSWORD=your_nexus_password

# SonarQube Configuration (for Jenkins)
SONAR_HOST_URL=http://your-server-ip:9000
SONAR_TOKEN=your_sonar_token_here
```

**Important:** 
- Replace `your_secure_root_password_here` with a strong password
- Replace `your_secure_db_password_here` with a strong password
- Replace `your_super_secret_jwt_key_min_32_characters_long_change_this` with a random 32+ character string
- Replace `your-server-ip` with your actual server IP
- Generate JWT_SECRET: `openssl rand -base64 32`

Save and exit (Ctrl+X, then Y, then Enter)

### 8.3 Set Proper Permissions

```bash
sudo chmod 600 .env
sudo chown $USER:$USER .env
```

---

## Step 9: Deploy the Application

### 9.1 Update Jenkinsfile

The Jenkinsfile is already configured in your repository. Make sure it has the correct values:

1. Edit `Jenkinsfile` in your project
2. Update these values:
   - `REGISTRY = 'your-server-ip:8082'` (Nexus Docker registry)
   - Update any other server-specific values

### 9.2 Run Jenkins Pipeline

1. In Jenkins, go to your pipeline: `student-attendance-system`
2. Click **"Build Now"**
3. Click on the build number to see progress
4. Click **"Console Output"** to see detailed logs

The pipeline will:
1. ✅ Checkout code from GitHub
2. ✅ Run SonarQube analysis
3. ✅ Build Docker image
4. ✅ Push to Nexus
5. ✅ Deploy to server

### 9.3 First-Time Database Setup

After first deployment, you need to run migrations:

```bash
# Connect to app container
docker exec -it attendance_app sh

# Run migrations
npx prisma migrate deploy

# Create admin user
npm run create-admin

# Exit container
exit
```

---

## Step 10: Post-Deployment

### 10.1 Access Your Application

1. Open browser: `http://your-server-ip:3000`
2. You should see the home page!

### 10.2 Create Admin User

```bash
# SSH into server
ssh username@your-server-ip

# Run admin creation script
docker exec attendance_app npm run create-admin

# Follow prompts or use:
docker exec attendance_app node scripts/create-admin-vivek.js
```

### 10.3 Set Up Reverse Proxy (Optional but Recommended)

If you want to use a domain name instead of IP:port:

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/attendance-system
```

Paste:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/attendance-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 10.4 Set Up SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Follow prompts
```

---

## Troubleshooting

### Issue: Jenkins can't connect to GitHub

**Solution:**
- Check GitHub credentials in Jenkins
- Verify Personal Access Token has `repo` scope
- Check firewall settings

### Issue: Docker build fails

**Solution:**
```bash
# Check Docker logs
docker logs attendance_app

# Check if Docker is running
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker
```

### Issue: Database connection error

**Solution:**
```bash
# Check if MySQL container is running
docker ps | grep mysql

# Check MySQL logs
docker logs attendance_mysql

# Verify DATABASE_URL in .env file
cat /opt/attendance-system/.env | grep DATABASE_URL
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in .env file
```

### Issue: SonarQube analysis fails

**Solution:**
- Verify SonarQube is running: `docker ps | grep sonarqube`
- Check SonarQube token in Jenkins credentials
- Verify SonarQube server URL in Jenkins configuration

### Issue: Nexus push fails

**Solution:**
- Verify Nexus is running: `docker ps | grep nexus`
- Check Nexus credentials in Jenkins
- Verify Docker registry URL in Jenkinsfile

---

## 🔄 Continuous Deployment Workflow

Once set up, the workflow is automatic:

1. **Developer pushes code to GitHub** → `git push origin main`
2. **Jenkins detects the push** → Automatically triggers pipeline
3. **Pipeline runs:**
   - ✅ Code quality check (SonarQube)
   - ✅ Build Docker image
   - ✅ Push to Nexus
   - ✅ Deploy to server
4. **Application is live** → Zero downtime deployment

---

## 📊 Monitoring and Maintenance

### View Application Logs

```bash
# Application logs
docker logs attendance_app -f

# MySQL logs
docker logs attendance_mysql -f
```

### Backup Database

```bash
# Create backup script
sudo nano /opt/backup-db.sh
```

Paste:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
docker exec attendance_mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD attendance_db > $BACKUP_DIR/backup_$DATE.sql
```

Make executable:

```bash
chmod +x /opt/backup-db.sh
```

### Set Up Automatic Backups

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/backup-db.sh
```

---

## 🎉 Congratulations!

Your Student Attendance Management System is now deployed and ready to use!

### Quick Access Links:

- **Application:** http://your-server-ip:3000
- **Jenkins:** http://your-server-ip:8080
- **Nexus:** http://your-server-ip:8081
- **SonarQube:** http://your-server-ip:9000

### Next Steps:

1. ✅ Create admin user
2. ✅ Create departments and classes
3. ✅ Add teachers and students
4. ✅ Start marking attendance!

---

## 📞 Support

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Check application logs: `docker logs attendance_app`
3. Check Jenkins console output
4. Verify all services are running: `docker ps`

---

**Last Updated:** 2024
**Version:** 1.0.0

