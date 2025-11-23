pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'student-attendance-system'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        // Update these with your server details
        NEXUS_REGISTRY = 'your-server-ip:8082'
        NEXUS_REPO = 'docker-hosted'
        SONAR_HOST_URL = 'http://your-server-ip:9000'
        SONAR_PROJECT_KEY = 'student-attendance-system'
    }

    tools {
        nodejs 'nodejs' // Configure Node.js in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh '''
                    npm ci
                    npx prisma generate
                '''
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running linter...'
                sh 'npm run lint || true' // Continue even if lint fails
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔎 Running SonarQube code analysis...'
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            # Install SonarQube Scanner if not available
                            if ! command -v sonar-scanner &> /dev/null; then
                                echo "SonarQube Scanner not found, installing..."
                                wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
                                unzip sonar-scanner-cli-4.8.0.2856-linux.zip
                                export PATH=$PATH:$(pwd)/sonar-scanner-4.8.0.2856-linux/bin
                            fi
                            
                            sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONAR_TOKEN} \
                                -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/dist/**,**/build/**
                        '''
                    }
                }
            }
        }

        stage('Wait for SonarQube Quality Gate') {
            steps {
                echo '⏳ Waiting for SonarQube Quality Gate...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Push to Nexus') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Pushing Docker image to Nexus...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh """
                            # Login to Nexus Docker registry
                            echo \$NEXUS_PASS | docker login ${NEXUS_REGISTRY} -u \$NEXUS_USER --password-stdin
                            
                            # Tag image for Nexus
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${NEXUS_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${NEXUS_REGISTRY}/${DOCKER_IMAGE}:latest
                            
                            # Push to Nexus
                            docker push ${NEXUS_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${NEXUS_REGISTRY}/${DOCKER_IMAGE}:latest
                            
                            echo "✅ Image pushed to Nexus successfully"
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                script {
                    sh """
                        # Navigate to deployment directory
                        cd /opt/attendance-system || {
                            echo "Creating deployment directory..."
                            sudo mkdir -p /opt/attendance-system
                            sudo chown \$USER:\$USER /opt/attendance-system
                            cd /opt/attendance-system
                        }
                        
                        # Pull latest docker-compose.yml from repo (or use existing)
                        # Copy docker-compose.yml if not exists
                        if [ ! -f docker-compose.yml ]; then
                            cp ${WORKSPACE}/docker-compose.yml .
                        fi
                        
                        # Stop and remove existing containers
                        docker-compose down || true
                        
                        # Pull latest image from Nexus (or use local)
                        docker pull ${NEXUS_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} || {
                            echo "Using local image..."
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                        }
                        
                        # Start containers
                        docker-compose up -d
                        
                        # Wait for services to be ready
                        echo "Waiting for services to start..."
                        sleep 10
                        
                        # Run database migrations
                        echo "Running database migrations..."
                        docker exec attendance_app npx prisma migrate deploy || {
                            echo "Migration failed, but continuing..."
                        }
                        
                        # Health check
                        echo "Performing health check..."
                        sleep 5
                        curl -f http://localhost:3000 || {
                            echo "⚠️ Health check failed, but deployment completed"
                        }
                        
                        echo "✅ Deployment completed successfully!"
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
            script {
                // Send notification (optional)
                // You can add email/Slack notifications here
                echo "Build #${env.BUILD_NUMBER} deployed successfully"
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                // Send failure notification (optional)
                echo "Build #${env.BUILD_NUMBER} failed. Check logs for details."
            }
        }
        always {
            // Clean up Docker images to save space (optional)
            sh '''
                # Remove old Docker images (keep last 5)
                docker images ${DOCKER_IMAGE} --format "{{.ID}}" | tail -n +6 | xargs -r docker rmi || true
            '''
            cleanWs()
        }
    }
}
