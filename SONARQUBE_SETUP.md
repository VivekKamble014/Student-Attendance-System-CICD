# 🔍 SonarQube Setup Guide - Following SonarQube Instructions

This guide helps you follow the exact steps shown in SonarQube's setup wizard.

---

## 📋 Step 1: Install SonarQube Plugin in Jenkins

### 1.1 Install SonarQube Community Build Scanner Plugin
1. Go to Jenkins: `http://jenkins.imcc.com/`
2. Login: `student` / `Changeme@2025`
3. Go to **Manage Jenkins** → **Plugins**
4. Click **Available plugins** tab
5. Search for: **SonarQube Scanner** (or **SonarQube Community Build Scanner**)
6. ✅ Check the box
7. Click **Install without restart** (or **Download now and install after restart**)
8. Wait for installation to complete
9. Restart Jenkins if prompted

**Plugin Name**: `SonarQube Scanner` (version 2.11 or later)

---

## 📦 Step 2: Create Pipeline Job in Jenkins

### 2.1 Create New Pipeline
1. In Jenkins, click **New Item**
2. Enter name: `2401084-vivek-kamble` (or `2401084-Student-Attendance-System-CICD`)
3. Select **Pipeline**
4. Click **OK**

### 2.2 Configure Build Triggers
1. Scroll to **Build Triggers** section
2. ✅ Check **Trigger builds remotely (e.g., from scripts)**
3. In **Authentication Token** field, enter a secret token (e.g., `my-secret-token-12345`)
4. **COPY THIS TOKEN** - You'll need it for the GitHub webhook!

**Example Token**: `jenkins-build-token-2401084`

### 2.3 Configure Pipeline
1. Scroll to **Pipeline** section
2. **Definition**: Select **Pipeline script from SCM**
3. **SCM**: Select **Git**
4. **Repository URL**: Enter your GitHub repository URL
   - Example: `https://github.com/YOUR_USERNAME/2401084-Student-Attendance-System-CICD.git`
   - Or SSH: `git@github.com:YOUR_USERNAME/2401084-Student-Attendance-System-CICD.git`
5. **Credentials**: 
   - If public repo: Leave empty
   - If private repo: Select your GitHub credentials
6. **Branches to build**: `*/main` (or your main branch name)
7. **Script Path**: `Jenkinsfile` ✅ (This is already in your repo!)
8. Click **Save**

---

## 🔗 Step 3: Create GitHub Webhook

### 3.1 Go to GitHub Repository
1. Open your repository: `2401084-Student-Attendance-System-CICD`
2. Go to **Settings** → **Webhooks**
3. Click **Add webhook**

### 3.2 Configure Webhook
1. **Payload URL**: 
   ```
   http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=YOUR_AUTH_TOKEN
   ```
   Replace:
   - `2401084-vivek-kamble` with your Jenkins job name
   - `YOUR_AUTH_TOKEN` with the token you created in Step 2.2

   **Example**:
   ```
   http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=jenkins-build-token-2401084
   ```

2. **Content type**: `application/json`

3. **Which events would you like to trigger this webhook?**
   - Select: **Let me select individual events**
   - ✅ Check **Pushes**

4. **Active**: ✅ Checked

5. Click **Add webhook**

### 3.3 Test Webhook
1. After creating webhook, GitHub will send a test ping
2. Check if it shows a green checkmark ✅
3. Go to Jenkins and verify a build was triggered

---

## 📝 Step 4: SonarQube Project Type Selection

When SonarQube asks: **"What option best describes your project?"**

### ✅ Select: **Other (for JS, TS, Go, Python, PHP, ...)**

**Why?** Your project is:
- Node.js/Next.js (JavaScript/TypeScript)
- Not Maven, Gradle, or .NET
- Uses npm for dependency management

---

## ✅ Step 5: Verify Your Jenkinsfile

Your `Jenkinsfile` is already configured! It includes:
- ✅ SonarQube analysis stage
- ✅ Quality gate check
- ✅ Docker build
- ✅ Nexus push
- ✅ Deployment

**No changes needed** - Your Jenkinsfile is ready to use!

---

## 🔍 Step 6: Configure SonarQube Scanner in Jenkins (Optional)

If you want to use the SonarQube Scanner tool configured in Jenkins (instead of downloading it):

### 6.1 Configure SonarQube Scanner Tool
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Find **SonarQube Scanner** section
3. Click **Add SonarQube Scanner**
4. Configure:
   - **Name**: `SonarQube Scanner` (or any name)
   - **Install automatically**: ✅ Checked
   - **Version**: Latest (or specific version)
