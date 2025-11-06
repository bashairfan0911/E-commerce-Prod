# ArgoCD Image Updater

Automatically update container images in your ArgoCD applications when new versions are pushed to the registry.

## Installation

### 1. Install ArgoCD Image Updater

```bash
kubectl apply -f argocd/image-updater/argocd-image-updater.yaml
```

### 2. Configure Docker Hub Credentials (if using private registry)

```bash
# Create secret with Docker Hub credentials
kubectl create secret generic docker-config \
  --from-literal=creds=username:password \
  -n argocd
```

### 3. Deploy Applications with Image Updater

```bash
# Deploy backend with image updater
kubectl apply -f argocd/image-updater/backend-app-with-updater.yaml

# Deploy frontend with image updater
kubectl apply -f argocd/image-updater/frontend-app-with-updater.yaml
```

## How It Works

1. **CI/CD Pipeline** builds and pushes new images with tags like `test-dev-abc123`
2. **Image Updater** polls Docker Hub every 2 minutes
3. **Detects new images** matching the tag pattern `test-dev-.*`
4. **Updates ArgoCD application** with the new image tag
5. **ArgoCD syncs** the application automatically

## Configuration

### Image List Annotation

```yaml
argocd-image-updater.argoproj.io/image-list: backend=bashairfan0911/ekomart-backend:test-dev
```

Format: `<alias>=<image_name>:<current_tag>`

### Update Strategy

```yaml
# Use latest tag
argocd-image-updater.argoproj.io/backend.update-strategy: latest

# Or use semver
argocd-image-updater.argoproj.io/backend.update-strategy: semver
```

### Tag Filtering

```yaml
# Allow only tags matching pattern
argocd-image-updater.argoproj.io/backend.allow-tags: regexp:^test-dev-.*$

# Or specific tags
argocd-image-updater.argoproj.io/backend.allow-tags: glob:test-dev-*
```

### Write-Back Methods

#### ArgoCD (Recommended for testing)
```yaml
argocd-image-updater.argoproj.io/write-back-method: argocd
```
Updates the application spec directly in ArgoCD (doesn't modify Git).

#### Git (Recommended for production)
```yaml
argocd-image-updater.argoproj.io/write-back-method: git
argocd-image-updater.argoproj.io/git-branch: main
```
Commits changes back to Git repository.

## Verify Image Updater

```bash
# Check image updater logs
kubectl logs -n argocd -l app=argocd-image-updater -f

# Check application annotations
kubectl get app ekomart-backend -n argocd -o yaml | grep image-updater

# Check current image version
kubectl get app ekomart-backend -n argocd -o jsonpath='{.status.summary.images}'
```

## Integration with CI/CD

Your GitHub Actions workflow should tag images with a pattern that Image Updater can detect:

```yaml
# In .github/workflows/ci-cd.yml
tags: |
  type=raw,value=test-dev
  type=sha,prefix=test-dev-
```

This creates tags like:
- `test-dev` (latest)
- `test-dev-abc1234` (commit SHA)

## Troubleshooting

### Image not updating

1. Check image updater logs:
```bash
kubectl logs -n argocd -l app=argocd-image-updater
```

2. Verify registry credentials:
```bash
kubectl get secret docker-config -n argocd
```

3. Check application annotations:
```bash
kubectl describe app ekomart-backend -n argocd
```

### Authentication errors

For private registries, ensure credentials are correct:
```bash
kubectl create secret generic docker-config \
  --from-literal=creds=username:token \
  -n argocd --dry-run=client -o yaml | kubectl apply -f -
```

## Disable Image Updater

To disable for a specific application, remove the annotations:

```bash
kubectl annotate app ekomart-backend \
  argocd-image-updater.argoproj.io/image-list- \
  -n argocd
```

## Best Practices

1. **Use specific tag patterns** to avoid unwanted updates
2. **Test in dev environment** before enabling in production
3. **Use Git write-back** for production to maintain audit trail
4. **Monitor image updater logs** for issues
5. **Set appropriate update intervals** (default: 2 minutes)
6. **Use pull secrets** for private registries
7. **Implement proper tagging strategy** in CI/CD

## Additional Resources

- [ArgoCD Image Updater Docs](https://argocd-image-updater.readthedocs.io/)
- [Configuration Options](https://argocd-image-updater.readthedocs.io/en/stable/configuration/applications/)
