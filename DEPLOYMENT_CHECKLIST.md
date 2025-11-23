# ✅ Deployment Checklist

Use this checklist to ensure everything is properly configured before deployment.

## Pre-Deployment

### GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Personal Access Token created
- [ ] Token saved securely

### Server Preparation
- [ ] Server access confirmed (SSH working)
- [ ] Server has sufficient resources (RAM, Disk space)
- [ ] System packages updated
- [ ] Java 17 installed
- [ ] Git installed

### Docker Installation
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Docker test successful (`docker run hello-world`)

### Jenkins Setup
- [ ] Jenkins installed and running
- [ ] Jenkins accessible on port 8080
- [ ] Initial admin password retrieved
- [ ] Admin user created
- [ ] Required plugins installed:
  - [ ] Docker Pipeline
  - [ ] Docker
  - [ ] GitHub Integration
  - [ ] SonarQube Scanner
  - [ ] Nexus Artifact Uploader
  - [ ] Pipeline

### Nexus Setup
- [ ] Nexus container running
- [ ] Nexus accessible on port 8081
- [ ] Admin password changed
- [ ] Docker registry created (port 8082)
- [ ] Repository URL noted

### SonarQube Setup
- [ ] SonarQube container running
- [ ] SonarQube accessible on port 9000
- [ ] Admin password changed
- [ ] Project created in SonarQube
- [ ] Project key and token saved

## Configuration

### Jenkins Configuration
- [ ] GitHub credentials added
- [ ] Nexus credentials added
- [ ] SonarQube credentials added
- [ ] SonarQube server configured in Jenkins
- [ ] Node.js tool configured in Jenkins
- [ ] Pipeline job created
- [ ] Jenkinsfile path configured correctly

### Environment Variables
- [ ] `.env` file created on server
- [ ] Database passwords set (strong passwords)
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Server IP addresses updated in all configs
- [ ] File permissions set correctly (600)

### Code Configuration
- [ ] Jenkinsfile updated with correct server IPs
- [ ] docker-compose.yml reviewed
- [ ] Dockerfile reviewed
- [ ] .env.example updated

## Deployment

### First Deployment
- [ ] Pipeline triggered manually
- [ ] Build successful
- [ ] SonarQube analysis passed
- [ ] Docker image built successfully
- [ ] Image pushed to Nexus
- [ ] Containers started
- [ ] Database migrations ran
- [ ] Application accessible

### Post-Deployment
- [ ] Admin user created
- [ ] Application tested (login works)
- [ ] Database connection verified
- [ ] All features tested

## Security

- [ ] All default passwords changed
- [ ] Strong passwords used everywhere
- [ ] .env file permissions set (600)
- [ ] Firewall configured (if needed)
- [ ] SSL certificate installed (if using domain)

## Monitoring

- [ ] Application logs accessible
- [ ] Database backup script created
- [ ] Backup schedule configured
- [ ] Monitoring set up (optional)

## Documentation

- [ ] Deployment guide reviewed
- [ ] Team members have access
- [ ] Credentials documented securely
- [ ] Server access documented

---

## Quick Verification Commands

```bash
# Check all services are running
docker ps

# Check application logs
docker logs attendance_app -f

# Check database logs
docker logs attendance_mysql -f

# Test application
curl http://localhost:3000

# Check Jenkins
curl http://localhost:8080

# Check Nexus
curl http://localhost:8081

# Check SonarQube
curl http://localhost:9000
```

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

