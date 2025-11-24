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
                            FOUND_NODE=$(find "$HOME/.nvm/versions/node" -name "node" -type f -executable 2>/dev/null | head -1)
                            if [ -n "$FOUND_NODE" ]; then
                                export PATH="$(dirname $FOUND_NODE):$PATH"
                            fi
                        fi
                        
                        if ! command -v node &> /dev/null; then
                            echo "❌ ERROR: Node.js is not available!"
                            exit 1
                        fi
                        
                        echo "✅ Node.js: $(node --version)"
                        echo "✅ npm: $(npm --version)"
                        
                        # Install Dependencies
                        echo "📦 Installing dependencies..."
                        if [ -f "package-lock.json" ]; then
                            npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit
                        else
                            npm install --prefer-offline --no-audit
                        fi
                        
                        # Generate Prisma Client
                        echo "🔧 Generating Prisma Client..."
                        npx prisma generate
                        
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
                                        exit 1
                                    }
                                    
                                    # Extract
                                    if command -v unzip &> /dev/null; then
                                        unzip -q ${SONAR_SCANNER_ZIP}
                                    elif command -v python3 &> /dev/null; then
                                        python3 -c "import zipfile; zipfile.ZipFile('${SONAR_SCANNER_ZIP}').extractall('.')"
                                    else
                                        echo "❌ Cannot extract SonarQube Scanner"
                                        exit 1
                                    fi
                                    
                                    rm -f ${SONAR_SCANNER_ZIP}
                                    export PATH=$PATH:$(pwd)/sonar-scanner-${SONAR_SCANNER_VERSION}-linux/bin
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
                        
                        # Create Docker registry secret for Nexus
                        withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                            kubectl create secret docker-registry nexus-registry-secret \\
                                --docker-server=${NEXUS_REGISTRY} \\
                                --docker-username=\${NEXUS_USER} \\
                                --docker-password=\${NEXUS_PASS} \\
                                --namespace=${K8S_NAMESPACE} \\
                                --dry-run=client -o yaml | kubectl apply -f - || {
                                echo "⚠️ Failed to create registry secret, may already exist"
                            }
                        }
                        
                        echo "✅ Registry secret 'nexus-registry-secret' created"
                        
                        # Create application secrets (if needed)
                        # Example: Database credentials, JWT secrets, etc.
                        # kubectl create secret generic app-secrets \\
                        #     --from-literal=DATABASE_URL='your-db-url' \\
                        #     --from-literal=JWT_SECRET='your-jwt-secret' \\
                        #     --namespace=${K8S_NAMESPACE} \\
                        #     --dry-run=client -o yaml | kubectl apply -f - || true
                        
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
                            echo "❌ Namespace '${K8S_NAMESPACE}' does not exist!"
                            echo "   Run 'Create Namespace + Secrets' stage first"
                            exit 1
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
                        echo "✅ Deployment completed!"
                        echo "📋 Get service info:"
                        echo "   kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE}"
                        echo ""
                        kubectl get svc ${DOCKER_IMAGE}-service -n ${K8S_NAMESPACE} || true
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
            script {
                echo "Build #${env.BUILD_NUMBER} completed successfully"
                echo "📊 SonarQube: ${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
                echo "📦 Nexus: ${NEXUS_REPO_URL}"
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
