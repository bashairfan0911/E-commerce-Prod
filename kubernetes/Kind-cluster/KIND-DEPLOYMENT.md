# Deploy E-Commerce App to Kind Cluster

This guide walks you through deploying the e-commerce application to a local Kind (Kubernetes in Docker) cluster.

> **💡 Tip**: When viewing this file in a markdown preview, hover over code blocks to see a copy button for easy command copying.

## Prerequisites

- Docker Desktop installed and running
- kubectl installed
- Kind installed

## Helper Scripts

All deployment and management scripts are located in the `scripts/` folder:
- **Deployment**: Automated deployment with database seeding
- **Cleanup**: Remove deployments while keeping data
- **Recovery**: Restore data after namespace deletion
- **Utilities**: Test user creation, storage setup

📁 See [scripts/README.md](scripts/README.md) for detailed documentation on all available scripts.

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy-to-kind.ps1` | Automated full deployment | `.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1` |
| `cleanup-keep-data.ps1` | Delete deployments, keep data | `.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1` |
| `recover-data.ps1` | Restore data after namespace deletion | `.\kubernetes\Kind-cluster\scripts\recover-data.ps1` |
| `setup-persistent-storage.ps1` | Create persistent volume | `.\kubernetes\Kind-cluster\scripts\setup-persistent-storage.ps1` |

## TL;DR - Quick Deploy

For experienced users, here's the fastest way to deploy:

```bash
# From project root directory
kind create cluster --config kubernetes/Kind-cluster/kind-config.yaml

# Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

# Build and load images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/api -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest
kind load docker-image ecommerce-frontend:latest

# Deploy with MongoDB Atlas (Cloud - Recommended)
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

# OR deploy with local MongoDB + persistent storage
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

# Wait for pods and seed database (if using local MongoDB)
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

Then open **http://localhost** (via Ingress) or http://localhost:31000 (NodePort)

> 💡 **Tip**: Use the automated script instead: `.\kubernetes\Kind-cluster\scripts\deploy.cmd`

## Quick Start

### Step 1: Create Kind Cluster

```bash
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
```

This creates a cluster with port mappings (31000 for frontend, 31100 for backend).

**Note**: Run all commands from the project root directory.

### Step 2: Install Nginx Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s
```

This enables Ingress support for routing traffic to your services.

### Step 3: Build Docker Images

```bash
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/api -t ecommerce-frontend:latest ./frontend
```

**Note**: The frontend is built with `VITE_API_URL=/api` so it can communicate with the backend through the Ingress.

### Step 4: Load Images into Kind

```bash
kind load docker-image ecommerce-backend:latest
kind load docker-image ecommerce-frontend:latest
```

### Step 5: Deploy to Kubernetes

**Create namespace:**
```bash
kubectl create namespace ekomart
kubectl config set-context --current --namespace=ekomart
```

**Deploy services in order:**

**Option A: With MongoDB Atlas (Cloud - Recommended)**
```bash
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml
```

**Option B: With Local MongoDB + Persistent Storage**
```bash
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml
```

**Note**: 
- Option A: Data persists in cloud (MongoDB Atlas), survives everything (cluster deletion, namespace deletion). Backend is configured to use Atlas by default.
- Option B: Data persists locally, survives pod restarts but not cluster deletion

**Or use the automated deployment script:**

**Windows:**
```cmd
kubernetes\Kind-cluster\scripts\deploy.cmd
```

**Note**: The deployment script automatically handles cluster creation, ingress setup, image building, and deployment.

> 📁 **All helper scripts are in** `kubernetes/Kind-cluster/scripts/` - See [scripts/README.md](scripts/README.md) for details.

### Step 6: Wait for Pods to be Ready

```bash
kubectl get pods -n ekomart -w
```

Wait until all pods show `1/1 Running`.

### Step 7: Seed the Database

Populate the database with sample products and categories:

```bash
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

This will add:
- 6 product categories
- 21 sample products

**Note**: If using the automated deployment script (`deploy.cmd`), this step is done automatically.

### Step 8: Access Your Application

**Recommended (via Ingress):**
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api

**Alternative (via NodePort):**
- **Frontend**: http://localhost:31000
- **Backend API**: http://localhost:31100

**Important**: The Ingress setup at http://localhost is the recommended way to access the application as it properly routes API calls from the frontend to the backend.

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

Check ingress:
```bash
kubectl get ingress -n ekomart
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

1. Open **http://localhost** in your browser (or http://localhost:31000 for NodePort)
2. Click "Sign Up" to create a new account
3. Login with your credentials
4. Browse products and add items to cart
5. Proceed to checkout

**Important Notes**:
- Use http://localhost (Ingress) for the best experience
- **User accounts are lost on pod restart** unless you use persistent storage (see below)
- Products are seeded automatically but you need to create your account each time

## Persistent Storage

**Recommended Setup**: The deployment uses persistent storage that survives namespace deletion.

### What is Persistent Storage?

- **With Persistent Storage** (`mongodb-persistent.yaml`): User accounts, products, and orders survive pod restarts
- **Without Persistent Storage** (`mongodb-kind.yaml`): All data is lost when MongoDB pod restarts

### Switching Between Storage Types

**To use persistent storage (recommended):**
```bash
kubectl delete deployment mongo-deployment -n ekomart
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl rollout restart deployment/backend-deployment -n ekomart
```

**To use temporary storage:**
```bash
kubectl delete deployment mongo-deployment -n ekomart
kubectl delete pvc mongo-pvc -n ekomart
kubectl delete pv mongo-pv
kubectl apply -f kubernetes/Kind-cluster/mongodb-kind.yaml
kubectl rollout restart deployment/backend-deployment -n ekomart
```

### Verify Persistent Storage

```bash
# Check PersistentVolumeClaim
kubectl get pvc -n ekomart

