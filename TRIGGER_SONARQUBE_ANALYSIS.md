# 🔍 How to Trigger SonarQube Analysis

## ⚠️ Current Status

**SonarQube shows**: "Project's Main Branch is not analyzed yet."

**This means**: Jenkins hasn't successfully completed the SonarQube Analysis stage yet.

---

## ✅ What's Already Configured

### Jenkinsfile ✅
- ✅ SonarQube Analysis stage configured
- ✅ Uses `SonarScanner` tool
- ✅ Project key: `2401084-Student-Attendance-System-CICD`
- ✅ Quality Gate stage configured

### sonar-project.properties ✅
- ✅ Project key: `2401084-Student-Attendance-System-CICD`
- ✅ All settings correct

---

## 🚀 How to Trigger Analysis

### Step 1: Verify Jenkins Configuration

Make sure these are configured in Jenkins:

1. **SonarQube Server**:
   - **Manage Jenkins** → **Configure System**
   - **SonarQube servers** → Name: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Token**: `sonarqube-token` (with token: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`)

2. **SonarScanner Tool**:
   - **Manage Jenkins** → **Global Tool Configuration**
   - **SonarQube Scanner** → Name: `SonarScanner` (exact match!)
   - **Install automatically**: ✅ Checked

3. **Credentials**:
   - **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
   - **Verify**: `sonarqube-token` exists with token: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`

### Step 2: Trigger Jenkins Build

1. **Go to**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
2. **Click**: **Build Now**
3. **Watch** the build progress
4. **Wait** for the **SonarQube Analysis** stage to complete

### Step 3: Check Build Console Output

1. **Click** on the build number (e.g., **#4** or **#5**)
2. **Click**: **Console Output**
3. **Look for**:
   ```
   🔎 Running SonarQube code analysis...
   [INFO] ANALYSIS SUCCESSFUL
   ```
4. **If you see errors**, note them and we can fix them

### Step 4: Check SonarQube Dashboard

**After the SonarQube Analysis stage completes**:

1. **Go to**: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
2. **Refresh** the page
3. **You should see**:
   - Code quality metrics
   - Code smells
   - Security vulnerabilities
   - Bugs
   - Quality gate status

---

## 🔍 Troubleshooting

### Issue: Build fails at SonarQube Analysis

**Error**: `tool 'SonarScanner' not found`

**Solution**:
1. **Manage Jenkins** → **Global Tool Configuration**
2. **SonarQube Scanner** → **Add SonarQube Scanner**
3. **Name**: `SonarScanner` (⚠️ exact match, case-sensitive!)
4. **Install automatically**: ✅ Checked
5. **Save**

### Issue: Build fails with authentication error

**Error**: `Unauthorized` or `401`

**Solution**:
1. **Verify token** in Jenkins credentials:
   - **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
   - **Find**: `sonarqube-token`
   - **Update** with: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`
2. **Verify SonarQube server** configuration:
   - **Server URL**: `http://sonarqube.imcc.com` (NOT https!)
   - **Token**: `sonarqube-token` selected

### Issue: Build completes but SonarQube shows "Not analyzed"

**Possible causes**:
- Build failed before reaching SonarQube Analysis stage
- SonarQube Analysis stage failed silently
- Project key mismatch

**Solution**:
1. **Check Jenkins console output** for errors
2. **Verify project key** matches:
   - Jenkinsfile: `2401084-Student-Attendance-System-CICD`
   - sonar-project.properties: `2401084-Student-Attendance-System-CICD`
   - SonarQube project: `2401084-Student-Attendance-System-CICD`

---

## 📋 Quick Checklist

Before triggering build:

- [ ] SonarQube server configured (`SonarQube`)
- [ ] SonarScanner tool configured (`SonarScanner`)
- [ ] Credential exists (`sonarqube-token`) with correct token
- [ ] Jenkinsfile has SonarQube Analysis stage
- [ ] sonar-project.properties has correct project key
- [ ] Triggered new Jenkins build
- [ ] Build completed SonarQube Analysis stage
- [ ] Checked SonarQube dashboard

---

## 🎯 Expected Timeline

1. **Build starts** → Checkout (10 sec)
2. **Install Dependencies** → ~1-2 min
3. **Lint** → ~30 sec
4. **SonarQube Analysis** → ~1-2 min ⭐ **This is when analysis happens!**
5. **Quality Gate** → ~30 sec
6. **Build Docker** → ~2-3 min
7. **Push to Nexus** → ~1 min
8. **Deploy** → ~1 min

**After step 4 completes**, check SonarQube dashboard!

---

## 🔗 Quick Links

- **Jenkins Job**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- **SonarQube Dashboard**: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
- **SonarQube Projects**: http://sonarqube.imcc.com/projects

---

## ✅ Next Steps

1. **Verify** all Jenkins configuration (Step 1 above)
2. **Trigger** a new Jenkins build
3. **Wait** for SonarQube Analysis stage to complete
4. **Check** SonarQube dashboard - you should see results!

---

**Once the Jenkins build completes the SonarQube Analysis stage, your project will be analyzed!** 🎉

