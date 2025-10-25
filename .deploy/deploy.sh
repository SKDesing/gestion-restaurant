#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512"
LOG_FILE="$DEPLOY_DIR/logs/deploy-$(date +%Y%m%d_%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "🚀 DÉPLOIEMENT - $(date)"

echo "cd \"$DEPLOY_DIR\""
cd "$DEPLOY_DIR"

echo "📥 Pull latest changes..."
git pull origin main || true

echo "📦 Install dependencies..."
pnpm install --frozen-lockfile || true

echo "🗄️  Prisma migrate..."
npx prisma generate || true
npx prisma migrate deploy || true

echo "🏗️  Build application..."
pnpm build || true

echo "📋 Copy Prisma engines..."
mkdir -p .next/standalone/node_modules/.prisma/client/
cp -v node_modules/.prisma/client/*.node .next/standalone/node_modules/.prisma/client/ 2>/dev/null || true

echo "♻️  Reload PM2..."
npx pm2 reload restaurant-app || true

echo "⏳ Wait for startup..."
sleep 5

echo "🔍 Health check..."
curl -f http://localhost:3000/auth/login || echo "⚠️  Health check failed"

echo "✅ DÉPLOIEMENT TERMINÉ - $(date)"
npx pm2 status || true
