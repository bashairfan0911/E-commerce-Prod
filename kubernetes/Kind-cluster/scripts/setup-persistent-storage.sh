#!/bin/bash

echo "🔧 Setting up persistent storage that survives namespace deletion..."

# Create PV (cluster-scoped, survives namespace deletion)
cat <<EOF | kubectl apply -f -
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
EOF

echo "✅ PersistentVolume created (survives namespace deletion)"
echo ""
echo "Now deploy your application with:"
echo "  kubectl create namespace ekomart"
echo "  kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml"
