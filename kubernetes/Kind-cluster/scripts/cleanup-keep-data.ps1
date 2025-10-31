Write-Host "🧹 Cleaning up deployments while preserving data..." -ForegroundColor Yellow

# Delete deployments but keep namespace and PVC
kubectl delete deployment backend-deployment frontend-deployment mongo-deployment -n ekomart

Write-Host "✅ Deployments deleted" -ForegroundColor Green
Write-Host "📦 Namespace and data preserved" -ForegroundColor Green
Write-Host ""
Write-Host "To redeploy:" -ForegroundColor Cyan
Write-Host "  kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml" -ForegroundColor White
Write-Host "  kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml" -ForegroundColor White
Write-Host "  kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml" -ForegroundColor White
