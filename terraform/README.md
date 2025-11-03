# Terraform EC2 Deployment for EkoMart

This Terraform configuration deploys an EC2 instance with all necessary tools for running EkoMart on Kubernetes (Kind cluster).

## What Gets Created

- **EC2 Instance**: Ubuntu 22.04 LTS (t3.medium by default)
- **Security Group**: With all required ports configured
- **Elastic IP**: Static public IP (optional)
- **Pre-installed Tools**:
  - Docker
  - Kind (Kubernetes in Docker)
  - kubectl
  - Helm
  - ArgoCD CLI

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** installed (>= 1.0)
4. **SSH Key Pair** created in AWS

### Create SSH Key Pair

```bash
# Create key pair in AWS
aws ec2 create-key-pair \
  --key-name ekomart-key \
  --query 'KeyMaterial' \
  --output text > ekomart-key.pem

# Set permissions
chmod 400 ekomart-key.pem
```

## Quick Start

### 1. Configure Variables

```bash
# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**Important**: Change these values:
- `key_name`: Your SSH key pair name
- `allowed_ssh_cidr`: Your IP address (e.g., "1.2.3.4/32")
- `allowed_management_cidr`: Your IP address for management ports

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review Plan

```bash
terraform plan
```

### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted.

### 5. Get Outputs

```bash
terraform output
```

You'll see:
- Instance ID
- Public IP
- SSH command
- Application URLs

## Access the Instance

```bash
# SSH into the instance
ssh -i ekomart-key.pem ubuntu@<PUBLIC_IP>

# Or use the output command
terraform output -raw ssh_command | bash
```

## Deploy EkoMart Application

Once connected to the instance:

```bash
# 1. Create Kind cluster
cd ~/ekomart
./setup-cluster.sh

# 2. Clone repository
git clone https://github.com/bashairfan0911/E-commerce-Prod.git
cd E-commerce-Prod
git checkout test-dev

# 3. Build Docker images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend

# 4. Load images into Kind
kind load docker-image ecommerce-backend:latest --name ekomart
kind load docker-image ecommerce-frontend:latest --name ekomart

# 5. Deploy application
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# 6. Verify deployment
kubectl get pods -n ekomart
```

## Access Applications

After deployment, access your applications:

```bash
# Get URLs from Terraform
terraform output frontend_url
terraform output backend_url
terraform output argocd_url
terraform output prometheus_url
terraform output grafana_url
```

Or manually:
- **Frontend**: http://\<PUBLIC_IP\>:31000
- **Backend**: http://\<PUBLIC_IP\>:31100
- **ArgoCD**: http://\<PUBLIC_IP\>:8080
- **Prometheus**: http://\<PUBLIC_IP\>:9090
- **Grafana**: http://\<PUBLIC_IP\>:3000

## Security Group Ports

The following ports are automatically configured:

### Public Access
- **31000**: Frontend application
- **31100**: Backend API
- **80**: HTTP (Ingress)
- **443**: HTTPS (Ingress)

### Restricted Access (Your IP only)
- **22**: SSH
- **8080**: ArgoCD UI
- **9090**: Prometheus
- **3000**: Grafana
- **9093**: Alertmanager
- **6443**: Kubernetes API

## Configuration Options

### Instance Types

| Type | vCPU | RAM | Use Case |
|------|------|-----|----------|
| t3.small | 2 | 2 GB | Testing |
| t3.medium | 2 | 4 GB | Development (default) |
| t3.large | 2 | 8 GB | Production |
| t3.xlarge | 4 | 16 GB | High load |

### Modify Instance Type

Edit `terraform.tfvars`:
```hcl
instance_type = "t3.large"
```

Then apply:
```bash
terraform apply
```

## Cost Estimation

### Monthly Costs (us-east-1)

| Resource | Specification | Monthly Cost |
|----------|--------------|--------------|
| EC2 t3.medium | 2 vCPU, 4 GB RAM | ~$30 |
| EBS gp3 | 30 GB | ~$2.40 |
| Elastic IP | 1 IP | ~$3.60 |
| Data Transfer | ~100 GB | ~$9 |
| **Total** | | **~$45/month** |

### Cost Optimization

1. **Stop instance when not in use**:
   ```bash
   aws ec2 stop-instances --instance-ids $(terraform output -raw instance_id)
   ```

2. **Use smaller instance**:
   ```hcl
   instance_type = "t3.small"  # ~$15/month
   ```

3. **Disable Elastic IP** if not needed:
   ```hcl
   create_elastic_ip = false
   ```

## Useful Commands

### Terraform Commands

```bash
# Show current state
terraform show

