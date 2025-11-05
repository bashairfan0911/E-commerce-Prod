# Fix API Routing Issue

## Problem
Frontend can't reach backend API - getting 404 errors on `/api/login`, `/api/signup`

## Root Cause
- Frontend is built with `VITE_API_URL=/` 
- Frontend tries to call `/api/*` on port 31000
- Backend is on port 31100
- Ingress is not installed/configured

## Solution 1: Install Nginx Ingress (Recommended)

### Step 1: Install Nginx Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

### Step 2: Wait for Ingress to be Ready
```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### Step 3: Apply Ingress Configuration
```bash
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml
```

### Step 4: Verify Ingress
```bash
kubectl get ingress -n ekomart
```

### Step 5: Access Application
- **With Ingress**: http://localhost (port 80)
- Frontend will call `/api/*` which routes to backend

## Solution 2: Rebuild Frontend with Backend URL

### Step 1: Rebuild Frontend with Backend URL
```bash
# For local Kind cluster
docker build --build-arg VITE_API_URL=http://localhost:31100 -t ecommerce-frontend:latest ./frontend

# For EC2 deployment
docker build --build-arg VITE_API_URL=http://<PUBLIC_IP>:31100 -t ecommerce-frontend:latest ./frontend
```

### Step 2: Reload Image into Kind
```bash
kind load docker-image ecommerce-frontend:latest --name ekomart
```

### Step 3: Restart Frontend Pods
```bash
kubectl rollout restart deployment frontend-deployment -n ekomart
```

### Step 4: Verify
```bash
kubectl get pods -n ekomart
```

### Step 5: Access Application
- **Frontend**: http://localhost:31000 (or http://<PUBLIC_IP>:31000)
- Frontend will call backend at http://localhost:31100

## Solution 3: Use Port Forwarding (Development Only)

### Forward both services to standard ports
```bash
# Terminal 1 - Frontend
kubectl port-forward -n ekomart svc/frontend-service 80:80

# Terminal 2 - Backend  
kubectl port-forward -n ekomart svc/backend-service 5000:5000
```

Then rebuild frontend:
```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest --name ekomart
kubectl rollout restart deployment frontend-deployment -n ekomart
```

Access at: http://localhost

## Recommended Approach

### For Local Development (Kind):
Use **Solution 1** (Nginx Ingress) - Access via http://localhost

### For EC2 Deployment:
Use **Solution 2** (Rebuild with backend URL) - Access via http://<PUBLIC_IP>:31000

## Quick Fix Commands

### For Kind Cluster (Local):
```bash
# Install Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Apply ingress config
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

# Access at http://localhost
```

### For EC2 Deployment:
```bash
# Get your public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

# Rebuild frontend
docker build --build-arg VITE_API_URL=http://${PUBLIC_IP}:31100 -t ecommerce-frontend:latest ./frontend

# Load into Kind
kind load docker-image ecommerce-frontend:latest --name ekomart

# Restart frontend
kubectl rollout restart deployment frontend-deployment -n ekomart

# Access at http://<PUBLIC_IP>:31000
```

## Verify Backend is Working

```bash
# Check backend pods
kubectl get pods -n ekomart

# Check backend logs
kubectl logs -f deployment/backend-deployment -n ekomart

# Test backend directly
curl http://localhost:31100/api/health
# or for EC2
curl http://<PUBLIC_IP>:31100/api/health
```

## Common Issues

### Issue 1: Ingress Not Working
```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress resource
kubectl describe ingress ekomart-ingress -n ekomart
```

### Issue 2: Backend Not Responding
```bash
# Check backend service
kubectl get svc backend-service -n ekomart

# Check backend endpoints
kubectl get endpoints backend-service -n ekomart

# Test backend pod directly
kubectl exec -it deployment/backend-deployment -n ekomart -- curl localhost:5000/api/health
```

### Issue 3: CORS Errors
If you see CORS errors, the backend needs to allow the frontend origin.

Check backend CORS configuration in `backend/index.js` or similar.
