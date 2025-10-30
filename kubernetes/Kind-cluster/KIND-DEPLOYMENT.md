# Deploy E-Commerce App to Kind Cluster

This guide walks you through deploying the e-commerce application to a local Kind (Kubernetes in Docker) cluster.

> **💡 Tip**: When viewing this file in a markdown preview, hover over code blocks to see a copy button for easy command copying.

## Prerequisites

- Docker Desktop installed and running
- kubectl installed
- Kind installed

## TL;DR - Quick Deploy

For experienced users, here's the fastest way to deploy:

```bash
# From project root directory
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce
.\kubernetes\Kind-cluster\deploy-to-kind.ps1
```

Then open http://localhost:31000 and press Ctrl+Shift+R

## Quick Start

### Step 1: Create Kind Cluster

```bash
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
```

This creates a cluster with port mappings (31000 for frontend, 31100 for backend).

**Note**: Run all commands from the project root directory.

### Step 2: Build Docker Images

```bash
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
```

**Note**: The frontend is built with `VITE_API_URL=/` so nginx can proxy API requests correctly.

### Step 3: Load Images into Kind

```bash
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce
```

### Step 4: Deploy to Kubernetes

**Create namespace:**
```bash
kubectl create namespace ekomart
kubectl config set-context --current --namespace=ekomart
```

**Deploy services in order:**
```bash
kubectl apply -f kubernetes/Kind-cluster/mongodb-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Or use the automated deployment script:**

**PowerShell (Windows):**
```powershell
.\kubernetes\Kind-cluster\deploy-to-kind.ps1
```

**Bash (Linux/Mac):**
```bash
chmod +x kubernetes/Kind-cluster/deploy-to-kind.sh
./kubernetes/Kind-cluster/deploy-to-kind.sh
```

**Note**: The deployment script automatically handles namespace creation, deployment, database connection verification, and seeding.

### Step 5: Wait for Pods to be Ready

```bash
kubectl get pods -n ekomart -w
```

Wait until all pods show `1/1 Running`.

### Step 6: Seed the Database

Populate the database with sample products and categories:

```bash
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

This will add:
- 6 product categories
- 21 sample products

**Note**: If using the automated deployment script (`deploy-to-kind.ps1`), this step is done automatically.

### Step 7: Access Your Application

- **Frontend**: http://localhost:31000
- **Backend API**: http://localhost:31100

**Important**: After accessing the application for the first time, do a **hard refresh** (Ctrl+Shift+R or Ctrl+F5) to ensure the latest JavaScript is loaded.

## Verify Deployment

Check all pods are running:
```bash
kubectl get pods -n ekomart
```

Expected output:
```
NAME                                   READY   STATUS    RESTARTS   AGE
backend-deployment-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
frontend-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
mongo-deployment-xxxxxxxxxx-xxxxx      1/1     Running   0          2m
```

Check services:
```bash
kubectl get svc -n ekomart
```

View backend logs:
```bash
kubectl logs -l app=backend -n ekomart
```

You should see:
```
✅ Database connected successfully
Server is running on port 5000
```

## Using the Application

1. Open http://localhost:31000 in your browser
2. **Do a hard refresh** (Ctrl+Shift+R or Ctrl+F5) to clear cached JavaScript
3. Click "Sign Up" to create a new account
4. Login with your credentials
5. Browse products and add items to cart
6. Proceed to checkout

**Note**: If you see errors like "ERR_CONNECTION_REFUSED" or requests going to `localhost:5000`, you need to clear your browser cache with a hard refresh.

## Troubleshooting

### Frontend trying to connect to localhost:5000?
This means the browser has cached old JavaScript. Solutions:
1. **Hard refresh**: Press Ctrl+Shift+R or Ctrl+F5
2. **Clear browser cache**: Open DevTools (F12) → Network tab → Check "Disable cache"
3. **Rebuild frontend** if hard refresh doesn't work:
```bash
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest --name ecommerce
kubectl rollout restart deployment/frontend-deployment -n ekomart
```

### Products not loading?
Seed the database:
```bash
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

### Backend can't connect to MongoDB?
Wait for MongoDB to be ready, then restart the backend:
```bash
kubectl rollout restart deployment/backend-deployment -n ekomart
# Wait 10 seconds, then check logs
kubectl logs -l app=backend -n ekomart
```

### Frontend showing 404 errors on /api/ endpoints?
Rebuild frontend with correct API URL:
```bash
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest --name ecommerce
kubectl rollout restart deployment/frontend-deployment -n ekomart
```

### Check pod details:
```bash
kubectl describe pod <pod-name> -n ekomart
```

### Check events:
```bash
kubectl get events -n ekomart --sort-by='.lastTimestamp'
```

### View all resources:
```bash
kubectl get all -n ekomart
```

## Updating the Application

After making code changes:

**Backend:**
```bash
docker build -t ecommerce-backend:latest ./backend
kind load docker-image ecommerce-backend:latest --name ecommerce
kubectl rollout restart deployment/backend-deployment -n ekomart
```

**Frontend:**
```bash
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest --name ecommerce
kubectl rollout restart deployment/frontend-deployment -n ekomart
```

## Clean Up

Delete the entire cluster (this removes all data):
```bash
kind delete cluster --name ecommerce
```

Or just delete the namespace (keeps the cluster):
```bash
kubectl delete namespace ekomart
```

## Architecture Notes

### Networking
- Frontend runs on port 80 inside the container, exposed via NodePort 31000
- Backend runs on port 5000 inside the container, exposed via NodePort 31100
- MongoDB runs on port 27017 (ClusterIP, internal only)
- Nginx in frontend proxies `/api/` requests to `backend-service:5000/api/`

### Storage
- MongoDB uses `emptyDir` for storage (data is lost when pod restarts)
- For persistent storage, configure hostPath volumes in Kind cluster

### Images
- Kind uses `imagePullPolicy: Never` to use locally loaded images
- No need to push images to DockerHub for local development

### Environment Variables
Backend deployment includes:
- `DBURI`: MongoDB connection string
- `JWT_SECRET_KEY`: For authentication
- `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET_KEY`: Cloudinary config
- `KEY_ID`, `KEY_SECRET`: Razorpay payment gateway (optional)

## Common Issues

**Issue**: `ERR_CONNECTION_REFUSED` or requests going to `localhost:5000`
**Solution**: 
1. Do a hard refresh (Ctrl+Shift+R) to clear browser cache
2. Verify frontend was built with `VITE_API_URL=/`
3. Check all pods are running: `kubectl get pods -n ekomart`

**Issue**: Double `/api/api` in URLs
**Solution**: Frontend must be built with `VITE_API_URL=/` (not `/api/` or `/api`)

**Issue**: 400 Bad Request on login
**Solution**: Create an account first using the Sign Up form

**Issue**: MongoDB connection refused
**Solution**: Wait for MongoDB pod to be ready, then restart backend deployment:
```bash
kubectl get pods -n ekomart  # Check if mongo pod is Running
kubectl rollout restart deployment/backend-deployment -n ekomart
```

**Issue**: Pods disappeared or not running
**Solution**: Reapply the manifests:
```bash
kubectl apply -f kubernetes/Kind-cluster/mongodb-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Issue**: Changes not reflecting in browser
**Solution**: Always do a hard refresh (Ctrl+Shift+R) after updating deployments
