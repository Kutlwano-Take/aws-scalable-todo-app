# Deployment Guide

This guide provides step-by-step instructions for deploying the To-Do List application to AWS infrastructure.

**Last Updated:** January 14, 2026  
**Status:** Production Ready  
**Design:** Custom CSS Glassmorphism with iOS-style interactions

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Terraform installed (version 1.5+)
- Node.js and npm installed
- Git installed

## Initial Setup

### 1. Configure AWS Credentials

Create an IAM user with AdministratorAccess (or appropriate permissions) and configure AWS CLI:

```bash
aws configure --profile your-profile-name
```

Enter your Access Key ID, Secret Access Key, default region (e.g., `eu-north-1`), and output format (`json`).

### 2. Clone Repository

```bash
git clone https://github.com/Kutlwano-Take/aws-scalable-todo-app.git
cd aws-scalable-todo-app
```

## Deployment Steps

### Backend Deployment (Lambda + API Gateway + DynamoDB)

1. Navigate to infrastructure directory:
   ```bash
   cd infra
   ```

2. Install Lambda dependencies:
   ```bash
   cd lambda
   npm install
   cd ..
   ```

3. Create Lambda deployment package:
   ```bash
   # Windows PowerShell
   Remove-Item -Force lambda.zip -ErrorAction SilentlyContinue
   Compress-Archive -Path .\lambda\* -DestinationPath lambda.zip
   
   # Linux/Mac
   zip -r lambda.zip lambda/*
   ```

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Review deployment plan:
   ```bash
   terraform plan
   ```

6. Deploy infrastructure:
   ```bash
   terraform apply
   ```

   Type `yes` when prompted, or use `-auto-approve` flag.

7. Get deployment outputs:
   ```bash
   terraform output
   ```

   Save these values:
   - `api_gateway_url` - Your API endpoint
   - `api_key` - API key for authentication (sensitive)
   - `cloudfront_domain` - Your CloudFront URL
   - `s3_bucket_name` - S3 bucket name
   - `cloudfront_distribution_id` - CloudFront distribution ID

### Frontend Deployment (React + S3 + CloudFront)

1. Navigate to app directory:
   ```bash
   cd ../app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create .env file
   echo "VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod" > .env
   echo "VITE_API_KEY=your-api-key-here" >> .env
   ```

   Replace `your-api-id` and `your-api-key-here` with values from Terraform outputs.

4. Build production bundle:
   ```bash
   npm run build
   ```

   This creates a `dist/` directory with optimized production files.

5. Upload to S3:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/ --delete --profile your-profile-name
   ```

   Replace `your-bucket-name` with the S3 bucket name from Terraform outputs.

6. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id your-distribution-id --paths "/*" --profile your-profile-name
   ```

   Replace `your-distribution-id` with the CloudFront distribution ID from Terraform outputs.

## Post-Deployment

### Verify Deployment

1. Wait 5-15 minutes for CloudFront distribution to fully deploy
2. Open your CloudFront URL in a browser
3. Test creating, updating, and deleting tasks
4. Verify tasks persist after page refresh

### Environment Variables

The frontend requires two environment variables:

- `VITE_API_URL`: Your API Gateway endpoint URL
- `VITE_API_KEY`: Your API Gateway API key (for authentication)

These are set in the `.env` file and embedded into the build at compile time.

## Security Configuration

### API Key Authentication

The API Gateway is protected with API key authentication. All requests must include the API key in the `x-api-key` header. The frontend automatically includes this header in all API requests.

### S3 Bucket Security

- S3 bucket is private (no public access)
- Access restricted to CloudFront via Origin Access Control (OAC)
- HTTPS enforced through CloudFront

### IAM Permissions

Lambda function uses IAM role with least privilege:
- CloudWatch Logs access for logging
- DynamoDB access limited to the tasks table only

## Monitoring

### CloudWatch Alarms

The deployment includes CloudWatch alarms for:
- Lambda errors (alerts when errors exceed 5 in 5 minutes)
- Lambda duration (alerts when average duration exceeds 5 seconds)

### Viewing Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/todo-app-todo-api --follow --profile your-profile-name

# View API Gateway logs (if enabled)
aws apigateway get-rest-apis --profile your-profile-name
```

## Troubleshooting

### CloudFront URL Not Working

- Wait 5-15 minutes after deployment for CloudFront to propagate
- Check CloudFront distribution status in AWS Console
- Verify S3 bucket has files uploaded
- Try accessing in incognito/private window

### API Requests Failing

- Verify API key is correctly set in `.env` file
- Check API Gateway deployment status
- Review Lambda function logs in CloudWatch
- Verify DynamoDB table exists and is accessible

### Build Errors

- Ensure Node.js version is 18+ and npm is up to date
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check that all environment variables are set correctly

## Updating the Application

### Update Backend

1. Make changes to `infra/lambda/index.js`
2. Recreate Lambda package: `Compress-Archive -Path .\lambda\* -DestinationPath lambda.zip`
3. Run `terraform apply` to update Lambda function

### Update Frontend

1. Make changes to React components
2. Rebuild: `npm run build`
3. Upload to S3: `aws s3 sync dist/ s3://your-bucket/ --delete`
4. Invalidate CloudFront cache

## Cost Management

This application is designed to stay within AWS Free Tier for typical usage. Monitor costs in AWS Billing Console:

- Set up billing alerts for unexpected charges
- Review CloudWatch metrics regularly
- Consider enabling AWS Budgets for cost tracking

See [SECURITY_AND_MAINTENANCE.md](./SECURITY_AND_MAINTENANCE.md) for detailed cost monitoring setup and billing alert configuration.

## Cleanup

To remove all resources and stop incurring costs:

```bash
cd infra
terraform destroy
```

Type `yes` when prompted. This will delete all AWS resources created by Terraform.

## Post-Deployment Improvements

After successful deployment, consider these enhancements:

- **Custom Domain**: Add a custom domain using Route 53 and ACM (see [SECURITY_AND_MAINTENANCE.md](./SECURITY_AND_MAINTENANCE.md))
- **IAM Security**: Restrict deployment user permissions (see [SECURITY_AND_MAINTENANCE.md](./SECURITY_AND_MAINTENANCE.md))
- **Remote State**: Set up Terraform state in S3 with versioning (see [SECURITY_AND_MAINTENANCE.md](./SECURITY_AND_MAINTENANCE.md))
- **Cost Monitoring**: Set up billing alerts and regular cost reviews

## Additional Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Security and Maintenance Guide](./SECURITY_AND_MAINTENANCE.md)