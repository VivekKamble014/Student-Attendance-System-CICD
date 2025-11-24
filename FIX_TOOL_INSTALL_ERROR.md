# 🔧 Fix "Declarative: Tool Install" Error

## ⚠️ Problem

**Builds are failing at**: "Declarative: Tool Install" stage

**This means**: Jenkins cannot find or install the `NodeJS18` tool.

**Result**: Build never reaches SonarQube Analysis stage, so SonarQube shows "Not analyzed yet"

---

## ✅ Solution: Configure NodeJS Tool in Jenkins

### Step 1: Check What NodeJS Tools Are Available

1. **Go to**: http://jenkins.imcc.com/
2. **Login**: `student` / `Changeme@2025`
3. **Manage Jenkins** → **Global Tool Configuration**
4. **Scroll to**: **NodeJS** section
5. **Check**: What NodeJS tools are configured
   - Look for names like: `NodeJS18`, `nodejs`, `NodeJS`, etc.
   - **Note the exact name** (case-sensitive!)

### Step 2: Configure NodeJS Tool

**Option A: If NodeJS18 doesn't exist**

1. **NodeJS** section → **Add NodeJS**
2. **Configure**:
   - **Name**: `NodeJS18` ⚠️ **MUST BE EXACTLY THIS!**
   - **Version**: Select Node.js 18 or higher
   - **Install automatically**: ✅ Checked
3. **Save**

**Option B: If a different name exists (e.g., `nodejs`, `NodeJS`)**

1. **Note the exact name** from Step 1
2. **Update Jenkinsfile** to match that name
3. **Or rename the tool** in Jenkins to `NodeJS18`

### Step 3: Verify Tool Configuration

1. **Global Tool Configuration** → **NodeJS** section
2. **Verify**:
   - ✅ Tool named `NodeJS18` exists
   - ✅ Version is selected (Node.js 18+)
   - ✅ "Install automatically" is checked
3. **Save**

---

## 🔄 Alternative: Make Tools Optional

If you can't configure the tool, we can modify the Jenkinsfile to install Node.js manually. But it's better to configure the tool properly.

---

## 🚀 After Fixing Tool Configuration

1. **Save** the tool configuration
2. **Go to**: http://jenkins.imcc.com/job/2401084-vivek-kamble/
3. **Click**: **Build Now**
4. **Watch**: Build should now pass "Tool Install" stage
5. **Continue**: Build will reach SonarQube Analysis stage
6. **Check**: SonarQube dashboard after build completes

---

## 📋 Quick Checklist

- [ ] Checked what NodeJS tools exist in Jenkins
- [ ] Configured NodeJS tool named `NodeJS18`
- [ ] Verified "Install automatically" is checked
- [ ] Saved configuration
- [ ] Triggered new build
- [ ] Build passed Tool Install stage
- [ ] Build reached SonarQube Analysis stage
- [ ] SonarQube shows analysis results

---

## 🔍 How to Check Tool Names

**In Jenkins**:
1. **Manage Jenkins** → **Global Tool Configuration**
2. **NodeJS** section shows all configured tools
3. **Look at the "Name" column** - that's what you need to match in Jenkinsfile

**Common names**:
- `NodeJS18` ✅ (what Jenkinsfile expects)
- `nodejs` (needs to be renamed or Jenkinsfile updated)
- `NodeJS` (needs to be renamed or Jenkinsfile updated)
- `NodeJS-18` (needs to be renamed or Jenkinsfile updated)

---

## 🎯 Expected Result

After fixing the tool configuration:

1. ✅ **Checkout** - Passes
2. ✅ **Tool Install** - Passes (NodeJS18 installed)
3. ✅ **Install Dependencies** - Passes
4. ✅ **Lint** - Passes
5. ✅ **SonarQube Analysis** - Runs! ⭐
6. ✅ **Quality Gate** - Passes
7. ✅ **Build Docker** - Passes
8. ✅ **Push to Nexus** - Passes
9. ✅ **Deploy** - Passes

**Then SonarQube will show analysis results!** 🎉

---

**Fix the NodeJS tool configuration and your build will work!** 🔧

