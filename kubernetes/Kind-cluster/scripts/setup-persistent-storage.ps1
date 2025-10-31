Write-Host "🔧 Setting up persistent storage that survives namespace deletion..." -ForegroundColor Yellow

# Create PV (cluster-scoped, survives namespace deletion)
@"
apiVersion: v1
kind: PersistentVolume
metadata:
  name: ekomart-mongo-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ekomart-storage
  hostPath:
    path: /mnt/data/ekomart-mongo
    type: DirectoryOrCreate
"@ | kubectl apply -f -

Write-Host "✅ PersistentVolume created (survives namespace deletion)" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploy your application with:" -ForegroundColor Cyan
Write-Host "  kubectl create namespace ekomart" -ForegroundColor White
Write-Host "  kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml" -ForegroundColor White
