# EkoMart Helm Chart

A Helm chart for deploying the EkoMart E-commerce Platform on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+

## Installation

### Install the chart

```bash
# Install with default values
helm install ekomart ./helm/ekomart

# Install with custom values
helm install ekomart ./helm/ekomart -f custom-values.yaml

# Install in a specific namespace
helm install ekomart ./helm/ekomart --namespace ekomart --create-namespace
```

### Upgrade the chart

```bash
helm upgrade ekomart ./helm/ekomart
```

### Uninstall the chart

```bash
helm uninstall ekomart
```

## Configuration

The following table lists the configurable parameters and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `namespace` | Kubernetes namespace | `ekomart` |
| `backend.enabled` | Enable backend deployment | `true` |
| `backend.replicaCount` | Number of backend replicas | `1` |
| `backend.image.repository` | Backend image repository | `irfan8194/ecommerce-backend` |
| `backend.image.tag` | Backend image tag | `latest` |
| `backend.service.type` | Backend service type | `LoadBalancer` |
| `backend.service.port` | Backend service port | `5000` |
| `frontend.enabled` | Enable frontend deployment | `true` |
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend image repository | `irfan8194/ecommerce-frontend` |
| `frontend.image.tag` | Frontend image tag | `v1.14` |
| `frontend.service.type` | Frontend service type | `LoadBalancer` |
| `frontend.service.port` | Frontend service port | `80` |
| `ingress.enabled` | Enable ingress | `false` |

## Custom Values Example

Create a `custom-values.yaml` file:

```yaml
backend:
  replicaCount: 2
  env:
    dbUri: "your-mongodb-connection-string"
    jwtSecretKey: "your-jwt-secret"

frontend:
  replicaCount: 2
  env:
    viteApiPath: "https://api.yourdomain.com"

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: ekomart.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
          service: frontend
```

Then install:

```bash
helm install ekomart ./helm/ekomart -f custom-values.yaml
```

## Accessing the Application

After installation, get the service URLs:

```bash
# Get frontend URL
kubectl get svc frontend-service -n ekomart

# Get backend URL
kubectl get svc backend-service -n ekomart
```

## Notes

- Update the `backend.env.dbUri` with your MongoDB connection string
- Update the `frontend.env.viteApiPath` with your backend service URL
- For production, consider using Secrets for sensitive data
- Enable ingress for production deployments with proper domain configuration
