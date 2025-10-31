#!/bin/bash

echo "🔄 Recovering data after namespace deletion..."

# Check if PV exists
if ! kubectl get pv ekomart-mongo-pv &>/dev/null; then
    echo "❌ PersistentVolume 'ekomart-mongo-pv' not found"
    echo "   Run setup-persistent-storage.sh first"
    exit 1
fi

echo "✅ Found PersistentVolume with data"

# Check PV status
STATUS=$(kubectl get pv ekomart-mongo-pv -o jsonpath='{.status.phase}')

if [ "$STATUS" == "Bound" ]; then
    echo "⚠️  PV is still bound. Releasing..."
    kubectl patch pv ekomart-mongo-pv -p '{"spec":{"claimRef": null}}'
    sleep 2
fi

echo "📦 Creating namespace..."
kubectl create namespace ekomart 2>/dev/null

echo "🔗 Binding PVC to existing PV..."
kubectl config set-context --current --namespace=ekomart

# Apply the persistent storage configuration
kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml

echo ""
echo "✅ Data recovery complete!"
echo "   Your MongoDB data from the previous deployment is now available"
echo ""
echo "Next steps:"
echo "  1. Deploy backend and frontend:"
echo "     kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml"
echo "     kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml"
echo "  2. Your user accounts and data should still be there!"
