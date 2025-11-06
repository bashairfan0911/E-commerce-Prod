# Getting Started with ArgoCD for EkoMart

Welcome! This guide will help you get your EkoMart application running with ArgoCD GitOps in just a few minutes.

## 🎯 What You'll Achieve

By the end of this guide, you'll have:
- ✅ ArgoCD installed and running
- ✅ EkoMart backend and frontend deployed
- ✅ Automatic synchronization from Git
- ✅ Self-healing deployments
- ✅ Easy rollback capability

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Kubernetes cluster running (Kind, EKS, GKE, etc.)
- [ ] `kubectl` installed and configured
- [ ] Access to your Git repository
- [ ] Docker images built and pushed (or use existing ones)

## 🚀 Installation Methods

Choose the method that works best for you:

### Method 1: Automated Installation (Recommended)

**Time: ~5 minutes**

```bash
# Step 1: Make script executable
chmod +x argocd/install-argocd.sh

# Step 2: Run installation
./argocd/install-argocd.sh

# Step 3: Follow the prompts
# - Script will install ArgoCD
# - Display credentials
# - Ask if you want to deploy applications
```

That's it! Your applications will be deployed and syncing automatically.

### Method 2: Manual Installation

**Time: ~10 minutes**

```bash
# Step 1: Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Step 2: Wait for ArgoCD to be ready
kubectl wait --for=condition=ready pod --all -n argocd --timeout=600s

# Step 3: Access ArgoCD
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Step 4: Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# Step 5: Deploy applications
kubectl apply -f argocd/namespace.yaml
kubectl apply -f argocd/app-of-apps.yaml
```

### Method 3: Step-by-Step with Options

**Time: ~15 minutes**

```bash
# Step 1: Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl wait --for=condition=ready pod --all -n argocd --timeout=600s

# Step 2: Create namespace
kubectl apply -f argocd/namespace.yaml

# Step 3: Create ArgoCD project (optional but recommended)
kubectl apply -f argocd/projects/ekomart-project.yaml

# Step 4: Configure RBAC (optional)
kubectl apply -f argocd/argocd-rbac-cm.yaml

# Step 5: Configure notifications (optional)
# Edit argocd/argocd-notifications-cm.yaml with your credentials first
kubectl apply -f argocd/argocd-notifications-cm.yaml

# Step 6: Deploy applications
kubectl apply -f argocd/applications/backend-app.yaml
kubectl apply -f argocd/applications/frontend-app.yaml

# Step 7: (Optional) Install Image Updater for auto-deployment
kubectl apply -f argocd/image-updater/argocd-image-updater.yaml
```

## 🌐 Accessing Your Setup

### Access ArgoCD UI

**For Local/Kind Cluster:**
```bash
# Terminal 1: Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Terminal 2: Get password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# Open browser: https://localhost:8080
# Username: admin
# Password: (from command above)
```

**For Remote Cluster (EC2, etc.):**
```bash
# Patch service to NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get NodePort
kubectl get svc argocd-server -n argocd

# Get Node IP
kubectl get nodes -o wide

# Access: http://<NODE_IP>:<NODEPORT>
```

### Access Your Applications

**Frontend:**
- Local: http://localhost:31000
- Remote: http://\<NODE_IP\>:31000

**Backend API:**
- Local: http://localhost:31100
- Remote: http://\<NODE_IP\>:31100

## ✅ Verification Steps

### 1. Check ArgoCD Installation
```bash
kubectl get pods -n argocd
```
Expected: All pods should be Running

### 2. Check Applications
```bash
kubectl get applications -n argocd
```
Expected: See ekomart-backend and ekomart-frontend

### 3. Check Application Status
```bash
kubectl get pods -n ekomart
kubectl get svc -n ekomart
```
Expected: Pods Running, Services created

### 4. Test Frontend
```bash
curl http://localhost:31000
```
Expected: HTML response

### 5. Test Backend API
```bash
curl http://localhost:31100/api/health
```
Expected: JSON response

## 🎓 Understanding What Happened

### 1. ArgoCD Installation
- Created `argocd` namespace
- Deployed ArgoCD components (server, repo-server, controller)
- Set up initial admin credentials

### 2. Application Deployment
- Created `ekomart` namespace
- Deployed backend and frontend applications
- Configured services with NodePort access

### 3. GitOps Setup
- ArgoCD monitors your Git repository
- Automatically syncs changes to cluster
- Self-heals if resources are modified manually

## 🔄 Making Changes

### Update Application Code

```bash
# 1. Make code changes
# 2. Commit to Git
git add .
git commit -m "Update feature"
git push

# 3. CI/CD builds and pushes new image
# (GitHub Actions handles this)

# 4. Update Kubernetes manifest with new image tag
# Edit kubernetes/Kind-cluster/backend-kind.yaml
# Change image tag to new version

# 5. Commit manifest change
git add kubernetes/Kind-cluster/backend-kind.yaml
git commit -m "Update backend image"
git push

# 6. ArgoCD automatically syncs (if auto-sync enabled)
# Or manually sync via UI or CLI
argocd app sync ekomart-backend
```

