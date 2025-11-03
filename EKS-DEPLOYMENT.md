# EkoMart - AWS EKS Deployment with Terraform

A complete Infrastructure as Code (IaC) solution for deploying EkoMart e-commerce platform on AWS EKS using Terraform and Kubernetes manifests.

![EKS Architecture](Assets/DevSecOps+GitOps-.gif)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Cost Estimation](#cost-estimation)
- [Clean Up](#clean-up)

---

## 🎯 Overview

This deployment guide provides a production-ready EKS cluster setup with:
- **Infrastructure**: VPC, Subnets, NAT Gateways, EKS Cluster
- **Compute**: Auto-scaling node groups with t3.medium instances
- **Storage**: EBS CSI driver for persistent volumes
- **Networking**: NodePort services for external access
- **Security**: IAM roles, security groups, OIDC provider

---

## 🏗️ Architecture

### Infrastructure Components
```
├── VPC (10.0.0.0/16)
│   ├── Public Subnets (2 AZs)
│   │   ├── Internet Gateway
│   │   └── NAT Gateways
│   └── Private Subnets (2 AZs)
│       └── EKS Worker Nodes
├── EKS Control Plane (v1.28)
├── EKS Node Group (2-3 t3.medium nodes)
└── EBS CSI Driver
```

### Application Components
```
├── Namespace: ekomart
├── Backend Service
│   ├── Deployment (2 replicas)
│   ├── ClusterIP Service (port 5000)
│   └── PersistentVolumeClaim (5Gi)
└── Frontend Service
    ├── Deployment (2 replicas)
    └── NodePort Service (port 30080)
```

---

## ✅ Prerequisites

### Required Tools
- **AWS CLI** (v2.x)
- **Terraform** (>= 1.0)
- **kubectl** (>= 1.28)
- **Docker** (for building images)
- **Git**

### AWS Requirements
- AWS Account with appropriate permissions
- IAM user with access keys
- EC2 key pair for SSH access (optional)

### Install Required Tools

#### 1. Install AWS CLI
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

#### 2. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

#### 3. Install Terraform
```bash
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform --version
```

#### 4. Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

---

## 🚀 Quick Start

### Step 1: Clone Repository
```bash
git clone https://github.com/bashairfan0911/E-commerce-Prod.git
cd E-commerce-Prod
git checkout EKS-Prod-Dev
```

### Step 2: Configure Variables
Edit `terraform/eks-variables.tf` or create `terraform/terraform.tfvars`:
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

### Step 3: Deploy Infrastructure
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

### Step 4: Configure kubectl
```bash
aws eks update-kubeconfig --region us-east-1 --name ekomart-eks-cluster
kubectl get nodes
```

### Step 5: Build and Push Docker Images

#### Option A: Using Docker Hub
```bash
# Build images
docker build -t <your-dockerhub-username>/ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/api -t <your-dockerhub-username>/ecommerce-frontend:latest ./frontend

# Push images
docker login
docker push <your-dockerhub-username>/ecommerce-backend:latest
docker push <your-dockerhub-username>/ecommerce-frontend:latest
```

#### Option B: Using AWS ECR
```bash
# Create ECR repositories
aws ecr create-repository --repository-name ecommerce-backend --region us-east-1
aws ecr create-repository --repository-name ecommerce-frontend --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/api -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest ./frontend

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
```

### Step 6: Update Kubernetes Manifests
Update image references in deployment files:
```bash
# Edit kubernetes/backend-deployment.yaml
# Edit kubernetes/frontend-deployment.yaml
# Replace 'your-registry' with your actual registry URL
```

### Step 7: Configure Secrets
Edit `kubernetes/secret.yaml` with your actual credentials:
```yaml
stringData:
  DBURI: "mongodb+srv://username:password@cluster.mongodb.net/ekomart"
  JWT_SECRET_KEY: "your-secret-key"
  CLOUD_NAME: "your-cloudinary-name"
  CLOUD_API_KEY: "your-cloudinary-key"
  CLOUD_API_SECRET_KEY: "your-cloudinary-secret"
  KEY_ID: "your-razorpay-key"
  KEY_SECRET: "your-razorpay-secret"
```

### Step 8: Deploy Application
```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Deploy configurations
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml

# Deploy storage
kubectl apply -f kubernetes/pvc.yaml

# Deploy backend
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml

# Deploy frontend
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
```

### Step 9: Verify Deployment
```bash
# Check all resources
kubectl get all -n ekomart

# Check pods status
kubectl get pods -n ekomart

# Check services
kubectl get svc -n ekomart

# View logs
kubectl logs -f deployment/backend -n ekomart
kubectl logs -f deployment/frontend -n ekomart
```

### Step 10: Access Application
```bash
# Get worker node public IP
kubectl get nodes -o wide

# Access frontend
http://<NODE_PUBLIC_IP>:30080
```

---

## 🔧 Terraform Infrastructure

### What Gets Created

#### Networking
- **VPC**: 10.0.0.0/16 CIDR block
- **Public Subnets**: 2 subnets across 2 AZs
- **Private Subnets**: 2 subnets across 2 AZs
- **Internet Gateway**: For public subnet internet access
- **NAT Gateways**: 2 NAT gateways (one per AZ)
- **Route Tables**: Public and private route tables

#### EKS Cluster
- **Control Plane**: Managed Kubernetes v1.28
- **Node Group**: 2 t3.medium instances (auto-scaling 1-3)
- **IAM Roles**: Cluster role, node group role, EBS CSI driver role
- **OIDC Provider**: For service account authentication
- **EBS CSI Driver**: For persistent volume support

### Terraform Commands

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan infrastructure
terraform plan

# Apply infrastructure
terraform apply

# Show current state
terraform show

# List resources
terraform state list

# Destroy infrastructure
terraform destroy
```

### Customize Infrastructure

Edit `terraform/eks-variables.tf`:
```hcl
variable "cluster_name" {
  default = "ekomart-eks-cluster"
}

variable "kubernetes_version" {
  default = "1.28"
}

variable "instance_types" {
  default = ["t3.medium"]  # Change to t3.large for more resources
}

variable "desired_capacity" {
  default = 2  # Increase for more nodes
}
```

---

## ☸️ Kubernetes Deployment

### Manifest Files Overview

| File | Purpose |
|------|---------|
| `namespace.yaml` | Creates ekomart namespace |
| `configmap.yaml` | Non-sensitive backend configuration |
| `secret.yaml` | Sensitive credentials (DB, API keys) |
| `pvc.yaml` | 5Gi persistent storage for uploads |
| `backend-deployment.yaml` | Backend Node.js application |
| `backend-service.yaml` | ClusterIP service for backend |
| `frontend-deployment.yaml` | Frontend React/Nginx application |
| `frontend-service.yaml` | NodePort service for frontend |

### Resource Specifications

#### Backend Pod Resources
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

#### Frontend Pod Resources
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

### Scaling Applications

#### Manual Scaling
```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n ekomart

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n ekomart
```

#### Auto-scaling (HPA)
```bash
# Create HPA for backend
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=5 -n ekomart

# Create HPA for frontend
kubectl autoscale deployment frontend --cpu-percent=70 --min=2 --max=5 -n ekomart

# Check HPA status
kubectl get hpa -n ekomart
```

---

## 🔄 Install and Configure ArgoCD

ArgoCD enables GitOps continuous delivery for Kubernetes applications.

### Step 1: Create ArgoCD Namespace
```bash
kubectl create namespace argocd
```

### Step 2: Apply ArgoCD Manifest
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Step 3: Verify Installation
Monitor pods until all are running:
```bash
watch kubectl get pods -n argocd
```

Or check once:
```bash
kubectl get pods -n argocd
```

### Step 4: Install ArgoCD CLI
```bash
sudo curl --silent --location -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/v2.4.7/argocd-linux-amd64

sudo chmod +x /usr/local/bin/argocd

argocd version
```

### Step 5: Expose ArgoCD Server
Check current services:
```bash
kubectl get svc -n argocd
```

Change ArgoCD server service from ClusterIP to NodePort:
```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

Verify the service is patched:
```bash
kubectl get svc -n argocd
```

### Step 6: Access ArgoCD UI
Get the NodePort assigned to ArgoCD server:
```bash
kubectl get svc argocd-server -n argocd
```

Note the port number (e.g., 30XXX) and access ArgoCD in your browser:
```
https://<worker-node-public-ip>:<nodeport>
```

**Note**: You'll see a security warning. Click "Advanced" and proceed to the site.

### Step 7: Get Initial Admin Password
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### Step 8: Login to ArgoCD
- **Username**: `admin`
- **Password**: Use the password from Step 7

### Step 9: Update Password
After logging in:
1. Click on "User Info" in the top right
2. Select "Update Password"
3. Enter your current password and new password
4. Save changes

### Step 10: Configure ArgoCD Applications
Apply your ArgoCD application manifests:
```bash
# Create ArgoCD project
kubectl apply -f argocd/project.yaml

# Deploy applications
kubectl apply -f argocd/application.yaml
kubectl apply -f argocd/backend-application.yaml
kubectl apply -f argocd/frontend-application.yaml
```

### Verify ArgoCD Applications
```bash
# List applications
argocd app list

# Get application details
argocd app get <app-name>

# Sync application
argocd app sync <app-name>
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend Configuration
```yaml
# ConfigMap (kubernetes/configmap.yaml)
PORT: "5000"
NODE_ENV: "production"

# Secret (kubernetes/secret.yaml)
DBURI: "mongodb+srv://..."
JWT_SECRET_KEY: "..."
CLOUD_NAME: "..."
CLOUD_API_KEY: "..."
CLOUD_API_SECRET_KEY: "..."
KEY_ID: "..."
KEY_SECRET: "..."
```

### Update Configuration
```bash
# Edit ConfigMap
kubectl edit configmap backend-config -n ekomart

# Edit Secret
kubectl edit secret backend-secret -n ekomart

# Restart pods to apply changes
kubectl rollout restart deployment/backend -n ekomart
kubectl rollout restart deployment/frontend -n ekomart
```

### Persistent Storage

The backend uses a PersistentVolumeClaim for file uploads:
```yaml
# kubernetes/pvc.yaml
storage: 5Gi
storageClassName: gp2  # AWS EBS gp2 volume
```

To increase storage:
```bash
# Edit PVC
kubectl edit pvc backend-uploads-pvc -n ekomart

# Verify
kubectl get pvc -n ekomart
```

---

## 📊 Monitoring

### Install Prometheus & Grafana

```bash
# Add Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Verify installation
kubectl get pods -n monitoring
```

### Expose Prometheus & Grafana

```bash
# Expose Prometheus
kubectl patch svc prometheus-kube-prometheus-prometheus -n monitoring -p '{"spec": {"type": "NodePort"}}'

# Expose Grafana
kubectl patch svc prometheus-grafana -n monitoring -p '{"spec": {"type": "NodePort"}}'

# Get services
kubectl get svc -n monitoring
```

### Access Grafana

```bash
# Get Grafana password
kubectl get secret prometheus-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

# Username: admin
# Access: http://<NODE_IP>:<GRAFANA_NODEPORT>
```

### Useful Dashboards
- **Kubernetes Cluster Monitoring**: Dashboard ID 7249
- **Node Exporter Full**: Dashboard ID 1860
- **Kubernetes Pods**: Dashboard ID 6417

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Pods Not Starting
```bash
# Check pod status
kubectl get pods -n ekomart

# Describe pod
kubectl describe pod <pod-name> -n ekomart

# Check logs
kubectl logs <pod-name> -n ekomart

# Check events
kubectl get events -n ekomart --sort-by='.lastTimestamp'
```

#### 2. Image Pull Errors
```bash
# Verify image exists
docker pull <your-image>

# Check image pull secrets (if using private registry)
kubectl get secrets -n ekomart

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<username> \
  --docker-password=<password> \
  -n ekomart
```

#### 3. PVC Not Binding
```bash
# Check PVC status
kubectl get pvc -n ekomart

# Describe PVC
kubectl describe pvc backend-uploads-pvc -n ekomart

# Check storage class
kubectl get storageclass

# Verify EBS CSI driver
kubectl get pods -n kube-system | grep ebs-csi
```

#### 4. Service Not Accessible
```bash
# Check service
kubectl get svc -n ekomart

# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Verify NodePort is open
# Open port 30080 in worker node security group
```

#### 5. Backend Cannot Connect to MongoDB
```bash
# Check secret
kubectl get secret backend-secret -n ekomart -o yaml

# Verify DBURI is correct
kubectl exec -it <backend-pod> -n ekomart -- env | grep DBURI

# Test MongoDB connection
kubectl exec -it <backend-pod> -n ekomart -- sh
# Inside pod: curl -v <mongodb-uri>
```

### Debug Commands

```bash
# Get all resources
kubectl get all -n ekomart

# Check resource usage
kubectl top nodes
kubectl top pods -n ekomart

# Execute commands in pod
kubectl exec -it <pod-name> -n ekomart -- /bin/sh

# Port forward for local testing
kubectl port-forward svc/backend-service 5000:5000 -n ekomart
kubectl port-forward svc/frontend-service 8080:80 -n ekomart

# Check DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup backend-service.ekomart.svc.cluster.local
```

---

## 💰 Cost Estimation

### Monthly AWS Costs (us-east-1)

| Resource | Specification | Monthly Cost |
|----------|--------------|--------------|
| EKS Control Plane | 1 cluster | $73 |
| EC2 Instances | 2x t3.medium | $60 |
| EBS Volumes | 2x 20GB gp2 + 5GB PVC | $5 |
| NAT Gateways | 2x NAT Gateway | $65 |
| Data Transfer | ~100GB | $9 |
| **Total** | | **~$212/month** |

### Cost Optimization Tips

1. **Use Spot Instances**: Save up to 90%
```hcl
# In terraform/eks-cluster.tf
capacity_type = "SPOT"
```

2. **Single NAT Gateway**: Save $32.50/month
```hcl
# In terraform/vpc.tf
# Use count = 1 instead of length(var.availability_zones)
```

3. **Smaller Instances**: Use t3.small for dev/test
```hcl
instance_types = ["t3.small"]
```

4. **Auto-scaling**: Scale down during off-hours
```bash
kubectl scale deployment backend --replicas=1 -n ekomart
kubectl scale deployment frontend --replicas=1 -n ekomart
```

---

## 🧹 Clean Up

### Delete Kubernetes Resources
```bash
# Delete application
kubectl delete -f kubernetes/frontend-service.yaml
kubectl delete -f kubernetes/frontend-deployment.yaml
kubectl delete -f kubernetes/backend-service.yaml
kubectl delete -f kubernetes/backend-deployment.yaml
kubectl delete -f kubernetes/pvc.yaml
kubectl delete -f kubernetes/secret.yaml
kubectl delete -f kubernetes/configmap.yaml
kubectl delete -f kubernetes/namespace.yaml

# Or delete entire namespace
kubectl delete namespace ekomart
```

### Delete Monitoring Stack
```bash
helm uninstall prometheus -n monitoring
kubectl delete namespace monitoring
```

### Destroy Terraform Infrastructure
```bash
cd terraform
terraform destroy -auto-approve
```

### Verify Cleanup
```bash
# Check EKS clusters
aws eks list-clusters --region us-east-1

# Check EC2 instances
aws ec2 describe-instances --region us-east-1 --filters "Name=tag:Name,Values=*ekomart*"

# Check VPCs
aws ec2 describe-vpcs --region us-east-1 --filters "Name=tag:Name,Values=*ekomart*"
```

---

## 📚 Additional Resources

### Documentation
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### Useful Commands Reference

```bash
# Terraform
terraform init              # Initialize Terraform
terraform plan              # Preview changes
terraform apply             # Apply changes
terraform destroy           # Destroy infrastructure
terraform output            # Show outputs

# kubectl
kubectl get pods -A         # List all pods
kubectl get svc -A          # List all services
kubectl get nodes           # List nodes
kubectl describe pod <pod>  # Describe pod
kubectl logs -f <pod>       # Follow logs
kubectl exec -it <pod> sh   # Execute shell in pod

# AWS CLI
aws eks list-clusters                           # List EKS clusters
aws eks describe-cluster --name <cluster>       # Describe cluster
aws eks update-kubeconfig --name <cluster>      # Configure kubectl
aws ecr get-login-password                      # ECR login
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

---

**Happy Deploying! 🚀**
