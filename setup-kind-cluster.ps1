# PowerShell script to set up Kind cluster and generate kubeconfig for GitHub

Write-Host "========================================" -ForegroundColor Green
Write-Host "EkoMart Kind Cluster Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if Kind is installed
Write-Host "Checking Kind..." -ForegroundColor Yellow
if (Get-Command kind -ErrorAction SilentlyContinue) {
    Write-Host "✓ Kind is already installed" -ForegroundColor Green
} else {
    Write-Host "Installing Kind..." -ForegroundColor Yellow
    
    # Download Kind
    $kindVersion = "v0.20.0"
    $kindUrl = "https://kind.sigs.k8s.io/dl/$kindVersion/kind-windows-amd64"
    $kindPath = "$env:USERPROFILE\kind.exe"
    
    try {
        Invoke-WebRequest -Uri $kindUrl -OutFile $kindPath
        
        # Add to PATH for current session
        $env:Path += ";$env:USERPROFILE"
        
        Write-Host "✓ Kind installed successfully" -ForegroundColor Green
        Write-Host "  Location: $kindPath" -ForegroundColor Cyan
        Write-Host "  Note: Add $env:USERPROFILE to your PATH permanently" -ForegroundColor Yellow
    } catch {
        Write-Host "✗ Failed to install Kind" -ForegroundColor Red
        Write-Host "  Please download manually from: https://kind.sigs.k8s.io/docs/user/quick-start/#installation" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Check if kubectl is installed
Write-Host "Checking kubectl..." -ForegroundColor Yellow
if (Get-Command kubectl -ErrorAction SilentlyContinue) {
    Write-Host "✓ kubectl is already installed" -ForegroundColor Green
} else {
    Write-Host "Installing kubectl..." -ForegroundColor Yellow
    
    try {
        # Download kubectl
        $kubectlUrl = "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe"
        $kubectlPath = "$env:USERPROFILE\kubectl.exe"
        
        Invoke-WebRequest -Uri $kubectlUrl -OutFile $kubectlPath
        
        # Add to PATH for current session
        $env:Path += ";$env:USERPROFILE"
        
        Write-Host "✓ kubectl installed successfully" -ForegroundColor Green
        Write-Host "  Location: $kubectlPath" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Failed to install kubectl" -ForegroundColor Red
        Write-Host "  Please download manually from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Check if cluster already exists
Write-Host "Checking for existing cluster..." -ForegroundColor Yellow
$clusterExists = kind get clusters 2>$null | Select-String "ekomart"

if ($clusterExists) {
    Write-Host "✓ Cluster 'ekomart' already exists" -ForegroundColor Green
    $recreate = Read-Host "Do you want to recreate it? (y/n)"
    
    if ($recreate -eq "y") {
        Write-Host "Deleting existing cluster..." -ForegroundColor Yellow
        kind delete cluster --name ekomart
        Write-Host "✓ Cluster deleted" -ForegroundColor Green
        $createCluster = $true
    } else {
        $createCluster = $false
    }
} else {
    $createCluster = $true
}
Write-Host ""

# Create Kind cluster
if ($createCluster) {
    Write-Host "Creating Kind cluster..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Cyan
    
    # Create cluster with config
    $configPath = "kubernetes\Kind-cluster\kind-config.yaml"
    
    if (Test-Path $configPath) {
        kind create cluster --name ekomart --config $configPath
    } else {
        kind create cluster --name ekomart
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Cluster created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create cluster" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Get kubeconfig
Write-Host "Getting kubeconfig..." -ForegroundColor Yellow
$kubeconfigPath = "kind-kubeconfig.yaml"
kind get kubeconfig --name ekomart | Out-File -FilePath $kubeconfigPath -Encoding UTF8

if (Test-Path $kubeconfigPath) {
    Write-Host "✓ Kubeconfig saved to: $kubeconfigPath" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to get kubeconfig" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test cluster connection
Write-Host "Testing cluster connection..." -ForegroundColor Yellow
$env:KUBECONFIG = $kubeconfigPath
kubectl cluster-info

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Cluster is accessible" -ForegroundColor Green
} else {
    Write-Host "✗ Cannot connect to cluster" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create namespace
Write-Host "Creating namespace..." -ForegroundColor Yellow
kubectl create namespace ekomart 2>$null
Write-Host "✓ Namespace 'ekomart' ready" -ForegroundColor Green
Write-Host ""

# Encode kubeconfig for GitHub
Write-Host "Encoding kubeconfig for GitHub..." -ForegroundColor Yellow
$kubeconfigContent = Get-Content $kubeconfigPath -Raw
$kubeconfigBytes = [System.Text.Encoding]::UTF8.GetBytes($kubeconfigContent)
$kubeconfigBase64 = [Convert]::ToBase64String($kubeconfigBytes)

# Save to file
$base64Path = "kubeconfig-base64.txt"
$kubeconfigBase64 | Out-File -FilePath $base64Path -Encoding ASCII -NoNewline

Write-Host "✓ Base64 encoded kubeconfig saved to: $base64Path" -ForegroundColor Green
Write-Host ""

# Display summary
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Cluster Information:" -ForegroundColor Cyan
Write-Host "  Name: ekomart" -ForegroundColor White
Write-Host "  Namespace: ekomart" -ForegroundColor White
Write-Host "  Kubeconfig: $kubeconfigPath" -ForegroundColor White
Write-Host "  Base64: $base64Path" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Add to GitHub Secrets:" -ForegroundColor White
Write-Host "   - Go to: https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions" -ForegroundColor Cyan
Write-Host "   - Click 'New repository secret'" -ForegroundColor Cyan
Write-Host "   - Name: KUBE_CONFIG" -ForegroundColor Cyan
Write-Host "   - Value: Copy content from $base64Path" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Test locally:" -ForegroundColor White
Write-Host "   kubectl get nodes" -ForegroundColor Cyan
Write-Host "   kubectl get namespaces" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Deploy application:" -ForegroundColor White
Write-Host "   cd kubernetes\Kind-cluster" -ForegroundColor Cyan
Write-Host "   kubectl apply -f backend-kind.yaml" -ForegroundColor Cyan
Write-Host "   kubectl apply -f frontend-kind.yaml" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Access application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:31000" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:31100" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Open base64 file
Write-Host "Opening base64 file for copying..." -ForegroundColor Yellow
Start-Process notepad.exe $base64Path

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
