
# EkoMart - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with admin panel, product management, shopping cart, and payment integration using Razorpay.

![alt text](Assets/images/image.png)

---

# EkoMart - E-Commerce Platform Deployment Guide

Deploy a full-stack MERN application on Kubernetes using Kind cluster.

![alt text](Assets/DevSecOps+GitOps-.gif)

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Kind)
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus & Grafana

---

## 🚀 Deployment Options

Choose your deployment method:

### Option 1: Local Development (Kind Cluster)
Perfect for testing and development on your local machine.

### Option 2: Cloud Deployment (AWS EC2 with Terraform)
Production-ready deployment on AWS EC2 instance.

---

## 📋 Step-by-Step Deployment Guide

### Option 1: Local Development with Kind Cluster

#### Prerequisites
- Docker installed
- Kind installed
- kubectl installed
- Git installed

#### Step 1: Clone Repository
```bash
git clone https://github.com/bashairfan0911/E-commerce-Prod.git
cd E-commerce-Prod
git checkout test-dev
```

#### Step 2: Create Kind Cluster
```bash
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
```

#### Step 3: Verify Cluster
```bash
kubectl cluster-info
kubectl get nodes
```

#### Step 4: Build Docker Images
```bash
# Build backend
docker build -t ecommerce-backend:latest ./backend

# Build frontend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
```

#### Step 5: Load Images into Kind
```bash
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce
```

#### Step 6: Create Namespace
```bash
kubectl create namespace ekomart
```

#### Step 7: Deploy Application
```bash
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

#### Step 8: Verify Deployment
```bash
kubectl get pods -n ekomart
kubectl get svc -n ekomart
```

#### Step 9: Access Application
- **Frontend**: http://localhost:31000
- **Backend API**: http://localhost:31100

#### Step 10: Install ArgoCD (Optional)
```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods
kubectl wait --for=condition=ready pod --all -n argocd --timeout=300s

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

Access ArgoCD at: https://localhost:8080 (Username: admin)

#### Step 11: Install Monitoring (Optional)
```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace
kubectl create namespace monitoring

# Install Prometheus & Grafana
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Port forward Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Get Grafana password
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d; echo
```

Access Grafana at: http://localhost:3000 (Username: admin)

**📁 [Detailed Kind Cluster Guide](kubernetes/Kind-cluster/KIND-DEPLOYMENT.md)**

---

### Option 2: AWS EC2 Deployment with Terraform

#### Prerequisites
- AWS Account
- AWS CLI configured
- Terraform installed (>= 1.0)
- SSH key pair

#### Step 1: Clone Repository
```bash
git clone https://github.com/bashairfan0911/E-commerce-Prod.git
cd E-commerce-Prod
git checkout test-dev
```

#### Step 2: Create SSH Key Pair in AWS
```bash
# Create key pair
aws ec2 create-key-pair \
  --key-name ekomart-key \
  --query 'KeyMaterial' \
  --output text > ekomart-key.pem

# Set permissions
chmod 400 ekomart-key.pem
```

#### Step 3: Configure Terraform Variables
```bash
cd terraform

# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

**Important**: Update these values in `terraform.tfvars`:
```hcl
key_name                = "ekomart-key"
allowed_ssh_cidr        = "YOUR_IP/32"  # Your public IP
allowed_management_cidr = "YOUR_IP/32"  # Your public IP
```

#### Step 4: Initialize Terraform
```bash
terraform init
```

#### Step 5: Review Infrastructure Plan
```bash
terraform plan
```

#### Step 6: Deploy Infrastructure
```bash
terraform apply
```

Type `yes` when prompted. This will create:
- EC2 instance (Ubuntu 22.04)
- Security group with required ports
- Elastic IP
- Auto-install Docker, Kind, kubectl, Helm, ArgoCD CLI

#### Step 7: Get Instance Details
```bash
# Get all outputs
terraform output

# Get public IP
terraform output instance_public_ip

