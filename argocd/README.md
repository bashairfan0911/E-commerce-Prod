# ArgoCD Configuration for EkoMart

This directory contains ArgoCD configuration files for GitOps deployment of the EkoMart application.

## Files

- `install.yaml` - Installation instructions for ArgoCD
- `project.yaml` - ArgoCD project definition
- `application.yaml` - Main application configuration
- `backend-application.yaml` - Backend-specific application
- `frontend-application.yaml` - Frontend-specific application

## Quick Setup

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

For Kind cluster:
```bash
# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

For production (NodePort):
```bash
# Change service type to NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get the NodePort
kubectl get svc argocd-server -n argocd
```

### 3. Get Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

- **Username**: `admin`
- **Password**: (output from above command)

Access at: https://localhost:8080

### 4. Deploy Applications

```bash
# Create ArgoCD project
kubectl apply -f argocd/project.yaml

# Deploy all applications
kubectl apply -f argocd/application.yaml

# Or deploy backend and frontend separately
kubectl apply -f argocd/backend-application.yaml
kubectl apply -f argocd/frontend-application.yaml
```

## ArgoCD CLI Commands

### Install ArgoCD CLI

```bash
# Linux
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# macOS
brew install argocd

# Windows
choco install argocd-cli
```

### Login via CLI

```bash
# Port forward first
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Login
argocd login localhost:8080 --username admin --insecure
```

### Manage Applications

```bash
# List applications
argocd app list

# Get application details
argocd app get ekomart-app

# Sync application
argocd app sync ekomart-app

# View application logs
argocd app logs ekomart-app

# Delete application
argocd app delete ekomart-app
```

## Configuration Details

### Project Configuration

The `project.yaml` defines:
- Project name: `ekomart`
- Allowed source repositories: All (`*`)
- Allowed destinations: `ekomart` namespace
- Resource permissions: All cluster and namespace resources

### Application Configuration

The `application.yaml` defines:
- Source: GitHub repository (test-dev branch)
- Path: `kubernetes/Kind-cluster`
- Destination: `ekomart` namespace
- Sync policy: Automated with self-healing
- Auto-create namespace

### Sync Policy

All applications use automated sync with:
- **Prune**: Remove resources not in Git
- **Self-heal**: Automatically sync when cluster state differs from Git
- **Retry**: Automatic retry on sync failures

## Troubleshooting

### Application Not Syncing

```bash
# Check application status
argocd app get ekomart-app

# View sync status
kubectl get application ekomart-app -n argocd -o yaml

# Manual sync
argocd app sync ekomart-app --force
```

### View Application Events

```bash
kubectl describe application ekomart-app -n argocd
```

### Reset Admin Password

```bash
# Delete the secret
kubectl -n argocd delete secret argocd-initial-admin-secret

# Restart ArgoCD server
kubectl -n argocd rollout restart deployment argocd-server
```

## Best Practices

1. **Use separate applications** for backend and frontend for independent deployments
2. **Enable auto-sync** for continuous deployment
3. **Use self-heal** to maintain desired state
4. **Set retry limits** to handle transient failures
5. **Monitor sync status** regularly

## Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [ArgoCD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
- [GitOps Principles](https://www.gitops.tech/)
