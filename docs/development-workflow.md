# 🔧 Development Workflow

## 📋 **Overview**

This guide explains how to develop new features, fix bugs, and contribute to InvoiceGen Pro using our established workflow.

## 🌳 **Branch Structure**

### **Branch Hierarchy**
```
main (stable)
├── production (deployment-ready)
    ├── development (active development)
        ├── feature/new-feature
        ├── bugfix/issue-fix
        └── hotfix/critical-fix
```

### **Branch Purposes**
- **main**: Stable, tested code for portfolio/showcase
- **production**: Deployment-ready code for live environments
- **development**: Active development, integration testing
- **feature/***: New feature development
- **bugfix/***: Bug fixes and improvements
- **hotfix/***: Critical production fixes

---

## 🚀 **Development Setup**

### **Initial Setup**
```bash
# Clone the repository
git clone https://github.com/SameerAli126/invoicegen-pro.git
cd invoicegen-pro

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your configuration
```

### **Development Environment**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start

# Terminal 3: Available for Git commands
```

---

## 🔄 **Daily Development Workflow**

### **Starting Development**
```bash
# Switch to development branch
git checkout development
git pull origin development

# Create feature branch (optional for small changes)
git checkout -b feature/client-export-functionality

# Or work directly on development for quick fixes
```

### **Making Changes**
1. **Edit files** using your preferred editor
2. **Test changes** locally
3. **Verify functionality** in browser
4. **Check for errors** in console/logs

### **Committing Changes**
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "✨ feat(client): add CSV export functionality

- Add export button to client list
- Implement CSV generation with client data
- Include financial summary in export
- Add loading state during export"

# Push changes
git push origin feature/client-export-functionality
# Or if working on development directly:
git push origin development
```

---

## 📝 **Commit Message Conventions**

### **Format**
```
<emoji> <type>(<scope>): <description>

[optional body]

[optional footer]
```

### **Types & Emojis**
- `✨ feat:` - New features
- `🐛 fix:` - Bug fixes
- `📚 docs:` - Documentation
- `💄 style:` - Code formatting
- `♻️ refactor:` - Code refactoring
- `⚡ perf:` - Performance improvements
- `✅ test:` - Tests
- `🔧 chore:` - Maintenance
- `🚀 deploy:` - Deployment

### **Scopes**
- `client` - Client management features
- `invoice` - Invoice-related functionality
- `auth` - Authentication system
- `dashboard` - Dashboard and analytics
- `api` - Backend API changes
- `ui` - User interface components
- `db` - Database changes

### **Examples**
```bash
git commit -m "✨ feat(invoice): add PDF export functionality"
git commit -m "🐛 fix(client): resolve duplicate email validation"
git commit -m "📚 docs: update API documentation for client endpoints"
git commit -m "💄 style(ui): improve responsive design for mobile"
git commit -m "⚡ perf(api): optimize database queries for invoice list"
```

---

## 🔀 **Feature Development Process**

### **1. Planning Phase**
- Create GitHub issue for the feature
- Discuss implementation approach
- Break down into smaller tasks
- Estimate development time

### **2. Development Phase**
```bash
# Create feature branch
git checkout development
git pull origin development
git checkout -b feature/invoice-templates

# Develop the feature
# - Write code
# - Add tests
# - Update documentation
# - Test thoroughly

# Commit regularly with descriptive messages
git add .
git commit -m "✨ feat(invoice): add template selection UI"
git commit -m "✨ feat(invoice): implement template rendering logic"
git commit -m "✅ test(invoice): add template functionality tests"
```

### **3. Integration Phase**
```bash
# Merge feature into development
git checkout development
git pull origin development
git merge feature/invoice-templates

# Test integration
npm test  # Run tests
# Manual testing in browser

# Push to development
git push origin development

# Delete feature branch
git branch -d feature/invoice-templates
git push origin --delete feature/invoice-templates
```

### **4. Release Phase**
```bash
# When ready for production
git checkout production
git pull origin production
git merge development
git push origin production

# Tag release (optional)
git tag -a v1.1.0 -m "Release v1.1.0: Invoice templates"
git push origin v1.1.0
```

---

## 🐛 **Bug Fix Workflow**

### **Regular Bug Fixes**
```bash
# Work on development branch
git checkout development
git pull origin development

# Fix the bug
# ... make changes ...

git add .
git commit -m "🐛 fix(client): resolve phone number validation issue"
git push origin development
```

### **Critical Hotfixes**
```bash
# Create hotfix from production
git checkout production
git pull origin production
git checkout -b hotfix/critical-payment-bug

# Fix the critical issue
# ... make changes ...

git add .
git commit -m "🐛 hotfix(payment): resolve payment processing failure"

# Merge back to production
git checkout production
git merge hotfix/critical-payment-bug
git push origin production

# Also merge to development
git checkout development
git merge hotfix/critical-payment-bug
git push origin development

# Delete hotfix branch
git branch -d hotfix/critical-payment-bug
```

---

## 🧪 **Testing Workflow**

### **Local Testing**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration testing
# Start both servers and test manually
```

### **Testing Checklist**
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] No console errors
- [ ] Responsive design works
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] Authentication still functional

---

## 📦 **Code Organization**

### **Frontend Structure**
```
frontend/src/
├── components/          # Reusable UI components
│   ├── UI/             # Basic UI elements
│   ├── Client/         # Client-specific components
│   ├── Invoice/        # Invoice-specific components
│   └── Onboarding/     # Onboarding components
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
└── App.tsx             # Main application
```

### **Backend Structure**
```
backend/src/
├── controllers/        # Route handlers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── services/          # Business logic
└── utils/             # Utility functions
```

### **Adding New Features**

#### **Frontend Component**
```typescript
// components/Invoice/InvoiceTemplate.tsx
import React from 'react';

interface InvoiceTemplateProps {
  template: string;
  onSelect: (template: string) => void;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ template, onSelect }) => {
  return (
    <div className="template-card" onClick={() => onSelect(template)}>
      {/* Template preview */}
    </div>
  );
};

