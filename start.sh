#!/bin/bash

# Configuration
SERVICES=("auth-service" "product-service")

echo "🚀 Starting Furniture Backend Services Setup..."

# 1. Install Dependencies
for SERVICE in "${SERVICES[@]}"; do
  echo -e "\n📦 Installing dependencies for $SERVICE..."
  if [ -d "$SERVICE" ]; then
    cd "$SERVICE" || exit
    npm install
    cd ..
  else
    echo "⚠️ Warning: Directory $SERVICE not found."
  fi
done

# 2. Start Services in PM2
echo -e "\n⚙️ Initializing PM2 processes..."

# Stop any existing processes first to avoid duplicates
pm2 delete all 2>/dev/null

for SERVICE in "${SERVICES[@]}"; do
  echo "▶️ Starting $SERVICE..."
  NODE_ENV=development pm2 start ./index.mjs \
    --name "$SERVICE" \
    --watch . \
    --ignore-watch "node_modules logs" \
    --cwd ./"$SERVICE"
done

echo -e "\n✅ All services started! Current status:"
pm2 status
