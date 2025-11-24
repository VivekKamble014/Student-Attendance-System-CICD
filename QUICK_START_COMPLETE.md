# ⚡ Quick Start - Complete Automation Setup

## 🎯 Your Jenkins Project URL

### **Main URL** (Bookmark this!):
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/
```

---

## 🚀 Complete Setup in 5 Steps

### Step 1: Create Jenkins Job (2 minutes)

1. Go to: http://jenkins.imcc.com/
2. Login: `student` / `Changeme@2025`
3. **New Item** → Name: `2401084-vivek-kamble` → **Pipeline** → OK
4. Configure:
   - **Build Triggers**: ✅ **Trigger builds remotely**
   - **Token**: `jenkins-build-token-2401084` (or any secret)
   - **Pipeline**: **Pipeline script from SCM**
   - **SCM**: **Git**
   - **Repository URL**: `https://github.com/VivekKamble014/Student-Attendance-System-CICD.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. **Save**

### Step 2: Add Credentials (3 minutes)

#### A. SonarQube Token
1. Get token: http://sonarqube.imcc.com/ → Profile → Security → Generate Token
2. Jenkins → **Manage Jenkins** → **Credentials** → **Add**
   - **Kind**: Secret text
   - **Secret**: [Paste token]
   - **ID**: `sonarqube-token`

#### B. Nexus Credentials
1. Jenkins → **Add Credentials**
   - **Kind**: Username with password
   - **Username**: `student`
   - **Password**: `Imcc@2025`
   - **ID**: `nexus-credentials`

#### C. Configure SonarQube Server
1. Jenkins → **Manage Jenkins** → **Configure System**
2. **SonarQube servers** → **Add SonarQube**
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Token**: `sonarqube-token`

### Step 3: Create SonarQube Project (1 minute)

1. Go to: http://sonarqube.imcc.com/
2. **+** → **Manually**
3. **Project key**: `2401084-vivek-kamble`
4. **Display name**: `Student Attendance System - 2401084-vivek-kamble`
5. **Set Up**

### Step 4: Set Up GitHub Webhook (2 minutes)

1. Go to: https://github.com/VivekKamble014/Student-Attendance-System-CICD/settings/hooks
2. **Add webhook**
3. **Payload URL**: 
   ```
   http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=jenkins-build-token-2401084
   ```
4. **Content type**: `application/json`
5. **Events**: ✅ **Pushes**
6. **Add webhook**

### Step 5: Run First Build! 🎉

1. Go to: http://jenkins.imcc.com/job/2401084-vivek-kamble/
2. Click **Build Now**
3. Watch it work! 🚀

---

## 📊 What Happens Automatically

Every time you push to GitHub:

1. ✅ **GitHub** triggers Jenkins via webhook
2. ✅ **Jenkins** checks out your code
3. ✅ **Jenkins** installs dependencies
4. ✅ **Jenkins** runs linting
5. ✅ **SonarQube** analyzes code quality
6. ✅ **SonarQube** checks quality gate
7. ✅ **Jenkins** builds Docker image
8. ✅ **Jenkins** pushes image to Nexus
9. ✅ **Jenkins** deploys application

---

## 🌐 All Your URLs

### Jenkins:
- **Project**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- **Latest Build**: http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/

### SonarQube:
- **Dashboard**: http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble

### Nexus:
- **Registry**: http://nexus.imcc.com/
- **Docker Images**: http://nexus.imcc.com/#browse/browse:docker-hosted

### GitHub:
- **Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Jenkins job created: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- [ ] First build completed successfully
- [ ] SonarQube shows analysis: http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble
- [ ] Nexus has Docker image: http://nexus.imcc.com/
- [ ] GitHub webhook configured and working
- [ ] Application deployed and running

---

## 🛠️ Quick Commands

### Build Docker Image Locally:
```bash
docker build -t 2401084-vivek-kamble:latest .
```

### Run with Docker Compose:
```bash
docker-compose up -d
```

### Test Application:
```bash
curl http://localhost:3000/api/health
```

### Push to Nexus:
```bash
docker login nexus.imcc.com:8082 -u student -p Imcc@2025
docker tag 2401084-vivek-kamble:latest nexus.imcc.com:8082/2401084-vivek-kamble:latest
docker push nexus.imcc.com:8082/2401084-vivek-kamble:latest
```

---

## 📚 Documentation Files

- **COMPLETE_AUTOMATION_SETUP.md** - Detailed setup guide
- **DOCKER_BUILD_AND_TEST.md** - Docker commands
- **YOUR_PROJECT_URLS.md** - All URLs reference
- **SONARQUBE_SETUP.md** - SonarQube configuration
- **GITHUB_WEBHOOK_SETUP.md** - Webhook setup

---

## 🎉 You're Ready!

**Your Jenkins Project URL**: 
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/
```

**Just follow the 5 steps above and you'll have a fully automated CI/CD pipeline!** 🚀

---

**Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD.git  
**Last Updated**: 2025-01-08

