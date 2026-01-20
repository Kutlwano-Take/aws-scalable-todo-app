# Security and Maintenance Guide

This guide is a short, practical checklist for running this project safely.

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

## What’s already secured in this project

- CloudFront enforces HTTPS.
- The S3 bucket is private and only CloudFront can read it (Origin Access Control).
- API requests require an API key (`x-api-key`).
- Lambda runs with a least-privilege IAM role (DynamoDB + CloudWatch Logs).
- Budget alerts and CloudWatch alarms are enabled for basic ops safety.

## Custom Domain Setup (Optional)

CloudFront URLs work fine for demos. If you want a nicer URL:

- Buy/own a domain
- Request an ACM certificate (CloudFront requires the cert in `us-east-1`)
- Attach the domain + certificate to CloudFront
- Create a Route 53 alias record to the CloudFront distribution

## Cost Monitoring

### Cost alerts

This project uses AWS Budgets for cost alerts (monthly threshold + email notifications).

Good habits:
- Check Cost Explorer monthly
- Keep an eye on CloudFront data transfer and API Gateway requests

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

Currently using local state. For teamwork or a “real” production workflow, move state to S3 and enable state locking.

Recommended production setup:

- S3 bucket for state (versioning + encryption + block public access)
- DynamoDB table for state locking
- Terraform backend configured to use them

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
