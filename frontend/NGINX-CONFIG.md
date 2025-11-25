# Nginx Configuration Files

This directory contains two nginx configuration files for different deployment scenarios:

## nginx.ingress.conf (Default - Used by Dockerfile)

**Used for:** Kubernetes with Ingress

**How it works:**
- Serves static files only
- No API proxying
- Kubernetes Ingress handles routing `/api/*` to backend service

**Access:** http://localhost (via Ingress)

**Routing flow:**
```
Browser → Ingress Controller
  ├─ / → Frontend nginx → Static files
  └─ /api/* → Backend service → API
```

## nginx.conf (Alternative - For NodePort/Docker Compose)

**Used for:** Docker Compose or Kubernetes NodePort without Ingress

**How it works:**
- Serves static files
- Proxies `/api/*` requests to backend
- Self-contained routing

**Access:** http://localhost:31000 (NodePort) or http://localhost:8080 (Docker Compose)

**To use this config:**
1. Edit `frontend/Dockerfile`
2. Change: `COPY nginx.ingress.conf` → `COPY nginx.conf`
3. Rebuild image

## Which Config to Use?

| Deployment Type | Config File | Access URL |
|----------------|-------------|------------|
| **Kubernetes + Ingress** (Recommended) | `nginx.ingress.conf` | http://localhost |
| **Kubernetes NodePort** | `nginx.conf` | http://localhost:31000 |
| **Docker Compose** | `nginx.conf` | http://localhost:8080 |
| **AWS EC2** | `nginx.conf` | http://your-ip:31000 |