5. Click **Save**

### 6.2 Update Jenkinsfile (Optional)
If you configure the scanner tool, you can update the Jenkinsfile to use it:

```groovy
tools {
    nodejs 'nodejs'
    sonarScanner 'SonarQube Scanner'  // Add this line
}
```

Then in the SonarQube Analysis stage, you can use:
```groovy
sh 'sonar-scanner -Dsonar.projectKey=...'
```

**Note**: Your current Jenkinsfile already works fine - this is optional!

---

## 🎯 Step 7: Complete SonarQube Project Setup

### 7.1 In SonarQube
1. Go to: `http://sonarqube.imcc.com/`
2. Login: `student` / `Imccstudent@2025`
3. Click **+** → **Manually**
4. Configure:
   - **Project display name**: `Student Attendance System - 2401084-vivek-kamble`
   - **Project key**: `2401084-vivek-kamble`
   - **Main branch name**: `main`
5. Click **Set Up**

### 7.2 Generate Token
1. After creating project, SonarQube will ask to generate a token
2. Click **Generate a token**
3. Name: `jenkins-token`
4. **COPY THE TOKEN** (you won't see it again!)

### 7.3 Add Token to Jenkins
1. Go to Jenkins → **Manage Jenkins** → **Credentials**
2. **System** → **Global credentials (unrestricted)**
3. **Add Credentials**:
   - **Kind**: Secret text
   - **Secret**: Paste the token from Step 7.2
   - **ID**: `sonarqube-token`
   - **Description**: `SonarQube Authentication Token`
4. Click **OK**

### 7.4 Configure SonarQube Server in Jenkins
1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers**
3. Click **Add SonarQube**
4. Configure:
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Server authentication token**: Select `sonarqube-token`
5. Click **Save**

---

## 🚀 Step 8: Test Your Pipeline

### 8.1 Manual Build
1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the build progress

### 8.2 Automatic Build (via Webhook)
1. Make a small change to your code
2. Commit and push to GitHub
3. The webhook should automatically trigger a build in Jenkins

### 8.3 Verify Results
- ✅ Jenkins build completes successfully
- ✅ SonarQube analysis runs
- ✅ Quality gate passes
- ✅ Docker image built
- ✅ Image pushed to Nexus
- ✅ Application deployed

---

## 📊 Expected Pipeline Flow

```
GitHub Push
    ↓
GitHub Webhook Triggers
    ↓
Jenkins Build Starts
    ↓
Checkout Code
    ↓
Install Dependencies
    ↓
Lint
    ↓
SonarQube Analysis ← (Using SonarQube Scanner Plugin)
    ↓
Quality Gate Check
    ↓
Build Docker Image
    ↓
Push to Nexus
    ↓
Deploy Application
    ↓
✅ Success!
```

---

## 🔧 Troubleshooting

### Issue: Webhook not triggering builds
**Solution**:
- Verify webhook URL is correct
- Check authentication token matches
- Ensure Jenkins is accessible from GitHub
- Check Jenkins logs: **Manage Jenkins** → **System Log**

### Issue: SonarQube Scanner not found
**Solution**:
- Your Jenkinsfile automatically downloads scanner if not found
- Or install SonarQube Scanner plugin in Jenkins
- Or configure scanner tool in Global Tool Configuration

### Issue: SonarQube analysis fails
**Solution**:
- Verify SonarQube server URL in Jenkins configuration
- Check SonarQube token is correct
- Ensure SonarQube server is running and accessible
- Check project key matches: `2401084-vivek-kamble`

---

## ✅ Checklist

- [ ] SonarQube Scanner plugin installed in Jenkins
- [ ] Pipeline job created with correct settings
- [ ] Build trigger token created and saved
- [ ] GitHub webhook configured
- [ ] SonarQube project created
- [ ] SonarQube token generated and added to Jenkins
- [ ] SonarQube server configured in Jenkins
- [ ] First build completed successfully
- [ ] Webhook triggers builds automatically

---

## 📚 Related Documentation

- **CICD_SETUP_GUIDE.md**: Complete CI/CD setup guide
- **JENKINS_QUICK_SETUP.md**: Quick reference
- **START_HERE.md**: Quick start guide

---

**Last Updated**: 2025-01-08  
**Project Key**: `2401084-vivek-kamble`

