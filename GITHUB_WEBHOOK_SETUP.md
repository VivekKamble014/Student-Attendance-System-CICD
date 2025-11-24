# 🔗 GitHub Webhook Setup Guide

This guide shows you exactly how to set up the GitHub webhook as shown in SonarQube's instructions.

---

## 📋 Prerequisites

Before setting up the webhook, make sure you have:
- ✅ Jenkins pipeline job created
- ✅ Build trigger token configured in Jenkins
- ✅ Access to your GitHub repository settings

---

## 🔧 Step 1: Get Your Jenkins Build Token

### 1.1 In Jenkins
1. Go to your pipeline job: `2401084-vivek-kamble`
2. Click **Configure**
3. Scroll to **Build Triggers** section
4. Find **Trigger builds remotely (e.g., from scripts)**
5. If not enabled:
   - ✅ Check the box
   - Enter a token (e.g., `jenkins-build-token-2401084`)
   - **COPY THIS TOKEN** - You'll need it!
6. Click **Save**

**Example Token**: `jenkins-build-token-2401084`

---

## 🔗 Step 2: Create GitHub Webhook

### 2.1 Go to GitHub Repository
1. Open your repository: `2401084-Student-Attendance-System-CICD`
2. Click **Settings** (top menu)
3. Click **Webhooks** (left sidebar)
4. Click **Add webhook** (top right)

### 2.2 Configure Webhook URL

**Payload URL Format**:
```
http://jenkins.imcc.com/job/JENKINS_JOB_NAME/build?token=YOUR_AUTH_TOKEN
```

**Replace**:
- `JENKINS_JOB_NAME` → Your Jenkins job name (e.g., `2401084-vivek-kamble`)
- `YOUR_AUTH_TOKEN` → The token from Step 1.1

**Example**:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=jenkins-build-token-2401084
```

### 2.3 Configure Webhook Settings

1. **Content type**: 
   - Select: `application/json` ✅

2. **Which events would you like to trigger this webhook?**
   - Select: **Let me select individual events** ✅
   - Under **Individual events**, check:
     - ✅ **Pushes** (this triggers on every push to the repository)

3. **Active**: 
   - ✅ Checked (enabled)

4. **Secret** (optional):
   - Leave empty for now (can add later for security)

5. Click **Add webhook**

---

## ✅ Step 3: Verify Webhook

### 3.1 Check Webhook Status
1. After creating webhook, GitHub will send a test ping
2. You should see a green checkmark ✅ next to the webhook
3. If there's an error, check:
   - URL is correct
   - Token matches
   - Jenkins is accessible

### 3.2 Test Webhook Manually
1. Go to your webhook in GitHub
2. Click **Recent Deliveries**
3. Click on the latest delivery
4. Check the **Response** tab
5. Should show: `200 OK` or similar success message

### 3.3 Test by Pushing Code
1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test webhook"
   git push origin main
   ```
3. Go to Jenkins
4. You should see a new build automatically triggered! 🎉

---

## 🔍 Step 4: Troubleshooting

### Issue: Webhook shows ❌ (red X)

**Possible Causes**:
1. **Jenkins URL incorrect**
   - Verify: `http://jenkins.imcc.com/job/YOUR_JOB_NAME/build?token=YOUR_TOKEN`
   - Make sure no typos

2. **Token mismatch**
   - Check token in Jenkins job configuration
   - Ensure it matches the webhook URL exactly

3. **Jenkins not accessible**
   - Verify Jenkins is running
   - Check if Jenkins is accessible from GitHub's servers
   - May need to configure firewall/network

4. **Job name incorrect**
   - Verify exact job name in Jenkins
   - Case-sensitive!

**Solution**:
- Check webhook **Recent Deliveries** in GitHub
- Look at **Response** tab for error details
- Check Jenkins logs: **Manage Jenkins** → **System Log**

### Issue: Webhook works but build doesn't trigger

**Possible Causes**:
1. **Branch mismatch**
   - Webhook triggers on all branches
   - Jenkins job may only build `main` branch
   - Check Jenkins job branch configuration

2. **Jenkins job disabled**
   - Check if job is enabled in Jenkins
   - Enable if disabled

**Solution**:
- Check Jenkins job configuration
- Verify branch settings match your repository

### Issue: 403 Forbidden Error

**Possible Causes**:
- Jenkins requires authentication
- CSRF protection enabled

**Solution**:
1. In Jenkins, go to **Manage Jenkins** → **Configure Global Security**
2. Check **Enable proxy compatibility** if behind proxy
3. For CSRF, you may need to use a different authentication method
4. Or use GitHub plugin instead of webhook

---

## 🔐 Alternative: Using GitHub Plugin (Recommended)

Instead of webhook, you can use GitHub plugin:

### Setup GitHub Plugin
1. In Jenkins, go to **Manage Jenkins** → **Plugins**
2. Install **GitHub plugin**
3. In your pipeline job:
   - Go to **Build Triggers**
   - ✅ Check **GitHub hook trigger for GITScm polling**
   - Save

### Configure GitHub
1. In GitHub repository → **Settings** → **Webhooks**
2. Add webhook:
   - **Payload URL**: `http://jenkins.imcc.com/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: **Just the push event**
   - Save

This method is often more reliable!

---

## 📊 Webhook URL Examples

### For Different Jenkins Setups:

**Standard Jenkins**:
```
http://jenkins.imcc.com/job/2401084-vivek-kamble/build?token=my-token-123
```

**Jenkins with Port**:
```
http://jenkins.imcc.com:8080/job/2401084-vivek-kamble/build?token=my-token-123
```

**Jenkins with GitHub Plugin**:
```
http://jenkins.imcc.com/github-webhook/
```
(No token needed, uses GitHub plugin authentication)

---

## ✅ Checklist

- [ ] Jenkins job created
- [ ] Build trigger token configured
- [ ] Token copied and saved
- [ ] GitHub webhook created
- [ ] Webhook URL correct
- [ ] Webhook events configured (Pushes)
- [ ] Webhook shows green checkmark ✅
- [ ] Test push triggers Jenkins build
- [ ] Build completes successfully

---

## 🎉 Success!

Once your webhook is working:
- Every push to your repository will automatically trigger a Jenkins build
- No need to manually click "Build Now" in Jenkins
- Your CI/CD pipeline runs automatically! 🚀

---

**Last Updated**: 2025-01-08  
**Repository**: `2401084-Student-Attendance-System-CICD`

