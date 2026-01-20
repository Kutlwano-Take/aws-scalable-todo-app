variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "todo-app"
}

variable "alert_email" {
  description = "Email address to receive CloudWatch alarm and budget notifications"
  type        = string
  default     = "kutlwano.take@capaciti.org.za"
}

variable "monthly_budget_limit_usd" {
  description = "Monthly AWS budget limit in USD"
  type        = string
  default     = "5.00"
}
