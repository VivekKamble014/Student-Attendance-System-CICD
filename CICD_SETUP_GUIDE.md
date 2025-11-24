# 🚀 Complete CI/CD Setup Guide
## Jenkins → SonarQube → Nexus → Deployment Pipeline

This guide will walk you through setting up a complete CI/CD pipeline for the Student Attendance System using Jenkins, SonarQube, and Nexus.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Access to Jenkins: `http://jenkins.imcc.com/`
- ✅ Access to SonarQube: `http://sonarqube.imcc.com/`
- ✅ Access to Nexus: `http://nexus.imcc.com/`
- ✅ GitHub repository: `2401084-vivek-kamble`
- ✅ Docker installed on Jenkins server
- ✅ Node.js installed on Jenkins server (or via Jenkins tool configuration)

---

## 🔐 Step 1: Configure Jenkins Credentials

### 1.1 Access Jenkins
1. Open `http://jenkins.imcc.com/`
2. Login with:
   - **Username**: `student`
   - **Password**: `Changeme@2025`

### 1.2 Create SonarQube Token
1. Go to SonarQube: `http://sonarqube.imcc.com/`
2. Login with:
   - **Username**: `student`
   - **Password**: `Imccstudent@2025`
3. Click on your profile (top right) → **My Account**
4. Go to **Security** tab
5. Generate a new token:
   - Name: `jenkins-token`
   - Type: **User Token**
   - Click **Generate**
   - **COPY THE TOKEN** (you won't see it again!)

### 1.3 Add Credentials in Jenkins

#### A. Add SonarQube Token
1. In Jenkins, go to **Manage Jenkins** → **Credentials**
2. Click **System** → **Global credentials (unrestricted)**
3. Click **Add Credentials**
4. Configure:
   - **Kind**: Secret text
   - **Secret**: Paste your SonarQube token
   - **ID**: `sonarqube-token`
   - **Description**: `SonarQube Authentication Token`
5. Click **OK**

#### B. Add Nexus Credentials
1. Click **Add Credentials** again
2. Configure:
   - **Kind**: Username with password
   - **Username**: `student`
   - **Password**: `Imcc@2025`
   - **ID**: `nexus-credentials`
   - **Description**: `Nexus Docker Registry Credentials`
3. Click **OK**

#### C. Add GitHub Credentials (if using private repo)
1. Click **Add Credentials** again
2. Configure:
   - **Kind**: Username with password (or SSH Username with private key)
   - **Username**: Your GitHub username
   - **Password**: Your GitHub personal access token
   - **ID**: `github-credentials`
   - **Description**: `GitHub Repository Access`
3. Click **OK**

---

## 🔧 Step 2: Configure Jenkins Plugins

### 2.1 Install Required Plugins
1. Go to **Manage Jenkins** → **Plugins**
2. Click **Available plugins** tab
3. Search and install:
   - ✅ **SonarQube Scanner** (or SonarQube Quality Gates)
   - ✅ **Docker Pipeline**
   - ✅ **Docker**
   - ✅ **GitHub Integration** (if using GitHub)
   - ✅ **Pipeline**
   - ✅ **NodeJS Plugin** (for Node.js builds)

### 2.2 Configure SonarQube Server
1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers** section
3. Click **Add SonarQube**
4. Configure:
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Server authentication token**: Select `sonarqube-token` from dropdown
5. Click **Save**

### 2.3 Configure Node.js (if needed)
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Find **NodeJS** section
3. Click **Add NodeJS**
4. Configure:
   - **Name**: `nodejs`
   - **Version**: Select Node.js 18 or higher
   - **Install automatically**: ✅ Checked
5. Click **Save**

---

## 📦 Step 3: Configure Nexus Docker Registry

### 3.1 Verify Nexus Access
1. Open `http://nexus.imcc.com/`
2. Login with:
   - **Username**: `student`
   - **Password**: `Imcc@2025`
3. Verify Docker repository exists:
   - Go to **Browse** → **docker-hosted**
   - Ensure it's configured for Docker images

### 3.2 Configure Docker Registry on Jenkins Server
On your Jenkins server, configure Docker to trust Nexus:

```bash
# Create or edit Docker daemon.json
sudo nano /etc/docker/daemon.json

# Add insecure registry (if Nexus uses HTTP)
{
  "insecure-registries": ["nexus.imcc.com:8082"]
}

# Restart Docker
sudo systemctl restart docker
```

**Note**: If Nexus uses HTTPS, you may need to configure SSL certificates instead.

---

## 🔗 Step 4: Create Jenkins Pipeline Job

### 4.1 Create New Pipeline
1. In Jenkins, click **New Item**
2. Enter name: `2401084-vivek-kamble` (or your preferred name)
3. Select **Pipeline**
4. Click **OK**

### 4.2 Configure Pipeline
1. **General** tab:
   - ✅ **GitHub project** (optional): Add your GitHub repo URL
   - ✅ **This project is parameterized** (optional): Add BUILD_BRANCH parameter

2. **Pipeline** tab:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/YOUR_USERNAME/2401084-vivek-kamble.git`
     - Or use SSH: `git@github.com:YOUR_USERNAME/2401084-vivek-kamble.git`
   - **Credentials**: Select your GitHub credentials (if private repo)
   - **Branches to build**: `*/main` (or your main branch)
   - **Script Path**: `Jenkinsfile`
   - **Lightweight checkout**: ✅ Checked (optional)

3. Click **Save**

### 4.3 Configure GitHub Webhook (Optional - for auto-trigger)
1. Go to your GitHub repository
2. Go to **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL**: `http://jenkins.imcc.com/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: ✅ Push events
   - **Active**: ✅ Checked
4. Click **Add webhook**

5. In Jenkins job, go to **Build Triggers**:
   - ✅ **GitHub hook trigger for GITScm polling**

---

## 🎯 Step 5: Create SonarQube Project

### 5.1 Create Project in SonarQube
1. Go to `http://sonarqube.imcc.com/`
2. Click **+** (Create Project) → **Manually**
3. Configure:
   - **Project display name**: `Student Attendance System - 2401084-vivek-kamble`
   - **Project key**: `2401084-vivek-kamble`
   - **Main branch name**: `main`
4. Click **Set Up**
5. Select **With Jenkins** → **Generate a token**
6. Copy the token (you already added it to Jenkins in Step 1.3)

### 5.2 Configure Quality Gate
1. In SonarQube, go to **Quality Gates**
2. Select **Sonar way** (default) or create custom
3. Ensure it's set as default

---

## 🚀 Step 6: Run Your First Build

### 6.1 Manual Build
1. Go to your Jenkins pipeline job
2. Click **Build Now**
3. Watch the build progress in **Console Output**

### 6.2 Verify Pipeline Stages
The pipeline should execute these stages:
1. ✅ **Checkout** - Pulls code from GitHub
2. ✅ **Install Dependencies** - Runs `npm ci` and Prisma generate
3. ✅ **Lint** - Runs ESLint
4. ✅ **SonarQube Analysis** - Analyzes code quality
5. ✅ **Wait for SonarQube Quality Gate** - Waits for quality gate result
6. ✅ **Build Docker Image** - Builds Docker image
7. ✅ **Push to Nexus** - Pushes image to Nexus (only on main branch)
8. ✅ **Deploy** - Deploys application (only on main branch)

### 6.3 Check Results
- **Jenkins**: View build status and logs
- **SonarQube**: Check code analysis results at `http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble`
- **Nexus**: Check Docker images at `http://nexus.imcc.com/` → Browse → docker-hosted

---

## 📝 Step 7: Deployment Configuration

### 7.1 Update Deployment Path (if needed)
The Jenkinsfile deploys to `/opt/attendance-system`. If you need a different path:

1. Edit `Jenkinsfile`
2. Find the `Deploy` stage
3. Update the path:
   ```groovy
   cd /opt/attendance-system || {
       // Change this path if needed
   }
   ```

### 7.2 Ensure Docker Compose is Available
On your deployment server:
```bash
# Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Create deployment directory (if needed)
sudo mkdir -p /opt/attendance-system
sudo chown $USER:$USER /opt/attendance-system
```

### 7.3 Environment Variables
Create a `.env` file in your deployment directory:
```bash
# In /opt/attendance-system/.env
DATABASE_URL=mysql://attendance_user:attendance_password@mysql:3306/attendance_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
NEXT_PUBLIC_APP_URL=http://your-domain.com
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=attendance_db
MYSQL_USER=attendance_user
MYSQL_PASSWORD=attendance_password
NODE_ENV=production
PORT=3000
```

---

## 🔍 Step 8: Troubleshooting

### Common Issues

#### 1. SonarQube Connection Failed
- **Error**: `Unable to connect to SonarQube server`
- **Solution**: 
  - Verify SonarQube URL in Jenkins configuration
  - Check SonarQube token is correct
  - Ensure SonarQube server is accessible from Jenkins

#### 2. Nexus Push Failed
- **Error**: `unauthorized: authentication required`
- **Solution**:
  - Verify Nexus credentials in Jenkins
  - Check Docker registry URL format
  - Ensure Docker daemon is configured for insecure registry (if using HTTP)

#### 3. Docker Build Failed
- **Error**: `Cannot connect to Docker daemon`
- **Solution**:
  - Ensure Jenkins user is in `docker` group: `sudo usermod -aG docker jenkins`
  - Restart Jenkins: `sudo systemctl restart jenkins`

#### 4. Deployment Failed
- **Error**: `Permission denied` or `Directory not found`
- **Solution**:
  - Check deployment directory permissions
  - Ensure Jenkins user has write access
  - Verify Docker Compose is installed

#### 5. Quality Gate Failed
- **Error**: `Quality Gate failed`
- **Solution**:
  - Check SonarQube dashboard for issues
  - Fix code quality issues
  - Adjust Quality Gate rules if needed

---

## 📊 Step 9: Monitor Your Pipeline

### 9.1 Jenkins Dashboard
- View all builds: Jenkins home page
- View build history: Click on your job
- View console output: Click on a build → Console Output

### 9.2 SonarQube Dashboard
- View code quality: `http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble`
- Check metrics: Coverage, Duplications, Code Smells, etc.

### 9.3 Nexus Repository
- View Docker images: `http://nexus.imcc.com/` → Browse → docker-hosted
- Check image tags and versions

---

## ✅ Step 10: Verify Deployment

### 10.1 Check Application
1. Access your application URL
2. Verify it's running: `curl http://localhost:3000/api/health`
3. Check Docker containers: `docker ps`

### 10.2 Check Logs
```bash
# Application logs
docker logs attendance_app

# MySQL logs
docker logs attendance_mysql

# Docker Compose logs
cd /opt/attendance-system
docker-compose logs
```

---

## 🎉 Success Checklist

- [ ] Jenkins credentials configured (SonarQube token, Nexus credentials)
- [ ] SonarQube server configured in Jenkins
- [ ] Jenkins pipeline job created and configured
- [ ] GitHub webhook configured (optional)
- [ ] SonarQube project created
- [ ] First build completed successfully
- [ ] Docker image pushed to Nexus
- [ ] Application deployed and running
- [ ] Health check passing

---

## 📚 Additional Resources

- **Jenkins Documentation**: https://www.jenkins.io/doc/
- **SonarQube Documentation**: https://docs.sonarqube.org/
- **Nexus Documentation**: https://help.sonatype.com/repomanager3
- **Docker Documentation**: https://docs.docker.com/

---

## 🆘 Need Help?

If you encounter issues:
1. Check Jenkins console output for detailed error messages
2. Review SonarQube logs
3. Check Docker logs
4. Verify all credentials are correct
5. Ensure all services are accessible from Jenkins server

---

**Last Updated**: 2025-01-08
**Pipeline Version**: 1.0
**Repository**: 2401084-vivek-kamble

