#!/bin/bash

# EkoMart Kubernetes Deployment Script
# This script deploys the EkoMart application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="ekomart"
DOCKER_USERNAME="${DOCKER_USERNAME:-your-docker-username}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}EkoMart Kubernetes Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi

echo -e "${GREEN}✓ kubectl is installed and cluster is accessible${NC}"
echo ""

# Create namespace
echo -e "${YELLOW}Creating namespace...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace created/updated${NC}"
echo ""

# Check if secrets exist
echo -e "${YELLOW}Checking secrets...${NC}"
if kubectl get secret backend-secrets -n $NAMESPACE &> /dev/null; then
    echo -e "${GREEN}✓ Secrets already exist${NC}"
else
    echo -e "${YELLOW}⚠ Secrets not found. Please create them manually:${NC}"
    echo ""
    echo "kubectl create secret generic backend-secrets \\"
    echo "  --from-literal=mongodb-uri='your-mongodb-uri' \\"
    echo "  --from-literal=jwt-secret='your-jwt-secret' \\"
    echo "  --from-literal=cloudinary-name='your-cloudinary-name' \\"
    echo "  --from-literal=cloudinary-key='your-cloudinary-key' \\"
    echo "  --from-literal=cloudinary-secret='your-cloudinary-secret' \\"
    echo "  --from-literal=razorpay-key-id='your-razorpay-key-id' \\"
    echo "  --from-literal=razorpay-key-secret='your-razorpay-key-secret' \\"
    echo "  -n $NAMESPACE"
    echo ""
    read -p "Press Enter to continue after creating secrets..."
fi
echo ""

# Update image names
echo -e "${YELLOW}Updating image names...${NC}"
sed -i.bak "s|\${DOCKER_USERNAME}|$DOCKER_USERNAME|g" backend-deployment.yaml
sed -i.bak "s|\${DOCKER_USERNAME}|$DOCKER_USERNAME|g" frontend-deployment.yaml
echo -e "${GREEN}✓ Image names updated${NC}"
echo ""

# Deploy application
echo -e "${YELLOW}Deploying application...${NC}"
kubectl apply -f namespace.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
echo -e "${GREEN}✓ Application deployed${NC}"
echo ""

# Wait for deployments
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/backend-deployment -n $NAMESPACE --timeout=5m
kubectl rollout status deployment/frontend-deployment -n $NAMESPACE --timeout=5m
echo -e "${GREEN}✓ Deployments are ready${NC}"
echo ""

# Deploy ingress (optional)
read -p "Do you want to deploy ingress? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deploying ingress...${NC}"
    kubectl apply -f ingress.yaml
    echo -e "${GREEN}✓ Ingress deployed${NC}"
    echo ""
fi

# Show deployment status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Status${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}Deployments:${NC}"
kubectl get deployments -n $NAMESPACE
echo ""

echo -e "${YELLOW}Pods:${NC}"
kubectl get pods -n $NAMESPACE
echo ""

echo -e "${YELLOW}Services:${NC}"
kubectl get services -n $NAMESPACE
echo ""

if kubectl get ingress -n $NAMESPACE &> /dev/null; then
    echo -e "${YELLOW}Ingress:${NC}"
    kubectl get ingress -n $NAMESPACE
    echo ""
fi

# Restore backup files
mv backend-deployment.yaml.bak backend-deployment.yaml 2>/dev/null || true
mv frontend-deployment.yaml.bak frontend-deployment.yaml 2>/dev/null || true

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check pod logs: kubectl logs -f deployment/backend-deployment -n $NAMESPACE"
echo "2. Access application: kubectl port-forward svc/frontend-service 8080:80 -n $NAMESPACE"
echo "3. Monitor: kubectl get all -n $NAMESPACE"
echo ""
