#!/bin/bash

echo "🧹 Cleaning up deployments while preserving data..."

# Delete deployments but keep namespace and PVC
kubectl delete deployment backend-deployment frontend-deployment mongo-deployment -n ekomart

echo "✅ Deployments deleted"
echo "📦 Namespace and data preserved"
echo ""
echo "To redeploy:"
echo "  kubectl apply -f kubernetes/Kind-cluster/mongodb-persistent.yaml"
echo "  kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml"
echo "  kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml"
