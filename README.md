# To-Do List App – Week 1 (Architecture & Planning)

This repository contains the Week 1 deliverables and initial scaffold for a React-based To‑Do List application that will be deployed on AWS as part of the "AWS Scalable Web App Infrastructure" project.

According to the Month 3 Project Brief (Week 1 — Phase 1: Architecture Design & Planning), the required deliverables are:

- Select application architecture (monolith, microservices, or serverless)
- Create an architecture diagram
- Identify AWS services (e.g., EC2, ALB, S3, CloudFront, RDS, DynamoDB)
- Define networking and security requirements (VPC, subnets, security groups/NACLs, IAM)
- Describe the workflow of the system end to end

This README documents those items and links to artifacts in the repo.

## 1) Architecture Selection

Selected: Serverless for auto-scaling and cost‑efficiency; monolith/ECS fallback if needed.

Rationale:
- Serverless aligns with AWS best practices for simple apps, reducing ops overhead (no servers to manage).
- Built-in scaling and pay-per-use model fits a lightweight To‑Do app.
- Clear evolution path: can be extended with additional managed services or decomposed if requirements grow.

Initial deployment choices for Month 3 trajectory:
- Frontend: React SPA, hosted on S3 with CloudFront (global CDN, HTTPS via ACM)
- Backend API: AWS Lambda behind Amazon API Gateway (Node.js runtime)
- Database: DynamoDB (serverless NoSQL for task items)

Fallback path (only if constraints arise): Containerized Node/Express on AWS Fargate (ECS) behind an ALB with RDS.

## 2) Architecture Diagram

See: docs/architecture/Week1-ToDo-Architecture.drawio (source) and docs/architecture/Week1-ToDo-Architecture.png (export).

High-level components:
- User -> Route 53 (optional) -> CloudFront (HTTPS via ACM) -> S3 (static SPA)
- SPA -> API Gateway -> Lambda (CRUD functions) -> DynamoDB
- Observability: CloudWatch Logs/Metrics; X-Ray optional
- IAM roles: Lambda execution role (CloudWatch, DynamoDB), CloudFront OAC for S3, least privilege
- VPC: Not required for core serverless path; may be introduced later for private resources as needed

## 3) AWS Services Identified

- Edge/Static: Amazon CloudFront, AWS Certificate Manager (ACM), Amazon S3 (static hosting), Route 53 (optional for custom domain)
- API/Compute: Amazon API Gateway (HTTP/REST), AWS Lambda (Node.js)
- Data: Amazon DynamoDB (tasks table)
- IAM: Roles and policies for Lambda execution (DynamoDB, CloudWatch), S3 access for CloudFront OAC, CI/CD roles
- Monitoring: Amazon CloudWatch (logs, metrics, dashboards, alarms)
- Optional innovation: Amazon Cognito for user authentication and authorization

## 4) Networking & Security Requirements

- Core serverless path minimizes VPC usage:
  - API Gateway and Lambda do not require a VPC by default for DynamoDB access
  - If private resources are added later, place them in a VPC and configure Lambda ENIs/subnets/security groups
- Security best practices:
  - CloudFront with ACM-issued TLS certificate for HTTPS
  - S3 bucket private with CloudFront Origin Access Control (OAC)
  - IAM least privilege for Lambda: scoped permissions to specific DynamoDB table and CloudWatch logging
  - API Gateway Cognito authorizers (if Cognito is integrated for secure authenticated endpoints)
  - Optional WAF on CloudFront for basic protections
- Optional VPC design (if needed later):
  - VPC CIDR: 10.0.0.0/16
  - Public subnets for NAT/egress; private subnets for Lambdas requiring VPC access
  - Security Groups and NACLs configured on least-privilege basis

## 5) End-to-End Workflow

1. User navigates to app URL (CloudFront distribution domain or Route 53 custom domain).
2. CloudFront serves cached static assets from edge, fetching from S3 origin via OAC when needed.
3. SPA renders and calls backend API endpoints (e.g., /prod/todos) via API Gateway over HTTPS.
4. API Gateway invokes Lambda CRUD functions.
5. Lambda reads/writes items in DynamoDB (Tasks table) and returns JSON responses.
6. Responses return via API Gateway/CloudFront to the client. Logs and metrics are captured in CloudWatch.

## Deliverables for Week 1

- docs/architecture/Week1-ToDo-Architecture.drawio — diagram source (serverless‑first)
- docs/architecture/Week1-ToDo-Architecture.png — diagram export
- README.md — this document
- app/ — React scaffold (with mock API for local development)
- backend/ — local Node/Express scaffold to simulate API while developing, preps for Lambda logic

## Local Development

Frontend (app/):
- Node.js >= 18
- Commands:
  - npm install
  - npm run dev (local dev server)

Backend mock (backend/):
- Node.js >= 18
- Commands:
  - npm install
  - npm start (runs Express on http://localhost:3000)

During Week 1/2, the frontend can use local state or mock API. In Week 3, switch to the real API Gateway + Lambda endpoint.

## Next Steps (Week 2+ Preview)

- Implement IaC (Terraform/CloudFormation) for S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM.
- Add GitHub Actions for CI/CD.
- Set up CloudWatch monitoring and alarms (Week 4).
- Optional: Integrate Cognito for user auth to support user-specific task lists.
