Write-Host "🔄 Recovering data after namespace deletion..." -ForegroundColor Yellow

# Check if PV exists
$pv = kubectl get pv ekomart-mongo-pv -o json 2>$null | ConvertFrom-Json

if ($null -eq $pv) {
    Write-Host "❌ PersistentVolume 'ekomart-mongo-pv' not found" -ForegroundColor Red
    Write-Host "   Run setup-persistent-storage.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found PersistentVolume with data" -ForegroundColor Green

# Check PV status
$status = $pv.status.phase

if ($status -eq "Bound") {
    Write-Host "⚠️  PV is still bound. Releasing..." -ForegroundColor Yellow
    kubectl patch pv ekomart-mongo-pv -p '{\"spec\":{\"claimRef\": null}}'
    Start-Sleep -Seconds 2
}

Write-Host "📦 Creating namespace..." -ForegroundColor Yellow
kubectl create namespace ekomart 2>$null

Write-Host "🔗 Binding PVC to existing PV..." -ForegroundColor Yellow
kubectl config set-context --current --namespace=ekomart

# Apply the persistent storage configuration
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml

Write-Host ""
Write-Host "✅ Data recovery complete!" -ForegroundColor Green
Write-Host "   Your MongoDB data from the previous deployment is now available" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Deploy backend and frontend:" -ForegroundColor White
Write-Host "     kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml" -ForegroundColor Gray
Write-Host "     kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml" -ForegroundColor Gray
Write-Host "  2. Your user accounts and data should still be there!" -ForegroundColor White
