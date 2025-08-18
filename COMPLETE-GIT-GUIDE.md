# 🚀 Complete Git Workflow Guide - InvoiceGen Pro

## 📋 **BRANCH STRATEGY**

### **Main Branches:**
- **`main`** - Stable release branch (portfolio/showcase)
- **`production`** - Production deployment branch (auto-deploys to Railway + Netlify)
- **`development`** - Main development branch (all features merge here first)

### **Feature Branches:**
- **`feature/feature-name`** - New features
- **`fix/bug-name`** - Bug fixes
- **`hotfix/critical-fix`** - Critical production fixes

---

## 🔄 **DAILY DEVELOPMENT WORKFLOW**

### **Option 1: Direct Development (Small Changes)**
```bash
# Switch to development branch
git checkout development
git pull origin development

# Make changes directly
# ... edit files ...

# Commit and push
git add .
git commit -m "feat: add user profile dropdown

✨ NEW FEATURES:
- User avatar display in header
- Dropdown menu with profile options
- Settings and logout functionality"

git push origin development
```

### **Option 2: Feature Branches (Recommended)**
```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/user-profile-settings

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: implement user profile settings

✨ NEW FEATURES:
- Profile editing functionality
- Avatar upload capability
- Account preferences management"

# Push feature branch
git push origin feature/user-profile-settings

# Merge back to development
git checkout development
git merge feature/user-profile-settings
git push origin development

# Clean up
git branch -d feature/user-profile-settings
git push origin --delete feature/user-profile-settings
```

---

## 🚀 **PRODUCTION DEPLOYMENT WORKFLOW**

### **Weekly/Bi-weekly Production Deploy:**
```bash
# Switch to production branch
git checkout production
git pull origin production

# Merge development into production
git merge development

# Push to trigger auto-deployment
git push origin production

# ✅ This automatically deploys to:
# - Railway (Backend)
# - Netlify (Frontend)
```

### **Merge to Main (Stable Release):**
```bash
# After production is stable, merge to main
git checkout main
git pull origin main
git merge production
git push origin main
```

---

## 🚨 **EMERGENCY HOTFIX WORKFLOW**

### **For Critical Production Issues:**
```bash
# Create hotfix from production
git checkout production
git pull origin production
git checkout -b hotfix/critical-payment-bug

# Fix the issue quickly
git add .
git commit -m "hotfix: fix payment processing error

🚨 CRITICAL FIX:
- Fixed Stripe payment integration
- Resolved invoice status update issue
- Added error handling for failed payments"

# Deploy hotfix immediately
git checkout production
git merge hotfix/critical-payment-bug
git push origin production

# Also merge back to development
git checkout development
git merge hotfix/critical-payment-bug
git push origin development

# Clean up
git branch -d hotfix/critical-payment-bug
```

---

## 📝 **COMMIT MESSAGE CONVENTIONS**

### **Format:**
```
<type>: <short description>

<optional detailed body with emojis>
```

### **Types:**
- **`feat:`** - New feature
- **`fix:`** - Bug fix
- **`style:`** - UI/styling changes
- **`refactor:`** - Code refactoring
- **`docs:`** - Documentation
- **`test:`** - Adding tests
- **`chore:`** - Maintenance

### **Examples:**

#### **Feature Commit:**
```bash
git commit -m "feat: implement invoice PDF generation

✨ NEW FEATURES:
- PDF export functionality for invoices
- Custom branding and logo support
- Professional invoice templates

🛠️ TECHNICAL:
- Added jsPDF library integration
- Created reusable PDF service
- Added download and email options"
```

#### **Bug Fix Commit:**
```bash
git commit -m "fix: resolve authentication issues

🐛 BUG FIXES:
- Fixed JWT token validation
- Resolved CORS configuration
- Fixed password hashing comparison

✅ TESTING:
- Verified login flow works
- Tested on both localhost and production"
```

#### **Style/UI Commit:**
```bash
git commit -m "style: improve dashboard responsive design

🎨 UI IMPROVEMENTS:
- Enhanced mobile responsiveness
- Updated color scheme consistency
- Improved button hover states
- Fixed layout issues on tablet devices"
```

---

## 🛠️ **USEFUL GIT COMMANDS**

### **Branch Management:**
```bash
# List all branches
git branch -a

# Switch branches
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

### **Syncing with Remote:**
```bash
# Fetch latest changes
git fetch origin

# Pull latest changes
git pull origin branch-name

# Push changes
git push origin branch-name
```

### **Undoing Changes:**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific file changes
git checkout -- filename.js

# Revert a commit (creates new commit)
git revert commit-hash
```

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Before Production Deployment:**
- [ ] All features tested on development
- [ ] No console errors in browser
- [ ] API endpoints working correctly
- [ ] Environment variables updated
- [ ] Database migrations completed (if any)
- [ ] Team notified of deployment

### **After Production Deployment:**
- [ ] Verify deployment successful
- [ ] Test critical user flows
- [ ] Monitor for errors
- [ ] Update team on deployment status

---

## 🎯 **QUICK REFERENCE COMMANDS**

### **Daily Development:**
```bash
git checkout development
git pull origin development
# ... make changes ...
git add .
git commit -m "feat: add awesome feature"
git push origin development
```

### **Production Deploy:**
```bash
git checkout production
git pull origin production
git merge development
git push origin production
# ✅ Auto-deploys to Railway + Netlify
```

### **Emergency Hotfix:**
```bash
git checkout production
git checkout -b hotfix/urgent-fix
# ... fix issue ...
git add .
git commit -m "hotfix: urgent production fix"
git checkout production
git merge hotfix/urgent-fix
git push origin production
```

---

## 📊 **CURRENT SETUP STATUS**

✅ **Repository:** https://github.com/SameerAli126/invoicegen-pro.git
✅ **Branches:** main, production, development
✅ **Auto-Deploy:** production → Railway + Netlify
✅ **Working:** Login, signup, dashboard, invoices, clients

**Remember:** Always test locally before pushing, and test on development before deploying to production! 🚀
