#!/bin/bash
# ==============================================================================
# DevPulse AWS EC2 Automated Linux Setup Script (Ubuntu 24.04 LTS)
# ==============================================================================

set -e

echo "🚀 Step 1: Updating Ubuntu System Packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

echo "📦 Step 2: Installing Docker & Docker Compose..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "👤 Step 3: Granting Docker Permissions to Ubuntu User..."
sudo usermod -aG docker $USER

echo "🌐 Step 4: Installing Nginx & Certbot SSL..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "🔥 Step 5: Enabling UFW Firewall (Ports 22, 80, 443)..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "✅ AWS EC2 Server Setup Completed Successfully!"
