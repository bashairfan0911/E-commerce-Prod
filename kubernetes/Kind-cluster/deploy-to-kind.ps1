Write-Host "🚀 Deploying E-Commerce App to Kind Cluster" -ForegroundColor Green
Write-Host ""

# Create namespace
Write-Host "📦 Creating namespace..." -ForegroundColor Yellow
kubectl create namespace ekomart --dry-run=client -o yaml | kubectl apply -f -

# Set context to namespace
kubectl config set-context --current --namespace=ekomart

# Deploy MongoDB
Write-Host "🗄️  Deploying MongoDB..." -ForegroundColor Yellow
kubectl apply -f kubernetes/Kind-cluster/mongodb-kind.yaml

# Wait for MongoDB to be ready
Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=mongo --timeout=120s

# Deploy Backend
Write-Host "⚙️  Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml

# Wait for Backend to be ready
Write-Host "⏳ Waiting for Backend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Check backend logs for database connection
Write-Host "🔍 Checking backend database connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
$backendLogs = kubectl logs -l app=backend -n ekomart --tail=5
if ($backendLogs -match "Database connected successfully") {
    Write-Host "✅ Backend connected to MongoDB" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend may not be connected to MongoDB yet" -ForegroundColor Yellow
    Write-Host "   Restarting backend to ensure connection..." -ForegroundColor Yellow
    kubectl rollout restart deployment/backend-deployment -n ekomart
    Start-Sleep -Seconds 5
}

# Deploy Frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml

# Wait for Frontend to be ready
Write-Host "⏳ Waiting for Frontend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

# Seed the database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
$seedOutput = kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database seeding failed. You can seed manually later:" -ForegroundColor Yellow
    Write-Host "   kubectl exec -n ekomart deployment/backend-deployment -- node seedData.js" -ForegroundColor Gray
}

# Show all resources
Write-Host ""
Write-Host "✅ Deployment complete! Here are your resources:" -ForegroundColor Green
kubectl get all

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌐 Access your application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:31000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:31100" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: After opening the app, do a hard refresh!" -ForegroundColor Yellow
Write-Host "   Press Ctrl+Shift+R or Ctrl+F5 to clear browser cache" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
