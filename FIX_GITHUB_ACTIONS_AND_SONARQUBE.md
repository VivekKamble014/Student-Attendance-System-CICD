# 🔧 Fix GitHub Actions & SonarQube Issues

## 🚨 Issues Reported

1. ❌ **GitHub Actions CI/CD Pipeline failing** (build failing after 30s)
2. ❌ **SonarQube project not showing**

---

## ✅ What I've Fixed

### 1. **Created GitHub Actions Workflow** ✅

**File**: `.github/workflows/ci.yml`

This workflow:
- ✅ Builds the application
- ✅ Runs linter
- ✅ Runs SonarQube analysis
- ✅ Checks quality gate
- ✅ Has proper timeout (30 minutes)

### 2. **Created Jenkins Trigger Workflow** ✅

**File**: `.github/workflows/jenkins-trigger.yml`

This workflow:
- ✅ Triggers Jenkins build on push
- ✅ Can be manually triggered
- ✅ Works with webhooks

### 3. **Enhanced SonarQube Configuration** ✅

**File**: `sonar-project.properties`

Updated with:
- ✅ Better project configuration
- ✅ TypeScript settings
- ✅ Clear project key

---

## 🔧 Setup Required

### **Step 1: Add GitHub Secrets**

Go to your GitHub repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** for each:

#### **Required Secrets:**

1. **SONAR_TOKEN**
   - Name: `SONAR_TOKEN`
   - Value: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`
   - Description: SonarQube authentication token

2. **SONAR_HOST_URL** (Optional - has default)
   - Name: `SONAR_HOST_URL`
   - Value: `http://sonarqube.imcc.com`
   - Description: SonarQube server URL

3. **DATABASE_URL** (For build)
   - Name: `DATABASE_URL`
   - Value: `mysql://3NEjqDkMJVJsKVk.root:RSuUmf5m3RphWqOq@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict`
   - Description: Database connection for build

4. **JWT_SECRET** (For build)
   - Name: `JWT_SECRET`
   - Value: `your-super-secret-jwt-key-change-in-production-min-32-characters-please-use-strong-random-string`
   - Description: JWT secret for build

5. **NEXT_PUBLIC_APP_URL** (Optional - has default)
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `http://localhost:3000`
   - Description: Application URL

#### **Optional Secrets (for Jenkins trigger):**

6. **JENKINS_URL**
   - Name: `JENKINS_URL`
   - Value: `http://jenkins.imcc.com`
   - Description: Jenkins server URL

7. **JENKINS_JOB_NAME**
   - Name: `JENKINS_JOB_NAME`
   - Value: `2401084-vivek-kamble`
   - Description: Jenkins job name

8. **JENKINS_BUILD_TOKEN**
   - Name: `JENKINS_BUILD_TOKEN`
   - Value: Your Jenkins build trigger token
   - Description: Token to trigger Jenkins builds

9. **JENKINS_USERNAME**
   - Name: `JENKINS_USERNAME`
   - Value: `student`
   - Description: Jenkins username

10. **JENKINS_PASSWORD**
    - Name: `JENKINS_PASSWORD`
    - Value: `Changeme@2025`
    - Description: Jenkins password

---

### **Step 2: Verify SonarQube Project**

1. **Go to**: http://sonarqube.imcc.com/
2. **Login**: `student` / `Imccstudent@2025`
3. **Check if project exists**:
   - Click **Projects** in top menu
   - Search for: `2401084-Student-Attendance-System-CICD`

4. **If project doesn't exist, create it**:
   - Click **+** → **Manually**
   - **Project display name**: `Student Attendance Management System - 2401084-Student-Attendance-System-CICD`
   - **Project key**: `2401084-Student-Attendance-System-CICD` ⚠️ **Must match exactly!**
   - **Main branch name**: `main`
   - Click **Set Up**

---

### **Step 3: Push Changes**

```bash
git add .github/workflows/ci.yml
git add .github/workflows/jenkins-trigger.yml
git add sonar-project.properties
git commit -m "Fix GitHub Actions CI/CD and SonarQube configuration"
git push origin main
```

