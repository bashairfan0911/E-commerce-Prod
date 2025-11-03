# EKS Kubernetes Manifests

## Prerequisites
- EKS cluster running
- kubectl configured
- Docker images pushed to registry

## Deployment Steps

### 1. Update Secret Values
Edit `secret.yaml` with your actual credentials:
```bash
kubectl apply -f secret.yaml
```

### 2. Apply Manifests in Order
```bash
# Create namespace
kubectl apply -f namespace.yaml

# Create ConfigMap and Secret
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Create PVC
kubectl apply -f pvc.yaml

# Deploy Backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Deploy Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

### 3. Get NodePort
```bash
kubectl get svc -n ekomart
```

### 4. Access Application
Frontend: `http://<NODE_IP>:30080`

## Update Image Registry
Replace `your-registry` in deployment files with your actual registry:
- AWS ECR: `<account-id>.dkr.ecr.<region>.amazonaws.com/ecommerce-backend:latest`
- Docker Hub: `<username>/ecommerce-backend:latest`

## Verify Deployment
```bash
kubectl get all -n ekomart
kubectl logs -f deployment/backend -n ekomart
kubectl logs -f deployment/frontend -n ekomart
```
