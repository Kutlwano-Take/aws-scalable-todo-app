output "s3_bucket_name" {
  description = "Name of the created S3 bucket"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_website_url" {
  description = "Website endpoint URL"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.cdn.id
}

output "api_key" {
  description = "API Gateway API Key (sensitive - keep secure)"
  value       = aws_api_gateway_api_key.todo_api_key.value
  sensitive   = true
}
