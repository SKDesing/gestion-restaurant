#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512"
LOG_FILE="$DEPLOY_DIR/logs/deploy-$(date +%Y%m%d_%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "🚀 DÉPLOIEMENT - $(date)"
cd "$DEPLOY_DIR"

# Load environment
export NODE_ENV=production
[ -f .env.local ] && set -a && source .env.local && set +a

echo "📥 Pull latest..."
git pull origin main || true

echo "📦 Install dependencies..."
pnpm install --frozen-lockfile

echo "🗄️  Prisma setup..."
if [ -n "${DATABASE_URL:-}" ]; then
  npx prisma generate
  npx prisma migrate deploy
else
  echo "⚠️  DATABASE_URL not set, skipping migrations"
  npx prisma generate
fi

echo "🏗️  Build..."
pnpm build

echo "📋 Copy Prisma engines..."
mkdir -p .next/standalone/node_modules/.prisma/client/
cp -v node_modules/.prisma/client/*.node .next/standalone/node_modules/.prisma/client/ 2>/dev/null || true

echo "♻️  PM2 restart..."
npx pm2 startOrRestart ecosystem.config.js --env production
npx pm2 save

echo "⏳ Wait for startup (30s max)..."
for i in {1..30}; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/login || echo "000")
  if [[ $code =~ ^[23] ]]; then
    echo "✅ Server responded after ${i}s (HTTP $code)"
    break
  fi
  sleep 1
done

echo "🔍 Final health check..."
curl -f http://localhost:3000/auth/login || echo "⚠️  Health check failed"

echo "✅ DÉPLOIEMENT TERMINÉ - $(date)"
npx pm2 status
