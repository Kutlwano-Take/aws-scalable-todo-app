# 🚀 AWS Scalable To-Do List App

A modern, full-stack serverless To-Do List application built with React and deployed on AWS infrastructure. Features a beautiful glassmorphism UI design with iOS-style interactions and animations.

---

## ✨ Features

### **Core Functionality**
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Task Filtering** - View All, Active, or Completed tasks
- ✅ **Task Counter** - Shows remaining active tasks
- ✅ **Clear Completed** - Bulk delete completed tasks
- ✅ **Persistent Storage** - Tasks saved to DynamoDB
- ✅ **Real-time Updates** - Optimistic UI with error rollback

### **UI/UX Features**
- 🎨 **Glassmorphism Design** - Frosted glass cards with backdrop blur
- 📱 **iOS-Style Interactions** - Smooth animations and transitions
- 👆 **Swipe to Delete** - Swipe left on mobile to delete tasks
- ✨ **Animated Background** - Gradient background with star sparkles
- 🎯 **Focus Glow Effects** - Soft neon glow on input focus
- 💫 **Smooth Animations** - Staggered task entries, checkmark animations
- 📊 **Progress Tracking** - Visual completion status

---

## 🏗️ Architecture

### **Tech Stack**

#### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Custom CSS** - Glassmorphism design (no Tailwind)
- **Inter/Roboto Fonts** - Clean, modern typography

#### Backend
- **AWS Lambda** (Node.js 20.x) - Serverless functions
- **API Gateway** - REST API with CORS
- **DynamoDB** - NoSQL database (PAY_PER_REQUEST)

#### Infrastructure
- **S3** - Static hosting with Origin Access Control
- **CloudFront** - Global CDN with HTTPS
- **Terraform** - Infrastructure as Code
- **IAM** - Least privilege security

---

## 📁 Project Structure

```
To-Do-List-App/
├── app/                    # React frontend
│   ├── src/
│   │   ├── modules/        # React components
│   │   │   ├── App.tsx     # Main app component
│   │   │   ├── NewTodo.tsx # Input component
│   │   │   ├── TodoList.tsx # Task list with swipe
│   │   │   ├── Filters.tsx # Filter buttons
│   │   │   └── types.ts   # TypeScript types
│   │   ├── api.ts         # API client
│   │   ├── index.css      # Custom CSS (glassmorphism)
│   │   └── main.tsx       # Entry point
│   ├── dist/              # Build output
│   └── package.json
│
├── backend/               # Local Express server (dev)
│   └── server.js
│
├── infra/                 # Terraform infrastructure
│   ├── lambda/           # Lambda function code
│   │   └── index.js     # API handler
│   ├── main.tf          # Main infrastructure
│   ├── variables.tf     # Variables
│   └── outputs.tf       # Outputs
│
└── docs/                 # Documentation
    └── architecture/     # Architecture diagrams
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js >= 18
- AWS CLI configured
- Terraform >= 1.0

### **Local Development**

1. **Start Backend (Mock API):**
   ```bash
   cd backend
   npm install
   npm start
   # Runs on http://localhost:3000
   ```

2. **Start Frontend:**
   ```bash
   cd app
   npm install
   npm run dev
   # Runs on http://localhost:5173
   ```

### **Production Deployment**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**
```bash
# 1. Deploy Infrastructure
cd infra
terraform init
terraform apply

