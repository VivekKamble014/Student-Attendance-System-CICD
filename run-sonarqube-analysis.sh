#!/bin/bash

# SonarQube Analysis Script
# This script runs SonarQube analysis locally

set -e

echo "🔎 Starting SonarQube Analysis..."
echo ""

# SonarQube Configuration
SONAR_HOST_URL="http://sonarqube.imcc.com"
SONAR_PROJECT_KEY="2401084-Student-Attendance-System-CICD"
SONAR_TOKEN="${SONAR_TOKEN:-}"

# Check if token is provided
if [ -z "$SONAR_TOKEN" ]; then
    echo "❌ ERROR: SONAR_TOKEN is required!"
    echo ""
    echo "📋 To get your token:"
    echo "   1. Go to: ${SONAR_HOST_URL}"
    echo "   2. Login with your credentials"
    echo "   3. Go to: My Account > Security > Generate Token"
    echo "   4. Copy the token"
    echo ""
    echo "💡 Then run:"
    echo "   export SONAR_TOKEN='your-token-here'"
    echo "   ./run-sonarqube-analysis.sh"
    echo ""
    exit 1
fi

# Check if sonar-scanner is available
if ! command -v sonar-scanner &> /dev/null; then
    echo "⚠️  SonarQube Scanner not found locally"
    echo ""
    echo "📥 Installing SonarQube Scanner..."
    
    SONAR_SCANNER_VERSION="4.8.0.2856"
    SONAR_SCANNER_ZIP="sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip"
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        SONAR_SCANNER_ZIP="sonar-scanner-cli-${SONAR_SCANNER_VERSION}-macosx.zip"
    fi
    
    echo "Downloading SonarQube Scanner..."
    curl -L -o ${SONAR_SCANNER_ZIP} https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_SCANNER_ZIP} || {
        echo "❌ Failed to download SonarQube Scanner"
        exit 1
    }
    
    unzip -q ${SONAR_SCANNER_ZIP} || {
        echo "❌ Failed to extract SonarQube Scanner"
        exit 1
    }
    
    export PATH=$PATH:$(pwd)/sonar-scanner-${SONAR_SCANNER_VERSION}-*/bin
    rm -f ${SONAR_SCANNER_ZIP}
    
    echo "✅ SonarQube Scanner installed"
    echo ""
fi

# Verify sonar-project.properties exists
if [ ! -f "sonar-project.properties" ]; then
    echo "❌ ERROR: sonar-project.properties not found!"
    exit 1
fi

echo "✅ Using sonar-project.properties"
echo "📋 Project Key: ${SONAR_PROJECT_KEY}"
echo "🌐 SonarQube URL: ${SONAR_HOST_URL}"
echo ""

# Run SonarQube analysis
echo "🚀 Running SonarQube Scanner..."
echo ""

sonar-scanner \
    -Dsonar.host.url=${SONAR_HOST_URL} \
    -Dsonar.login=${SONAR_TOKEN} \
    -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
    -Dsonar.projectName="Student Attendance Management System - ${SONAR_PROJECT_KEY}" \
    -Dsonar.projectVersion=1.0.0

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SonarQube analysis completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 View your project dashboard:"
echo "   🔗 ${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
echo ""
echo "📋 Project Overview:"
echo "   🔗 ${SONAR_HOST_URL}/project/overview?id=${SONAR_PROJECT_KEY}"
echo ""
echo "⏳ Wait a few moments for analysis to process, then check the dashboard!"
echo ""