# List resources
terraform state list

# Get specific output
terraform output instance_public_ip

# Refresh state
terraform refresh

# Destroy infrastructure
terraform destroy
```

### AWS CLI Commands

```bash
# Check instance status
aws ec2 describe-instances \
  --instance-ids $(terraform output -raw instance_id) \
  --query 'Reservations[0].Instances[0].State.Name'

# Stop instance
aws ec2 stop-instances \
  --instance-ids $(terraform output -raw instance_id)

# Start instance
aws ec2 start-instances \
  --instance-ids $(terraform output -raw instance_id)

# Get public IP
aws ec2 describe-instances \
  --instance-ids $(terraform output -raw instance_id) \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
```

### SSH Commands

```bash
# SSH with key
ssh -i ekomart-key.pem ubuntu@<PUBLIC_IP>

# Copy files to instance
scp -i ekomart-key.pem file.txt ubuntu@<PUBLIC_IP>:~/

# Copy files from instance
scp -i ekomart-key.pem ubuntu@<PUBLIC_IP>:~/file.txt ./
```

## Troubleshooting

### Cannot SSH to Instance

1. Check security group allows your IP:
   ```bash
   terraform output security_group_id
   ```

2. Verify instance is running:
   ```bash
   aws ec2 describe-instances --instance-ids $(terraform output -raw instance_id)
   ```

3. Check SSH key permissions:
   ```bash
   chmod 400 ekomart-key.pem
   ```

### User Data Script Failed

Check logs on the instance:
```bash
ssh -i ekomart-key.pem ubuntu@<PUBLIC_IP>
cat /var/log/user-data.log
sudo cat /var/log/cloud-init-output.log
```

### Ports Not Accessible

1. Verify security group rules:
   ```bash
   aws ec2 describe-security-groups \
     --group-ids $(terraform output -raw security_group_id)
   ```

2. Check if services are running:
   ```bash
   kubectl get svc -A
   ```

### Kind Cluster Issues

```bash
# Check Kind cluster
kind get clusters

# Delete and recreate
kind delete cluster --name ekomart
cd ~/ekomart && ./setup-cluster.sh
```

## Backup and Recovery

### Backup Configuration

```bash
# Backup Terraform state
cp terraform.tfstate terraform.tfstate.backup

# Backup Kubernetes configs
kubectl get all -A -o yaml > k8s-backup.yaml
```

### Create AMI from Instance

```bash
aws ec2 create-image \
  --instance-id $(terraform output -raw instance_id) \
  --name "ekomart-backup-$(date +%Y%m%d)" \
  --description "EkoMart instance backup"
```

## Clean Up

### Destroy All Resources

```bash
# Review what will be destroyed
terraform plan -destroy

# Destroy infrastructure
terraform destroy
```

Type `yes` when prompted.

### Verify Cleanup

```bash
# Check if resources are deleted
aws ec2 describe-instances \
  --filters "Name=tag:Project,Values=EkoMart" \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name]'
```

## Security Best Practices

1. ✅ **Restrict SSH access** to your IP only
2. ✅ **Use strong SSH keys** (4096-bit RSA)
3. ✅ **Enable IMDSv2** (already configured)
4. ✅ **Encrypt EBS volumes** (already enabled)
5. ✅ **Regular updates**: `sudo apt update && sudo apt upgrade`
6. ✅ **Use IAM roles** instead of access keys
7. ✅ **Enable CloudWatch monitoring**
8. ✅ **Regular backups** of important data

## Additional Resources

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Kind Documentation](https://kind.sigs.k8s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Check instance system logs
4. Create an issue in the repository
