# Kind Cluster Deployment - Summary

## 📂 Folder Organization

```
kubernetes/Kind-cluster/
├── scripts/                    # All helper scripts
│   ├── deploy-to-kind.ps1     # Automated deployment
│   ├── cleanup-keep-data.ps1  # Clean without losing data
│   ├── recover-data.ps1       # Restore data after deletion
│   └── README.md              # Scripts documentation
├── backend-atlas.yaml         # Backend with MongoDB Atlas ⭐
├── backend-kind.yaml          # Backend with local MongoDB
├── frontend-kind.yaml         # Frontend deployment
├── mongodb-kind.yaml          # Temporary MongoDB
├── mongodb-persistent.yaml    # Persistent MongoDB
├── kind-config.yaml           # Cluster configuration
├── KIND-DEPLOYMENT.md         # Main deployment guide
├── README.md                  # Quick start guide
└── SUMMARY.md                 # This file
```

## 🎯 Deployment Options

### Option 1: MongoDB Atlas (Recommended) ⭐
- **Data**: Persists in cloud forever
- **Setup**: Simplest, no volumes needed
- **Use**: `backend-atlas.yaml`
- **Best for**: Development, testing, production

### Option 2: Local MongoDB + Persistent Storage
- **Data**: Persists locally, survives pod restarts
- **Setup**: Requires PersistentVolume
- **Use**: `mongodb-persistent.yaml` + `backend-kind.yaml`
- **Best for**: Offline development

### Option 3: Local MongoDB (Temporary)
- **Data**: Lost on pod restart
- **Setup**: Simplest local setup
- **Use**: `mongodb-kind.yaml` + `backend-kind.yaml`
- **Best for**: Quick testing

## 🛠️ Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `deploy-to-kind.ps1` | Full automated deployment | First time setup |
| `cleanup-keep-data.ps1` | Remove deployments, keep data | Temporary cleanup |
| `recover-data.ps1` | Restore after namespace deletion | Data recovery |
| `setup-persistent-storage.ps1` | Create persistent volume | Advanced setup |

## 📝 Common Workflows

### First Time Setup
```bash
# 1. Create cluster
kind create cluster --name ecommerce --config kind-config.yaml

# 2. Build images
docker build -t ecommerce-backend:latest ./backend
docker build --build-arg VITE_API_URL=/ -t ecommerce-frontend:latest ./frontend

# 3. Load images
kind load docker-image ecommerce-backend:latest --name ecommerce
kind load docker-image ecommerce-frontend:latest --name ecommerce

# 4. Deploy (choose one)
# Option A: MongoDB Atlas
kubectl create namespace ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# Option B: Use automated script
.\kubernetes\Kind-cluster\scripts\deploy-to-kind.ps1
```

### Update Code
```bash
# 1. Rebuild image
docker build -t ecommerce-backend:latest ./backend

# 2. Reload into Kind
kind load docker-image ecommerce-backend:latest --name ecommerce

# 3. Restart deployment
kubectl rollout restart deployment/backend-deployment -n ekomart
```

### Clean Up (Keep Data)
```bash
.\kubernetes\Kind-cluster\scripts\cleanup-keep-data.ps1
```

### Complete Cleanup
```bash
kind delete cluster --name ecommerce
```

## 🔍 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Frontend shows 404 | Hard refresh: Ctrl+Shift+R |
| Backend can't connect | Check MongoDB pod: `kubectl get pods -n ekomart` |
| Data lost after restart | Use MongoDB Atlas or persistent storage |
| Login fails | Create new account or check backend logs |
| Slow loading | Normal for first load, check network tab |

## 📚 Documentation Links

- **[KIND-DEPLOYMENT.md](KIND-DEPLOYMENT.md)** - Complete deployment guide
- **[scripts/README.md](scripts/README.md)** - All scripts documentation
- **[README.md](README.md)** - Quick start guide

## 💡 Best Practices

1. **Use MongoDB Atlas** for persistent data across all scenarios
2. **Use automated scripts** for consistent deployments
3. **Always hard refresh** browser after deployment (Ctrl+Shift+R)
4. **Check logs** when troubleshooting: `kubectl logs -l app=backend -n ekomart`
5. **Don't delete namespace** if you want to keep local data

## 🎓 Learning Path

1. Start with automated script: `deploy-to-kind.ps1`
2. Try manual deployment to understand the process
3. Experiment with different storage options
4. Practice data recovery scenarios
5. Customize for your needs

## ⚡ Quick Commands

```bash
# Check status
kubectl get all -n ekomart

# View logs
kubectl logs -l app=backend -n ekomart --tail=20

# Access pod shell
kubectl exec -it deployment/backend-deployment -n ekomart -- sh

# Port forward (alternative access)
kubectl port-forward svc/frontend-service 8080:80 -n ekomart

# Delete and redeploy
kubectl delete deployment backend-deployment -n ekomart
kubectl apply -f kubernetes/Kind-cluster/backend-atlas.yaml
```

## 🌟 Key Features

- ✅ Multiple deployment options (Atlas, Local, Temporary)
- ✅ Automated deployment scripts
- ✅ Data recovery capabilities
- ✅ Comprehensive documentation
- ✅ Production-ready configurations
- ✅ Easy cleanup and maintenance

---

**Need help?** Check [KIND-DEPLOYMENT.md](KIND-DEPLOYMENT.md) for detailed troubleshooting.
