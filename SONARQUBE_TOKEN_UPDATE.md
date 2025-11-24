# 🔑 SonarQube Token Update

## ✅ New SonarQube Token

**New Token**: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`

**Old Token**: `sqa_671dff185897dccc56ee593a2b0a2232a7439dd8` (replace this)

---

## 🔧 Update Token in Jenkins

### Step 1: Update Credential in Jenkins

1. **Go to**: http://jenkins.imcc.com/
2. **Login**: `student` / `Changeme@2025`
3. **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
4. **Find**: `sonarqube-token` credential
5. **Click on it** to edit
6. **Update Secret** with new token: `sqp_b46176386302391e89ba34b257a1bf24c274b0d8`
7. **Save**

### Step 2: Verify SonarQube Server Configuration

1. **Manage Jenkins** → **Configure System**
2. **SonarQube servers** section
3. **Verify**:
   - Name: `SonarQube`
   - Server URL: `http://sonarqube.imcc.com` (NOT https!)
   - Server authentication token: `sonarqube-token` is selected
4. **Save**

---

## ✅ Current Configuration Status

### Jenkinsfile ✅
- Uses `SonarScanner` tool correctly
- Uses `withSonarQubeEnv('SonarQube')` correctly
- Project key: `2401084-Student-Attendance-System-CICD`

### sonar-project.properties ✅
- Project key: `2401084-Student-Attendance-System-CICD`
- All settings correct

### What Needs Update:
- ⚠️ **Jenkins Credential**: Update `sonarqube-token` with new token

---

## 🚀 After Updating Token

1. **Update the credential** in Jenkins (Step 1 above)
2. **Trigger a new build**:
   - Go to: http://jenkins.imcc.com/job/2401084-vivek-kamble/
   - Click **Build Now**
3. **Check SonarQube**:
   - Go to: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
   - After build completes, you'll see analysis results!

---

## 📋 Quick Checklist

- [ ] Updated `sonarqube-token` credential in Jenkins with new token
- [ ] Verified SonarQube server URL: `http://sonarqube.imcc.com`
- [ ] SonarScanner tool configured (`SonarScanner`)
- [ ] Triggered new Jenkins build
- [ ] Checked SonarQube dashboard for results

---

**After updating the token, everything should work!** 🎉

