# ArgoCD Files Index

Complete reference guide for all ArgoCD configuration files.

## 📖 Documentation Files

| File | Description | When to Read |
|------|-------------|--------------|
| [README.md](README.md) | Complete setup and configuration guide | Detailed installation |
| [QUICKSTART.md](QUICKSTART.md) | Get started in 3 steps | First time setup |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and design | Understanding the system |
| [SUMMARY.md](SUMMARY.md) | Quick reference and checklist | Quick overview |
| [INDEX.md](INDEX.md) | This file - complete file reference | Finding specific files |

## 🚀 Core Application Files

### Namespace
| File | Purpose | Apply Command |
|------|---------|---------------|
| [namespace.yaml](namespace.yaml) | Creates ekomart namespace | `kubectl apply -f argocd/namespace.yaml` |

### App of Apps Pattern
| File | Purpose | Apply Command |
|------|---------|---------------|
| [app-of-apps.yaml](app-of-apps.yaml) | Manages all applications | `kubectl apply -f argocd/app-of-apps.yaml` |

### Individual Applications
| File | Purpose | Apply Command |
|------|---------|---------------|
| [applications/backend-app.yaml](applications/backend-app.yaml) | Backend application definition | `kubectl apply -f argocd/applications/backend-app.yaml` |
| [applications/frontend-app.yaml](applications/frontend-app.yaml) | Frontend application definition | `kubectl apply -f argocd/applications/frontend-app.yaml` |

### Projects
| File | Purpose | Apply Command |
|------|---------|---------------|
| [projects/ekomart-project.yaml](projects/ekomart-project.yaml) | ArgoCD project with RBAC | `kubectl apply -f argocd/projects/ekomart-project.yaml` |

## 🔧 Configuration Files

### RBAC (Role-Based Access Control)
| File | Purpose | Apply Command |
|------|---------|---------------|
| [argocd-rbac-cm.yaml](argocd-rbac-cm.yaml) | User roles and permissions | `kubectl apply -f argocd/argocd-rbac-cm.yaml` |

**Roles Defined:**
- Admin: Full access
- Developer: Sync and view
- Read-only: View only
- EkoMart-specific: Namespace scoped

### Notifications
| File | Purpose | Apply Command |
|------|---------|---------------|
| [argocd-notifications-cm.yaml](argocd-notifications-cm.yaml) | Slack/email notifications | `kubectl apply -f argocd/argocd-notifications-cm.yaml` |

**Notification Types:**
- Deployment success
- Health degradation
- Sync failures

### ArgoCD Configuration
| File | Purpose | Apply Command |
|------|---------|---------------|
| [argocd-cm-patch.yaml](argocd-cm-patch.yaml) | ArgoCD settings patch | `kubectl patch configmap argocd-cm -n argocd --patch-file argocd/argocd-cm-patch.yaml` |

**Settings:**
- Timeout configurations
- Repository credentials
- Resource customizations

### Ingress
| File | Purpose | Apply Command |
|------|---------|---------------|
| [argocd-ingress.yaml](argocd-ingress.yaml) | Custom domain access | `kubectl apply -f argocd/argocd-ingress.yaml` |

**Provides:**
- HTTPS ingress
- HTTP ingress (testing)
- Custom domain support

## 🖼️ Image Updater Files

### Installation
| File | Purpose | Apply Command |
|------|---------|---------------|
| [image-updater/argocd-image-updater.yaml](image-updater/argocd-image-updater.yaml) | Image updater deployment | `kubectl apply -f argocd/image-updater/argocd-image-updater.yaml` |

### Applications with Auto-Update
| File | Purpose | Apply Command |
|------|---------|---------------|
| [image-updater/backend-app-with-updater.yaml](image-updater/backend-app-with-updater.yaml) | Backend with auto-update | `kubectl apply -f argocd/image-updater/backend-app-with-updater.yaml` |
| [image-updater/frontend-app-with-updater.yaml](image-updater/frontend-app-with-updater.yaml) | Frontend with auto-update | `kubectl apply -f argocd/image-updater/frontend-app-with-updater.yaml` |

### Documentation
| File | Purpose |
|------|---------|
| [image-updater/README.md](image-updater/README.md) | Image updater setup guide |

## 🔨 Scripts

### Installation
| File | Purpose | Command |
|------|---------|---------|
| [install-argocd.sh](install-argocd.sh) | Automated ArgoCD installation | `./argocd/install-argocd.sh` |

**What it does:**
- Installs ArgoCD
- Sets up access (port-forward or NodePort)
- Displays credentials
- Optionally deploys applications

### Uninstallation
| File | Purpose | Command |
|------|---------|---------|
| [uninstall-argocd.sh](uninstall-argocd.sh) | Cleanup script | `./argocd/uninstall-argocd.sh` |

**What it does:**
- Removes ArgoCD applications
- Deletes ArgoCD installation
- Optionally removes namespace

