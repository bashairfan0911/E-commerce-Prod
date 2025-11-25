# EkoMart ArgoCD Architecture

## Overview

This document describes the GitOps architecture for EkoMart using ArgoCD.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer                                │
│                            │                                     │
│                            ▼                                     │
│                    ┌──────────────┐                             │
│                    │  Git Commit  │                             │
│                    └──────┬───────┘                             │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Actions                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Security   │  │    Build &   │  │   Push to    │         │
│  │   Scanning   │→ │     Test     │→ │  Docker Hub  │         │
│  └──────────────┘  └──────────────┘  └──────┬───────┘         │
└────────────────────────────────────────────────┼────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Hub                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  bashairfan0911/ekomart-backend:test-dev-abc123      │      │
│  │  bashairfan0911/ekomart-frontend:test-dev-abc123     │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────────────────────┬────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ArgoCD Image Updater                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │  • Polls Docker Hub every 2 minutes                │         │
│  │  • Detects new images matching pattern             │         │
│  │  • Updates ArgoCD Application spec                 │         │
│  └────────────────────────────────────────────────────┘         │
└────────────────────────────────────────┬────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ArgoCD                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │  • Monitors Git repository                         │         │
│  │  • Detects configuration changes                   │         │
│  │  • Syncs desired state to cluster                  │         │
│  │  • Self-heals on drift                             │         │
│  └────────────────────────────────────────────────────┘         │
└────────────────────────────────────────┬────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Namespace: ekomart                              │           │
│  │  ┌────────────────┐      ┌────────────────┐    │           │
│  │  │    Backend     │      │    Frontend    │    │           │
│  │  │   Deployment   │      │   Deployment   │    │           │
│  │  │                │      │                │    │           │
│  │  │  Port: 31100   │      │  Port: 31000   │    │           │
│  │  └────────────────┘      └────────────────┘    │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Git Repository (Source of Truth)
- **Location**: `https://github.com/bashairfan0911/E-commerce-Prod.git`
- **Branch**: `test-dev`
- **Contains**: Kubernetes manifests, ArgoCD applications
- **Role**: Single source of truth for desired state

### 2. GitHub Actions (CI/CD Pipeline)
- **Triggers**: Push to `test-dev` branch
- **Steps**:
  1. Security scanning (Trivy, OWASP)
  2. Code quality analysis (SonarQube)
  3. Build Docker images
  4. Push to Docker Hub with tags
- **Outputs**: Docker images with semantic tags

### 3. Docker Hub (Container Registry)
- **Images**:
  - `bashairfan0911/ekomart-backend`
  - `bashairfan0911/ekomart-frontend`
- **Tags**:
  - `test-dev` (latest)
  - `test-dev-<commit-sha>` (specific version)

### 4. ArgoCD Image Updater (Optional)
- **Function**: Automatically updates image tags
- **Polling Interval**: 2 minutes
- **Strategy**: Latest tag matching pattern
- **Write-back**: Updates ArgoCD application spec

### 5. ArgoCD (GitOps Controller)
- **Function**: Continuous deployment
- **Monitors**: Git repository for changes
- **Syncs**: Kubernetes resources to match Git
- **Features**:
  - Auto-sync
  - Self-healing
  - Rollback capability
  - Health monitoring

### 6. Kubernetes Cluster
- **Type**: Kind (local) or EKS/GKE (cloud)
- **Namespace**: `ekomart`
- **Resources**:
  - Backend Deployment + Service (NodePort 31100)
  - Frontend Deployment + Service (NodePort 31000)

## Deployment Flow

### Manual Deployment Flow

```
1. Developer commits code to Git
2. GitHub Actions builds and pushes images
3. Developer updates Kubernetes manifests in Git
4. ArgoCD detects changes
5. ArgoCD syncs to cluster
6. Application updated
```

### Automated Deployment Flow (with Image Updater)

```
1. Developer commits code to Git
2. GitHub Actions builds and pushes images with new tag
3. Image Updater detects new image
4. Image Updater updates ArgoCD application
5. ArgoCD syncs to cluster
6. Application updated automatically
```

## Directory Structure

```
argocd/
├── README.md                          # Main documentation
├── QUICKSTART.md                      # Quick start guide
├── ARCHITECTURE.md                    # This file
│
├── namespace.yaml                     # Namespace definition
├── app-of-apps.yaml                   # App of Apps pattern
│
├── applications/                      # Application definitions
│   ├── backend-app.yaml              # Backend application
│   └── frontend-app.yaml             # Frontend application
│
├── projects/                          # ArgoCD projects
│   └── ekomart-project.yaml          # Project with RBAC
│
├── image-updater/                     # Image updater configs
│   ├── README.md                     # Image updater docs
│   ├── argocd-image-updater.yaml     # Image updater deployment
│   ├── backend-app-with-updater.yaml # Backend with auto-update
│   └── frontend-app-with-updater.yaml# Frontend with auto-update
│
├── argocd-rbac-cm.yaml               # RBAC configuration
├── argocd-notifications-cm.yaml      # Notifications config
├── argocd-cm-patch.yaml              # ArgoCD config patch
├── argocd-ingress.yaml               # Ingress configuration
│
├── install-argocd.sh                 # Installation script
└── uninstall-argocd.sh               # Uninstallation script
```

