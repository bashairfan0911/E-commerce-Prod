#!/bin/bash

echo "🚀 Deploying E-Commerce App to Kind Cluster"

# Create namespace
echo "📦 Creating namespace..."
kubectl create namespace ekomart --dry-run=client -o yaml | kubectl apply -f -

# Set context to namespace
kubectl config set-context --current --namespace=ekomart

# Deploy MongoDB
echo "🗄️  Deploying MongoDB..."
kubectl apply -f kubernetes/mongodb-kind.yaml

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongo --timeout=120s

# Deploy Backend
echo "⚙️  Deploying Backend..."
kubectl apply -f kubernetes/backend-kind.yaml

# Wait for Backend to be ready
echo "⏳ Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Deploy Frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f kubernetes/frontend-kind.yaml

# Wait for Frontend to be ready
echo "⏳ Waiting for Frontend to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

# Show all resources
echo "✅ Deployment complete! Here are your resources:"
kubectl get all

echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://localhost:31000"
echo "   Backend:  http://localhost:31100"
