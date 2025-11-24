# 🚀 Complete Jenkins Setup - Step by Step

## ✅ Your SonarQube Token
```
sqa_671dff185897dccc56ee593a2b0a2232a7439dd8
```

---

## 📋 Step 1: Configure Jenkins Credentials

### 1.1 Add SonarQube Token to Jenkins

1. Go to: **http://jenkins.imcc.com/**
2. Login: `student` / `Changeme@2025`
3. Click **Manage Jenkins** → **Credentials**
4. Click **System** → **Global credentials (unrestricted)**
5. Click **Add Credentials**
6. Configure:
   - **Kind**: **Secret text**
   - **Secret**: `sqa_671dff185897dccc56ee593a2b0a2232a7439dd8`
   - **ID**: `sonarqube-token`
   - **Description**: `SonarQube Authentication Token`
7. Click **OK**

### 1.2 Add Nexus Credentials

1. Click **Add Credentials** again
2. Configure:
   - **Kind**: **Username with password**
   - **Username**: `student`
   - **Password**: `Imcc@2025`
   - **ID**: `nexus-credentials`
   - **Description**: `Nexus Docker Registry Credentials`
3. Click **OK**

---

## 🔧 Step 2: Configure SonarQube Server in Jenkins

1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers** section
3. Click **Add SonarQube**
4. Configure:
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Server authentication token**: Select `sonarqube-token` from dropdown
5. Click **Save**

---

## 🛠️ Step 3: Configure SonarQube Scanner Tool

1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **SonarQube Scanner** section
3. Click **Add SonarQube Scanner**
4. Configure:
   - **Name**: `SonarScanner` (⚠️ **IMPORTANT**: Must be exactly this name!)
   - **Install automatically**: ✅ Checked
   - **Version**: Select latest version (or leave default)
5. Click **Save**

---

## 📦 Step 4: Create Jenkins Pipeline Job

### 4.1 Create New Job

1. In Jenkins, click **New Item**
2. Enter name: `2401084-vivek-kamble` (or `2401084-Student-Attendance-System-CICD`)
3. Select **Pipeline**
4. Click **OK**

### 4.2 Configure Pipeline

**General Tab:**
- ✅ **GitHub project**: `https://github.com/VivekKamble014/Student-Attendance-System-CICD`

**Build Triggers:**
- ✅ **Trigger builds remotely (e.g., from scripts)**
- **Authentication Token**: Enter a secret token (e.g., `jenkins-build-token-2401084`)
- **⚠️ COPY THIS TOKEN** - You'll need it for GitHub webhook!

**Pipeline Tab:**
- **Definition**: **Pipeline script from SCM**
- **SCM**: **Git**
- **Repository URL**: `https://github.com/VivekKamble014/Student-Attendance-System-CICD.git`
- **Credentials**: (Leave empty if public repo)
- **Branches to build**: `*/main`
- **Script Path**: `Jenkinsfile`
- ✅ **Lightweight checkout**: (Optional)

Click **Save**

---

## 🔗 Step 5: Set Up GitHub Webhook (For Automatic Builds)

1. Go to: https://github.com/VivekKamble014/Student-Attendance-System-CICD/settings/hooks
2. Click **Add webhook**
3. Configure:
   - **Payload URL**: 
     ```
     http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=YOUR_TOKEN
     ```
     (Replace `YOUR_TOKEN` with the token from Step 4.2)
   - **Content type**: `application/json`
   - **Events**: Select **Let me select individual events** → ✅ Check **Pushes**
   - **Active**: ✅ Checked
4. Click **Add webhook**

---

## 🎯 Step 6: Verify SonarQube Project

1. Go to: **http://sonarqube.imcc.com/**
2. Login: `student` / `Imccstudent@2025`
3. Click **+** → **Manually** (if project doesn't exist)
4. Configure:
   - **Project display name**: `Student Attendance System - 2401084-Student-Attendance-System-CICD`
   - **Project key**: `2401084-Student-Attendance-System-CICD`
   - **Main branch name**: `main`
5. Click **Set Up**

---

## 🚀 Step 7: Run Your First Build!

### Option 1: Manual Build
1. Go to your Jenkins job: `2401084-vivek-kamble`
2. Click **Build Now**
3. Watch the build progress!

### Option 2: Automatic Build (via GitHub)
1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Trigger Jenkins build"
   git push origin main
   ```
3. Jenkins will automatically start building! 🎉

---

## ✅ What Jenkins Will Do Automatically

1. ✅ **Checkout** - Pulls code from GitHub
2. ✅ **Install Dependencies** - Runs `npm ci` and Prisma generate
3. ✅ **Lint** - Runs ESLint
4. ✅ **SonarQube Analysis** - Analyzes code quality (uses SonarScanner tool)
5. ✅ **Wait for Quality Gate** - Waits for SonarQube quality gate result
6. ✅ **Build Docker Image** - Builds `2401084-vivek-kamble:BUILD_NUMBER`
7. ✅ **Push to Nexus** - Pushes image to `nexus.imcc.com:8082`
8. ✅ **Deploy** - Deploys application automatically

---

## 📊 Check Results

### Jenkins Build:
- **URL**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- **Latest Build**: http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/

### SonarQube Analysis:
- **URL**: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
- **After first build**: You'll see code analysis results!

### Nexus Images:
- **URL**: http://nexus.imcc.com/
- **Login**: `student` / `Imcc@2025`
- **Browse**: docker-hosted → You'll see your images!

---

## 🔍 Troubleshooting

### Issue: Project not showing in Jenkins
**Solution**: 
- Make sure you created the job (Step 4)
- Check the job name matches: `2401084-vivek-kamble`
- Go to: http://jenkins.imcc.com/ → You should see it in the list

### Issue: SonarQube Scanner not found
**Solution**:
- Make sure SonarScanner tool is configured (Step 3)
- **Name must be exactly**: `SonarScanner` (case-sensitive!)

### Issue: Build fails at SonarQube
**Solution**:
- Verify SonarQube server is configured (Step 2)
- Check token is correct: `sqa_671dff185897dccc56ee593a2b0a2232a7439dd8`
- Verify project exists in SonarQube (Step 6)

---

## ✅ Checklist

- [ ] SonarQube token added to Jenkins (`sonarqube-token`)
- [ ] Nexus credentials added to Jenkins (`nexus-credentials`)
- [ ] SonarQube server configured in Jenkins
- [ ] SonarScanner tool configured (name: `SonarScanner`)
- [ ] Jenkins pipeline job created (`2401084-vivek-kamble`)
- [ ] GitHub webhook configured (optional)
- [ ] SonarQube project created
- [ ] First build triggered
- [ ] Build completed successfully
- [ ] SonarQube analysis visible
- [ ] Docker image pushed to Nexus
- [ ] Application deployed

---

## 🎉 You're All Set!

**Your Jenkins Project URL**: 
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/
```

**Just follow the steps above and everything will be automated!** 🚀

---

**Last Updated**: 2025-01-08  
**SonarQube Token**: `sqa_671dff185897dccc56ee593a2b0a2232a7439dd8`

