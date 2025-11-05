# Kubernetes Production Deployment

Production-ready Kubernetes manifests for EkoMart E-Commerce platform.

## 📋 Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- NGINX Ingress Controller installed
- cert-manager installed (for SSL/TLS)
- Docker images pushed to Docker Hub

## 🚀 Quick Start

### 1. Create Namespace
```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets
```bash
kubectl create secret generic backend-secrets \
  --from-literal=mongodb-uri='your-mongodb-uri' \
  --from-literal=jwt-secret='your-jwt-secret' \
  --from-literal=cloudinary-name='your-cloudinary-name' \
  --from-literal=cloudinary-key='your-cloudinary-key' \
  --from-literal=cloudinary-secret='your-cloudinary-secret' \
  --from-literal=razorpay-key-id='your-razorpay-key-id' \
  --from-literal=razorpay-key-secret='your-razorpay-key-secret' \
  -n ekomart
```

### 3. Update Image Names
Edit `backend-deployment.yaml` and `frontend-deployment.yaml`:
```yaml
image: YOUR-DOCKER-USERNAME/ekomart-backend:test-dev
image: YOUR-DOCKER-USERNAME/ekomart-frontend:test-dev
```

### 4. Deploy Application
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml
```

### 5. Verify Deployment
```bash
kubectl get all -n ekomart
kubectl get ingress -n ekomart
```

## 📁 Files Overview

### Core Manifests
- `namespace.yaml` - Namespace definition
- `backend-deployment.yaml` - Backend deployment and service
- `frontend-deployment.yaml` - Frontend deployment and service
- `ingress.yaml` - Ingress configuration
- `secrets-template.yaml` - Secrets template (DO NOT commit actual secrets!)

### Configuration
- `kustomization.yaml` - Kustomize configuration
- `README.md` - This file

## 🔧 Configuration

### Backend Deployment
- **Replicas**: 2
- **Resources**:
  - Requests: 256Mi memory, 250m CPU
  - Limits: 512Mi memory, 500m CPU
- **Health Checks**: Liveness and readiness probes on `/health`
- **Strategy**: RollingUpdate with zero downtime

### Frontend Deployment
- **Replicas**: 2
- **Resources**:
  - Requests: 128Mi memory, 100m CPU
  - Limits: 256Mi memory, 200m CPU
- **Health Checks**: Liveness and readiness probes on `/`
- **Strategy**: RollingUpdate with zero downtime

### Ingress
- **Controller**: NGINX
- **TLS**: Enabled with cert-manager
- **Hosts**:
  - `ekomart.example.com` → Frontend
  - `api.ekomart.example.com` → Backend

## 🔐 Secrets Management

### Required Secrets
```yaml
backend-secrets:
  - mongodb-uri: MongoDB connection string
  - jwt-secret: JWT secret key
  - cloudinary-name: Cloudinary cloud name
  - cloudinary-key: Cloudinary API key
  - cloudinary-secret: Cloudinary API secret
  - razorpay-key-id: Razorpay key ID
  - razorpay-key-secret: Razorpay key secret
```

### Create from File
```bash
kubectl create secret generic backend-secrets \
  --from-env-file=.env.production \
  -n ekomart
```

### Using Sealed Secrets (Recommended)
```bash
# Install sealed-secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Create sealed secret
kubeseal --format=yaml < secrets.yaml > sealed-secrets.yaml
kubectl apply -f sealed-secrets.yaml
```

## 🌐 Ingress Setup

### Install NGINX Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### Install cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### Create ClusterIssuer
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

### Update DNS
Point your domains to the ingress controller's external IP:
```bash
kubectl get svc -n ingress-nginx
```

## 📊 Monitoring

### Check Deployment Status
```bash
kubectl get deployments -n ekomart
kubectl rollout status deployment/backend-deployment -n ekomart
kubectl rollout status deployment/frontend-deployment -n ekomart
```

### View Pods
```bash
kubectl get pods -n ekomart
kubectl describe pod <pod-name> -n ekomart
```

