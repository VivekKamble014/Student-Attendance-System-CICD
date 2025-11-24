# 🔧 Jenkins Configuration - Step by Step

## 📋 What to Change in Your Jenkins Configuration Page

### Step 1: Pipeline Definition (IMPORTANT!)

**Current Setting**: "Pipeline script"  
**Change To**: "Pipeline script from SCM"

1. In the **Pipeline** section, find **Definition** dropdown
2. Change from: `Pipeline script`
3. Change to: `Pipeline script from SCM` ✅

### Step 2: Configure SCM Settings

After selecting "Pipeline script from SCM", you'll see new fields:

1. **SCM**: Select `Git` from dropdown
2. **Repository URL**: 
   ```
   https://github.com/VivekKamble014/Student-Attendance-System-CICD.git
   ```
   (This should already be filled from your GitHub project URL)
3. **Credentials**: Leave empty (if public repo) or select your GitHub credentials
4. **Branches to build**: 
   ```
   */main
   ```
   (or `*/master` if your main branch is called master)
5. **Script Path**: 
   ```
   Jenkinsfile
   ```
   (This is the file in your repo root)
6. **Lightweight checkout**: ✅ Check this (optional, but recommended)

### Step 3: Configure Build Triggers (Optional but Recommended)

In the **Triggers** section:

1. ✅ Check **Trigger builds remotely (e.g., from scripts)**
2. **Authentication Token**: Enter a secret token (e.g., `jenkins-build-token-2401084`)
3. **⚠️ COPY THIS TOKEN** - You'll need it for GitHub webhook!

**OR**

1. ✅ Check **GitHub hook trigger for GITScm polling**
   - This works if you set up GitHub webhook

### Step 4: Save Configuration

1. Click **Save** button at the bottom
2. Your project is now configured!

---

## ✅ After Saving

1. Go back to your project: http://jenkins.imcc.com/job/2401084-vivek-kamble/
2. Click **Build Now**
3. Watch it build! 🎉

---

## 🔍 Quick Checklist

- [ ] Pipeline Definition changed to "Pipeline script from SCM"
- [ ] SCM set to "Git"
- [ ] Repository URL: `https://github.com/VivekKamble014/Student-Attendance-System-CICD.git`
- [ ] Branch: `*/main`
- [ ] Script Path: `Jenkinsfile`
- [ ] Build trigger configured (optional)
- [ ] Clicked **Save**

---

## 🚀 What Happens Next

After you save and click "Build Now":

1. ✅ Jenkins will checkout code from GitHub
2. ✅ Run the Jenkinsfile pipeline
3. ✅ Install dependencies
4. ✅ Run SonarQube analysis
5. ✅ Build Docker image
6. ✅ Push to Nexus
7. ✅ Deploy application

**Everything is automated!** 🎉

---

**Need help?** Make sure:
- SonarScanner tool is configured (name: `SonarScanner`)
- SonarQube server is configured (name: `SonarQube`)
- Credentials are added (`sonarqube-token` and `nexus-credentials`)

See `QUICK_JENKINS_SETUP.md` for complete setup!

