# EKS Terraform Infrastructure

## Prerequisites
- AWS CLI configured
- Terraform >= 1.0
- kubectl installed

## Quick Start

### 1. Initialize Terraform
```bash
cd terraform
terraform init
```

### 2. Review Variables
Edit `eks-variables.tf` or create `terraform.tfvars`:
```hcl
region             = "us-east-1"
cluster_name       = "ekomart-eks-cluster"
environment        = "production"
availability_zones = ["us-east-1a", "us-east-1b"]
instance_types     = ["t3.medium"]
desired_capacity   = 2
min_capacity       = 1
max_capacity       = 3
```

### 3. Plan Infrastructure
```bash
terraform plan
```

### 4. Apply Infrastructure
```bash
terraform apply
```

### 5. Configure kubectl
```bash
aws eks update-kubeconfig --region us-east-1 --name ekomart-eks-cluster
```

### 6. Verify Cluster
```bash
kubectl get nodes
kubectl get pods -A
```

## What Gets Created
- VPC with public/private subnets across 2 AZs
- Internet Gateway and NAT Gateways
- EKS Cluster (v1.28)
- EKS Node Group (2 t3.medium instances)
- IAM Roles and Policies
- EBS CSI Driver addon
- Security Groups

## Estimated Cost
- EKS Control Plane: ~$73/month
- 2x t3.medium nodes: ~$60/month
- NAT Gateways: ~$65/month
- Total: ~$200/month

## Cleanup
```bash
terraform destroy
```
