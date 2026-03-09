#!/bin/bash
set -e

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building and starting containers..."
docker compose -f docker-compose.prod.yml up --build -d

echo "==> Waiting for app to be ready..."
sleep 10

echo "==> Checking status..."
docker compose -f docker-compose.prod.yml ps

echo ""
echo "Deployment complete! Site: https://ichara.ma"
