# 🌐 Your Project URLs and Access Information

## 🎯 Jenkins Project URLs

### Main Project Dashboard:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/
```

### Build History:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/builds
```

### Latest Build:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/
```

### Console Output (Latest Build):
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/console
```

### Pipeline Visualization:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/pipeline
```

### Build with Parameters:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/build
```

---

## 🔍 SonarQube URLs

### Project Dashboard:
```
http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble
```

### Project Overview:
```
http://sonarqube.imcc.com/project/overview?id=2401084-vivek-kamble
```

### Code Quality:
```
http://sonarqube.imcc.com/project/issues?id=2401084-vivek-kamble
```

### Code Coverage:
```
http://sonarqube.imcc.com/component_measures?id=2401084-vivek-kamble&metric=coverage
```

---

## 📦 Nexus URLs

### Docker Registry:
```
http://nexus.imcc.com/
```

### Browse Docker Images:
```
http://nexus.imcc.com/#browse/browse:docker-hosted
```

### Your Image:
```
http://nexus.imcc.com/#browse/browse:docker-hosted:2401084-vivek-kamble
```

---

## 🚀 Application URLs

### Local Development:
```
http://localhost:3000
```

### Health Check:
```
http://localhost:3000/api/health
```

### Production (After Deployment):
```
http://your-server-ip:3000
```

---

## 📚 GitHub Repository

### Repository URL:
```
https://github.com/VivekKamble014/Student-Attendance-System-CICD.git
```

### Webhook URL (for GitHub):
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=YOUR_TOKEN
```

### GitHub Webhook Settings:
```
https://github.com/VivekKamble014/Student-Attendance-System-CICD/settings/hooks
```

---

## 🔐 Login Credentials

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| **Jenkins** | http://jenkins.imcc.com/ | student | Changeme@2025 |
| **SonarQube** | http://sonarqube.imcc.com/ | student | Imccstudent@2025 |
| **Nexus** | http://nexus.imcc.com/ | student | Imcc@2025 |

---

## 📊 Quick Access Links

### Most Used URLs:

1. **Jenkins Project**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
2. **SonarQube Dashboard**: http://sonarqube.imcc.com/dashboard?id=2401084-vivek-kamble
3. **Nexus Docker Registry**: http://nexus.imcc.com/
4. **GitHub Repository**: https://github.com/VivekKamble014/Student-Attendance-System-CICD

---

## 🎯 Project Information

- **Project Name**: Student Attendance System
- **Project Key**: `2401084-vivek-kamble`
- **GitHub Repo**: `VivekKamble014/Student-Attendance-System-CICD`
- **Docker Image**: `2401084-vivek-kamble:latest`
- **Nexus Image**: `nexus.imcc.com:8082/2401084-vivek-kamble:latest`

---

## ✅ Status Check Commands

### Check Jenkins Build Status:
```bash
curl http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/api/json | grep result
```

### Check Application Health:
```bash
curl http://localhost:3000/api/health
```

### Check Docker Containers:
```bash
docker ps | grep attendance
```

### Check Nexus Images:
```bash
curl -u student:Imcc@2025 http://nexus.imcc.com/service/rest/v1/components?repository=docker-hosted
```

---

## 🚀 Quick Actions

### Trigger Jenkins Build:
```bash
curl -X POST "http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=YOUR_TOKEN"
```

### View Latest Build Logs:
```bash
curl http://jenkins.imcc.com/job/2401084-vivek-kamble/lastBuild/consoleText
```

### Pull Latest Image from Nexus:
```bash
docker login nexus.imcc.com:8082 -u student -p Imcc@2025
docker pull nexus.imcc.com:8082/2401084-vivek-kamble:latest
```

---

**Last Updated**: 2025-01-08  
**Project**: 2401084-vivek-kamble

