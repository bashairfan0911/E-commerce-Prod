# ArgoCD GitOps Deployment for EkoMart

This directory contains ArgoCD application manifests for deploying EkoMart e-commerce platform using GitOps methodology.

## 📋 Overview

ArgoCD provides:
- **Automated Deployment**: Sync Kubernetes manifests from Git
- **Self-Healing**: Automatically fix drift from desired state
- **Rollback**: Easy rollback to previous versions
- **Multi-Environment**: Manage dev, staging, and production
- **Audit Trail**: Track all changes through Git history

## 🏗️ Architecture

```
GitHub Repository (Source of Truth)
         ↓
    ArgoCD Server
         ↓
    EKS Cluster (Target)
         ↓
    EkoMart Application
```

## 📁 Files

| File | Purpose |
|------|---------|
| `install.yaml` | ArgoCD installation instructions |
| `project.yaml` | ArgoCD project definition |
| `application.yaml` | Main application (all resources) |
| `backend-application.yaml` | Backend-only application |
| `frontend-application.yaml` | Frontend-only application |

## 🚀 Quick Start

### Step 1: Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### Step 2: Expose ArgoCD Server

```bash
# Change service type to NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get the NodePort
kubectl get svc argocd-server -n argocd
```

### Step 3: Get Admin Password

```bash
# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### Step 4: Access ArgoCD UI

```bash
# Get worker node IP
kubectl get nodes -o wide

# Access ArgoCD
# URL: https://<NODE_IP>:<NODEPORT>
# Username: admin
# Password: <from step 3>
```

### Step 5: Install ArgoCD CLI (Optional)

```bash
# Linux
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# Verify installation
argocd version
```

### Step 6: Login via CLI

```bash
# Login to ArgoCD
argocd login <ARGOCD_SERVER>:<PORT> --username admin --password <PASSWORD> --insecure

# Change admin password
argocd account update-password
```

### Step 7: Add EKS Cluster to ArgoCD

```bash
# List available contexts
kubectl config get-contexts

# Add cluster to ArgoCD
argocd cluster add <CONTEXT_NAME> --name ekomart-eks-cluster

# Verify cluster is added
argocd cluster list
```

### Step 8: Create ArgoCD Project

```bash
# Apply project
kubectl apply -f argocd/project.yaml

# Verify project
argocd proj list
```

### Step 9: Deploy Application

#### Option A: Deploy Complete Application
```bash
# Apply application manifest
kubectl apply -f argocd/application.yaml

# Verify application
argocd app list
argocd app get ekomart-app
```

#### Option B: Deploy Backend and Frontend Separately
```bash
# Deploy backend
kubectl apply -f argocd/backend-application.yaml

# Deploy frontend
kubectl apply -f argocd/frontend-application.yaml

# Verify applications
argocd app list
```

### Step 10: Sync Application

```bash
# Sync application (if not auto-sync)
argocd app sync ekomart-app

# Watch sync status
argocd app wait ekomart-app --health

# Check application status
argocd app get ekomart-app
```

## 🔧 Configuration

### Auto-Sync Policy

The applications are configured with automated sync:
```yaml
syncPolicy:
  automated:
    prune: true        # Delete resources not in Git
    selfHeal: true     # Auto-fix drift
    allowEmpty: false  # Prevent empty sync
```

### Sync Options

```yaml
syncOptions:
  - CreateNamespace=true              # Auto-create namespace
  - PrunePropagationPolicy=foreground # Delete in order
  - PruneLast=true                    # Delete after new resources
```

### Retry Policy

```yaml
retry:
  limit: 5           # Max retry attempts
  backoff:
    duration: 5s     # Initial backoff
    factor: 2        # Backoff multiplier
    maxDuration: 3m  # Max backoff duration
```

## 📊 Monitoring

### Check Application Health

```bash
# Get application status
argocd app get ekomart-app

# List all applications
argocd app list

# Watch application sync
watch argocd app get ekomart-app
```

### View Application in UI

1. Login to ArgoCD UI
2. Click on application name
3. View resource tree and sync status
4. Check pod logs and events

### Check Sync History

```bash
# View sync history
argocd app history ekomart-app

# View specific revision
argocd app manifests ekomart-app --revision <REVISION>
```

## 🔄 GitOps Workflow

### 1. Update Application

```bash
# Make changes to Kubernetes manifests
vim kubernetes/backend-deployment.yaml