export default InvoiceTemplate;
```

#### **Backend Route**
```javascript
// routes/invoiceTemplates.js
const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate } = require('../controllers/templateController');
const auth = require('../middleware/auth');

router.get('/', auth, getTemplates);
router.post('/', auth, createTemplate);

module.exports = router;
```

#### **Database Model**
```javascript
// models/InvoiceTemplate.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  design: { type: Object, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceTemplate', templateSchema);
```

---

## 🔍 **Code Review Process**

### **Self Review Checklist**
- [ ] Code follows project conventions
- [ ] No console.log statements left
- [ ] Error handling implemented
- [ ] Comments added for complex logic
- [ ] No hardcoded values
- [ ] Responsive design considered
- [ ] Performance implications considered

### **Pull Request Process**
1. **Create descriptive PR title**
2. **Add detailed description**
3. **Include screenshots if UI changes**
4. **Link related issues**
5. **Request review from team members**
6. **Address review feedback**
7. **Merge after approval**

---

## 🚀 **Deployment Integration**

### **Automatic Deployments**
- **development** → Staging environment (optional)
- **production** → Live production environment

### **Manual Deployment**
```bash
# Deploy to production
git checkout production
git merge development
git push origin production
# Automatic deployment triggers on Netlify/Railway
```

---

## 📊 **Development Metrics**

### **Track Your Progress**
- Commits per day/week
- Features completed
- Bugs fixed
- Code review participation
- Documentation contributions

### **Quality Metrics**
- Test coverage
- Code complexity
- Performance benchmarks
- User feedback
- Bug reports

---

## 🤝 **Collaboration Guidelines**

### **Communication**
- Use GitHub issues for feature requests
- Comment on code for clarification
- Update documentation with changes
- Share knowledge with team members

### **Best Practices**
- Keep commits small and focused
- Write descriptive commit messages
- Test before pushing
- Review others' code constructively
- Keep documentation updated

---

**🎯 Following this workflow ensures consistent, high-quality development and smooth collaboration on InvoiceGen Pro!**
