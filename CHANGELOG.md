# 📝 Changelog

All notable changes to the To-Do List App project.

---

## [2.0.0] - January 13, 2026

### 🎨 Major Design Overhaul

#### **Removed Tailwind CSS**
- ✅ Removed Tailwind CSS and all dependencies
- ✅ Deleted `tailwind.config.js` and `postcss.config.js`
- ✅ Removed Tailwind from `package.json`
- ✅ Reduced bundle size: 8.5KB CSS (was 14KB+)

#### **Custom CSS Glassmorphism Design**
- ✅ Created comprehensive custom CSS (657 lines)
- ✅ Implemented glassmorphism effects
- ✅ Added iOS-style components
- ✅ Smooth animations and transitions
- ✅ Animated gradient background
- ✅ Star sparkle effects

#### **iOS-Style Features**
- ✅ Swipe to delete gesture (mobile/touch)
- ✅ iOS-style input fields
- ✅ iOS-style buttons with ripple
- ✅ iOS-style checkboxes
- ✅ iOS segmented control filters
- ✅ Smooth cubic-bezier animations

### 🔒 Security Improvements
- ✅ **Removed hardcoded API URL** from source code
- ✅ **Environment variable support** via `VITE_API_URL`
- ✅ **Fallback to localhost** for local development
- ✅ **Created `.env.example`** template file
- ✅ **Updated all documentation** to use placeholders
- ✅ **Removed API Gateway ID** from public documentation

### 🐛 Bug Fixes
- ✅ Fixed error in `App.tsx` line 164: Changed `onRemove` to `handleRemove`
- ✅ All linter errors resolved

### 📚 Documentation Updates
- ✅ Updated `README.md` with current tech stack and environment variable setup
- ✅ Updated `DEPLOYMENT_GUIDE.md` with design system info and API URL configuration
- ✅ Updated `PROJECT_STATUS.md` - Removed hardcoded API URLs
- ✅ Updated `FIXES_SUMMARY.md` - Replaced API URLs with placeholders
- ✅ Updated `TESTING_CHECKLIST.md` - Replaced API URLs with placeholders
- ✅ Created `PROJECT_STATUS.md` - Complete status report
- ✅ Created `CHANGELOG.md` - This file

---

## [1.0.0] - January 12, 2026

### ✨ Initial Production Release

#### **Backend Fixes**
- ✅ Added PUT `/todos/{id}/toggle` endpoint
- ✅ Added DELETE `/todos/{id}` endpoint
- ✅ Added OPTIONS handler for CORS
- ✅ Updated API Gateway with proxy routes

#### **Frontend Fixes**
- ✅ Fixed `t.title` → `t.text` bug
- ✅ Added proper async/await error handling
- ✅ Added error rollback mechanism
- ✅ Added user-friendly error notifications
- ✅ Added TypeScript types

#### **Infrastructure**
- ✅ Terraform configuration complete
- ✅ All AWS resources deployed
- ✅ Security configured (OAC, IAM, HTTPS)

#### **Documentation**
- ✅ Created deployment guide
- ✅ Created testing checklist
- ✅ Created fixes summary
- ✅ Created before/after comparison

---

## Technical Details

### **Dependencies Removed (v2.0)**
- `tailwindcss` ^4.1.18
- `@tailwindcss/postcss` ^4.1.18
- `autoprefixer` ^10.4.23
- `postcss` ^8.5.6

### **Current Dependencies**
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `typescript` ^5.6.3
- `vite` ^5.4.8
- `@vitejs/plugin-react` ^4.3.0

### **Build Output (v2.0)**
- JavaScript: 149KB (48KB gzipped)
- CSS: 8.5KB (2.4KB gzipped)
- HTML: 0.4KB
- **Total:** ~158KB (~51KB gzipped)

---

## Migration Notes

### **From Tailwind to Custom CSS**
- All Tailwind classes replaced with custom CSS classes
- No build-time CSS processing needed
- Direct CSS imports in components
- Smaller bundle size
- Full control over styling

### **Breaking Changes**
- None - All functionality preserved
- UI design updated but features remain the same

### **Environment Variable Migration**
If you're upgrading from a previous version with hardcoded API URLs:

1. Create `.env` file in `app/` directory:
   ```bash
   VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
   ```

2. For local development:
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

3. The app will automatically use the environment variable or fallback to localhost.

---

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
**Versioning:** [Semantic Versioning](https://semver.org/)