# Commit and push changes
git add kubernetes/backend-deployment.yaml
git commit -m "Update backend image to v2.0"
git push origin EKS-Prod-Dev
```

### 2. ArgoCD Auto-Sync

ArgoCD will automatically:
1. Detect changes in Git repository
2. Compare with cluster state
3. Sync changes to cluster
4. Report sync status

### 3. Manual Sync (if needed)

```bash
# Sync application
argocd app sync ekomart-app

# Sync specific resource
argocd app sync ekomart-app --resource apps:Deployment:backend
```

## 🔙 Rollback

### Rollback to Previous Version

```bash
# View history
argocd app history ekomart-app

# Rollback to specific revision
argocd app rollback ekomart-app <REVISION>

# Rollback to previous revision
argocd app rollback ekomart-app
```

### Rollback via UI

1. Open application in ArgoCD UI
2. Click "History and Rollback"
3. Select revision to rollback
4. Click "Rollback"

## 🛠️ Troubleshooting

### Application Not Syncing

```bash
# Check application status
argocd app get ekomart-app

# View sync errors
argocd app get ekomart-app --show-operation

# Force refresh
argocd app get ekomart-app --refresh

# Hard refresh (bypass cache)
argocd app get ekomart-app --hard-refresh
```

### Sync Failed

```bash
# View detailed error
kubectl describe application ekomart-app -n argocd

# Check ArgoCD logs
kubectl logs -n argocd deployment/argocd-application-controller

# Check repo server logs
kubectl logs -n argocd deployment/argocd-repo-server
```

### Out of Sync

```bash
# View diff
argocd app diff ekomart-app

# Sync with prune
argocd app sync ekomart-app --prune

# Force sync
argocd app sync ekomart-app --force
```

### Repository Connection Issues

```bash
# Test repository connection
argocd repo list

# Add repository manually
argocd repo add https://github.com/bashairfan0911/E-commerce-Prod.git

# Update repository credentials
argocd repo add https://github.com/bashairfan0911/E-commerce-Prod.git \
  --username <USERNAME> \
  --password <TOKEN>
```

## 🔐 Security Best Practices

### 1. Change Default Password

```bash
argocd account update-password
```

### 2. Enable RBAC

```yaml
# argocd-rbac-cm ConfigMap
policy.default: role:readonly
policy.csv: |
  p, role:admin, applications, *, */*, allow
  p, role:admin, clusters, *, *, allow
  g, admin-group, role:admin
```

### 3. Use Private Repository

```bash
# Add private repo with SSH key
argocd repo add git@github.com:bashairfan0911/E-commerce-Prod.git \
  --ssh-private-key-path ~/.ssh/id_rsa
```

### 4. Enable TLS

```bash
# Generate TLS certificate
kubectl create secret tls argocd-server-tls \
  --cert=server.crt \
  --key=server.key \
  -n argocd
```

## 📈 Advanced Features

### Multi-Environment Deployment

```yaml
# production
source:
  path: kubernetes/overlays/production

# staging
source:
  path: kubernetes/overlays/staging
```

### Helm Chart Support

```yaml
source:
  repoURL: https://charts.example.com
  chart: ekomart
  targetRevision: 1.0.0
  helm:
    values: |
      image:
        tag: v2.0
```

### Kustomize Support

```yaml
source:
  path: kubernetes/base
  kustomize:
    namePrefix: prod-
    commonLabels:
      env: production
```

### Sync Waves

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "1"  # Deploy in order
```

### Sync Hooks

```yaml
metadata:
  annotations:
    argocd.argoproj.io/hook: PreSync  # Run before sync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
```

## 🧹 Cleanup

### Delete Application

```bash
# Delete application (keeps resources)
argocd app delete ekomart-app

# Delete application and resources
argocd app delete ekomart-app --cascade

# Delete via kubectl
kubectl delete -f argocd/application.yaml
```

### Uninstall ArgoCD

```bash
# Delete ArgoCD
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Delete namespace
kubectl delete namespace argocd
```

## 📚 Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
- [GitOps Principles](https://www.gitops.tech/)

## 🤝 Support

For issues:
- Check ArgoCD logs: `kubectl logs -n argocd deployment/argocd-application-controller`
- View application events: `kubectl describe application ekomart-app -n argocd`
- ArgoCD Slack: https://argoproj.github.io/community/join-slack

---

**Happy GitOps! 🚀**
