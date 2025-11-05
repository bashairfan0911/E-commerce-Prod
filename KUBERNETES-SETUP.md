# Kubernetes Deployment Setup

## ✅ Existing GitHub Secrets

You already have these secrets configured:
- ✅ `CLOUD_API_KEY`
- ✅ `CLOUD_API_SECRET_KEY`
- ✅ `CLOUD_NAME`
- ✅ `DBURI`
- ✅ `DOCKER_PASSWORD`
- ✅ `DOCKER_USERNAME`
- ✅ `JWT_SECRET_KEY`
- ✅ `SONAR_HOST_URL`
- ✅ `SONAR_TOKEN`

## 🔧 Additional Secrets Needed for Kubernetes

Add these secrets to your GitHub repository:

### 1. KUBE_CONFIG (Required for CI/CD deployment)

**What it is**: Your Kubernetes cluster configuration file

**How to get it**:
```bash
# Get your kubeconfig
cat ~/.kube/config | base64 -w 0

# Or on Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content ~/.kube/config -Raw)))
```

**Add to GitHub**:
1. Go to: https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions
2. Click "New repository secret"
3. Name: `KUBE_CONFIG`
4. Value: Paste the base64 encoded kubeconfig
5. Click "Add secret"

### 2. KEY_ID (Razorpay - Optional)

**What it is**: Razorpay API Key ID

**Add to GitHub**:
1. Name: `KEY_ID`
2. Value: Your Razorpay key ID (or use placeholder: `your_razorpay_key_id`)

### 3. KEY_SECRET (Razorpay - Optional)

**What it is**: Razorpay API Key Secret

**Add to GitHub**:
1. Name: `KEY_SECRET`
2. Value: Your Razorpay key secret (or use placeholder: `your_razorpay_key_secret`)

### 4. MONGODB_URI (Alias for DBURI)

**Note**: The CI/CD workflow uses `MONGODB_URI` but you have `DBURI`. 

**Option A**: Add alias secret
1. Name: `MONGODB_URI`
2. Value: Same as your `DBURI` value

**Option B**: I'll update the workflow to use `DBURI` instead

## 🚀 Quick Setup Options

### Option 1: Skip Kubernetes Deployment (Current State)

The Kubernetes deployment job has `continue-on-error: true`, so:
- ✅ Pipeline will complete successfully
- ✅ Docker images will be built and pushed
- ⚠️ Kubernetes deployment will be skipped (no KUBE_CONFIG)

**No action needed** - Everything else works!

### Option 2: Enable Kubernetes Deployment

**If you have a Kubernetes cluster**:

1. Add `KUBE_CONFIG` secret (see above)
2. Add `KEY_ID` and `KEY_SECRET` (or use placeholders)
3. Add `MONGODB_URI` (or I'll update workflow to use `DBURI`)
4. Push to test-dev
5. ✅ Full deployment to Kubernetes!

**If you don't have a Kubernetes cluster**:
- Use local Kind cluster (see `kubernetes/Kind-cluster/`)
- Or deploy to cloud (AWS EKS, GKE, AKS)
- Or skip Kubernetes for now

## 🔄 Update Workflow to Use Existing Secrets

I can update the workflow to use your existing secret names:
- `DBURI` instead of `MONGODB_URI`
- Make Razorpay keys optional

Would you like me to do that?

## 📋 Current Status

### Working ✅
- Security scanning
- OWASP dependency check
- SonarQube analysis (with continue-on-error)
- Docker image build and push
- All tests passing

### Optional ⚠️
- Kubernetes deployment (needs KUBE_CONFIG)
- Razorpay integration (needs KEY_ID, KEY_SECRET)

## 🎯 Recommended Actions

### For Now (Minimal Setup)
1. **Do nothing** - Pipeline works without Kubernetes deployment
2. Docker images are built and pushed successfully
3. You can deploy manually using `docker-compose` or Kind cluster

### For Full Automation (Complete Setup)
1. Set up Kubernetes cluster (Kind, EKS, GKE, or AKS)
2. Add `KUBE_CONFIG` secret
3. Add Razorpay secrets (or use placeholders)
4. Pipeline will automatically deploy to Kubernetes

## 🛠️ Manual Deployment Options

### Option A: Docker Compose (Easiest)
```bash
docker-compose -f docker-compose.test-dev.yml up -d
```

### Option B: Kind Cluster (Local Kubernetes)
```bash
cd kubernetes/Kind-cluster
kind create cluster --config kind-config.yaml
kubectl apply -f backend-kind.yaml
kubectl apply -f frontend-kind.yaml
```

### Option C: Production Kubernetes
```bash
cd kubernetes/production
./deploy.sh
```

## 📞 Next Steps

**Choose one**:

1. **Keep current setup** - Everything works, Kubernetes is optional
2. **Add KUBE_CONFIG** - Enable automatic Kubernetes deployment
3. **Update workflow** - Use existing secret names (DBURI instead of MONGODB_URI)

Let me know which option you prefer!

---

**Current Pipeline Status**: ✅ Working (Docker images built and pushed)  
**Kubernetes Deployment**: ⚠️ Optional (needs KUBE_CONFIG)  
**Recommendation**: Keep current setup or add KUBE_CONFIG if you have a cluster
