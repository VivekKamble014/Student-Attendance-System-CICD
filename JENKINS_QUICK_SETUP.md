# ⚡ Jenkins Quick Setup Checklist

## 🔐 Credentials Setup (5 minutes)

### Step 1: Get SonarQube Token
1. Go to: `http://sonarqube.imcc.com/`
2. Login: `student` / `Imccstudent@2025`
3. Profile → My Account → Security → Generate Token
4. Name: `jenkins-token` → **Copy the token**

### Step 2: Add Credentials in Jenkins
1. Jenkins → **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. **Add Credentials** → Secret text:
   - Secret: `[Paste SonarQube token]`
   - ID: `sonarqube-token`
   - ✅ Save

3. **Add Credentials** → Username with password:
   - Username: `student`
   - Password: `Imcc@2025`
   - ID: `nexus-credentials`
   - ✅ Save

### Step 3: Configure SonarQube Server
1. Jenkins → **Manage Jenkins** → **Configure System**
2. **SonarQube servers** → **Add SonarQube**:
   - Name: `SonarQube`
   - Server URL: `http://sonarqube.imcc.com`
   - Server authentication token: `sonarqube-token`
   - ✅ Save

---

## 📦 Create Pipeline Job (3 minutes)

1. Jenkins → **New Item**
2. Name: `2401084-vivek-kamble`
3. Type: **Pipeline** → OK
4. **Pipeline** tab:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/YOUR_USERNAME/2401084-vivek-kamble.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
   - ✅ Save

---

## 🎯 Create SonarQube Project (2 minutes)

1. Go to: `http://sonarqube.imcc.com/`
2. **+** → **Manually**
3. Project key: `2401084-vivek-kamble`
4. Display name: `Student Attendance System - 2401084-vivek-kamble`
5. ✅ Set Up

---

## 🚀 Run First Build

1. Go to your Jenkins job
2. Click **Build Now**
3. Watch Console Output
4. ✅ Done!

---

## 📋 Quick Reference

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| **Jenkins** | http://jenkins.imcc.com/ | student | Changeme@2025 |
| **SonarQube** | http://sonarqube.imcc.com/ | student | Imccstudent@2025 |
| **Nexus** | http://nexus.imcc.com/ | student | Imcc@2025 |

| Credential ID | Type | Usage |
|--------------|------|-------|
| `sonarqube-token` | Secret text | SonarQube authentication |
| `nexus-credentials` | Username/Password | Nexus Docker registry |

---

## ✅ Verification Checklist

- [ ] SonarQube token generated and added to Jenkins
- [ ] Nexus credentials added to Jenkins
- [ ] SonarQube server configured in Jenkins
- [ ] Pipeline job created
- [ ] SonarQube project created
- [ ] First build triggered
- [ ] Build completed successfully
- [ ] Docker image pushed to Nexus
- [ ] Application deployed

---

**Need detailed instructions?** See [CICD_SETUP_GUIDE.md](./CICD_SETUP_GUIDE.md)