# Should show:
# NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES
# mongo-pvc   Bound    mongo-pv   1Gi        RWO
```

**Note**: Data persists across pod restarts but is lost if you delete the entire Kind cluster with `kind delete cluster`

## Troubleshooting

### Frontend can't connect to backend?
Make sure you're using the Ingress URL (http://localhost) instead of NodePort. If issues persist:
```bash
# Check ingress is running
kubectl get ingress -n ekomart

# Verify ingress controller is ready
kubectl get pods -n ingress-nginx

# Rebuild frontend if needed
docker build --build-arg VITE_API_URL=/api -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest
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
Check that the Ingress is properly configured:
```bash
kubectl describe ingress ekomart-ingress -n ekomart

# If ingress is missing, apply it
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

# Rebuild frontend with correct API URL if needed
docker build --build-arg VITE_API_URL=/api -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest
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
kind load docker-image ecommerce-backend:latest
kubectl rollout restart deployment/backend-deployment -n ekomart
```

**Frontend:**
```bash
docker build --build-arg VITE_API_URL=/api -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-frontend:latest
kubectl rollout restart deployment/frontend-deployment -n ekomart
```

## Clean Up

### Option 1: Delete Only Deployments (Keeps Data)
```bash
kubectl delete deployment backend-deployment frontend-deployment mongo-deployment -n ekomart
```
This keeps the namespace and PersistentVolume, so your data is preserved.

### Option 2: Delete Namespace (May Lose Data)
```bash
kubectl delete namespace ekomart
```
**Warning**: This deletes the PVC. If using dynamic provisioning, data is lost. With static PV (manual storageClass), data is retained.

### Option 3: Delete Entire Cluster (Loses All Data)
```bash
kind delete cluster --name ecommerce
```
This removes everything including the Kind node where data is stored.

### To Preserve Data Across Namespace Deletion

The PersistentVolume is configured with `Retain` policy, but you need to:

1. **Before deleting namespace**, note the PV name:
   ```bash
   kubectl get pv
   ```

2. **Delete namespace**:
   ```bash
   kubectl delete namespace ekomart
   ```

3. **Recreate namespace and PVC**:
   ```bash
   kubectl create namespace ekomart
   # Edit the PV to remove claimRef, then apply PVC
   kubectl patch pv mongo-pv -p '{"spec":{"claimRef": null}}'
   kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
   ```

**Recommended**: Don't delete the namespace if you want to keep data. Just delete individual deployments.

**Quick cleanup script** (preserves data):
```powershell
.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1
```

## Data Recovery After Namespace Deletion

If you accidentally deleted the namespace, you can recover your data:

### Step 1: Check if PersistentVolume still exists
```bash
kubectl get pv ekomart-mongo-pv
```

If it shows `STATUS: Released` or `Available`, your data is still there!

### Step 2: Recover the data
```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\recover-data.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/recover-data.sh
```

### Step 3: Redeploy applications
```bash
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

Your user accounts and all data will be restored!

### How It Works

- **PersistentVolume** is cluster-scoped (not in namespace) with `Retain` policy
- When namespace is deleted, PVC is deleted but PV remains with status `Released`
- Data stays in Kind node at `/mnt/data/ekomart-mongo`
- Recovery script rebinds the PV to a new PVC in the recreated namespace
- All your MongoDB data (users, products, orders) is preserved

## Architecture Notes

### Networking
- **Ingress** (Recommended): Routes traffic at http://localhost
  - `/` → Frontend service (port 80)
  - `/api` → Backend service (port 5000)
- **NodePort** (Alternative):
  - Frontend: http://localhost:31000
  - Backend: http://localhost:31100
- MongoDB runs on port 27017 (ClusterIP, internal only)
- Frontend nginx config proxies `/api/` to `backend-service.ekomart.svc.cluster.local:5000/`

### Storage
- **Recommended**: Use `mongodb-persistent.yaml` for persistent storage (keeps data across pod restarts)
- **Alternative**: Use `mongodb-kind.yaml` for temporary storage (data lost on pod restart)
- Persistent data is stored in Kind node at `/data/mongo`
- Data survives pod restarts but not cluster deletion (`kind delete cluster`)

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

**Issue**: `ERR_CONNECTION_REFUSED` or API calls failing
**Solution**: 
1. Use http://localhost (Ingress) instead of http://localhost:31000 (NodePort)
2. Verify ingress is running: `kubectl get ingress -n ekomart`
3. Check ingress controller: `kubectl get pods -n ingress-nginx`
4. Verify frontend was built with `VITE_API_URL=/api`

**Issue**: Double `/api/api` in URLs
**Solution**: Frontend must be built with `VITE_API_URL=/api` and nginx should proxy to `backend-service:5000/` (not `/api/`)

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
**Solution**: Clear browser cache or open in incognito mode after updating deployments

**Issue**: Username/password wrong after redeploying
**Solution**: If using temporary storage (`mongodb-kind.yaml`), data is lost on restart. Solutions:
1. **Use persistent storage**: Deploy with `mongodb-persistent.yaml` (recommended)
2. **Recreate your account**: Sign up again after each deployment
3. **Check storage type**: Run `kubectl get pvc -n ekomart` to verify persistent storage is active
