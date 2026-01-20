# Application Description

A simple serverless To-Do List app deployed on AWS.

It’s built to demonstrate Month 3 outcomes (scalable architecture, IaC, monitoring, CI/CD, and security best practices) while staying Free Tier friendly.

## What you can do

- Create tasks
- Mark tasks complete/incomplete
- Filter tasks (All / Active / Completed)
- Delete tasks
- Refresh the page and see tasks still there (stored in DynamoDB)

## Tech at a glance

- Frontend: React + TypeScript + Vite (S3 + CloudFront)
- Backend: API Gateway + Lambda (Node.js)
- Database: DynamoDB (PAY_PER_REQUEST)
- IaC: Terraform

## Where to find the “real” docs

This file is intentionally short to avoid duplication.

- Main overview + links: `README.md`
- Deployment steps: `DEPLOYMENT_GUIDE.md`
- Security/maintenance notes: `SECURITY_AND_MAINTENANCE.md`