## 📋 Quick Reference

### Basic Setup (3 Commands)
```bash
# 1. Install ArgoCD
./argocd/install-argocd.sh

# 2. Deploy applications
kubectl apply -f argocd/app-of-apps.yaml

# 3. Access ArgoCD
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### With Image Auto-Update (4 Commands)
```bash
# 1. Install ArgoCD
./argocd/install-argocd.sh

# 2. Install Image Updater
kubectl apply -f argocd/image-updater/argocd-image-updater.yaml

# 3. Deploy applications with auto-update
kubectl apply -f argocd/image-updater/backend-app-with-updater.yaml
kubectl apply -f argocd/image-updater/frontend-app-with-updater.yaml

# 4. Access ArgoCD
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### Full Setup with All Features
```bash
# 1. Install ArgoCD
./argocd/install-argocd.sh

# 2. Configure RBAC
kubectl apply -f argocd/argocd-rbac-cm.yaml

# 3. Configure notifications
kubectl apply -f argocd/argocd-notifications-cm.yaml

# 4. Patch ArgoCD config
kubectl patch configmap argocd-cm -n argocd --patch-file argocd/argocd-cm-patch.yaml

# 5. Install Image Updater
kubectl apply -f argocd/image-updater/argocd-image-updater.yaml

# 6. Deploy applications
kubectl apply -f argocd/app-of-apps.yaml

# 7. (Optional) Set up Ingress
kubectl apply -f argocd/argocd-ingress.yaml
```

## 🎯 File Selection Guide

### I want to...

**Get started quickly**
→ Read [QUICKSTART.md](QUICKSTART.md)

**Understand the architecture**
→ Read [ARCHITECTURE.md](ARCHITECTURE.md)

**Install ArgoCD**
→ Run [install-argocd.sh](install-argocd.sh)

**Deploy applications**
→ Apply [app-of-apps.yaml](app-of-apps.yaml)

**Enable auto-deployment**
→ Apply [image-updater/argocd-image-updater.yaml](image-updater/argocd-image-updater.yaml)

**Configure notifications**
→ Edit and apply [argocd-notifications-cm.yaml](argocd-notifications-cm.yaml)

**Set up RBAC**
→ Apply [argocd-rbac-cm.yaml](argocd-rbac-cm.yaml)

**Use custom domain**
→ Apply [argocd-ingress.yaml](argocd-ingress.yaml)

**Remove everything**
→ Run [uninstall-argocd.sh](uninstall-argocd.sh)

## 📊 File Dependencies

```
install-argocd.sh
    ↓
namespace.yaml
    ↓
projects/ekomart-project.yaml (optional)
    ↓
app-of-apps.yaml
    ↓
    ├── applications/backend-app.yaml
    └── applications/frontend-app.yaml

Optional:
├── argocd-rbac-cm.yaml
├── argocd-notifications-cm.yaml
├── argocd-cm-patch.yaml
├── argocd-ingress.yaml
└── image-updater/
    ├── argocd-image-updater.yaml
    ├── backend-app-with-updater.yaml
    └── frontend-app-with-updater.yaml
```

## 🔍 File Categories

### Essential (Must Have)
- ✅ namespace.yaml
- ✅ app-of-apps.yaml OR applications/*.yaml
- ✅ install-argocd.sh

### Recommended
- ⭐ projects/ekomart-project.yaml
- ⭐ argocd-rbac-cm.yaml
- ⭐ README.md / QUICKSTART.md

### Optional (Based on Needs)
- 🔧 argocd-notifications-cm.yaml (if you want alerts)
- 🔧 image-updater/* (if you want auto-deployment)
- 🔧 argocd-ingress.yaml (if you want custom domain)
- 🔧 argocd-cm-patch.yaml (for advanced config)

### Documentation
- 📚 README.md
- 📚 QUICKSTART.md
- 📚 ARCHITECTURE.md
- 📚 SUMMARY.md
- 📚 INDEX.md (this file)

## 🔗 External Resources

- **ArgoCD Official Docs**: https://argo-cd.readthedocs.io/
- **Image Updater Docs**: https://argocd-image-updater.readthedocs.io/
- **GitOps Principles**: https://opengitops.dev/
- **Kubernetes Docs**: https://kubernetes.io/docs/

## 📝 Notes

- All YAML files are ready to use
- Scripts need execute permissions: `chmod +x *.sh`
- Update Git repository URLs before applying
- Configure secrets before enabling notifications/image-updater
- Test in development environment first

## ✅ Verification Commands

```bash
# Check ArgoCD installation
kubectl get pods -n argocd

# Check applications
kubectl get applications -n argocd

# Check deployments
kubectl get pods -n ekomart

# Check services
kubectl get svc -n ekomart

# Check image updater
kubectl get pods -n argocd -l app=argocd-image-updater
```

---

**Need help? Start with [QUICKSTART.md](QUICKSTART.md) for a 3-step setup!**
