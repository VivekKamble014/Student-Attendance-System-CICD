# ⚡ Quick Jenkins Setup - Get Your Project Running!

## 🎯 Your SonarQube Token
```
sqa_671dff185897dccc56ee593a2b0a2232a7439dd8
```

---

## 🚀 5-Minute Setup

### Step 1: Add Credentials in Jenkins (2 min)

1. **Go to**: http://jenkins.imcc.com/
2. **Login**: `student` / `Changeme@2025`
3. **Manage Jenkins** → **Credentials** → **System** → **Global credentials**

#### A. Add SonarQube Token:
- **Add Credentials** → **Secret text**
- **Secret**: `sqa_671dff185897dccc56ee593a2b0a2232a7439dd8`
- **ID**: `sonarqube-token`
- **Save**

#### B. Add Nexus Credentials:
- **Add Credentials** → **Username with password**
- **Username**: `student`
- **Password**: `Imcc@2025`
- **ID**: `nexus-credentials`
- **Save**

### Step 2: Configure SonarQube Server (1 min)

1. **Manage Jenkins** → **Configure System**
2. **SonarQube servers** → **Add SonarQube**
   - **Name**: `SonarQube`
   - **Server URL**: `http://sonarqube.imcc.com`
   - **Token**: `sonarqube-token`
3. **Save**

### Step 3: Configure SonarScanner Tool (1 min)

1. **Manage Jenkins** → **Global Tool Configuration**
2. **SonarQube Scanner** → **Add SonarQube Scanner**
   - **Name**: `SonarScanner` ⚠️ **MUST BE EXACTLY THIS!**
   - **Install automatically**: ✅ Checked
3. **Save**

### Step 4: Create Pipeline Job (1 min)

1. **New Item** → Name: `2401084-vivek-kamble` → **Pipeline** → **OK**
2. **Pipeline** tab:
   - **Definition**: **Pipeline script from SCM**
   - **SCM**: **Git**
   - **Repository URL**: `https://github.com/VivekKamble014/Student-Attendance-System-CICD.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`
3. **Save**

### Step 5: Build! 🎉

1. Click **Build Now**
2. Watch it work!

---

## ✅ Your Project Will Appear At:

**http://jenkins.imcc.com/job/2401084-vivek-kamble/**

---

## 🔍 After Build Completes:

- **Jenkins**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
- **SonarQube**: http://sonarqube.imcc.com/dashboard?id=2401084-Student-Attendance-System-CICD
- **Nexus**: http://nexus.imcc.com/ → Browse → docker-hosted

---

**That's it! Everything is automated!** 🚀

