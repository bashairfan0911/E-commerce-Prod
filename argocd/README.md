# ArgoCD GitOps Setup for EkoMart

This directory contains ArgoCD application manifests for deploying the EkoMart e-commerce platform using GitOps principles.

## Prerequisites

- Kubernetes cluster (Kind, EKS, GKE, etc.)
- kubectl configured
- ArgoCD installed in the cluster

## Quick Start

### 1. Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod --all -n argocd --timeout=300s
```

### 2. Access ArgoCD UI

```bash
# Port forward (for local access)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Or patch to NodePort (for EC2/remote access)
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

Access at: https://localhost:8080 (Username: `admin`)

### 3. Deploy Applications with ArgoCD

#### Option A: Deploy All Applications at Once

```bash
# Deploy the app-of-apps pattern
kubectl apply -f argocd/app-of-apps.yaml
```

#### Option B: Deploy Individual Applications

```bash
# Deploy namespace
kubectl apply -f argocd/namespace.yaml

# Deploy backend
kubectl apply -f argocd/applications/backend-app.yaml

# Deploy frontend
kubectl apply -f argocd/applications/frontend-app.yaml
```

### 4. Verify Deployments

```bash
# Check ArgoCD applications
kubectl get applications -n argocd

# Check application status
argocd app list

# Check pods in ekomart namespace
kubectl get pods -n ekomart

# Check services
kubectl get svc -n ekomart
```

## ArgoCD CLI Setup

```bash
# Install ArgoCD CLI (Linux)
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# Login to ArgoCD
argocd login localhost:8080 --username admin --password <password>

# Or for remote server
argocd login <ARGOCD_SERVER> --username admin --password <password>
```

## Application Structure

```
argocd/
├── README.md                          # This file
├── namespace.yaml                     # Namespace configuration
├── app-of-apps.yaml                   # App of Apps pattern
├── applications/
│   ├── backend-app.yaml              # Backend application
│   └── frontend-app.yaml             # Frontend application
└── projects/
    └── ekomart-project.yaml          # ArgoCD project definition
```

## Configuration

### Update Git Repository

Edit the application manifests to point to your Git repository:

```yaml
spec:
  source:
    repoURL: https://github.com/YOUR_USERNAME/YOUR_REPO.git
    targetRevision: test-dev
```

### Sync Policies

Applications are configured with:
- **Auto-sync**: Automatically sync when changes are detected
- **Self-heal**: Automatically correct drift from desired state
- **Prune**: Remove resources that are no longer defined

To disable auto-sync, remove the `automated` section from the application manifest.

## Managing Applications

### Sync Application

```bash
# Sync specific app
argocd app sync ekomart-backend

# Sync all apps
argocd app sync -l app.kubernetes.io/instance=ekomart
```

### View Application Details

```bash
# Get app info
argocd app get ekomart-backend

# View app logs
argocd app logs ekomart-backend

# View app history
argocd app history ekomart-backend
```

### Rollback Application

```bash
# Rollback to previous version
argocd app rollback ekomart-backend

# Rollback to specific revision
argocd app rollback ekomart-backend 5
```

### Delete Application

```bash
# Delete app (keeps resources)
argocd app delete ekomart-backend

# Delete app and resources
argocd app delete ekomart-backend --cascade
```

## Monitoring

### Application Health

ArgoCD automatically monitors:
- Deployment status
- Pod health
- Service availability
- Resource sync status

### Notifications

Configure notifications in ArgoCD to get alerts on:
- Sync failures
- Health degradation
- Out-of-sync resources

## Troubleshooting

### Application Not Syncing

```bash
# Check application status
argocd app get ekomart-backend

# View sync errors
kubectl describe application ekomart-backend -n argocd

# Force refresh
argocd app get ekomart-backend --refresh
```

### Image Pull Errors

If using private Docker registry:

```bash
# Create docker registry secret
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password> \
  -n ekomart

# Update deployment to use imagePullSecrets
```

### Access Application

- **Frontend**: http://\<NODE_IP\>:31000
- **Backend**: http://\<NODE_IP\>:31100

## Best Practices

1. **Use Git as Single Source of Truth**: All changes should go through Git
2. **Enable Auto-Sync with Caution**: Test in dev before enabling in production
3. **Use Projects**: Organize applications using ArgoCD projects
4. **Implement RBAC**: Control access to applications and resources
5. **Monitor Sync Status**: Set up alerts for sync failures
6. **Use Helm/Kustomize**: For complex configurations
7. **Tag Images Properly**: Avoid using `latest` tag in production

## Integration with CI/CD

Your GitHub Actions workflow builds and pushes images. ArgoCD will:
1. Detect changes in Kubernetes manifests
2. Automatically sync the changes to the cluster
3. Update deployments with new image tags

To update image tags automatically, consider using:
- ArgoCD Image Updater
- Kustomize with image transformers
- Helm values files

## Security

- Store secrets in Kubernetes Secrets or external secret managers
- Use RBAC to control access
- Enable audit logging
- Regularly update ArgoCD
- Use private Git repositories
- Implement network policies

## Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
- [GitOps Principles](https://opengitops.dev/)
