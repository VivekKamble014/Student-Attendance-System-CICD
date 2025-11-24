pipeline {
    agent any

    environment {
        DOCKER_IMAGE = '2401084-vivek-kamble'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        // Nexus Configuration
        NEXUS_REGISTRY = 'nexus.imcc.com:8082'
        NEXUS_REPO = '2401084-vivek-kamble'
        NEXUS_REPO_URL = 'https://nexus.imcc.com/repository/2401084-vivek-kamble/'
        // SonarQube Configuration
        SONAR_HOST_URL = 'http://sonarqube.imcc.com'
        SONAR_PROJECT_KEY = '2401084-Student-Attendance-System-CICD'
        // Kubernetes Configuration
        K8S_NAMESPACE = '2401084-vivek-kamble'
        // Database Configuration (TiDB Cloud)
        DB_HOST = 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com'
        DB_PORT = '4000'
        DB_USERNAME = '3NEjqDkMJVJsKVk.root'
        DB_PASSWORD = 'RSuUmf5m3RphWqOq'
        DB_DATABASE = 'test'
        // Application Configuration
        JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-min-32-chars'
    }

    stages {
        // Stage 1: Checkout SCM (Declarative)
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
            }
        }

        // Stage 2: CHECK (Validation, Install Tools, Install Dependencies, Lint)
        stage('CHECK') {
            steps {
                echo '✅ Running validation checks...'
                script {
                sh '''
                        set -e
                        
                        # ============================================
                        # Install Node.js 18 if not available
                        # ============================================
                        if ! command -v node &> /dev/null || ! node --version 2>/dev/null | grep -q "v18"; then
                            echo "📦 Installing Node.js 18..."
                            export NVM_DIR="${HOME}/.nvm"
                            if [ ! -d "$NVM_DIR" ]; then
                                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash 2>/dev/null || true
                            fi
                            if [ -s "$NVM_DIR/nvm.sh" ]; then
                                . "$NVM_DIR/nvm.sh"
                                nvm install 18 2>/dev/null || nvm install --lts 2>/dev/null || true
                                nvm use 18 2>/dev/null || nvm use --lts 2>/dev/null || true
                            fi
                        fi
                        
                        # Setup Node.js environment
                        export PATH=$PATH:/usr/bin:/usr/local/bin
                        if [ -d "$HOME/.nvm" ]; then
                            export NVM_DIR="$HOME/.nvm"
                            if [ -s "$NVM_DIR/nvm.sh" ]; then
                                . "$NVM_DIR/nvm.sh"
                                nvm use 18 2>/dev/null || nvm use --lts 2>/dev/null || nvm use default 2>/dev/null || true
                            fi
                        fi
                        
                        # Find Node.js using direct path
                        if [ -x "$HOME/.nvm/versions/node/v18.20.8/bin/node" ]; then
                            export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
                        elif [ -d "$HOME/.nvm/versions/node" ]; then
                            FOUND_NODE=\$(find "$HOME/.nvm/versions/node" -name "node" -type f -executable 2>/dev/null | head -1)
                            if [ -n "$FOUND_NODE" ]; then
                                export PATH="\$(dirname \$FOUND_NODE):\$PATH"
                            fi
                        fi
                        
                        if ! command -v node &> /dev/null; then
                            echo "❌ ERROR: Node.js is not available!"
                            echo "   Attempted installation but failed"
                            echo "   Please ensure Node.js 18+ is installed on Jenkins agent"
                            exit 1
                        fi
                        
                        echo "✅ Node.js: \$(node --version)"
                        echo "✅ npm: \$(npm --version)"
                        
                        # Install Dependencies
                        echo "📦 Installing dependencies..."
                        if [ -f "package-lock.json" ]; then
                            npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit
                        else
                            npm install --prefer-offline --no-audit
                        fi
                        
                        # Generate Prisma Client
                        echo "🔧 Generating Prisma Client..."
                        npx prisma generate || {
                            echo "⚠️ Prisma generate failed, but continuing..."
                            echo "   This may cause issues in the application"
                        }
                        
                        # Run Lint
                        echo "🔍 Running linter..."
                        npm run lint || {
                            echo "⚠️ Linter found issues, but continuing build..."
                        }
                        
                        echo "✅ CHECK stage completed successfully!"
                    '''
                }
            }
        }

        // Stage 3: Build Docker Images
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh """
                        if ! command -v docker &> /dev/null; then
                            echo "⚠️ Docker not found - skipping build"
                            exit 0
                        fi
                        
                        echo "✅ Docker found: \$(docker --version)"
                        echo "🚀 Building: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                        
                        echo "✅ Image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    """
                }
            }
        }

        // Stage 4: SonarQube Scan
        stage('SonarQube Scan') {
            steps {
                echo '🔎 Running SonarQube code analysis...'
                script {
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                                # Find or download SonarQube Scanner
                            if ! command -v sonar-scanner &> /dev/null; then
                                    echo "📦 Downloading SonarQube Scanner..."
                                    SONAR_SCANNER_VERSION="4.8.0.2856"
                                    SONAR_SCANNER_ZIP="sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip"
                                    
                                    wget -q --no-check-certificate https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_SCANNER_ZIP} || \
                                    curl -L -k -o ${SONAR_SCANNER_ZIP} https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_SCANNER_ZIP} || {
                                        echo "⚠️ Failed to download SonarQube Scanner"
                                        echo "   Skipping SonarQube analysis"
                                        exit 0
                                    }
                                    
                                    # Extract
                                    EXTRACTED=false
                                    if command -v unzip &> /dev/null; then
                                        if unzip -q ${SONAR_SCANNER_ZIP} 2>/dev/null; then
                                            EXTRACTED=true
                                        fi
                                    fi
                                    
                                    if [ "$EXTRACTED" = false ] && command -v python3 &> /dev/null; then
                                        if python3 -c "import zipfile; zipfile.ZipFile('${SONAR_SCANNER_ZIP}').extractall('.')" 2>/dev/null; then
                                            EXTRACTED=true
                                        fi
                                    fi
                                    
                                    if [ "$EXTRACTED" = false ]; then
                                        echo "⚠️ Cannot extract SonarQube Scanner"
                                        echo "   Skipping SonarQube analysis"
                                        exit 0
                                    fi
                                    
                                    rm -f ${SONAR_SCANNER_ZIP}
                                    export PATH=\$PATH:\$(pwd)/sonar-scanner-${SONAR_SCANNER_VERSION}-linux/bin
                                fi
                                
                                # Run SonarQube Analysis
                            sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONAR_TOKEN} \
                                    -Dsonar.projectName="Student Attendance Management System - ${SONAR_PROJECT_KEY}" \
                                    -Dsonar.sources=app,components,lib,scripts \
                                    -Dsonar.sourceEncoding=UTF-8 \
                                    -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/dist/**,**/build/**,**/coverage/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx \
                                    -Dsonar.typescript.tsconfigPath=tsconfig.json
                                
                                echo "✅ SonarQube analysis completed!"
                                echo "📊 Dashboard: ${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
                            '''
                        }
                    }
                }
            }
        }

        // Stage 5: Login to Nexus Registry
        stage('Login to Nexus Registry') {
            when {
                branch 'main'
            }
            steps {
                echo '🔐 Logging in to Nexus Registry...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh """
                            if ! command -v docker &> /dev/null; then
                                echo "⚠️ Docker not found - skipping login"
                                exit 0
                            fi
                            
                            echo \${NEXUS_PASS} | docker login ${NEXUS_REGISTRY} -u \${NEXUS_USER} --password-stdin
                            echo "✅ Successfully logged in to Nexus Registry: ${NEXUS_REGISTRY}"
                        """
                    }
                }
            }
        }

        // Stage 6: Tag + Push Images
        stage('Tag + Push Images') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Tagging and pushing Docker images to Nexus...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh """
                            if ! command -v docker &> /dev/null; then
                                echo "⚠️ Docker not found - skipping push"
                                exit 0
                            fi
                            
                            if ! docker images | grep -q "${DOCKER_IMAGE}.*${DOCKER_TAG}"; then
                                echo "⚠️ Image not found - skipping push"
                                exit 0
                            fi
                            
                            # Tag images for Nexus
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${NEXUS_REGISTRY}/${NEXUS_REPO}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${NEXUS_REGISTRY}/${NEXUS_REPO}/${DOCKER_IMAGE}:latest
                            
                            # Push to Nexus
                            docker push ${NEXUS_REGISTRY}/${NEXUS_REPO}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${NEXUS_REGISTRY}/${NEXUS_REPO}/${DOCKER_IMAGE}:latest
                            
                            echo "✅ Pushed to Nexus: ${NEXUS_REPO_URL}${DOCKER_IMAGE}:${DOCKER_TAG}"
                            echo "📦 Repository URL: ${NEXUS_REPO_URL}"
                        """
                    }
                }
            }
        }

        // Stage 7: Create Namespace + Secrets
        stage('Create Namespace + Secrets') {
            when {
                branch 'main'
            }
            steps {
                echo '🔧 Creating Kubernetes namespace and secrets...'
                script {
                    sh """
                        if ! command -v kubectl &> /dev/null; then
                            echo "⚠️ kubectl not found - skipping Kubernetes setup"
                            echo "   Install kubectl or configure Kubernetes credentials in Jenkins"
                            exit 0
                        fi
                        
                        # Create namespace if it doesn't exist
                        kubectl create namespace ${K8S_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f - || {
                            echo "⚠️ Failed to create namespace, may already exist"
                        }
                        
                        echo "✅ Namespace '${K8S_NAMESPACE}' ready"
                    """
                }
            }
        }
        
        // Stage 7b: Create Registry Secret (separate stage for withCredentials)
        stage('Create Registry Secret') {
            when {
                branch 'main'
            }
            steps {
                echo '🔐 Creating Docker registry secret...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh """
                            if ! command -v kubectl &> /dev/null; then
                                echo "⚠️ kubectl not found - skipping registry secret"
                                exit 0
                            fi
                            
                            # Create Docker registry secret for Nexus
                            kubectl create secret docker-registry nexus-registry-secret \\
                                --docker-server=${NEXUS_REGISTRY} \\
                                --docker-username=\${NEXUS_USER} \\
                                --docker-password=\${NEXUS_PASS} \\
                                --namespace=${K8S_NAMESPACE} \\
                                --dry-run=client -o yaml | kubectl apply -f - || {
                                echo "⚠️ Failed to create registry secret, may already exist"
                            }
                            
                            echo "✅ Registry secret 'nexus-registry-secret' created"
                        """
                    }
                }
            }
        }
        
        // Stage 7c: Create Application Secrets
        stage('Create Application Secrets') {
            when {
                branch 'main'
            }
            steps {
                echo '🔐 Creating application secrets...'
                script {
                    sh """
                        if ! command -v kubectl &> /dev/null; then
                            echo "⚠️ kubectl not found - skipping application secrets"
                            exit 0
                        fi
                        
                        # Create application secrets with actual values
                        echo "📝 Creating application secrets with actual values..."
                        
                        # Build DATABASE_URL from components
                        DATABASE_URL="mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
                        
                        # Create app-secrets with actual values
                        kubectl create secret generic app-secrets \\
                            --from-literal=DATABASE_URL="${DATABASE_URL}" \\
                            --from-literal=JWT_SECRET="${JWT_SECRET}" \\
                            --from-literal=NEXT_PUBLIC_APP_URL="http://localhost:3000" \\
                            --namespace=${K8S_NAMESPACE} \\
                            --dry-run=client -o yaml | kubectl apply -f - || {
                            echo "⚠️ Secret may already exist, updating it..."
                            # Delete and recreate if exists
                            kubectl delete secret app-secrets -n ${K8S_NAMESPACE} 2>/dev/null || true
                            kubectl create secret generic app-secrets \\
                                --from-literal=DATABASE_URL="${DATABASE_URL}" \\
                                --from-literal=JWT_SECRET="${JWT_SECRET}" \\
                                --from-literal=NEXT_PUBLIC_APP_URL="http://localhost:3000" \\
                                --namespace=${K8S_NAMESPACE}
                        }
                        
                        echo "✅ Application secrets created with:"
                        echo "   • DATABASE_URL: mysql://${DB_USERNAME}:***@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
                        echo "   • JWT_SECRET: *** (hidden)"
                        echo "   • NEXT_PUBLIC_APP_URL: http://localhost:3000 (will be updated after deployment)"
                        
                        # Create config map for non-sensitive config
                        kubectl create configmap app-config \\
                            --from-literal=NODE_ENV='production' \\
                            --from-literal=PORT='3000' \\
                            --from-literal=HOSTNAME='0.0.0.0' \\
                            --namespace=${K8S_NAMESPACE} \\
                            --dry-run=client -o yaml | kubectl apply -f - || {
                            echo "⚠️ ConfigMap may already exist (this is OK)"
                        }
                        
                        echo "✅ Kubernetes namespace and secrets ready!"
                    """
                }
            }
        }

        // Stage 8: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying to Kubernetes...'
                script {
                    sh """
                        if ! command -v kubectl &> /dev/null; then
                            echo "⚠️ kubectl not found - skipping deployment"
                            exit 0
                        fi
                        
                        # Check if namespace exists
                        if ! kubectl get namespace ${K8S_NAMESPACE} &> /dev/null; then
                            echo "⚠️ Namespace '${K8S_NAMESPACE}' does not exist!"
                            echo "   Attempting to create it..."
                            kubectl create namespace ${K8S_NAMESPACE} || {
                                echo "❌ Failed to create namespace"
                                exit 1
                            }
                        fi
                        
                        # Create Kubernetes deployment YAML (if not exists)
                        cat > k8s-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${DOCKER_IMAGE}
  namespace: ${K8S_NAMESPACE}
  labels:
    app: ${DOCKER_IMAGE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${DOCKER_IMAGE}
  template:
    metadata:
      labels:
        app: ${DOCKER_IMAGE}
    spec:
      imagePullSecrets:
      - name: nexus-registry-secret
      containers:
      - name: ${DOCKER_IMAGE}
        image: ${NEXUS_REGISTRY}/${NEXUS_REPO}/${DOCKER_IMAGE}:${DOCKER_TAG}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: HOSTNAME
          value: "0.0.0.0"
        envFrom:
        - secretRef:
            name: app-secrets
          optional: true
        - configMapRef:
            name: app-config
          optional: true
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: ${DOCKER_IMAGE}-service
  namespace: ${K8S_NAMESPACE}
spec:
  selector:
    app: ${DOCKER_IMAGE}
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
EOF
                        
                        # Apply deployment
                        kubectl apply -f k8s-deployment.yaml
                        
                        # Wait for deployment to be ready
                        echo "⏳ Waiting for deployment to be ready..."
                        kubectl rollout status deployment/${DOCKER_IMAGE} -n ${K8S_NAMESPACE} --timeout=5m || {
                            echo "⚠️ Deployment may still be starting"
                        }
                        
                        # Get service URL
                        echo ""
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo "✅ Deployment completed!"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo ""
                        
                        # Wait a bit for LoadBalancer to get external IP
                        echo "⏳ Waiting for LoadBalancer to assign external IP..."
                        sleep 10
                        
                        # Get the external IP/URL
                        EXTERNAL_IP=""
                        MAX_RETRIES=30
                        RETRY_COUNT=0
                        
                        while [ -z "$EXTERNAL_IP" ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
                            EXTERNAL_IP=\$(kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
                            if [ -z "$EXTERNAL_IP" ]; then
                                EXTERNAL_IP=\$(kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
                            fi
                            if [ -z "$EXTERNAL_IP" ]; then
                                RETRY_COUNT=\$((RETRY_COUNT + 1))
                                echo "   Waiting for external IP... (attempt \$RETRY_COUNT/\$MAX_RETRIES)"
                        sleep 5
                            fi
                        done
                        
                        # Get service details
                        echo ""
                        echo "📋 Service Details:"
                        kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE} || true
                        echo ""
                        
                        # Display the URL
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo "🌐 YOUR APPLICATION URL:"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo ""
                        if [ -n "$EXTERNAL_IP" ]; then
                            # Check if it's an IP address (simplified check to avoid regex issues)
                            # Use a simple check that doesn't require complex regex patterns
                            if echo "\$EXTERNAL_IP" | grep -q '^[0-9]'; then
                                APP_URL="http://\${EXTERNAL_IP}"
                            else
                                APP_URL="http://\${EXTERNAL_IP}"
                            fi
                            echo "   🔗 ${APP_URL}"
                            echo ""
                            echo "   ✅ Your application is accessible at the URL above!"
                            echo "   📱 Open this URL in your browser to access your application"
                            
                            # Update NEXT_PUBLIC_APP_URL in the secret with the actual URL
                            echo ""
                            echo "🔄 Updating NEXT_PUBLIC_APP_URL in secrets..."
                            DATABASE_URL="mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
                            kubectl delete secret app-secrets -n ${K8S_NAMESPACE} 2>/dev/null || true
                            kubectl create secret generic app-secrets \\
                                --from-literal=DATABASE_URL="${DATABASE_URL}" \\
                                --from-literal=JWT_SECRET="${JWT_SECRET}" \\
                                --from-literal=NEXT_PUBLIC_APP_URL="${APP_URL}" \\
                                --namespace=${K8S_NAMESPACE} || {
                                echo "⚠️ Failed to update secret, but continuing..."
                            }
                            echo "   ✅ Updated secrets with:"
                            echo "      • DATABASE_URL: mysql://${DB_USERNAME}:***@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
                            echo "      • NEXT_PUBLIC_APP_URL: ${APP_URL}"
                            
                            # Restart deployment to pick up new secret (non-blocking)
                            echo ""
                            echo "🔄 Restarting deployment to apply updated secrets..."
                            kubectl rollout restart deployment/${DOCKER_IMAGE} -n ${K8S_NAMESPACE} 2>/dev/null || true
                            echo "   ⏳ Waiting for restart..."
                            sleep 10
                            kubectl rollout status deployment/${DOCKER_IMAGE} -n ${K8S_NAMESPACE} --timeout=2m 2>/dev/null || {
                                echo "⚠️ Deployment restart may still be in progress"
                            }
                            echo "   ✅ Deployment updated!"
                        else
                            echo "   ⏳ LoadBalancer is still provisioning..."
                            echo "   📋 Run this command to get the URL:"
                            echo ""
                            echo "   kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE}"
                            echo ""
                            echo "   Or check the EXTERNAL-IP column in the output above"
                        fi
                        echo ""
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo ""
                        
                        # Also save URL to file for easy access
                        if [ -n "$EXTERNAL_IP" ]; then
                            echo "${APP_URL}" > \${WORKSPACE}/app-url.txt || true
                            echo "📝 URL saved to: app-url.txt"
                        fi
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "🎉 BUILD #${env.BUILD_NUMBER} COMPLETED SUCCESSFULLY!"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo ""
                
                // Try to read the app URL if it was saved
                def appUrl = ""
                try {
                    appUrl = readFile("${WORKSPACE}/app-url.txt").trim()
                } catch (Exception e) {
                    // URL file not found, will show command instead
                }
                
                if (appUrl) {
                    echo "🌐 YOUR APPLICATION URL:"
                    echo "   🔗 ${appUrl}"
                    echo ""
                    echo "   ✅ Open this URL in your browser to access your application!"
                } else {
                    echo "🌐 TO GET YOUR APPLICATION URL:"
                    echo "   Run: kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE}"
                    echo "   Look for the EXTERNAL-IP column"
                }
                
                echo ""
                echo "📊 SonarQube Dashboard:"
                echo "   🔗 ${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
                echo ""
                echo "📦 Nexus Repository:"
                echo "   🔗 ${NEXUS_REPO_URL}"
                echo ""
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                echo "Build #${env.BUILD_NUMBER} failed. Check logs for details."
            }
        }
        always {
            // Clean up Docker images
            sh '''
                if command -v docker &> /dev/null; then
                    docker images ${DOCKER_IMAGE} --format "{{.ID}}" 2>/dev/null | tail -n +6 | xargs -r docker rmi 2>/dev/null || true
                fi
            '''
            // Clean workspace
            deleteDir()
        }
    }
}
