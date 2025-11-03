#!/bin/bash
set -e

# Update system
apt-get update -y
apt-get upgrade -y

# Install essential packages
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    wget \
    unzip

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

# Install Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
mv ./kind /usr/local/bin/kind

# Install Helm
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
rm get_helm.sh

# Install ArgoCD CLI
curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x /usr/local/bin/argocd

# Create working directory
mkdir -p /home/ubuntu/ekomart
chown -R ubuntu:ubuntu /home/ubuntu/ekomart

# Clone repository (optional - uncomment and add your repo)
# cd /home/ubuntu/ekomart
# git clone https://github.com/bashairfan0911/E-commerce-Prod.git
# chown -R ubuntu:ubuntu /home/ubuntu/ekomart

# Create Kind cluster configuration
cat > /home/ubuntu/ekomart/kind-config.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 31000
        hostPort: 31000
        protocol: TCP
      - containerPort: 31100
        hostPort: 31100
        protocol: TCP
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
EOF

chown ubuntu:ubuntu /home/ubuntu/ekomart/kind-config.yaml

# Create setup script
cat > /home/ubuntu/ekomart/setup-cluster.sh <<'EOF'
#!/bin/bash
echo "Creating Kind cluster..."
kind create cluster --name ekomart --config /home/ubuntu/ekomart/kind-config.yaml

echo "Waiting for cluster to be ready..."
kubectl wait --for=condition=Ready nodes --all --timeout=300s

echo "Kind cluster created successfully!"
echo "Run 'kubectl get nodes' to verify"
EOF

chmod +x /home/ubuntu/ekomart/setup-cluster.sh
chown ubuntu:ubuntu /home/ubuntu/ekomart/setup-cluster.sh

# Create welcome message
cat > /etc/motd <<'EOF'
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              Welcome to EkoMart K8s Server                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Installed Tools:
  - Docker
  - Kind (Kubernetes in Docker)
  - kubectl
  - Helm
  - ArgoCD CLI

Quick Start:
  1. Create Kind cluster:
     cd ~/ekomart && ./setup-cluster.sh

  2. Clone repository:
     git clone https://github.com/bashairfan0911/E-commerce-Prod.git
     cd E-commerce-Prod && git checkout test-dev

  3. Deploy application:
     Follow instructions in kubernetes/Kind-cluster/KIND-DEPLOYMENT.md

Useful Commands:
  - kubectl get nodes
  - kubectl get pods -A
  - kind get clusters
  - docker ps

Access Points:
  - Frontend: http://<PUBLIC_IP>:31000
  - Backend: http://<PUBLIC_IP>:31100
  - ArgoCD: http://<PUBLIC_IP>:8080
  - Prometheus: http://<PUBLIC_IP>:9090
  - Grafana: http://<PUBLIC_IP>:3000

EOF

echo "Setup completed successfully!" > /var/log/user-data.log