### With Image Updater (Automatic)

```bash
# 1. Make code changes
# 2. Commit to Git
git add .
git commit -m "Update feature"
git push

# 3. CI/CD builds and pushes new image
# (GitHub Actions handles this)

# 4. Image Updater detects new image
# 5. Updates ArgoCD application automatically
# 6. ArgoCD syncs to cluster
# Done! No manual steps needed.
```

## 🛠️ Common Tasks

### Sync Application Manually
```bash
argocd app sync ekomart-backend
```

### View Application Status
```bash
argocd app get ekomart-backend
```

### View Application Logs
```bash
argocd app logs ekomart-backend
```

### Rollback to Previous Version
```bash
argocd app rollback ekomart-backend
```

### Refresh Application
```bash
argocd app get ekomart-backend --refresh
```

### Delete Application
```bash
argocd app delete ekomart-backend
```

## 🐛 Troubleshooting

### Issue: ArgoCD pods not starting
```bash
# Check pod status
kubectl get pods -n argocd

# Check pod logs
kubectl logs -n argocd <pod-name>

# Check events
kubectl get events -n argocd --sort-by='.lastTimestamp'
```

### Issue: Application not syncing
```bash
# Check application status
argocd app get ekomart-backend

# View sync errors
kubectl describe application ekomart-backend -n argocd

# Force sync
argocd app sync ekomart-backend --force
```

### Issue: Can't access ArgoCD UI
```bash
# Check if port-forward is running
ps aux | grep port-forward

# Restart port-forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Or use NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
kubectl get svc argocd-server -n argocd
```

### Issue: Image pull errors
```bash
# For Kind cluster, load images manually
docker build -t ecommerce-backend:latest ./backend
kind load docker-image ecommerce-backend:latest --name ekomart

# For remote cluster, check image exists
docker pull bashairfan0911/ekomart-backend:test-dev

# Create image pull secret if needed
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password> \
  -n ekomart
```

### Issue: Application unhealthy
```bash
# Check pod logs
kubectl logs -n ekomart -l app=backend

# Check pod events
kubectl describe pod -n ekomart -l app=backend

# Check service
kubectl get svc -n ekomart

# Check endpoints
kubectl get endpoints -n ekomart
```

## 📚 Next Steps

Now that you have ArgoCD running, consider:

1. **Enable Image Auto-Update**
   - See [image-updater/README.md](image-updater/README.md)
   - Automate deployments when new images are pushed

2. **Configure Notifications**
   - Edit [argocd-notifications-cm.yaml](argocd-notifications-cm.yaml)
   - Get alerts on Slack/email for deployments

3. **Set Up RBAC**
   - Apply [argocd-rbac-cm.yaml](argocd-rbac-cm.yaml)
   - Control team access to applications

4. **Use Custom Domain**
   - Apply [argocd-ingress.yaml](argocd-ingress.yaml)
   - Access ArgoCD via custom domain with TLS

5. **Integrate with Monitoring**
   - Set up Prometheus and Grafana
   - Monitor application health and performance

6. **Implement Progressive Delivery**
   - Use Argo Rollouts for canary deployments
   - Implement blue-green deployments

## 📖 Documentation Reference

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | 3-step quick start |
| [README.md](README.md) | Complete documentation |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [SUMMARY.md](SUMMARY.md) | Quick reference |
| [INDEX.md](INDEX.md) | File reference |
| [GETTING-STARTED.md](GETTING-STARTED.md) | This guide |

## 💡 Tips for Success

1. **Start Simple**: Use basic setup first, add features later
2. **Test in Dev**: Always test changes in development first
3. **Monitor Regularly**: Check sync status and application health
4. **Use Git**: Make all changes through Git (GitOps principle)
5. **Document Changes**: Keep track of what you change and why
6. **Backup**: Keep backups of your configurations
7. **Learn ArgoCD**: Spend time understanding ArgoCD features
8. **Automate**: Use Image Updater for automatic deployments

## 🎉 Success Checklist

- [ ] ArgoCD installed and accessible
- [ ] Admin password retrieved
- [ ] Applications deployed
- [ ] Frontend accessible at port 31000
- [ ] Backend accessible at port 31100
- [ ] Applications showing as "Healthy" in ArgoCD UI
- [ ] Auto-sync working (if enabled)
- [ ] Can make changes via Git and see them sync

## 🆘 Getting Help

If you're stuck:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review [README.md](README.md) for detailed information
3. Check [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
4. Look at application logs: `kubectl logs -n ekomart -l app=backend`
5. Check ArgoCD logs: `kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server`

## 🚀 You're Ready!

Congratulations! You now have a fully functional GitOps setup with ArgoCD. Your applications will automatically sync from Git, self-heal if modified, and provide easy rollback capabilities.

**Happy GitOps! 🎊**

---

**Quick Links:**
- [Quick Start (3 steps)](QUICKSTART.md)
- [Complete Guide](README.md)
- [Architecture](ARCHITECTURE.md)
- [File Index](INDEX.md)
