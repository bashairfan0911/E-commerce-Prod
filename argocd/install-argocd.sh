#!/bin/bash

# ArgoCD Installation Script for EkoMart
# This script installs ArgoCD and sets up the EkoMart applications

set -e

echo "=========================================="
echo "Installing ArgoCD for EkoMart"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Cannot connect to Kubernetes cluster. Please check your kubeconfig.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ kubectl is installed and cluster is accessible${NC}"

# Create ArgoCD namespace
echo -e "\n${YELLOW}Creating ArgoCD namespace...${NC}"
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Install ArgoCD
echo -e "\n${YELLOW}Installing ArgoCD...${NC}"
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
echo -e "\n${YELLOW}Waiting for ArgoCD pods to be ready (this may take a few minutes)...${NC}"
kubectl wait --for=condition=ready pod --all -n argocd --timeout=600s

echo -e "${GREEN}✓ ArgoCD installed successfully${NC}"

# Get ArgoCD admin password
echo -e "\n${YELLOW}Retrieving ArgoCD admin password...${NC}"
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

# Check if running on Kind or remote cluster
if kubectl get nodes -o jsonpath='{.items[0].metadata.name}' | grep -q "kind"; then
    echo -e "\n${YELLOW}Detected Kind cluster - setting up port forwarding...${NC}"
    echo -e "${GREEN}Run this command in a separate terminal:${NC}"
    echo -e "  kubectl port-forward svc/argocd-server -n argocd 8080:443"
    echo -e "\n${GREEN}Then access ArgoCD at: https://localhost:8080${NC}"
else
    echo -e "\n${YELLOW}Patching ArgoCD server to NodePort...${NC}"
    kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
    
    NODEPORT=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.spec.ports[0].nodePort}')
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}')
    
    if [ -z "$NODE_IP" ]; then
        NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    fi
    
    echo -e "\n${GREEN}ArgoCD is accessible at: http://${NODE_IP}:${NODEPORT}${NC}"
fi

# Display credentials
echo -e "\n=========================================="
echo -e "${GREEN}ArgoCD Installation Complete!${NC}"
echo -e "=========================================="
echo -e "Username: ${GREEN}admin${NC}"
echo -e "Password: ${GREEN}${ARGOCD_PASSWORD}${NC}"
echo -e "=========================================="

# Ask if user wants to deploy applications
echo -e "\n${YELLOW}Do you want to deploy EkoMart applications now? (y/n)${NC}"
read -r DEPLOY_APPS

if [[ "$DEPLOY_APPS" =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Deploying EkoMart namespace...${NC}"
    kubectl apply -f argocd/namespace.yaml
    
    echo -e "\n${YELLOW}Deploying ArgoCD project...${NC}"
    kubectl apply -f argocd/projects/ekomart-project.yaml
    
    echo -e "\n${YELLOW}Deploying applications using App of Apps pattern...${NC}"
    kubectl apply -f argocd/app-of-apps.yaml
    
    echo -e "\n${GREEN}✓ Applications deployed successfully${NC}"
    echo -e "\n${YELLOW}Check application status:${NC}"
    echo -e "  kubectl get applications -n argocd"
    echo -e "\n${YELLOW}Or use ArgoCD CLI:${NC}"
    echo -e "  argocd app list"
else
    echo -e "\n${YELLOW}To deploy applications later, run:${NC}"
    echo -e "  kubectl apply -f argocd/namespace.yaml"
    echo -e "  kubectl apply -f argocd/projects/ekomart-project.yaml"
    echo -e "  kubectl apply -f argocd/app-of-apps.yaml"
fi

echo -e "\n${GREEN}Installation complete!${NC}"
