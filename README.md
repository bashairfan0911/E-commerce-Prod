
# EkoMart - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with admin panel, product management, shopping cart, and payment integration using Razorpay.

![alt text](Assets/images/image.png)

---

# EkoMart - E-Commerce Platform Deployment Guide

Deploy a full-stack MERN application on Kubernetes with two flexible deployment options.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Kind/EKS)
- **Infrastructure as Code**: Terraform
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus & Grafana

---

## 🚀 Deployment Options

This project supports two deployment approaches:

### 1️⃣ Local Development - Kind Cluster (test-dev branch)

Want to try the application locally without AWS? Deploy on Kind (Kubernetes in Docker):

**📁 [Kind Cluster Deployment Guide](kubernetes/Kind-cluster/KIND-DEPLOYMENT.md)**

Quick deploy:
```bash
git checkout test-dev
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

Access at: http://localhost:31000

---

### 2️⃣ Production Deployment - AWS EKS with Terraform (EKS-Prod-Dev branch)

For production-ready infrastructure deployment using Terraform and GitOps:

**📁 [EKS Terraform Deployment Guide](EKS-DEPLOYMENT.md)**

Quick deploy:
```bash
git checkout EKS-Prod-Dev
cd terraform
terraform init
terraform apply -auto-approve
aws eks update-kubeconfig --region us-east-1 --name ekomart-eks-cluster
kubectl apply -f kubernetes/
```

**Features:**
- Infrastructure as Code with Terraform
- Auto-scaling EKS cluster
- EBS CSI driver for persistent storage
- GitOps with ArgoCD
- Production-ready architecture
- Monitoring with Prometheus & Grafana

---

## 📚 Branch Structure

- **test-dev**: Local development with Kind cluster
- **EKS-Prod-Dev**: Production deployment with Terraform and ArgoCD

---

## 🧹 Clean Up

### For Kind Cluster:
```bash
kind delete cluster --name ecommerce
```

### For Terraform-based EKS deployment:
```bash
cd terraform
terraform destroy -auto-approve
```

---

## 📝 License

This project is licensed under the MIT License.

---

**Happy Deploying! 🚀**
