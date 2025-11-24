# 🚀 Complete Automation Setup - Jenkins CI/CD Pipeline

This guide will help you set up the complete automated pipeline: **GitHub → Jenkins → SonarQube → Nexus → Deployment**

---

## 📋 Your Project Information

- **GitHub Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD.git
- **Project Key**: `2401084-vivek-kamble`
- **Jenkins URL**: http://jenkins.imcc.com/
- **SonarQube URL**: http://sonarqube.imcc.com/
- **Nexus URL**: http://nexus.imcc.com/

---

## 🎯 Step 1: Configure Jenkins Job

### 1.1 Create Pipeline Job

1. Go to **Jenkins**: http://jenkins.imcc.com/
2. Login: `student` / `Changeme@2025`
3. Click **New Item**
4. Enter name: `2401084-vivek-kamble`
5. Select **Pipeline**
6. Click **OK**

### 1.2 Configure Pipeline

**General Tab:**
- ✅ **GitHub project**: https://github.com/VivekKamble014/Student-Attendance-System-CICD

**Build Triggers:**
- ✅ **Trigger builds remotely (e.g., from scripts)**
- **Authentication Token**: `jenkins-build-token-2401084` (or any secret token)
- **COPY THIS TOKEN** - You'll need it for GitHub webhook!

**Pipeline Tab:**
- **Definition**: **Pipeline script from SCM**
- **SCM**: **Git**
- **Repository URL**: `https://github.com/VivekKamble014/Student-Attendance-System-CICD.git`
- **Credentials**: (Leave empty if public repo, or add GitHub credentials if private)
- **Branches to build**: `*/main`
- **Script Path**: `Jenkinsfile`
- ✅ **Lightweight checkout**: (Optional)

Click **Save**

---

## 🔗 Step 2: Set Up GitHub Webhook

### 2.1 In GitHub Repository

1. Go to: https://github.com/VivekKamble014/Student-Attendance-System-CICD
2. Click **Settings** → **Webhooks** → **Add webhook**

### 2.2 Configure Webhook

- **Payload URL**: 
  ```
  http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=jenkins-build-token-2401084
  ```
  (Replace token with the one you created in Step 1.2)

- **Content type**: `application/json`
- **Events**: Select **Let me select individual events** → ✅ Check **Pushes**
- **Active**: ✅ Checked

Click **Add webhook**

### 2.3 Test Webhook

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test Jenkins pipeline"
   git push origin main
   ```
3. Go to Jenkins - a build should automatically start! 🎉

---

## 🔐 Step 3: Configure Jenkins Credentials

### 3.1 Add SonarQube Token

1. **Get Token from SonarQube**:
   - Go to: http://sonarqube.imcc.com/
   - Login: `student` / `Imccstudent@2025`
   - Profile → My Account → Security → Generate Token
   - Name: `jenkins-token`
   - **COPY THE TOKEN**

2. **Add to Jenkins**:
   - Jenkins → **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
   - **Add Credentials**:
     - **Kind**: Secret text
     - **Secret**: [Paste SonarQube token]
     - **ID**: `sonarqube-token`
     - **Description**: `SonarQube Authentication Token`
   - Click **OK**

### 3.2 Add Nexus Credentials

1. Jenkins → **Add Credentials**
2. Configure:
   - **Kind**: Username with password
   - **Username**: `student`
   - **Password**: `Imcc@2025`
   - **ID**: `nexus-credentials`
   - **Description**: `Nexus Docker Registry Credentials`
3. Click **OK**

### 3.3 Configure SonarQube Server

1. Jenkins → **Manage Jenkins** → **Configure System**
2. **SonarQube servers** → **Add SonarQube**:
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Server authentication token**: Select `sonarqube-token`
3. Click **Save**

---

## 📦 Step 4: Create SonarQube Project

1. Go to: http://sonarqube.imcc.com/
2. Login: `student` / `Imccstudent@2025`
3. Click **+** → **Manually**
4. Configure:
   - **Project display name**: `Student Attendance System - 2401084-vivek-kamble`
   - **Project key**: `2401084-vivek-kamble`
   - **Main branch name**: `main`
5. Click **Set Up**

---

## 🚀 Step 5: Run Your First Build

### 5.1 Manual Build

1. Go to Jenkins job: `2401084-vivek-kamble`
2. Click **Build Now**
3. Watch the build progress in **Console Output**

### 5.2 Automatic Build (via Webhook)

1. Push code to GitHub:
   ```bash
   git push origin main
   ```
2. Jenkins will automatically start a build!

---

## 📊 Step 6: Monitor Pipeline

### Pipeline Stages:

1. ✅ **Checkout** - Pulls code from GitHub
2. ✅ **Install Dependencies** - Runs `npm ci` and Prisma generate
3. ✅ **Lint** - Runs ESLint
4. ✅ **SonarQube Analysis** - Analyzes code quality
5. ✅ **Wait for Quality Gate** - Waits for SonarQube quality gate
6. ✅ **Build Docker Image** - Builds Docker image
7. ✅ **Push to Nexus** - Pushes image to Nexus (main branch only)
8. ✅ **Deploy** - Deploys application (main branch only)

### Check Results:

- **Jenkins**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- **SonarQube**: http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble
- **Nexus**: http://nexus.imcc.com/ → Browse → docker-hosted
- **Application**: http://your-server:3000 (after deployment)

---

## 🌐 Your Jenkins Project URLs

### Main Project URL:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/
```

