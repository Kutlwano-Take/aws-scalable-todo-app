# Deploy To-Do App to New AWS Account
# This script deploys the app to your new AWS account (701742813629)

Write-Host "🚀 Deploying To-Do App to New AWS Account" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify AWS credentials
Write-Host "🔐 Step 1: Verifying AWS Credentials..." -ForegroundColor Yellow
$awsIdentity = aws sts get-caller-identity --profile new-account 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS credentials not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please configure AWS credentials first:" -ForegroundColor Yellow
    Write-Host "   aws configure --profile new-account" -ForegroundColor White
    exit 1
}

$accountInfo = $awsIdentity | ConvertFrom-Json
Write-Host "   ✅ Connected to AWS Account: $($accountInfo.Account)" -ForegroundColor Green
Write-Host "   User: $($accountInfo.Arn)" -ForegroundColor Gray
Write-Host ""

# Step 2: Navigate to infra directory
Write-Host "📁 Step 2: Preparing Terraform..." -ForegroundColor Yellow
Set-Location "C:\Users\kutlw\To-Do-List-App\infra"

# Backup and remove old state files (from old account)
if (Test-Path "terraform.tfstate") {
    Write-Host "   Backing up old state file..." -ForegroundColor Gray
    $backupName = "terraform.tfstate.backup.old-account-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item "terraform.tfstate" $backupName -ErrorAction SilentlyContinue
    Remove-Item "terraform.tfstate" -ErrorAction SilentlyContinue
    Remove-Item "terraform.tfstate.backup" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Old state backed up to: $backupName" -ForegroundColor Gray
}

# Step 3: Initialize Terraform
Write-Host ""
Write-Host "📦 Step 3: Initializing Terraform..." -ForegroundColor Yellow
$env:AWS_PROFILE = "new-account"
terraform init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform init failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Prepare Lambda deployment package
Write-Host ""
Write-Host "📦 Step 4: Preparing Lambda Function..." -ForegroundColor Yellow
Set-Location "lambda"
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing Lambda dependencies..." -ForegroundColor Gray
    npm install
}
Set-Location ".."

Write-Host "   Creating Lambda deployment package..." -ForegroundColor Gray
Remove-Item -Force "lambda.zip" -ErrorAction SilentlyContinue
Compress-Archive -Path ".\lambda\*" -DestinationPath "lambda.zip" -Force

if (-not (Test-Path "lambda.zip")) {
    Write-Host "❌ Failed to create lambda.zip!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Lambda package created" -ForegroundColor Gray

# Step 5: Deploy infrastructure
Write-Host ""
Write-Host "🏗️  Step 5: Deploying Infrastructure (this may take 10-15 minutes)..." -ForegroundColor Yellow
Write-Host "   This will create:" -ForegroundColor Gray
Write-Host "   - S3 Bucket for frontend" -ForegroundColor Gray
Write-Host "   - CloudFront Distribution" -ForegroundColor Gray
Write-Host "   - DynamoDB Table" -ForegroundColor Gray
Write-Host "   - Lambda Function" -ForegroundColor Gray
Write-Host "   - API Gateway" -ForegroundColor Gray
Write-Host ""

terraform apply -auto-approve

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform deployment failed!" -ForegroundColor Red
    Write-Host "   Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}

# Step 6: Get deployment outputs
Write-Host ""
Write-Host "📊 Step 6: Getting Deployment Information..." -ForegroundColor Yellow
$bucketName = terraform output -raw s3_bucket_name
$distributionId = terraform output -raw cloudfront_distribution_id
$cloudfrontUrl = terraform output -raw cloudfront_domain
$apiUrl = terraform output -raw api_gateway_url

Write-Host "   S3 Bucket: $bucketName" -ForegroundColor Gray
Write-Host "   CloudFront ID: $distributionId" -ForegroundColor Gray
Write-Host "   CloudFront URL: $cloudfrontUrl" -ForegroundColor Gray
Write-Host "   API URL: $apiUrl" -ForegroundColor Gray
Write-Host ""

# Step 7: Build frontend
Write-Host "🏗️  Step 7: Building Frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\kutlw\To-Do-List-App\app"

# Extract base API URL (remove /todos suffix)
$apiBaseUrl = $apiUrl -replace '/todos$', ''
Write-Host "   Setting API URL: $apiBaseUrl" -ForegroundColor Gray
$env:VITE_API_URL = $apiBaseUrl

# Update .env file
if (Test-Path ".env") {
    (Get-Content ".env") -replace 'VITE_API_URL=.*', "VITE_API_URL=$apiBaseUrl" | Set-Content ".env"
} else {
    "VITE_API_URL=$apiBaseUrl" | Out-File -FilePath ".env" -Encoding utf8
}

# Build
Write-Host "   Running npm run build..." -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "dist")) {
    Write-Host "❌ Build output directory 'dist' not found!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Frontend built successfully" -ForegroundColor Gray

# Step 8: Upload to S3
Write-Host ""
Write-Host "☁️  Step 8: Uploading Frontend to S3..." -ForegroundColor Yellow
Write-Host "   Syncing dist/ to s3://$bucketName/" -ForegroundColor Gray
aws s3 sync dist/ "s3://$bucketName/" --delete --profile new-account

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ S3 upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Files uploaded to S3" -ForegroundColor Gray

# Step 9: Invalidate CloudFront cache
Write-Host ""
Write-Host "🔄 Step 9: Invalidating CloudFront Cache..." -ForegroundColor Yellow
Write-Host "   Distribution ID: $distributionId" -ForegroundColor Gray
$invalidation = aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*" --profile new-account 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Cache invalidation started" -ForegroundColor Gray
    Write-Host "   ⏳ Cache will clear in 5-10 minutes" -ForegroundColor Yellow
} else {
    Write-Host "   ⚠️  Cache invalidation failed (non-critical)" -ForegroundColor Yellow
    Write-Host "   You can manually invalidate later if needed" -ForegroundColor Gray
}

# Final Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Your app is available at:" -ForegroundColor Cyan
Write-Host "   $cloudfrontUrl" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "📡 API Endpoint:" -ForegroundColor Cyan
Write-Host "   $apiUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Important Notes:" -ForegroundColor Yellow
Write-Host "   • CloudFront distribution takes 5-15 minutes to fully deploy" -ForegroundColor Gray
Write-Host "   • If the URL does not work immediately, wait a few minutes" -ForegroundColor Gray
Write-Host "   • Cache invalidation may take 5-10 minutes" -ForegroundColor Gray
Write-Host "   • Try the URL in an incognito/private window if you see old content" -ForegroundColor Gray
Write-Host ""
Write-Host "💾 Save these URLs for future reference!" -ForegroundColor Cyan
Write-Host ""
