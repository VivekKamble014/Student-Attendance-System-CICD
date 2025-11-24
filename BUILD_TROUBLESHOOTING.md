# 🔍 Build Troubleshooting Guide

## 📊 Your Build Status

Your builds are running but completing very quickly:
- Build #3: 4.7 sec
- Build #2: 48 sec  
- Build #1: 1 min 20 sec

**This suggests builds might be failing early or skipping stages.**

---

## 🔍 How to Check Build Status

### Step 1: Check Latest Build

1. Go to: http://jenkins.imcc.com/job/2401084-vivek-kamble/
2. Click on **Build #3** (or latest build)
3. Look at the **Stage View** or **Console Output**

### Step 2: Check Console Output

1. Click on the build number (e.g., **#3**)
2. Click **Console Output** in the left menu
3. Scroll through to see:
   - ✅ Which stages completed
   - ❌ Which stages failed
   - ⚠️ Any error messages

---

## 🎯 Expected Build Stages

Your pipeline should have these stages:

1. ✅ **Checkout** - Pulls code from GitHub
2. ✅ **Install Dependencies** - Runs `npm ci` and Prisma generate
3. ✅ **Lint** - Runs ESLint
4. ✅ **SonarQube Analysis** - Analyzes code
5. ✅ **Wait for SonarQube Quality Gate** - Waits for results
6. ✅ **Build Docker Image** - Builds Docker image
7. ✅ **Push to Nexus** - Pushes to Nexus (main branch only)
8. ✅ **Deploy** - Deploys application (main branch only)

**Total time should be 5-10 minutes** for a full build.

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Fails at Checkout

**Symptoms**: Build completes in < 10 seconds  
**Solution**:
- Check repository URL is correct
- Verify GitHub credentials (if private repo)
- Check branch name (`main` vs `master`)

### Issue 2: Build Fails at Install Dependencies

**Symptoms**: Build fails around 30-60 seconds  
**Solution**:
- Check Node.js tool is configured in Jenkins
- Verify `package.json` exists
- Check npm permissions

### Issue 3: Build Fails at SonarQube

**Symptoms**: Build fails after 1-2 minutes  
**Solution**:
- Verify SonarScanner tool is configured (name: `SonarScanner`)
- Check SonarQube server is configured
- Verify `sonarqube-token` credential exists
- Check `sonar-project.properties` file exists

### Issue 4: Build Fails at Docker Build

**Symptoms**: Build fails after 2-3 minutes  
**Solution**:
- Check Docker is installed on Jenkins server
- Verify Jenkins user has Docker permissions
- Check Dockerfile exists in repo

### Issue 5: Build Fails at Nexus Push

**Symptoms**: Build fails after 4-5 minutes  
**Solution**:
- Verify `nexus-credentials` exists
- Check Nexus URL is correct: `nexus.imcc.com:8082`
- Verify Docker can access Nexus registry

---

## 🔧 Quick Fixes

### Fix 1: Check Build Console Output

```bash
# In Jenkins, go to:
Build #3 → Console Output

# Look for error messages like:
- "ERROR: ..."
- "FAILED: ..."
- "Command not found: ..."
```

### Fix 2: Verify Tools Are Configured

1. **Manage Jenkins** → **Global Tool Configuration**
2. Check:
   - ✅ **NodeJS** tool named `nodejs` exists
   - ✅ **SonarQube Scanner** tool named `SonarScanner` exists

### Fix 3: Verify Credentials

1. **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Check:
   - ✅ `sonarqube-token` exists
   - ✅ `nexus-credentials` exists

### Fix 4: Verify SonarQube Server

1. **Manage Jenkins** → **Configure System**
2. Check:
   - ✅ SonarQube server named `SonarQube` exists
   - ✅ Server URL: `http://sonarqube.imcc.com`
   - ✅ Token: `sonarqube-token` is selected

---

## 📋 Diagnostic Checklist

Run through this checklist:

- [ ] Build console output shows all stages
- [ ] No error messages in console
- [ ] Node.js tool configured (`nodejs`)
- [ ] SonarScanner tool configured (`SonarScanner`)
- [ ] SonarQube server configured (`SonarQube`)
- [ ] Credentials exist (`sonarqube-token`, `nexus-credentials`)
- [ ] Docker is installed on Jenkins server
- [ ] Jenkins user has Docker permissions
- [ ] Repository URL is correct
- [ ] Branch name is correct (`main`)

---

## 🚀 Expected Build Flow

**Normal build should show:**

```
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
✅ Checkout completed

[Pipeline] stage
[Pipeline] { (Install Dependencies)
[Pipeline] sh
📦 Installing dependencies...
✅ Dependencies installed

[Pipeline] stage
[Pipeline] { (Lint)
[Pipeline] sh
🔍 Running linter...
✅ Lint completed

[Pipeline] stage
[Pipeline] { (SonarQube Analysis)
[Pipeline] sh
🔎 Running SonarQube code analysis...
✅ SonarQube analysis completed

[Pipeline] stage
[Pipeline] { (Wait for SonarQube Quality Gate)
⏳ Waiting for SonarQube Quality Gate...
✅ Quality gate passed

[Pipeline] stage
[Pipeline] { (Build Docker Image)
[Pipeline] sh
🐳 Building Docker image...
✅ Docker image built

[Pipeline] stage
[Pipeline] { (Push to Nexus)
[Pipeline] sh
📤 Pushing Docker image to Nexus...
✅ Image pushed to Nexus

[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] sh
🚀 Deploying application...
✅ Deployment completed
```

---

## 🆘 Next Steps

1. **Click on Build #3** → **Console Output**
2. **Copy the error message** (if any)
3. **Check which stage failed**
4. **Follow the solutions above** based on the error

---

## 💡 Quick Test

To test if everything is configured:

1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the **Stage View** (blue progress bars)
4. Click on any failed stage (red) to see error
5. Check **Console Output** for details

---

**Share the console output or error message, and I can help you fix it!** 🔧

