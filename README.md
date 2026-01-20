# AWS Scalable To-Do List App

A full-stack serverless To-Do List app deployed on AWS.

**Live Demo:** https://dnz0gkceadoio.cloudfront.net

If you’re reviewing this for the Month 3 project: this repo shows a scalable AWS architecture, Infrastructure-as-Code (Terraform), monitoring + cost controls, and a simple CI/CD pipeline.

**Docs:**
- `DEPLOYMENT_GUIDE.md` (how to deploy)
- `SECURITY_AND_MAINTENANCE.md` (security + ops notes)
- `APP_DESCRIPTION.md` (short overview)

## Quick Start

### Local Development

```bash
git clone https://github.com/Kutlwano-Take/aws-scalable-todo-app.git
cd aws-scalable-todo-app

cd app
cp .env.example .env  # Copy example, edit with your API URL and API key
npm install && npm run dev

```

### Production Deployment

```bash
cd infra
terraform init && terraform apply

terraform output -raw api_key

cd ../app
echo "VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod" > .env
echo "VITE_API_KEY=your-api-key-here" >> .env
npm run build
aws s3 sync dist/ s3://{your-bucket}/ --delete
aws cloudfront create-invalidation --distribution-id {your-id} --paths "/*"
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Features

### Core Functionality
- Full CRUD operations for tasks
- Task filtering (All, Active, Completed)
- Persistent storage with DynamoDB
- Optimistic UI updates with error rollback

### User Interface
- Glassmorphism design with frosted glass cards
- iOS-style interactions and animations
- Swipe to delete on mobile devices
- Smooth animations for task entries and interactions
- Animated gradient background with visual effects

## Architecture

**Serverless Stack:**
- Frontend: React 18 + TypeScript + Vite, hosted on S3 + CloudFront
- Backend: AWS Lambda (Node.js 20.x) + API Gateway
- Database: DynamoDB (on-demand pricing)
- Infrastructure: Terraform (Infrastructure as Code)

## Security

- HTTPS enforced via CloudFront
- S3 access restricted with Origin Access Control
- API Gateway protected with API keys
- IAM roles with least privilege permissions
- Environment variables for sensitive configuration
- CORS properly configured

## API Endpoints

All endpoints require an API key in the `x-api-key` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Fetch all tasks |
| POST | `/todos` | Create new task |
| PUT | `/todos/{id}/toggle` | Toggle task completion |
| DELETE | `/todos/{id}` | Delete task |

Base URL is configured via `VITE_API_URL` environment variable. API key is configured via `VITE_API_KEY` environment variable.

## Cost Estimate

This application is designed to stay within AWS Free Tier for typical usage:

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| S3 | 5GB storage, 20K GET requests | $0 (within free tier) |
| CloudFront | 50GB data transfer, 2M requests | $0 (within free tier) |
| Lambda | 1M requests, 400K GB-seconds | $0 (within free tier) |
| API Gateway | 1M requests/month | $0 (within free tier) |
| DynamoDB | 25GB storage, 200M read/write units | $0 (on-demand, minimal usage) |
| CloudWatch | 10 custom metrics, 5GB logs | $0 (within free tier) |

Beyond free tier, costs remain minimal for typical usage (under $5/month for 1000+ daily users).

## Monitoring

CloudWatch integration provides:
- Logs for the Lambda function
- Alarms for Lambda errors and performance
- A CloudWatch dashboard for key metrics
- AWS Budgets alerts for cost monitoring

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for monitoring setup details.

## CI/CD

This repo includes a simple GitHub Actions workflow that builds the frontend and deploys it to S3, then invalidates CloudFront.

- Workflow: `.github/workflows/deploy-frontend.yml`
- Runs on push to `main`

## Tech Stack

**Frontend:**
- React 18.3.1 + TypeScript 5.6.3
- Vite 5.4.8 (build tool)
- Custom CSS (glassmorphism design, no frameworks)

**Backend:**
- AWS Lambda (Node.js 20.x)
- API Gateway (REST API with API key authentication)
- DynamoDB (NoSQL database)

**Infrastructure:**
- Terraform (Infrastructure as Code)
- S3 + CloudFront (static hosting and CDN)
- IAM (security and permissions)

## Documentation

- [APP_DESCRIPTION.md](./APP_DESCRIPTION.md) - Complete application overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [SECURITY_AND_MAINTENANCE.md](./SECURITY_AND_MAINTENANCE.md) - Security best practices and maintenance tasks

## Future Enhancements

- User authentication with AWS Cognito
- User-specific task lists
- Task categories and tags
- Due dates and reminders
- Progressive Web App features (offline support)

## License

Educational project - AWS Scalable Web App Infrastructure

**Version:** 2.0 | **Status:** Production Ready | **Last Updated:** January 14, 2026
