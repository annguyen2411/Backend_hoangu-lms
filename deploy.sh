#!/bin/bash
set -e

echo "Starting deployment..."

# Server configuration
SERVER_HOST="${SERVER_HOST}"
SERVER_USER="${SERVER_USER}"
APP_DIR="/var/www/hoangu-lms"

# SSH connection
SSH_CMD="ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST}"

# Pull latest docker images
echo "Pulling latest images..."
${SSH_CMD} "docker pull ${REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}"
${SSH_CMD} "docker pull ${REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}"

# Stop and remove old containers
echo "Stopping old containers..."
${SSH_CMD} "cd ${APP_DIR} && docker-compose down"

# Update docker-compose.yml with new image tags
echo "Updating image tags..."
${SSH_CMD} "cd ${APP_DIR} && sed -i 's|image:.*-frontend:.*|image: ${REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}|' docker-compose.yml"
${SSH_CMD} "cd ${APP_DIR} && sed -i 's|image:.*-backend:.*|image: ${REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}|' docker-compose.yml"

# Pull and restart containers
echo "Starting new containers..."
${SSH_CMD} "cd ${APP_DIR} && docker-compose pull"
${SSH_CMD} "cd ${APP_DIR} && docker-compose up -d"

# Wait for containers to be healthy
echo "Waiting for containers to be healthy..."
sleep 30

# Check container status
${SSH_CMD} "cd ${APP_DIR} && docker-compose ps"

# Clean up old images
echo "Cleaning up old images..."
${SSH_CMD} "docker image prune -f"

echo "Deployment completed successfully!"
