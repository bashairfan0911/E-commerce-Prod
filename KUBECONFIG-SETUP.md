# How to Create Kubeconfig for GitHub Actions

## Overview

Kubeconfig is a YAML file that contains information about Kubernetes clusters, users, and authentication. You need to add it as a GitHub secret for automated deployment.

## Option 1: Local Kind Cluster (Development/Testing)

### Step 1: Install Kind
```bash
# On Linux/Mac
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# On Windows (PowerShell)
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```

### Step 2: Create Kind Cluster
```bash
cd kubernetes/Kind-cluster
kind create cluster --name ekomart --config kind-config.yaml
```

### Step 3: Get Kubeconfig
```bash
# Get the kubeconfig
kind get kubeconfig --name ekomart > kind-kubeconfig.yaml

# View it
cat kind-kubeconfig.yaml
```

### Step 4: Encode for GitHub
```bash
# On Linux/Mac
cat kind-kubeconfig.yaml | base64 -w 0

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content kind-kubeconfig.yaml -Raw)))
```

### Step 5: Add to GitHub Secrets
1. Copy the base64 output
2. Go to: https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions
3. Click "New repository secret"
4. Name: `KUBE_CONFIG`
5. Value: Paste the base64 string
6. Click "Add secret"

**Note**: Kind cluster runs locally, so GitHub Actions can't access it. This is only for understanding the process.

---

## Option 2: AWS EKS (Production)

### Step 1: Create EKS Cluster
```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster
eksctl create cluster \
  --name ekomart-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed
```

### Step 2: Get Kubeconfig
```bash
# Update kubeconfig
aws eks update-kubeconfig --name ekomart-cluster --region us-east-1

# View kubeconfig
cat ~/.kube/config
```

### Step 3: Create Service Account for GitHub Actions
```bash
# Create service account
kubectl create serviceaccount github-actions -n kube-system

# Create cluster role binding
kubectl create clusterrolebinding github-actions-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=kube-system:github-actions

# Get service account token (Kubernetes 1.24+)
kubectl create token github-actions -n kube-system --duration=87600h > github-token.txt
```

### Step 4: Create Kubeconfig for Service Account
```bash
# Get cluster info
CLUSTER_NAME=$(kubectl config view --minify -o jsonpath='{.clusters[0].name}')
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CLUSTER_CA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
TOKEN=$(cat github-token.txt)

# Create kubeconfig file
cat > github-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: ${CLUSTER_CA}
    server: ${CLUSTER_SERVER}
  name: ${CLUSTER_NAME}
contexts:
- context:
    cluster: ${CLUSTER_NAME}
    user: github-actions
  name: github-actions-context
current-context: github-actions-context
users:
- name: github-actions
  user:
    token: ${TOKEN}
EOF
```

### Step 5: Encode and Add to GitHub
```bash
# Encode
cat github-kubeconfig.yaml | base64 -w 0

# Add to GitHub Secrets as KUBE_CONFIG
```

---

## Option 3: Google GKE (Production)

### Step 1: Create GKE Cluster
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Create cluster
gcloud container clusters create ekomart-cluster \
  --zone us-central1-a \
  --num-nodes 2 \
  --machine-type n1-standard-2
```

### Step 2: Get Kubeconfig
```bash
# Get credentials
gcloud container clusters get-credentials ekomart-cluster --zone us-central1-a

# View kubeconfig
cat ~/.kube/config
```

### Step 3: Create Service Account
```bash
# Create service account
kubectl create serviceaccount github-actions -n kube-system

# Create cluster role binding
kubectl create clusterrolebinding github-actions-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=kube-system:github-actions

# Get token
kubectl create token github-actions -n kube-system --duration=87600h > github-token.txt
```

### Step 4: Create Kubeconfig (same as EKS Step 4)

---

## Option 4: Azure AKS (Production)

### Step 1: Create AKS Cluster
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name ekomart-rg --location eastus

# Create cluster
az aks create \
  --resource-group ekomart-rg \
  --name ekomart-cluster \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --generate-ssh-keys
```