# Get SSH command
terraform output ssh_command
```

#### Step 8: Connect to EC2 Instance
```bash
ssh -i ekomart-key.pem ubuntu@<PUBLIC_IP>
```

#### Step 9: Create Kind Cluster on EC2
```bash
# Run the setup script
cd ~/ekomart
./setup-cluster.sh

# Verify cluster
kubectl get nodes
```

#### Step 10: Clone Repository on EC2
```bash
git clone https://github.com/bashairfan0911/E-commerce-Prod.git
cd E-commerce-Prod
git checkout test-dev
```

#### Step 11: Build and Deploy Application
```bash
# Build images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend

# Load into Kind
kind load docker-image ecommerce-backend:latest --name ekomart
kind load docker-image ecommerce-frontend:latest --name ekomart

# Deploy
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# Verify
kubectl get pods -n ekomart
```

#### Step 12: Access Application
Get your public IP from Terraform output and access:
- **Frontend**: http://\<PUBLIC_IP\>:31000
- **Backend API**: http://\<PUBLIC_IP\>:31100

#### Step 13: Install ArgoCD (Optional)
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=ready pod --all -n argocd --timeout=300s

# Patch service to NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get NodePort
kubectl get svc argocd-server -n argocd

# Get password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

Access ArgoCD at: http://\<PUBLIC_IP\>:\<NODEPORT\>

#### Step 14: Install Monitoring (Optional)
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

kubectl create namespace monitoring
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Patch services to NodePort
kubectl patch svc prometheus-grafana -n monitoring -p '{"spec": {"type": "NodePort"}}'
kubectl patch svc prometheus-kube-prometheus-prometheus -n monitoring -p '{"spec": {"type": "NodePort"}}'

# Get NodePorts
kubectl get svc -n monitoring

# Get Grafana password
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d; echo
```

Access:
- **Grafana**: http://\<PUBLIC_IP\>:\<GRAFANA_NODEPORT\>
- **Prometheus**: http://\<PUBLIC_IP\>:\<PROMETHEUS_NODEPORT\>

**📁 [Detailed Terraform Guide](terraform/README.md)**

---

## 🔐 Required Ports for EC2 Deployment

If deploying on EC2 instance, configure your security group with these ports:

### Application Ports
| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| **31000** | Frontend | TCP | Frontend application access (NodePort) |
| **31100** | Backend API | TCP | Backend API access (NodePort) |
| **80** | HTTP | TCP | Ingress HTTP traffic (optional) |
| **443** | HTTPS | TCP | Ingress HTTPS traffic (optional) |

### Management & Monitoring Ports
| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| **22** | SSH | TCP | Remote access to EC2 instance |
| **8080** | ArgoCD UI | TCP | ArgoCD web interface |
| **9090** | Prometheus | TCP | Prometheus web UI |
| **3000** | Grafana | TCP | Grafana dashboards |
| **9093** | Alertmanager | TCP | Alertmanager UI (optional) |

### Minimal Security Group Configuration

```bash
# Application access (public)
Port 31000 - Source: 0.0.0.0/0 (Frontend)
Port 31100 - Source: 0.0.0.0/0 (Backend API)

# Management access (restrict to your IP)
Port 22 - Source: YOUR_IP/32 (SSH)
Port 8080 - Source: YOUR_IP/32 (ArgoCD)
Port 9090 - Source: YOUR_IP/32 (Prometheus)
Port 3000 - Source: YOUR_IP/32 (Grafana)
```

### Security Recommendations
- ✅ Restrict management ports (22, 8080, 9090, 3000) to your IP only
- ✅ Use Ingress with SSL/TLS for production (ports 80/443)
- ✅ Enable firewall rules with least privilege
- ✅ Use VPN for management access in production

---

## 🧹 Clean Up

```bash
# Delete Kind cluster
kind delete cluster --name ecommerce

# Remove Docker images
docker rmi ecommerce-backend:latest ecommerce-frontend:latest
```

---

## 📝 License

This project is licensed under the MIT License.

---

**Happy Deploying! 🚀**
