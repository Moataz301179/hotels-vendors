#!/bin/bash
# UFW Firewall setup for Hotels Vendors VPS
# Run once on new VPS deployment
# Blocks all incoming except SSH (22), HTTP (80), HTTPS (443)
# NEVER exposes Ollama port 11434 to the internet

set -e

echo "=== Hotels Vendors VPS Firewall Setup ==="
echo "Installing UFW..."
sudo apt-get update -qq
sudo apt-get install -y -qq ufw

echo "Setting default policies..."
sudo ufw default deny incoming
sudo ufw default allow outgoing

echo "Allowing essential ports..."
sudo ufw allow 22/tcp   comment 'SSH'
sudo ufw allow 80/tcp   comment 'HTTP'
sudo ufw allow 443/tcp  comment 'HTTPS'

echo "Allowing Docker internal networks..."
sudo ufw allow from 172.16.0.0/12 comment 'Docker networks'
sudo ufw allow from 10.0.0.0/8    comment 'Docker networks'
sudo ufw allow from 192.168.0.0/16 comment 'Docker networks'

echo "=== IMPORTANT: Ollama port 11434 is NOT exposed ==="
echo "Ollama is accessible ONLY via internal Docker network."
echo "If you need external access, use the nginx reverse proxy at /ollama/"

echo "Enabling UFW..."
echo "y" | sudo ufw enable

echo ""
echo "=== Firewall Status ==="
sudo ufw status verbose

echo ""
echo "Done. Your VPS is secured."
