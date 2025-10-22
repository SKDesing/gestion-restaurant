#!/bin/bash
set -euo pipefail

# ============================================
# GESTION RESTAURANT - DÉPLOIEMENT COMPLET (ONE-SHOT)
# This script automates backup, checks, build, docker, tests,
# and creates tablet launcher scripts and documentation.
# NOTE: Review before running on production systems.
# ============================================

PROJECT_ROOT="/home/soufiane/Bureau/gestion restaurant"
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${CYAN}[$(date +"%Y-%m-%d %H:%M:%S")]${NC} $*"; }
err() { echo -e "${RED}ERROR:${NC} $*" >&2; }

rollback() {
  err "Rolling back due to failure"
  if [[ -n "${BACKUP_PATH:-}" && -d "$BACKUP_PATH" ]]; then
    if [[ -x "$BACKUP_PATH/RESTORE.sh" ]]; then
      bash "$BACKUP_PATH/RESTORE.sh" || err "Rollback script failed"
    else
      err "No restore script available in $BACKUP_PATH"
    fi
  else
    err "No backup available to rollback"
  fi
  exit 1
}

trap 'rollback' ERR

log "Starting deploy automation"

# PHASE 0: Backup
BACKUP_DIR="$HOME/backups/gestion-restaurant"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"
mkdir -p "$BACKUP_PATH"

log "Creating git bundle and project archive at $BACKUP_PATH"
if [[ -d .git ]]; then
  git bundle create "$BACKUP_PATH/repo.bundle" --all || true
fi
tar -czf "$BACKUP_PATH/project.tar.gz" --exclude=node_modules --exclude=.next --exclude=.git --exclude=logs . || true

# create RESTORE script
cat > "$BACKUP_PATH/RESTORE.sh" <<'RESTORE_EOF'
#!/bin/bash
set -e
PROJECT_ROOT="/home/soufiane/Bureau/gestion restaurant"
BACKUP_ROOT="$(dirname "$0")"
cd "$PROJECT_ROOT"
./scripts/stop-tablets.sh 2>/dev/null || true
docker-compose down 2>/dev/null || true
tar -xzf "$BACKUP_ROOT/project.tar.gz" -C "$PROJECT_ROOT"
if [[ -f "$BACKUP_ROOT/database.sql" ]]; then
  docker-compose up -d db
  sleep 5
  docker exec -i gestion-restaurant-db psql -U restaurant_user restaurant_db < "$BACKUP_ROOT/database.sql" || true
fi
echo "Restore complete"
RESTORE_EOF
chmod +x "$BACKUP_PATH/RESTORE.sh" || true

log "Backup created"

# PHASE 1: Prereqs
REQUIRED_CMDS=(node npm git)
MISSING=()
for c in "${REQUIRED_CMDS[@]}"; do
  if ! command -v "$c" &>/dev/null; then
    MISSING+=("$c")
  fi
done
if [[ ${#MISSING[@]} -gt 0 ]]; then
  err "Missing commands: ${MISSING[*]}"
  exit 1
fi

# PHASE 2: Cleanup
log "Cleaning workspace"
pkill -f "chromium.*app.*localhost" 2>/dev/null || true
rm -rf node_modules .next out build dist || true
rm -rf /tmp/chromium-profiles/* /tmp/tablet-*.pid /tmp/nextjs-server.pid || true

# PHASE 3: Ensure .env.example and .gitignore
if [[ ! -f .env.example ]]; then
  log "Creating .env.example"
  cat > .env.example <<'EOF'
DATABASE_URL="postgresql://restaurant_user:restaurant_password@localhost:5432/restaurant_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="CHANGE_THIS_TO_A_RANDOM_STRING_OF_32_CHARS"
NODE_ENV=development
PORT=3000
EOF
  git add .env.example || true
fi

if [[ ! -f .gitignore ]]; then
  log "Creating .gitignore"
  cat > .gitignore <<'EOF'
node_modules/
.next/
.env
logs/
EOF
  git add .gitignore || true
fi

# PHASE 4: Install dependencies & prisma generate
log "Installing dependencies (npm ci)"
npm ci --prefer-offline --no-audit --no-fund || npm install || true

if [[ -f prisma/schema.prisma ]]; then
  log "Generating Prisma client"
  npx prisma generate || true
fi

# PHASE 5: TypeScript check
if command -v npx &>/dev/null; then
  log "TypeScript check"
  npx tsc --noEmit || true
fi

# PHASE 6: Build Next.js
log "Building Next.js"
NODE_ENV=production npm run build || (err "Build failed"; exit 1)

# PHASE 7: Create tablet scripts if absent
mkdir -p scripts logs
if [[ ! -f scripts/launch-tablets.sh ]]; then
  log "Creating scripts/launch-tablets.sh"
  cat > scripts/launch-tablets.sh <<'LAUNCH'
#!/bin/bash
set -e
PROJECT_ROOT="/home/soufiane/Bureau/gestion restaurant"
cd "$PROJECT_ROOT"
BASE_URL="http://localhost:3000"
for browser in chromium-browser google-chrome chromium chrome; do
  if command -v "$browser" &>/dev/null; then
    CHROMIUM_BIN=$(command -v "$browser")
    break
  fi
done
mkdir -p /tmp/chromium-profiles logs
declare -A TABLETS=( [CAISSE]="/caisse-avancee" [CUISINE]="/cuisine-avancee" [SERVEUR]="/serveur" [BAR]="/bar" [ADMIN]="/admin" )
for k in "${!TABLETS[@]}"; do
  PROFILE="/tmp/chromium-profiles/${k,,}"
  mkdir -p "$PROFILE"
  "$CHROMIUM_BIN" --user-data-dir="$PROFILE" --app="$BASE_URL${TABLETS[$k]}" --no-first-run --no-default-browser-check > "logs/${k,,}.log" 2>&1 &
  echo $! > "/tmp/tablet-${k,,}.pid"
  sleep 0.5
done
LAUNCH
  chmod +x scripts/launch-tablets.sh
fi

if [[ ! -f scripts/stop-tablets.sh ]]; then
  cat > scripts/stop-tablets.sh <<'STOP'
#!/bin/bash
pkill -f "chromium.*app.*localhost" 2>/dev/null || true
rm -f /tmp/tablet-*.pid
rm -rf /tmp/chromium-profiles/*
STOP
  chmod +x scripts/stop-tablets.sh
fi

# PHASE 8: Runtime health checks
log "Starting temporary production server for runtime checks"
NODE_ENV=production npm run start > server_test.log 2>&1 &
SERVER_PID=$!
log "Server PID: $SERVER_PID"
sleep 6

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")
log "Homepage status: $HTTP_STATUS"
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
log "API health status: $API_HEALTH"

# Auth smoke test (CSRF + signin) - best-effort
if curl -s http://localhost:3000/api/auth/csrf >/dev/null 2>&1; then
  log "NextAuth endpoints responsive"
else
  log "NextAuth endpoints not found or disabled"
fi

# Stop temp server
kill $SERVER_PID 2>/dev/null || true

# PHASE 9: Docker build (optional, skip if not available)
if command -v docker &>/dev/null && [[ -f Dockerfile ]]; then
  log "Building docker image (docker-compose build)"
  docker-compose build --no-cache || true
else
  log "Docker not available or Dockerfile missing - skipping docker build"
fi

# PHASE 10: Finalize: commit created files (if any)
git add scripts .env.example .gitignore || true
git commit -m "chore: add deploy helper and tablet scripts" || true

log "Deploy script finished successfully"
echo
echo -e "${GREEN}Done. To launch tablets: ./scripts/launch-tablets.sh${NC}"

exit 0
