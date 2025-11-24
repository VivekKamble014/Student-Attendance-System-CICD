#!/bin/bash

# Docker Build and Test Script
# This script builds the Docker image, runs tests, and pushes to Nexus

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="2401084-vivek-kamble"
NEXUS_REGISTRY="nexus.imcc.com:8082"
NEXUS_USER="student"
NEXUS_PASS="Imcc@2025"
SONAR_HOST="http://sonarqube.imcc.com"
SONAR_PROJECT_KEY="2401084-vivek-kamble"

echo -e "${GREEN}🚀 Starting Docker Build and Test Process${NC}"
echo "=========================================="

# Step 1: Build Docker Image
echo -e "\n${YELLOW}Step 1: Building Docker Image...${NC}"
docker build -t ${IMAGE_NAME}:latest .
docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    docker images | grep ${IMAGE_NAME}
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

# Step 2: Test Docker Image
echo -e "\n${YELLOW}Step 2: Testing Docker Image...${NC}"
docker run -d --name ${IMAGE_NAME}-test -p 3000:3000 ${IMAGE_NAME}:latest || true

# Wait for container to start
sleep 5

# Check if container is running
if docker ps | grep -q ${IMAGE_NAME}-test; then
    echo -e "${GREEN}✅ Container is running!${NC}"
    
    # Test health endpoint
    echo "Testing health endpoint..."
    sleep 3
    curl -f http://localhost:3000/api/health || echo -e "${YELLOW}⚠️ Health check failed (container may still be starting)${NC}"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    docker logs ${IMAGE_NAME}-test
    exit 1
fi

# Step 3: Push to Nexus (optional)
read -p "Do you want to push to Nexus? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Step 3: Pushing to Nexus...${NC}"
    
    # Login to Nexus
    echo ${NEXUS_PASS} | docker login ${NEXUS_REGISTRY} -u ${NEXUS_USER} --password-stdin
    
    # Tag for Nexus
    docker tag ${IMAGE_NAME}:latest ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest
    docker tag ${IMAGE_NAME}:latest ${NEXUS_REGISTRY}/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)
    
    # Push to Nexus
    docker push ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Image pushed to Nexus successfully!${NC}"
        echo "View at: http://nexus.imcc.com/ → Browse → docker-hosted"
    else
        echo -e "${RED}❌ Failed to push to Nexus!${NC}"
    fi
fi

# Step 4: Cleanup
echo -e "\n${YELLOW}Step 4: Cleaning up test container...${NC}"
docker stop ${IMAGE_NAME}-test || true
docker rm ${IMAGE_NAME}-test || true

echo -e "\n${GREEN}✅ Build and test process completed!${NC}"
echo "=========================================="
echo "Image: ${IMAGE_NAME}:latest"
echo "To run: docker-compose up -d"
echo "Or: docker run -d -p 3000:3000 ${IMAGE_NAME}:latest"