### Step 2: Get Kubeconfig
```bash
# Get credentials
az aks get-credentials --resource-group ekomart-rg --name ekomart-cluster

# View kubeconfig
cat ~/.kube/config
```

### Step 3: Create Service Account (same as EKS/GKE)

---

## Option 5: Existing Cluster

If you already have a Kubernetes cluster:

### Step 1: Get Current Kubeconfig
```bash
# View your current config
cat ~/.kube/config

# Or get specific cluster
kubectl config view --minify --raw
```

### Step 2: Encode for GitHub
```bash
# On Linux/Mac
cat ~/.kube/config | base64 -w 0

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content ~/.kube/config -Raw)))
```

### Step 3: Add to GitHub Secrets
1. Copy the base64 output
2. Go to GitHub repository settings
3. Add as `KUBE_CONFIG` secret

---

## Security Best Practices

### 1. Use Service Account (Recommended)
- Create dedicated service account for CI/CD
- Limit permissions (don't use cluster-admin in production)
- Use short-lived tokens

### 2. Use RBAC
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: github-actions
  namespace: ekomart
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: github-actions-role
  namespace: ekomart
rules:
- apiGroups: ["", "apps", "networking.k8s.io"]
  resources: ["deployments", "services", "pods", "ingresses", "secrets"]
  verbs: ["get", "list", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: github-actions-binding
  namespace: ekomart
subjects:
- kind: ServiceAccount
  name: github-actions
  namespace: ekomart
roleRef:
  kind: Role
  name: github-actions-role
  apiGroup: rbac.authorization.k8s.io
```

### 3. Rotate Credentials
- Rotate tokens regularly
- Use short expiration times
- Monitor access logs

### 4. Use Secrets Management
- Consider using GitHub OIDC instead of static tokens
- Use external secrets operators
- Encrypt secrets at rest

---

## Quick Start for Testing (Local Kind)

```bash
# 1. Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/

# 2. Create cluster
kind create cluster --name ekomart

# 3. Get kubeconfig
kind get kubeconfig --name ekomart > kind-kubeconfig.yaml

# 4. Test it works
export KUBECONFIG=kind-kubeconfig.yaml
kubectl get nodes

# 5. Encode for GitHub
cat kind-kubeconfig.yaml | base64 -w 0

# 6. Add to GitHub Secrets as KUBE_CONFIG
```

**Note**: Kind cluster is local only. For GitHub Actions to deploy, you need a cloud cluster (EKS, GKE, AKS) or expose your local cluster (not recommended).

---

## Troubleshooting

### Error: "connection refused"
- Cluster is not accessible from GitHub Actions
- Check if cluster endpoint is public
- Verify firewall rules

### Error: "unauthorized"
- Token expired or invalid
- Service account doesn't have permissions
- Check RBAC configuration

### Error: "certificate verify failed"
- Certificate authority data is incorrect
- Cluster CA certificate changed
- Regenerate kubeconfig

---

## Recommended Setup for Production

1. **Use Cloud Provider** (EKS, GKE, or AKS)
2. **Create Service Account** with limited permissions
3. **Use RBAC** for fine-grained access control
4. **Rotate Credentials** regularly
5. **Monitor Deployments** with logging and alerts
6. **Use GitOps** (ArgoCD) for better control

---

## Alternative: Skip Kubernetes Deployment

If you don't want to set up Kubernetes now:

1. The pipeline will skip Kubernetes deployment (no KUBE_CONFIG)
2. Docker images are still built and pushed
3. You can deploy manually using:
   - `docker-compose -f docker-compose.test-dev.yml up`
   - Local Kind cluster
   - Manual kubectl commands

---

## Summary

**For Testing**: Use Kind cluster locally
**For Production**: Use EKS, GKE, or AKS
**For CI/CD**: Create service account with limited permissions
**For Security**: Use RBAC, rotate tokens, monitor access

Choose the option that fits your needs!
