# ArgoCD Quick Start Guide for EkoMart

Get your EkoMart application running with ArgoCD in minutes!

## Prerequisites

- Kubernetes cluster (Kind, EKS, GKE, etc.)
- kubectl installed and configured
- Git repository access

## 🚀 Quick Installation (3 Steps)

### Step 1: Install ArgoCD

```bash
# Make script executable
chmod +x argocd/install-argocd.sh

# Run installation script
./argocd/install-argocd.sh
```

This will:
- Install ArgoCD in your cluster
- Set up port forwarding or NodePort
- Display admin credentials
- Optionally deploy EkoMart applications

### Step 2: Access ArgoCD UI

**For Kind/Local Cluster:**
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Access at: https://localhost:8080

**For Remote Cluster (EC2, etc.):**
```bash
# Get NodePort
kubectl get svc argocd-server -n argocd

# Access at: http://<NODE_IP>:<NODEPORT>
```

**Login Credentials:**
- Username: `admin`
- Password: Get with command below
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### Step 3: Deploy Applications

**Option A: Deploy All at Once (App of Apps Pattern)**
```bash
kubectl apply -f argocd/app-of-apps.yaml
```

**Option B: Deploy Individually**
```bash
# Create namespace
kubectl apply -f argocd/namespace.yaml

# Deploy backend
kubectl apply -f argocd/applications/backend-app.yaml

# Deploy frontend
kubectl apply -f argocd/applications/frontend-app.yaml
```

## ✅ Verify Deployment

```bash
# Check ArgoCD applications
kubectl get applications -n argocd

# Check application status
kubectl get pods -n ekomart

# Check services
kubectl get svc -n ekomart
```

## 🌐 Access Your Application

- **Frontend**: http://\<NODE_IP\>:31000
- **Backend API**: http://\<NODE_IP\>:31100

For Kind cluster:
- **Frontend**: http://localhost:31000
- **Backend API**: http://localhost:31100

## 📊 Optional: Install ArgoCD CLI

**Linux:**
```bash
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```

**macOS:**
```bash
brew install argocd
```

**Windows:**
```powershell
choco install argocd-cli
```

**Login:**
```bash
argocd login localhost:8080 --username admin --password <password>
```

## 🔄 Common Operations

### Sync Application
```bash
# Via CLI
argocd app sync ekomart-backend

# Via kubectl
kubectl patch app ekomart-backend -n argocd --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{}}}'
```

### View Application Status
```bash
argocd app get ekomart-backend
```

### View Logs
```bash
argocd app logs ekomart-backend
```

### Refresh Application
```bash
argocd app get ekomart-backend --refresh
```

## 🔧 Configuration

### Update Git Repository

Edit `argocd/applications/backend-app.yaml` and `argocd/applications/frontend-app.yaml`:

```yaml
spec:
  source:
    repoURL: https://github.com/YOUR_USERNAME/YOUR_REPO.git
    targetRevision: YOUR_BRANCH
```

Then apply:
```bash
kubectl apply -f argocd/applications/
```

### Enable/Disable Auto-Sync

**Enable:**
```yaml
spec:
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

**Disable:**
Remove the `automated` section or set to `null`.

## 🖼️ Image Auto-Update (Optional)

To automatically update images when new versions are pushed:

```bash
# Install Image Updater
kubectl apply -f argocd/image-updater/argocd-image-updater.yaml

# Deploy apps with image updater enabled
kubectl apply -f argocd/image-updater/backend-app-with-updater.yaml
kubectl apply -f argocd/image-updater/frontend-app-with-updater.yaml
```

See [Image Updater README](image-updater/README.md) for details.

## 🔔 Notifications (Optional)

Configure Slack/email notifications:

1. Edit `argocd/argocd-notifications-cm.yaml` with your credentials
2. Apply:
```bash
kubectl apply -f argocd/argocd-notifications-cm.yaml
```

## 🧹 Cleanup

```bash
# Make script executable
chmod +x argocd/uninstall-argocd.sh

# Run uninstallation
./argocd/uninstall-argocd.sh
```

## 📚 Next Steps

1. **Set up RBAC**: Configure user access with `argocd/argocd-rbac-cm.yaml`
2. **Enable Notifications**: Get alerts on deployments
3. **Configure Image Updater**: Automate image updates
4. **Set up Ingress**: Use custom domain with TLS
5. **Integrate with CI/CD**: Automate deployments from GitHub Actions

## 🆘 Troubleshooting

### Application Stuck in Progressing
```bash
# Check events
kubectl get events -n ekomart --sort-by='.lastTimestamp'

# Check pod logs
kubectl logs -n ekomart -l app=backend
```

### Sync Failed
```bash
# View sync errors
argocd app get ekomart-backend

# Force sync
argocd app sync ekomart-backend --force
```

### Can't Access ArgoCD UI
```bash
# Check ArgoCD pods
kubectl get pods -n argocd

# Restart port-forward
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### Image Pull Errors
```bash
# Check if images exist in registry
docker pull bashairfan0911/ekomart-backend:test-dev

# For Kind cluster, load images manually
kind load docker-image ekomart-backend:latest --name ekomart
```

## 📖 Documentation

- [Full README](README.md) - Detailed documentation
- [Image Updater](image-updater/README.md) - Auto-update images
- [ArgoCD Docs](https://argo-cd.readthedocs.io/) - Official documentation

## 💡 Tips

1. **Use App of Apps pattern** for managing multiple applications
2. **Enable auto-sync carefully** - test in dev first
3. **Monitor sync status** regularly
4. **Use projects** to organize applications
5. **Implement proper RBAC** for team access
6. **Tag images properly** in CI/CD for better tracking

---

**Happy GitOps! 🚀**
