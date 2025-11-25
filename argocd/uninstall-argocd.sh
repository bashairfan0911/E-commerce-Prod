#!/bin/bash

# ArgoCD Uninstallation Script for EkoMart
# This script removes ArgoCD and EkoMart applications

set -e

echo "=========================================="
echo "Uninstalling ArgoCD and EkoMart Apps"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Confirm uninstallation
echo -e "${RED}WARNING: This will delete ArgoCD and all EkoMart applications!${NC}"
echo -e "${YELLOW}Are you sure you want to continue? (yes/no)${NC}"
read -r CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
    echo -e "${GREEN}Uninstallation cancelled.${NC}"
    exit 0
fi

# Delete ArgoCD applications
echo -e "\n${YELLOW}Deleting ArgoCD applications...${NC}"
kubectl delete -f argocd/app-of-apps.yaml --ignore-not-found=true
kubectl delete -f argocd/applications/ --ignore-not-found=true

# Delete ArgoCD project
echo -e "\n${YELLOW}Deleting ArgoCD project...${NC}"
kubectl delete -f argocd/projects/ekomart-project.yaml --ignore-not-found=true

# Delete EkoMart namespace
echo -e "\n${YELLOW}Do you want to delete the ekomart namespace and all resources? (y/n)${NC}"
read -r DELETE_NAMESPACE

if [[ "$DELETE_NAMESPACE" =~ ^[Yy]$ ]]; then
    kubectl delete namespace ekomart --ignore-not-found=true
    echo -e "${GREEN}✓ EkoMart namespace deleted${NC}"
fi

# Delete ArgoCD
echo -e "\n${YELLOW}Deleting ArgoCD...${NC}"
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml --ignore-not-found=true

# Delete ArgoCD namespace
kubectl delete namespace argocd --ignore-not-found=true

echo -e "\n${GREEN}✓ ArgoCD uninstalled successfully${NC}"
echo -e "=========================================="
