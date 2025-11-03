#!/bin/bash
# Quick fix for API routing on local Kind cluster

echo "🔧 Fixing API routing for local Kind cluster..."
echo ""

# Install Nginx Ingress Controller
echo "📦 Installing Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

echo ""
echo "⏳ Waiting for Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

echo ""
echo "🔗 Applying Ingress configuration..."
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

echo ""
echo "✅ Done! Ingress is configured."
echo ""
echo "📍 Access your application at:"
echo "   http://localhost"
echo ""
echo "🔍 Verify ingress:"
echo "   kubectl get ingress -n ekomart"
echo ""
