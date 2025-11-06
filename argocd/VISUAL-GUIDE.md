# ArgoCD Visual Guide

Visual diagrams and flowcharts to help you understand the ArgoCD setup.

## 📁 Directory Structure

```
argocd/
│
├── 📚 Documentation/
│   ├── README.md                    # Complete setup guide
│   ├── QUICKSTART.md                # 3-step quick start
│   ├── GETTING-STARTED.md           # Beginner guide
│   ├── ARCHITECTURE.md              # System architecture
│   ├── SUMMARY.md                   # Quick reference
│   ├── INDEX.md                     # File reference
│   └── VISUAL-GUIDE.md              # This file
│
├── 🚀 Core Application Files/
│   ├── namespace.yaml               # Creates ekomart namespace
│   ├── app-of-apps.yaml            # Manages all applications
│   │
│   ├── applications/
│   │   ├── backend-app.yaml        # Backend application
│   │   └── frontend-app.yaml       # Frontend application
│   │
│   └── projects/
│       └── ekomart-project.yaml    # ArgoCD project with RBAC
│
├── 🔧 Configuration Files/
│   ├── argocd-rbac-cm.yaml         # User roles & permissions
│   ├── argocd-notifications-cm.yaml # Slack/email alerts
│   ├── argocd-cm-patch.yaml        # ArgoCD settings
│   └── argocd-ingress.yaml         # Custom domain access
│
├── 🖼️ Image Updater/
│   ├── argocd-image-updater.yaml   # Image updater deployment
│   ├── backend-app-with-updater.yaml
│   ├── frontend-app-with-updater.yaml
│   └── README.md                    # Image updater docs
│
└── 🔨 Scripts/
    ├── install-argocd.sh            # Automated installation
    └── uninstall-argocd.sh          # Cleanup script
```

## 🔄 GitOps Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

    Developer                Git Repository           ArgoCD
        │                          │                     │
        │  1. Code Changes         │                     │
        ├─────────────────────────>│                     │
        │                          │                     │
        │                          │  2. Detects Change  │
        │                          ├────────────────────>│
        │                          │                     │
        │                          │  3. Pulls Manifests │
        │                          │<────────────────────┤
        │                          │                     │
        │                          │  4. Syncs to K8s    │
        │                          │                     ├──────┐
        │                          │                     │      │
        │                          │                     │<─────┘
        │                          │                     │
        │  5. Verify Deployment    │                     │
        │<─────────────────────────┴─────────────────────┘
        │
```

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │  Security  │→ │   Build &  │→ │  Push to   │                 │
│  │  Scanning  │  │    Test    │  │ Docker Hub │                 │
│  └────────────┘  └────────────┘  └──────┬─────┘                 │
└────────────────────────────────────────────┼──────────────────────┘
                                             │
                                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                        DOCKER HUB                                 │
│  bashairfan0911/ekomart-backend:test-dev-abc123                  │
│  bashairfan0911/ekomart-frontend:test-dev-abc123                 │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                   ARGOCD IMAGE UPDATER                            │
│  • Polls every 2 minutes                                         │
│  • Detects new images                                            │
│  • Updates ArgoCD apps                                           │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                         ARGOCD                                    │
│  ┌────────────────────────────────────────────────┐             │
│  │  • Monitors Git repository                     │             │
│  │  • Syncs desired state to cluster              │             │
│  │  • Self-heals on drift                         │             │
│  │  • Provides rollback capability                │             │
│  └────────────────────────────────────────────────┘             │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Namespace: ekomart                              │           │
│  │  ┌────────────────┐      ┌────────────────┐    │           │
│  │  │    Backend     │      │    Frontend    │    │           │
│  │  │  Deployment    │      │  Deployment    │    │           │
│  │  │  Port: 31100   │      │  Port: 31000   │    │           │
│  │  └────────────────┘      └────────────────┘    │           │
│  └──────────────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

## 🎯 Deployment Flow

### Manual Deployment

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Code   │────>│   Git   │────>│ ArgoCD  │────>│  K8s    │
│ Change  │     │  Commit │     │  Sync   │     │ Cluster │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
    │               │                │               │
    │               │                │               │
    └───────────────┴────────────────┴───────────────┘
              Developer Actions Required
```

### Automated Deployment (with Image Updater)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Code   │────>│   CI    │────>│  Image  │────>│ ArgoCD  │────>│  K8s    │
│ Change  │     │  Build  │     │ Updater │     │  Sync   │     │ Cluster │
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
    │               │                │                │               │
    │               │                │                │               │
    └───────────────┴────────────────┴────────────────┴───────────────┘
                    Fully Automated - No Manual Steps