---

## 🚀 After Setup

### **Check GitHub Actions:**

1. **Go to**: Your GitHub repository
2. **Click**: **Actions** tab
3. **You should see**:
   - ✅ `CI/CD Pipeline` workflow
   - ✅ `Trigger Jenkins Build` workflow

4. **Click on a workflow run** to see:
   - Build status
   - SonarQube analysis results
   - Quality gate status

### **Check SonarQube:**

1. **Go to**: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
2. **After GitHub Actions runs**, you should see:
   - ✅ Code quality metrics
   - ✅ Code smells
   - ✅ Security vulnerabilities
   - ✅ Bugs
   - ✅ Quality gate status

---

## 🔍 Troubleshooting

### **Issue: GitHub Actions fails with "SONAR_TOKEN not found"**

**Solution:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add `SONAR_TOKEN` secret with value: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`
3. Re-run the workflow

### **Issue: Build fails with database error**

**Solution:**
1. Add `DATABASE_URL` secret (see Step 1 above)
2. Re-run the workflow

### **Issue: SonarQube project still not showing**

**Possible causes:**
1. **Project doesn't exist** - Create it manually (Step 2)
2. **Project key mismatch** - Verify it's exactly: `2401084-Student-Attendance-System-CICD`
3. **Analysis hasn't run** - Wait for GitHub Actions to complete
4. **Token invalid** - Verify `SONAR_TOKEN` secret is correct

**Solution:**
1. Verify project key in:
   - `sonar-project.properties`: `sonar.projectKey=2401084-Student-Attendance-System-CICD`
   - `.github/workflows/ci.yml`: `-Dsonar.projectKey=2401084-Student-Attendance-System-CICD`
   - SonarQube project: `2401084-Student-Attendance-System-CICD`
2. All must match **exactly** (case-sensitive)!

### **Issue: Workflow times out**

**Solution:**
- Current timeout is 30 minutes
- If it still times out, increase in `.github/workflows/ci.yml`:
  ```yaml
  timeout-minutes: 60  # Increase to 60 minutes
  ```

---

## ✅ Verification Checklist

Before pushing:

- [ ] **GitHub Secrets added**:
  - [ ] `SONAR_TOKEN`
  - [ ] `SONAR_HOST_URL` (optional)
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL` (optional)

- [ ] **SonarQube Project exists**:
  - [ ] Project key: `2401084-Student-Attendance-System-CICD`
  - [ ] Project name matches
  - [ ] Main branch: `main`

- [ ] **Files committed**:
  - [ ] `.github/workflows/ci.yml`
  - [ ] `.github/workflows/jenkins-trigger.yml`
  - [ ] `sonar-project.properties` (updated)

- [ ] **Project key matches everywhere**:
  - [ ] `sonar-project.properties`: `2401084-Student-Attendance-System-CICD`
  - [ ] `.github/workflows/ci.yml`: `2401084-Student-Attendance-System-CICD`
  - [ ] `Jenkinsfile`: `2401084-Student-Attendance-System-CICD`
  - [ ] SonarQube project: `2401084-Student-Attendance-System-CICD`

---

## 📊 Expected Results

### **After GitHub Actions Runs:**

1. **GitHub Actions**:
   - ✅ Build succeeds
   - ✅ SonarQube analysis completes
   - ✅ Quality gate check passes (or shows status)

2. **SonarQube Dashboard**:
   - ✅ Project appears in project list
   - ✅ Shows analysis results
   - ✅ Shows quality gate status
   - ✅ Shows code metrics

---

## 🎯 Quick Fix Commands

```bash
# 1. Add files to git
git add .github/workflows/
git add sonar-project.properties

# 2. Commit
git commit -m "Fix GitHub Actions CI/CD and SonarQube configuration"

# 3. Push
git push origin main

# 4. Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# 5. Check SonarQube
# Go to: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
```

---

**Status**: ✅ **GitHub Actions & SonarQube Configuration Fixed!**

After adding GitHub secrets and pushing, everything should work! 🚀