### View Logs
```bash
# Backend logs
kubectl logs -f deployment/backend-deployment -n ekomart

# Frontend logs
kubectl logs -f deployment/frontend-deployment -n ekomart

# All logs
kubectl logs -f -l app=backend -n ekomart
kubectl logs -f -l app=frontend -n ekomart
```

### Check Services
```bash
kubectl get svc -n ekomart
kubectl describe svc backend-service -n ekomart
kubectl describe svc frontend-service -n ekomart
```

### Check Ingress
```bash
kubectl get ingress -n ekomart
kubectl describe ingress ekomart-ingress -n ekomart
```

## 🔄 Updates and Rollbacks

### Update Deployment
```bash
# Update image
kubectl set image deployment/backend-deployment \
  backend=your-username/ekomart-backend:new-tag \
  -n ekomart

# Or apply updated manifest
kubectl apply -f backend-deployment.yaml
```

### Rollback Deployment
```bash
# View rollout history
kubectl rollout history deployment/backend-deployment -n ekomart

# Rollback to previous version
kubectl rollout undo deployment/backend-deployment -n ekomart

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment --to-revision=2 -n ekomart
```

### Scale Deployment
```bash
# Scale up
kubectl scale deployment/backend-deployment --replicas=3 -n ekomart

# Scale down
kubectl scale deployment/backend-deployment --replicas=1 -n ekomart
```

## 🐛 Troubleshooting

### Pods Not Starting
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

### Service Not Accessible
```bash
# Check service
kubectl get svc -n ekomart
kubectl describe svc backend-service -n ekomart

# Test service internally
kubectl run -it --rm debug --image=busybox --restart=Never -n ekomart -- sh
wget -O- http://backend-service:5000/health
```

### Ingress Not Working
```bash
# Check ingress
kubectl get ingress -n ekomart
kubectl describe ingress ekomart-ingress -n ekomart

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Check certificate
kubectl get certificate -n ekomart
kubectl describe certificate ekomart-tls -n ekomart
```

### Database Connection Issues
```bash
# Check secrets
kubectl get secrets -n ekomart
kubectl describe secret backend-secrets -n ekomart

# Test connection from pod
kubectl exec -it <backend-pod> -n ekomart -- sh
env | grep DBURI
```

## 🔒 Security Best Practices

### 1. Use Secrets for Sensitive Data
- Never commit secrets to Git
- Use Kubernetes secrets or sealed-secrets
- Rotate secrets regularly

### 2. Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: ekomart
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 5000
```

### 3. Resource Limits
- Always set resource requests and limits
- Prevents resource exhaustion
- Enables proper scheduling

### 4. Security Context
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000
  capabilities:
    drop:
      - ALL
```

## 📈 Scaling

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: ekomart
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## 🔗 CI/CD Integration

### GitHub Actions
The deployment is automated via GitHub Actions. See `.github/workflows/ci-cd.yml`.

### Required Secrets
Add these secrets to your GitHub repository:
- `KUBE_CONFIG` - Kubernetes config file (base64 encoded)
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT secret
- `CLOUD_NAME` - Cloudinary name
- `CLOUD_API_KEY` - Cloudinary API key
- `CLOUD_API_SECRET_KEY` - Cloudinary API secret
- `KEY_ID` - Razorpay key ID
- `KEY_SECRET` - Razorpay key secret

### Manual Deployment
```bash
# Deploy via kubectl
kubectl apply -k kubernetes/production/

# Or using kustomize
kustomize build kubernetes/production/ | kubectl apply -f -
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)

## 🆘 Support

For issues or questions:
1. Check pod logs: `kubectl logs -f <pod-name> -n ekomart`
2. Check events: `kubectl get events -n ekomart`
3. Review deployment status: `kubectl describe deployment <name> -n ekomart`
4. Check GitHub Actions logs for CI/CD issues

---

**Environment**: Production  
**Namespace**: ekomart  
**Replicas**: 2 (backend), 2 (frontend)  
**Strategy**: RollingUpdate with zero downtime