```

## 🔐 RBAC Structure

```
┌──────────────────────────────────────────────────────────────┐
│                      ARGOCD RBAC                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Admin    │  │  Developer  │  │  Read-Only  │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ • Create    │  │ • View      │  │ • View      │         │
│  │ • Update    │  │ • Sync      │  │             │         │
│  │ • Delete    │  │ • Rollback  │  │             │         │
│  │ • Sync      │  │             │  │             │         │
│  │ • Rollback  │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │         EkoMart-Specific Roles                  │        │
│  ├─────────────────────────────────────────────────┤        │
│  │ • Scoped to ekomart namespace only              │        │
│  │ • Can't access other applications               │        │
│  └─────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

## 📊 Application Sync States

```
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION STATES                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐                                               │
│  │  Synced  │  ✓ Git matches Cluster                       │
│  └──────────┘  ✓ All resources healthy                     │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                               │
│  │Out of    │  ⚠ Git differs from Cluster                  │
│  │Sync      │  → Auto-sync will fix (if enabled)           │
│  └──────────┘  → Manual sync required (if disabled)        │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                               │
│  │Syncing   │  ⏳ Applying changes to cluster              │
│  └──────────┘  ⏳ Waiting for resources to be ready        │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                               │
│  │ Healthy  │  ✓ All pods running                          │
│  └──────────┘  ✓ Services available                        │
│       │        ✓ Ready to serve traffic                    │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐                                               │
│  │Degraded  │  ✗ Some pods failing                         │
│  └──────────┘  ✗ Resources not ready                       │
│                → Self-heal will retry (if enabled)          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Self-Healing Process

```
┌─────────────────────────────────────────────────────────────┐
│                    SELF-HEALING FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Desired State (Git)                                     │
│     ┌──────────────────────┐                               │
│     │ replicas: 3          │                               │
│     │ image: backend:v2    │                               │
│     └──────────────────────┘                               │
│              │                                               │
│              ▼                                               │
│  2. Actual State (Cluster)                                  │
│     ┌──────────────────────┐                               │
│     │ replicas: 2          │  ← Someone deleted a pod      │
│     │ image: backend:v2    │                               │
│     └──────────────────────┘                               │
│              │                                               │
│              ▼                                               │
│  3. ArgoCD Detects Drift                                    │
│     ┌──────────────────────┐                               │
│     │ ⚠ Out of Sync        │                               │
│     └──────────────────────┘                               │
│              │                                               │
│              ▼                                               │
│  4. Self-Heal Triggered                                     │
│     ┌──────────────────────┐                               │
│     │ Creating missing pod │                               │
│     └──────────────────────┘                               │
│              │                                               │
│              ▼                                               │
│  5. State Restored                                          │
│     ┌──────────────────────┐                               │
│     │ ✓ replicas: 3        │                               │
│     │ ✓ image: backend:v2  │                               │
│     └──────────────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎬 Installation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              INSTALLATION PROCESS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Run install-argocd.sh                              │
│  ┌──────────────────────────────────────────┐              │
│  │ • Creates argocd namespace               │              │
│  │ • Installs ArgoCD components             │              │
│  │ • Waits for pods to be ready             │              │
│  │ • Sets up access (port-forward/NodePort) │              │
│  │ • Displays admin credentials             │              │
│  └──────────────────────────────────────────┘              │
│              │                                               │
│              ▼                                               │
│  Step 2: Deploy Applications                                │
│  ┌──────────────────────────────────────────┐              │
│  │ • Creates ekomart namespace              │              │
│  │ • Deploys backend application            │              │
│  │ • Deploys frontend application           │              │
│  │ • Configures services                    │              │
│  └──────────────────────────────────────────┘              │
│              │                                               │
│              ▼                                               │
│  Step 3: Verify Deployment                                  │
│  ┌──────────────────────────────────────────┐              │
│  │ • Check ArgoCD UI                        │              │
│  │ • Verify applications are synced         │              │
│  │ • Test frontend (port 31000)             │              │
│  │ • Test backend (port 31100)              │              │
│  └──────────────────────────────────────────┘              │
│              │                                               │
│              ▼                                               │
│  ✓ Installation Complete!                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🔔 Notification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  NOTIFICATION SYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Event Occurs                                               │
│  ┌──────────────┐                                           │
│  │ Deployment   │                                           │
│  │ Sync Failed  │                                           │
│  │ Health Issue │                                           │
│  └──────┬───────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ArgoCD Notifications                                       │
│  ┌──────────────────────────────────┐                      │
│  │ • Checks notification triggers   │                      │
│  │ • Formats message                │                      │
│  │ • Sends to configured channels   │                      │
│  └──────┬───────────────────────────┘                      │
│         │                                                    │
│         ├─────────────┬─────────────┐                      │
│         ▼             ▼             ▼                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │  Slack   │  │  Email   │  │ Webhook  │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│         │             │             │                       │
│         └─────────────┴─────────────┘                      │
│                       │                                      │
│                       ▼                                      │
│              Team Notified                                  │
└─────────────────────────────────────────────────────────────┘
```

## 🖼️ Image Update Flow

```
┌─────────────────────────────────────────────────────────────┐
│              IMAGE UPDATER WORKFLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CI/CD pushes new image                                  │
│     ┌──────────────────────────────────┐                   │
│     │ backend:test-dev-abc123          │                   │
│     └──────────────────────────────────┘                   │
│              │                                               │
│              ▼                                               │
│  2. Image Updater polls registry (every 2 min)             │
│     ┌──────────────────────────────────┐                   │
│     │ Checking for new images...       │                   │
│     └──────────────────────────────────┘                   │
│              │                                               │
│              ▼                                               │
│  3. New image detected                                      │
│     ┌──────────────────────────────────┐                   │
│     │ ✓ Found: backend:test-dev-abc123 │                   │
│     └──────────────────────────────────┘                   │
│              │                                               │
│              ▼                                               │
│  4. Updates ArgoCD application                              │
│     ┌──────────────────────────────────┐                   │
│     │ Updating image tag in app spec   │                   │
│     └──────────────────────────────────┘                   │
│              │                                               │
│              ▼                                               │
│  5. ArgoCD syncs to cluster                                 │
│     ┌──────────────────────────────────┐                   │
│     │ Deploying new version...         │                   │
│     └──────────────────────────────────┘                   │
│              │                                               │
│              ▼                                               │
│  6. Application updated                                     │
│     ┌──────────────────────────────────┐                   │
│     │ ✓ Running: backend:test-dev-abc123│                  │
│     └──────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Quick Reference

