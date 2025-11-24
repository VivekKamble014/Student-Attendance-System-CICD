#!/bin/bash

# Check SonarQube Project Status
# This script checks if your project exists in SonarQube

set -e

SONAR_HOST_URL="http://sonarqube.imcc.com"
SONAR_PROJECT_KEY="2401084-Student-Attendance-System-CICD"
SONAR_TOKEN="${SONAR_TOKEN:-}"

echo "🔍 Checking SonarQube Project Status..."
echo ""
echo "📋 Project Key: ${SONAR_PROJECT_KEY}"
echo "📝 Project Name: Student Attendance Management System - ${SONAR_PROJECT_KEY}"
echo "🌐 SonarQube URL: ${SONAR_HOST_URL}"
echo ""

# Check if token is provided
if [ -z "$SONAR_TOKEN" ]; then
    echo "⚠️  SONAR_TOKEN not set"
    echo ""
    echo "📋 To check project status, you need your SonarQube token:"
    echo "   1. Go to: ${SONAR_HOST_URL}"
    echo "   2. Login"
    echo "   3. Go to: My Account > Security > Generate Token"
    echo "   4. Copy the token"
    echo ""
    echo "💡 Then run:"
    echo "   export SONAR_TOKEN='your-token-here'"
    echo "   ./check-sonarqube-project.sh"
    echo ""
    exit 1
fi

echo "✅ Checking if project exists..."
echo ""

# Try to get project info
PROJECT_INFO=$(curl -s -u "${SONAR_TOKEN}:" "${SONAR_HOST_URL}/api/projects/search?projects=${SONAR_PROJECT_KEY}" 2>/dev/null || echo "")

if [ -z "$PROJECT_INFO" ] || echo "$PROJECT_INFO" | grep -q '"total":0'; then
    echo "❌ Project NOT FOUND in SonarQube!"
    echo ""
    echo "📋 This means analysis hasn't been run yet."
    echo ""
    echo "🚀 To create the project, run SonarQube analysis:"
    echo "   ./run-sonarqube-analysis.sh"
    echo ""
    echo "✅ OR: Push to GitHub and Jenkins will run it automatically!"
else
    echo "✅ Project EXISTS in SonarQube!"
    echo ""
    echo "$PROJECT_INFO" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"\(.*\)"/📝 Project Name: \1/'
    echo ""
    echo "🔗 View your project:"
    echo "   ${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
    echo ""
fi

echo ""
echo "📊 About CSP Errors:"
echo "   The Content Security Policy errors you see are just browser warnings."
echo "   They don't prevent the dashboard from loading or working."
echo "   They're related to loading fonts from Google Fonts."
echo "   The dashboard should still work fine!"
echo ""

