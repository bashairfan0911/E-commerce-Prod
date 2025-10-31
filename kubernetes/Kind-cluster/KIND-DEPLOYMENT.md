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
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce

# Deploy with MongoDB Atlas (Cloud - Recommended)
kubectl create namespace ekomart
kubectl config set-context --current --namespace=ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# OR deploy with local MongoDB + persistent storage
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# Wait for pods and seed database (if using local MongoDB)
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

Then open http://localhost:31000 and press Ctrl+Shift+R

> 💡 **Tip**: Use the automated script instead: `.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1`

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

**Option A: With MongoDB Atlas (Cloud - Recommended)**
```bash
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Option B: With Local MongoDB + Persistent Storage**
```bash
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Option C: With Local MongoDB (Temporary)**
```bash
kubectl apply -f kubernetes/Kind-cluster/mongodb-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Note**: 
- Option A: Data persists in cloud, survives everything (cluster deletion, namespace deletion)
- Option B: Data persists locally, survives pod restarts
- Option C: Data lost on pod restart

**Or use the automated deployment script:**

**PowerShell (Windows):**
```powershell
.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1
```

**Bash (Linux/Mac):**
```bash
chmod +x kubernetes/Kind-cluster/scripts/deploy-to-kind.sh
./kubernetes/Kind-cluster/scripts/deploy-to-kind.sh
```

**Note**: The deployment script automatically handles namespace creation, deployment, database connection verification, and seeding.

> 📁 **All helper scripts are in** `kubernetes/Kind-cluster/scripts/` - See [scripts/README.md](scripts/README.md) for details.

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

**Important Notes**:
- If you see errors like "ERR_CONNECTION_REFUSED" or requests going to `localhost:5000`, do a hard refresh
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
- Frontend runs on port 80 inside the container, exposed via NodePort 31000
- Backend runs on port 5000 inside the container, exposed via NodePort 31100
- MongoDB runs on port 27017 (ClusterIP, internal only)
- Nginx in frontend proxies `/api/` requests to `backend-service:5000/api/`

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

**Issue**: Username/password wrong after redeploying
**Solution**: If using temporary storage (`mongodb-kind.yaml`), data is lost on restart. Solutions:
1. **Use persistent storage**: Deploy with `mongodb-persistent.yaml` (recommended)
2. **Recreate your account**: Sign up again after each deployment
3. **Check storage type**: Run `kubectl get pvc -n ekomart` to verify persistent storage is active