### File Purpose Matrix

| File | Install | Deploy | Configure | Monitor |
|------|---------|--------|-----------|---------|
| install-argocd.sh | ✓ | | | |
| namespace.yaml | | ✓ | | |
| app-of-apps.yaml | | ✓ | | |
| applications/*.yaml | | ✓ | | |
| argocd-rbac-cm.yaml | | | ✓ | |
| argocd-notifications-cm.yaml | | | ✓ | ✓ |
| image-updater/*.yaml | | ✓ | ✓ | |

### Command Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMON COMMANDS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Install ArgoCD                                             │
│  $ ./argocd/install-argocd.sh                               │
│                                                              │
│  Deploy Applications                                        │
│  $ kubectl apply -f argocd/app-of-apps.yaml                 │
│                                                              │
│  Access ArgoCD UI                                           │
│  $ kubectl port-forward svc/argocd-server -n argocd 8080:443│
│                                                              │
│  Get Admin Password                                         │
│  $ kubectl -n argocd get secret argocd-initial-admin-secret \│
│    -o jsonpath="{.data.password}" | base64 -d               │
│                                                              │
│  Check Application Status                                   │
│  $ kubectl get applications -n argocd                       │
│                                                              │
│  Sync Application                                           │
│  $ argocd app sync ekomart-backend                          │
│                                                              │
│  View Application Details                                   │
│  $ argocd app get ekomart-backend                           │
│                                                              │
│  Rollback Application                                       │
│  $ argocd app rollback ekomart-backend                      │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Documentation Map

```
Start Here
    │
    ├─ New to ArgoCD?
    │  └─> GETTING-STARTED.md
    │
    ├─ Want quick setup?
    │  └─> QUICKSTART.md
    │
    ├─ Need complete guide?
    │  └─> README.md
    │
    ├─ Want to understand architecture?
    │  └─> ARCHITECTURE.md
    │
    ├─ Need quick reference?
    │  └─> SUMMARY.md
    │
    ├─ Looking for specific file?
    │  └─> INDEX.md
    │
    └─ Want visual diagrams?
       └─> VISUAL-GUIDE.md (this file)
```

---

**This visual guide helps you understand the ArgoCD setup at a glance!**

For detailed instructions, see:
- [Getting Started Guide](GETTING-STARTED.md)
- [Quick Start](QUICKSTART.md)
- [Complete Documentation](README.md)