### Build History:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/builds
```

### Latest Build:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/
```

### Console Output:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/console
```

### Pipeline Visualization:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/pipeline
```

---

## 🔍 Verify Everything is Working

### 1. Check Jenkins Build
- Go to: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- Should show: ✅ **Success** (green ball)

### 2. Check SonarQube Analysis
- Go to: http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble
- Should show: Code analysis results and quality gate status

### 3. Check Nexus Image
- Go to: http://nexus.imcc.com/
- Login: `student` / `Imcc@2025`
- Browse → docker-hosted
- Should see: `2401084-vivek-kamble:latest` and `2401084-vivek-kamble:BUILD_NUMBER`

### 4. Check Deployed Application
- Application should be running on your server
- Health check: `curl http://your-server:3000/api/health`
- Should return: `{"status":"ok"}` or similar

---

## 🛠️ Troubleshooting

### Build Fails at Checkout
- **Issue**: Cannot clone repository
- **Solution**: Verify GitHub URL is correct and accessible

### Build Fails at SonarQube
- **Issue**: Cannot connect to SonarQube
- **Solution**: 
  - Check SonarQube server URL in Jenkins
  - Verify SonarQube token is correct
  - Ensure SonarQube is running

### Build Fails at Nexus Push
- **Issue**: Cannot push to Nexus
- **Solution**:
  - Verify Nexus credentials
  - Check Docker registry URL
  - Ensure Docker daemon allows insecure registry

### Build Fails at Deployment
- **Issue**: Cannot deploy
- **Solution**:
  - Check deployment directory exists: `/opt/attendance-system`
  - Verify Docker Compose is installed
  - Check environment variables

---

## ✅ Success Checklist

- [ ] Jenkins job created and configured
- [ ] GitHub webhook configured
- [ ] SonarQube token added to Jenkins
- [ ] Nexus credentials added to Jenkins
- [ ] SonarQube server configured in Jenkins
- [ ] SonarQube project created
- [ ] First build completed successfully
- [ ] Docker image built and pushed to Nexus
- [ ] Application deployed and running
- [ ] All URLs accessible

---

## 📚 Quick Reference

| Service | URL | Login |
|---------|-----|-------|
| **Jenkins** | http://jenkins.imcc.com/ | student / Changeme@2025 |
| **SonarQube** | http://sonarqube.imcc.com/ | student / Imccstudent@2025 |
| **Nexus** | http://nexus.imcc.com/ | student / Imcc@2025 |
| **GitHub** | https://github.com/VivekKamble014/Student-Attendance-System-CICD | Your GitHub credentials |

---

## 🎉 You're All Set!

Your complete CI/CD pipeline is now automated:
- ✅ Every push to GitHub triggers Jenkins build
- ✅ Code is analyzed by SonarQube
- ✅ Docker image is built and pushed to Nexus
- ✅ Application is automatically deployed

**Your Jenkins Project URL**: http://jenkins.imcc.com/job/2401084-vivek-kamble/

---

**Last Updated**: 2025-01-08  
**Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD.git

