@echo off
echo ====================================
echo Deploying Ekomart to Kind Cluster
echo ====================================

echo.
echo Step 1: Recreating Kind cluster...
kind delete cluster
kind create cluster --config kubernetes/Kind-cluster/kind-config.yaml

echo.
echo Step 2: Installing nginx ingress controller...
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
echo Waiting for ingress controller to be ready...
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

echo.
echo Step 3: Building Docker images...
docker build -t ecommerce-frontend:latest --build-arg VITE_API_URL=/api ./frontend
docker build -t ecommerce-backend:latest ./backend

echo.
echo Step 4: Loading images into Kind...
kind load docker-image ecommerce-frontend:latest
kind load docker-image ecommerce-backend:latest

echo.
echo Step 5: Creating namespace...
kubectl create namespace ekomart

echo.
echo Step 6: Deploying applications...
kubectl apply -f kubernetes/Kind-cluster/backend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/frontend-kind.yaml
kubectl apply -f kubernetes/Kind-cluster/ingress-kind.yaml

echo.
echo Step 7: Waiting for deployments...
kubectl wait --namespace ekomart --for=condition=available deployment/backend-deployment --timeout=120s
kubectl wait --namespace ekomart --for=condition=available deployment/frontend-deployment --timeout=120s

echo.
echo ====================================
echo Deployment Complete!
echo ====================================
echo Frontend: http://localhost
echo Backend API: http://localhost/api
echo.
echo To check status:
echo   kubectl get pods -n ekomart
echo   kubectl get svc -n ekomart
echo   kubectl get ingress -n ekomart
echo.
