# Deployment Scripts

This folder contains helper scripts for deploying and managing the e-commerce application on Kind cluster.

## Deployment Scripts

### `deploy-to-kind.ps1` / `deploy-to-kind.sh`
Automated deployment script that:
- Creates namespace
- Deploys MongoDB, Backend, and Frontend
- Waits for pods to be ready
- Seeds the database with sample data
- Verifies database connection

**Usage:**
```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/deploy-to-kind.sh
```

## Cleanup Scripts

### `cleanup-keep-data.ps1` / `cleanup-keep-data.sh`
Deletes deployments while preserving namespace and data.

**Usage:**
```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/cleanup-keep-data.sh
```

**What it does:**
- Deletes backend, frontend, and MongoDB deployments
- Keeps namespace and PersistentVolumeClaim
- Data is preserved for next deployment

## Data Recovery Scripts

### `recover-data.ps1` / `recover-data.sh`
Recovers data after namespace deletion.

**Usage:**
```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\recover-data.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/recover-data.sh
```

**What it does:**
- Checks if PersistentVolume exists
- Releases bound PV
- Recreates namespace
- Rebinds PVC to existing PV
- Restores all data

### `setup-persistent-storage.ps1` / `setup-persistent-storage.sh`
Creates a PersistentVolume that survives namespace deletion.

**Usage:**
```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\setup-persistent-storage.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/setup-persistent-storage.sh
```

## Utility Scripts

### `create-test-user.sh`
Creates a test user account in the database.

**Usage:**
```bash
./kubernetes/Kind-cluster/scripts/create-test-user.sh
```

**Creates:**
- Email: test@example.com
- Password: test123

## Script Workflow Examples

### Fresh Deployment
```powershell
# 1. Create Kind cluster
kind create cluster --name ecommerce --config kubernetes/Kind-cluster/kind-config.yaml

# 2. Build and load images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce

# 3. Deploy everything
.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1
```

### Cleanup and Redeploy (Keep Data)
```powershell
# 1. Clean up deployments
.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1

# 2. Redeploy
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

### Recover After Namespace Deletion
```powershell
# 1. Recover data
.\kubernetes\Kind-cluster\scripts\recover-data.ps1

# 2. Deploy applications
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

## Notes

- All PowerShell scripts are for Windows
- All `.sh` scripts are for Linux/Mac
- Scripts assume you're running from the project root directory
- Make sure scripts are executable on Linux/Mac: `chmod +x kubernetes/Kind-cluster/scripts/*.sh`
