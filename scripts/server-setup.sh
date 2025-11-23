#!/bin/bash

# Server Setup Script for Student Attendance Management System
# Run this script on your college server to set up the environment

set -e

echo "🚀 Starting server setup for Student Attendance Management System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root. Run as a regular user with sudo privileges.${NC}"
   exit 1
fi

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing essential tools...${NC}"
sudo apt install -y curl wget git vim unzip

echo -e "${YELLOW}Step 3: Installing Java 17...${NC}"
sudo apt install -y openjdk-17-jdk
java -version

echo -e "${YELLOW}Step 4: Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo systemctl start docker
sudo systemctl enable docker
docker --version

echo -e "${YELLOW}Step 5: Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

echo -e "${YELLOW}Step 6: Installing Jenkins...${NC}"
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

echo -e "${GREEN}✅ Basic setup completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Log out and log back in for Docker group changes to take effect"
echo "2. Access Jenkins at: http://$(hostname -I | awk '{print $1}'):8080"
echo "3. Get Jenkins initial password: sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
echo "4. Follow the DEPLOYMENT_GUIDE.md for complete setup"
echo ""
echo -e "${GREEN}Setup script completed!${NC}"