## Application Specifications

### Backend Application

```yaml
Name: ekomart-backend
Namespace: ekomart
Image: bashairfan0911/ekomart-backend:test-dev
Port: 5000
Service Type: NodePort (31100)
Replicas: 1
Auto-sync: Enabled
Self-heal: Enabled
```

### Frontend Application

```yaml
Name: ekomart-frontend
Namespace: ekomart
Image: bashairfan0911/ekomart-frontend:test-dev
Port: 80
Service Type: NodePort (31000)
Replicas: 1
Auto-sync: Enabled
Self-heal: Enabled
```

## Sync Policies

### Auto-Sync
- **Enabled**: Yes
- **Prune**: Remove resources not in Git
- **Self-Heal**: Correct drift automatically
- **Allow Empty**: No

### Retry Policy
- **Limit**: 5 attempts
- **Initial Duration**: 5 seconds
- **Factor**: 2x backoff
- **Max Duration**: 3 minutes

## Security

### RBAC Roles

1. **Admin**: Full access to all resources
2. **Developer**: Can sync and view applications
3. **Read-only**: Can only view applications
4. **EkoMart-specific**: Scoped to ekomart namespace

### Secrets Management

- Database credentials in Kubernetes Secrets
- Docker registry credentials in ArgoCD
- API keys in environment variables
- Sensitive data not in Git

### Network Policies

- Backend accessible only from frontend
- Frontend accessible from internet
- ArgoCD accessible from management network

## Monitoring

### ArgoCD Metrics

- Application sync status
- Health status
- Sync duration
- Error rates

### Application Metrics

- Pod status
- Resource usage
- Request rates
- Error rates

### Notifications

- Slack/Email on deployment
- Alerts on sync failures
- Health degradation warnings

## High Availability

### ArgoCD HA Setup

```yaml
replicas:
  argocd-server: 2
  argocd-repo-server: 2
  argocd-application-controller: 1
```

### Application HA

```yaml
backend:
  replicas: 3
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi

frontend:
  replicas: 3
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 256Mi
```

## Disaster Recovery

### Backup Strategy

1. **Git Repository**: Primary backup (source of truth)
2. **ArgoCD Backup**: Export applications and settings
3. **Cluster Backup**: Velero for cluster resources

### Recovery Procedure

```bash
# 1. Restore ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Restore applications
kubectl apply -f argocd/app-of-apps.yaml

# 3. Sync applications
argocd app sync --all
```

## Best Practices

1. **Git as Source of Truth**: All changes through Git
2. **Immutable Infrastructure**: Never modify cluster directly
3. **Semantic Versioning**: Use proper image tags
4. **Environment Separation**: Dev, staging, prod branches
5. **RBAC**: Implement least privilege access
6. **Monitoring**: Set up alerts and dashboards
7. **Documentation**: Keep docs up to date
8. **Testing**: Test in dev before production
9. **Rollback Plan**: Always have rollback strategy
10. **Audit Trail**: Track all changes in Git

## Troubleshooting

### Common Issues

1. **Sync Failures**: Check application events and logs
2. **Image Pull Errors**: Verify registry credentials
3. **Health Degraded**: Check pod logs and events
4. **Out of Sync**: Force refresh or hard refresh
5. **RBAC Errors**: Verify user permissions

### Debug Commands

```bash
# Check application status
argocd app get ekomart-backend

# View sync errors
kubectl describe app ekomart-backend -n argocd

# Check pod logs
kubectl logs -n ekomart -l app=backend

# View events
kubectl get events -n ekomart --sort-by='.lastTimestamp'

# Force sync
argocd app sync ekomart-backend --force
```

## Future Enhancements

1. **Multi-cluster Support**: Deploy to multiple clusters
2. **Progressive Delivery**: Canary/blue-green deployments
3. **Policy Enforcement**: OPA/Gatekeeper integration
4. **Secret Management**: External Secrets Operator
5. **Service Mesh**: Istio integration
6. **Observability**: Distributed tracing
7. **Cost Optimization**: Resource right-sizing
8. **Compliance**: Automated compliance checks

## References

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitOps Principles](https://opengitops.dev/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [12-Factor App](https://12factor.net/)
