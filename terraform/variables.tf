variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "ekomart-k8s-server"
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "ekomart-key"
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 30
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH (your IP)"
  type        = string
  default     = "0.0.0.0/0" # Change this to your IP for security
}

variable "allowed_management_cidr" {
  description = "CIDR block allowed to access management ports"
  type        = string
  default     = "0.0.0.0/0" # Change this to your IP for security
}

variable "create_elastic_ip" {
  description = "Create and associate Elastic IP"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable detailed monitoring"
  type        = bool
  default     = true
}

variable "ami_id" {
  description = "AMI ID to use for EC2 instance (leave empty to use latest Ubuntu 22.04)"
  type        = string
  default     = ""
}

variable "ami_owner" {
  description = "AMI owner ID (099720109477 for Canonical/Ubuntu, 137112412989 for Amazon)"
  type        = string
  default     = "099720109477"
}

variable "ami_name_filter" {
  description = "AMI name filter pattern"
  type        = string
  default     = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
}
