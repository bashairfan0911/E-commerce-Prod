# Kind Cluster Deployment

This folder contains everything needed to deploy the e-commerce application on a local Kind (Kubernetes in Docker) cluster.

## 📁 Folder Structure

```
Kind-cluster/
├── scripts/              # Helper scripts for deployment and management
│   ├── deploy-to-kind.ps1/sh
│   ├── cleanup-keep-data.ps1/sh
│   ├── recover-data.ps1/sh
│   └── README.md
├── backend-atlas.yaml    # Backend with MongoDB Atlas (cloud)
├── backend-kind.yaml     # Backend with local MongoDB
├── frontend-kind.yaml    # Frontend deployment
├── mongodb-kind.yaml     # Local MongoDB (temporary storage)
├── mongodb-persistent.yaml # Local MongoDB (persistent storage)
├── kind-config.yaml      # Kind cluster configuration
└── KIND-DEPLOYMENT.md    # Complete deployment guide

```

## 🚀 Quick Start

### Option 1: Using MongoDB Atlas (Recommended)

```bash
# 1. Create cluster
kind create cluster --name ecommerce --config kind-config.yaml

# 2. Build and load images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce

# 3. Deploy
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
```

**Benefits**: Data persists in cloud, survives everything

### Option 2: Using Local MongoDB with Persistent Storage

```bash
# Same steps 1-2 as above, then:

# 3. Deploy
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# 4. Seed database
kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js
```

**Benefits**: Data persists locally, no internet required

### Option 3: Automated Deployment

```powershell
# Windows
.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1

# Linux/Mac
./kubernetes/Kind-cluster/scripts/deploy-to-kind.sh
```

## 📖 Documentation

- **[KIND-DEPLOYMENT.md](KIND-DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[scripts/README.md](scripts/README.md)** - Documentation for all helper scripts

## 🔑 Key Files

### Deployment Manifests

- **backend-atlas.yaml** - Backend configured for MongoDB Atlas (cloud database)
- **backend-kind.yaml** - Backend configured for local MongoDB
- **frontend-kind.yaml** - Frontend with nginx proxy
- **mongodb-kind.yaml** - Local MongoDB with temporary storage (data lost on restart)
- **mongodb-persistent.yaml** - Local MongoDB with persistent storage (data survives restarts)

### Configuration

- **kind-config.yaml** - Kind cluster configuration with port mappings (31000, 31100)

### Scripts

All scripts are in the `scripts/` folder:
- Deployment automation
- Data management
- Recovery tools

## 🌐 Access Points

After deployment:
- **Frontend**: http://localhost:31000
- **Backend API**: http://localhost:31100

## 🧹 Cleanup

```bash
# Delete cluster (removes everything)
kind delete cluster --name ecommerce

# Delete deployments only (keep data)
.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1
```

## 💡 Tips

1. **Use MongoDB Atlas** for production-like experience with persistent data
2. **Use automated scripts** for faster deployment
3. **Always do hard refresh** (Ctrl+Shift+R) after deployment
4. **Check logs** if something doesn't work: `kubectl logs -l app=backend -n ekomart`

## 🆘 Troubleshooting

See [KIND-DEPLOYMENT.md](KIND-DEPLOYMENT.md#troubleshooting) for detailed troubleshooting guide.

Common issues:
- Frontend showing 404: Hard refresh browser (Ctrl+Shift+R)
- Backend can't connect: Check MongoDB pod is running
- Data lost: Use MongoDB Atlas or persistent storage
