# Security and Maintenance Guide

This guide covers security best practices and maintenance tasks for the To-Do List application.

## IAM Security

### Restricting Deployment User Permissions

The deployment user (`todo-app-deployer`) should not have AdministratorAccess in production. Instead, use a restricted policy that only allows the services Terraform actually uses.

#### Step 1: Create Restricted Policy

1. Go to IAM Console → Policies → Create Policy
2. Choose JSON tab
3. Copy the contents of `infra/iam-deployment-policy.json`
4. Name it: `TodoAppTerraformDeployment`
5. Create the policy

#### Step 2: Update IAM User

1. Go to IAM Console → Users → `todo-app-deployer`
2. Remove `AdministratorAccess` policy
3. Attach the new `TodoAppTerraformDeployment` policy
4. Test deployment with `terraform plan` to verify permissions

#### Policy Permissions

The restricted policy allows:
- S3 bucket and object management (for frontend hosting)
- CloudFront distribution management
- DynamoDB table management
- Lambda function management
- API Gateway management
- IAM role and policy management (for Lambda execution roles)
- CloudWatch logs and alarms
- Terraform state bucket access (if using remote state)

The policy does NOT allow:
- Creating new IAM users
- Modifying other IAM policies
- Accessing resources outside the todo-app namespace
- Billing or account management

## Custom Domain Setup (Optional)

CloudFront URLs are long and hard to remember. You can add a custom domain using Route 53 and ACM.

### Prerequisites

- A domain name registered (can use Route 53 or external registrar)
- Access to DNS settings for your domain

### Steps

1. **Request SSL Certificate in ACM**
   ```bash
   # Request certificate in us-east-1 (required for CloudFront)
   aws acm request-certificate \
     --domain-name todo.yourdomain.com \
     --validation-method DNS \
     --region us-east-1 \
     --profile your-profile
   ```

2. **Validate Certificate**
   - Go to ACM Console → Certificates
   - Copy the CNAME records provided
   - Add them to your domain's DNS settings
   - Wait for validation (usually 5-30 minutes)

3. **Update CloudFront Distribution**
   - Go to CloudFront Console → Your Distribution
   - Edit → Alternate Domain Names (CNAMEs)
   - Add: `todo.yourdomain.com`
   - SSL Certificate: Select your ACM certificate
   - Save changes

4. **Update Route 53 Record**
   - Go to Route 53 → Hosted Zones → Your Domain
   - Create A record (Alias)
   - Name: `todo`
   - Alias: Yes → CloudFront distribution
   - Select your CloudFront distribution
   - Save

5. **Wait for Propagation**
   - DNS changes can take up to 48 hours (usually much faster)
   - Test with: `curl -I https://todo.yourdomain.com`

### Terraform Configuration (Optional)

You can automate this with Terraform by adding:

```hcl
# ACM Certificate
resource "aws_acm_certificate" "todo_domain" {
  domain_name       = "todo.yourdomain.com"
  validation_method = "DNS"
  provider          = aws.us_east_1  # CloudFront requires us-east-1
}

# CloudFront with custom domain
resource "aws_cloudfront_distribution" "cdn" {
  # ... existing configuration ...
  
  aliases = ["todo.yourdomain.com"]
  
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.todo_domain.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
```

## Cost Monitoring

### Setting Up Billing Alerts

1. **Enable Billing Alerts**
   - Go to AWS Billing Console → Preferences
   - Enable "Receive Billing Alerts"

2. **Create CloudWatch Billing Alarm**
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name todo-app-monthly-billing \
     --alarm-description "Alert when monthly costs exceed $5" \
     --metric-name EstimatedCharges \
     --namespace AWS/Billing \
     --statistic Maximum \
     --period 86400 \
     --evaluation-periods 1 \
     --threshold 5 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=Currency,Value=USD \
     --profile your-profile
   ```

3. **Set Up SNS Topic for Alerts**
   - Create SNS topic in AWS Console
   - Subscribe your email to the topic
   - Update the alarm to send to SNS topic

### Regular Cost Review

- Check AWS Cost Explorer monthly
- Review CloudWatch metrics for unusual spikes
- Monitor DynamoDB read/write capacity usage
- Check CloudFront data transfer costs
- Review Lambda invocation counts

### Expected Costs

For typical usage (100-1000 daily users):
- Free Tier: $0/month
- Beyond Free Tier: $2-5/month

## Terraform State Management

### Setting Up Remote State with Versioning

Currently using local state. For production, use S3 backend with versioning.

#### Step 1: Create State Bucket

```bash
# Create bucket for Terraform state
aws s3api create-bucket \
  --bucket todo-app-terraform-state-701742813629 \
  --region eu-north-1 \
  --create-bucket-configuration LocationConstraint=eu-north-1 \
  --profile new-account

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket todo-app-terraform-state-701742813629 \
  --versioning-configuration Status=Enabled \
  --profile new-account

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket todo-app-terraform-state-701742813629 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' \
  --profile new-account

# Block public access
aws s3api put-public-access-block \
  --bucket todo-app-terraform-state-701742813629 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile new-account
```

#### Step 2: Create DynamoDB Table for Locking

```bash
aws dynamodb create-table \
  --table-name todo-app-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-north-1 \
  --profile new-account
```

#### Step 3: Update Terraform Configuration

Add to `infra/providers.tf`:

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "todo-app-terraform-state-701742813629"
    key            = "todo-app/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "todo-app-terraform-locks"
    encrypt        = true
    profile        = "new-account"
  }
}
```

#### Step 4: Migrate State

```bash
cd infra
terraform init -migrate-state
```

This will migrate your local state to S3.

### State Backup Benefits

- Version history of infrastructure changes
- Team collaboration (multiple developers)
- State locking prevents concurrent modifications
- Encrypted storage
- Disaster recovery

## Regular Maintenance Tasks

### Weekly

- Check CloudWatch alarms for errors
- Review Lambda function logs
- Verify API Gateway metrics

### Monthly

- Review AWS billing and costs
- Check for unused resources
- Review IAM access logs
- Update dependencies (npm packages, Terraform providers)

### Quarterly

- Review and rotate API keys if needed
- Audit IAM permissions
- Review security best practices
- Update documentation

## Security Checklist

- [ ] IAM user has restricted permissions (not AdministratorAccess)
- [ ] API keys are stored in environment variables (not hardcoded)
- [ ] S3 buckets are private with OAC
- [ ] CloudFront enforces HTTPS
- [ ] Terraform state is encrypted (if using remote state)
- [ ] Billing alerts are configured
- [ ] CloudWatch alarms are active
- [ ] No hardcoded credentials in code
- [ ] .env files are in .gitignore
- [ ] Regular security reviews scheduled

## Additional Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)
- [Terraform State Management](https://www.terraform.io/docs/language/state/index.html)
- [AWS Cost Management](https://aws.amazon.com/aws-cost-management/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