# 2. Build & Deploy Frontend
cd ../app
npm run build
aws s3 sync dist/ s3://todo-app-frontend-uy9fm47h/ --delete
aws cloudfront create-invalidation --distribution-id EB7DDXZ4MYDUO --paths "/*"
```

---

## 🌐 Live URLs

- **Production App:** https://d2tjhu6fumjbf7.cloudfront.net
- **API Endpoint:** https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod
- **Local Frontend:** http://localhost:5173
- **Local Backend:** http://localhost:3000

---

## 🎨 Design System

### **Glassmorphism UI**
- Semi-transparent frosted glass cards
- Heavy backdrop blur (40px)
- Subtle borders and shadows
- Animated gradient background
- Star sparkle effects

### **iOS-Style Components**
- Rounded inputs with focus glow
- System blue buttons (#007AFF)
- Segmented control filters
- Smooth cubic-bezier transitions
- Swipe gestures for mobile

### **Typography**
- **Font:** Inter/Roboto
- **Title:** 32px, Bold
- **Body:** 16px, Regular
- High contrast white text

### **Colors**
- Background: Black with gradient overlay
- Glass: `rgba(255, 255, 255, 0.1)`
- Primary: System Blue (#007AFF)
- Success: System Green (#34C759)
- Danger: System Red (#FF3B30)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Fetch all tasks |
| POST | `/todos` | Create new task |
| PUT | `/todos/{id}/toggle` | Toggle completion |
| DELETE | `/todos/{id}` | Delete task |

**Base URL:** `https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod`

---

## 🔒 Security

- ✅ HTTPS enforced on CloudFront
- ✅ S3 access restricted to CloudFront (OAC)
- ✅ IAM roles with least privilege
- ✅ CORS headers properly configured
- ✅ No public S3 bucket access
- ✅ Secure API Gateway endpoints

---

## 📊 AWS Resources

| Resource | Name/ID | Purpose |
|----------|---------|---------|
| S3 Bucket | `todo-app-frontend-uy9fm47h` | Static hosting |
| CloudFront | `EB7DDXZ4MYDUO` | CDN + HTTPS |
| API Gateway | `xydj5lg2h6` | REST API |
| Lambda | `todo-app-todo-api` | Backend logic |
| DynamoDB | `todo-app-tasks` | Task storage |

---

## 🛠️ Development

### **Tech Stack Details**

**Frontend:**
- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.8
- Custom CSS (no frameworks)

**Backend:**
- Node.js 20.x
- AWS SDK v2
- DynamoDB DocumentClient

**Infrastructure:**
- Terraform
- AWS Provider 5.100.0

### **Build Commands**

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

### **Environment Variables**

No environment variables needed - API URL is hardcoded in `app/src/api.ts`:
```typescript
const BASE_URL = 'https://xydj5lg2h6.execute-api.us-east-1.amazonaws.com/prod';
```

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Testing procedures
- **[FIXES_SUMMARY.md](./FIXES_SUMMARY.md)** - Technical fixes documentation
- **[BEFORE_AFTER.md](./BEFORE_AFTER.md)** - Design comparison

---

## 🎯 Key Features Implemented

### **iOS-Style Interactions**
- ✅ Swipe to delete (mobile/touch)
- ✅ Smooth animations (cubic-bezier)
- ✅ Ripple effects on buttons
- ✅ Checkmark bounce animation
- ✅ Hover effects with elevation
- ✅ Active state feedback

### **Glassmorphism Design**
- ✅ Frosted glass cards
- ✅ Backdrop blur effects
- ✅ Semi-transparent backgrounds
- ✅ Glass reflection highlights
- ✅ Animated gradient background
- ✅ Star sparkle effects

### **Error Handling**
- ✅ Optimistic UI updates
- ✅ Automatic rollback on failure
- ✅ User-friendly error notifications
- ✅ Network error handling
- ✅ Loading states

---

## 🚧 Future Enhancements

- [ ] User authentication (AWS Cognito)
- [ ] User-specific task lists
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Bulk operations
- [ ] PWA features (offline support)
- [ ] Dark/light mode toggle
- [ ] Task search functionality
- [ ] Drag and drop reordering

---

## 📝 License

This project is part of the AWS Scalable Web App Infrastructure course.

---

## 👤 Author

Built as part of Month 3 Project - AWS Scalable Web App Infrastructure

**Last Updated:** January 13, 2026  
**Status:** ✅ Production Ready  
**Version:** 2.0 (Custom CSS Glassmorphism)
