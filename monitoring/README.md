# Monitoring Stack for EkoMart

This directory contains Prometheus and Grafana monitoring configuration for the EkoMart application.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert management and notifications
- **Node Exporter**: Hardware and OS metrics
- **Kube State Metrics**: Kubernetes cluster metrics

## Files

- `install.yaml` - Installation instructions
- `values.yaml` - Custom Helm values for monitoring stack
- `servicemonitor-backend.yaml` - Backend service monitoring
- `servicemonitor-frontend.yaml` - Frontend service monitoring
- `grafana-dashboard-ekomart.yaml` - Custom EkoMart dashboard
- `alerts.yaml` - Prometheus alert rules

## Quick Setup

### 1. Install Helm

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

### 2. Add Helm Repositories

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

### 3. Create Monitoring Namespace

```bash
kubectl create namespace monitoring
```

### 4. Install Monitoring Stack

**Option A: Default installation**
```bash
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

**Option B: With custom values**
```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f monitoring/values.yaml
```

### 5. Wait for Pods to be Ready

```bash
kubectl wait --for=condition=ready pod --all -n monitoring --timeout=300s
```

### 6. Deploy Service Monitors

```bash
kubectl apply -f monitoring/servicemonitor-backend.yaml
kubectl apply -f monitoring/servicemonitor-frontend.yaml
```

### 7. Deploy Alert Rules

```bash
kubectl apply -f monitoring/alerts.yaml
```

### 8. Deploy Custom Dashboard

```bash
kubectl apply -f monitoring/grafana-dashboard-ekomart.yaml
```

## Access Monitoring Services

### Prometheus

```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```

Access at: http://localhost:9090

### Grafana

```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

Access at: http://localhost:3000

**Get Grafana password:**
```bash
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d; echo
```

- **Username**: `admin`
- **Password**: (from above command)

### Alertmanager

```bash
# Port forward
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-alertmanager 9093:9093
```

Access at: http://localhost:9093

## Pre-configured Dashboards

Grafana comes with several pre-configured dashboards:

1. **Kubernetes Cluster Monitoring** (ID: 7249)
   - Overall cluster health
   - Node resources
   - Pod status

2. **Kubernetes Pods** (ID: 6417)
   - Pod CPU and memory usage
   - Network I/O
   - Storage metrics

3. **Node Exporter Full** (ID: 1860)
   - Detailed node metrics
   - System resources
   - Hardware information

4. **EkoMart Application Dashboard** (Custom)
   - Backend/Frontend pod status
   - CPU and memory usage
   - Pod restart counts

## Metrics Available

### Application Metrics

- Pod status and health
- CPU usage per pod
- Memory usage per pod
- Network traffic
- Pod restart counts
- Container resource limits

### Cluster Metrics

- Node CPU and memory
- Disk usage
- Network bandwidth
- API server metrics
- etcd metrics

## Alert Rules

The following alerts are configured:

1. **EkoMartPodDown** (Critical)
   - Triggers when a pod is not running for 5 minutes

2. **EkoMartHighCPU** (Warning)
   - Triggers when CPU usage exceeds 80% for 10 minutes

3. **EkoMartHighMemory** (Warning)
   - Triggers when memory usage exceeds 90% for 10 minutes

4. **EkoMartPodRestarting** (Warning)
   - Triggers when pods restart frequently

5. **EkoMartBackendUnavailable** (Critical)
   - Triggers when backend metrics are unavailable

6. **EkoMartFrontendUnavailable** (Critical)
   - Triggers when frontend metrics are unavailable

## Useful Commands

### Check Monitoring Stack Status

```bash
# Check all pods
kubectl get pods -n monitoring

# Check services
kubectl get svc -n monitoring

# Check service monitors
kubectl get servicemonitor -n ekomart

# Check prometheus rules
kubectl get prometheusrule -n monitoring
```

### View Metrics

```bash
# Query Prometheus
curl http://localhost:9090/api/v1/query?query=up

# Check targets
curl http://localhost:9090/api/v1/targets
```

### Troubleshooting

```bash
# Check Prometheus logs
kubectl logs -n monitoring -l app.kubernetes.io/name=prometheus

# Check Grafana logs
kubectl logs -n monitoring -l app.kubernetes.io/name=grafana

# Describe service monitor
kubectl describe servicemonitor backend-monitor -n ekomart
```

## Customization

### Add Custom Metrics

Edit your application to expose metrics endpoint:

**Backend (Node.js with prom-client):**
```javascript
const promClient = require('prom-client');
const register = new promClient.Registry();

// Create metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

### Modify Alert Rules

Edit `monitoring/alerts.yaml` and apply:
```bash
kubectl apply -f monitoring/alerts.yaml
```

### Update Grafana Dashboards

1. Access Grafana UI
2. Create/modify dashboard
3. Export JSON
4. Update `grafana-dashboard-ekomart.yaml`
5. Apply changes

## Retention and Storage

Default retention: 7 days

To modify:
```yaml
# In values.yaml
prometheus:
  prometheusSpec:
    retention: 15d  # Change to 15 days
    storageSpec:
      volumeClaimTemplate:
        spec:
          resources:
            requests:
              storage: 20Gi  # Increase storage
```

Apply changes:
```bash
helm upgrade prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f monitoring/values.yaml
```

## Uninstall

```bash
# Delete service monitors
kubectl delete -f monitoring/servicemonitor-backend.yaml
kubectl delete -f monitoring/servicemonitor-frontend.yaml

# Delete alert rules
kubectl delete -f monitoring/alerts.yaml

# Uninstall Helm release
helm uninstall prometheus -n monitoring

# Delete namespace
kubectl delete namespace monitoring
```

## Best Practices

1. **Set resource limits** for Prometheus and Grafana
2. **Configure retention** based on your needs
3. **Enable persistence** for production environments
4. **Set up alerting** for critical metrics
5. **Regular backup** of Grafana dashboards
6. **Monitor the monitoring stack** itself
7. **Use service monitors** for automatic discovery

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
- [Prometheus Operator](https://prometheus-operator.dev/)
