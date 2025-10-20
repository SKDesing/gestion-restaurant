#!/bin/bash

set -euo pipefail

PROJECT_ROOT="/home/soufiane/Bureau/gestion restaurant"
cd "$PROJECT_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   🍽️  GESTION RESTAURANT - TABLETTES${NC}"
echo -e "${BLUE}================================================${NC}"
echo

# Prefer env override, otherwise probe common local dev/prod ports
if [ -n "${NEXT_PUBLIC_BASE_URL-}" ]; then
  BASE_URL="$NEXT_PUBLIC_BASE_URL"
else
  # probe 4001 (custom server), then 3000
  if curl -s "http://127.0.0.1:4001" > /dev/null 2>&1; then
    BASE_URL="http://127.0.0.1:4001"
  else
    BASE_URL="http://127.0.0.1:3000"
  fi
fi
CHROMIUM_BIN="/usr/bin/chromium-browser"

if [ ! -x "$CHROMIUM_BIN" ]; then
  if [ -x "/usr/bin/google-chrome" ]; then
    CHROMIUM_BIN="/usr/bin/google-chrome"
  elif [ -x "/usr/bin/chromium" ]; then
    CHROMIUM_BIN="/usr/bin/chromium"
  else
    echo -e "${RED}❌ Chromium or Chrome not found. Install: sudo apt install chromium-browser${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✅ Browser found: $CHROMIUM_BIN${NC}"

declare -A TABLETS=(
  [CAISSE]="$BASE_URL/caisse-avancee"
  [CUISINE]="$BASE_URL/cuisine-avancee"
  [SERVEUR]="$BASE_URL/serveur"
  [BAR]="$BASE_URL/bar"
  [ADMIN]="$BASE_URL/admin"
)

declare -A POSITIONS=(
  [CAISSE]="0,0"
  [CUISINE]="960,0"
  [SERVEUR]="0,540"
  [BAR]="960,540"
  [ADMIN]="1920,0"
)

declare -A SIZES=(
  [CAISSE]="960,540"
  [CUISINE]="960,540"
  [SERVEUR]="960,540"
  [BAR]="960,540"
  [ADMIN]="1920,1080"
)

echo -e "${YELLOW}🔍 Checking Next.js server...${NC}"
if ! curl -s "$BASE_URL" > /dev/null; then
  echo -e "${YELLOW}⚠️  Server not running. Starting dev server...${NC}"
  mkdir -p logs
  npm run dev > logs/nextjs.log 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" > /tmp/nextjs-server.pid
  echo -e "${BLUE}⏳ Waiting for server start (15s)...${NC}"
  sleep 15
  if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✅ Server started (PID: $SERVER_PID)${NC}"
  else
    echo -e "${RED}❌ Server failed to start.${NC}"
    tail -n 40 logs/nextjs.log || true
    exit 1
  fi
else
  echo -e "${GREEN}✅ Server already running${NC}"
fi

echo -e "${YELLOW}🧹 Cleaning old chromium windows...${NC}"
pkill -f "chromium.*app.*localhost" 2>/dev/null || true
sleep 1

mkdir -p logs
mkdir -p /tmp/chromium-profiles

echo -e "${BLUE}🚀 Launching tablets...${NC}"

for TABLET_NAME in "${!TABLETS[@]}"; do
  URL="${TABLETS[$TABLET_NAME]}"
  POSITION="${POSITIONS[$TABLET_NAME]}"
  SIZE="${SIZES[$TABLET_NAME]}"

  IFS=',' read -r X Y <<< "$POSITION"
  IFS=',' read -r WIDTH HEIGHT <<< "$SIZE"

  echo -e "${GREEN}📱 Launching $TABLET_NAME...${NC}"
  echo "  URL: $URL"
  echo "  Position: $X,$Y"
  echo "  Size: ${WIDTH}x${HEIGHT}"

  PROFILE_DIR="/tmp/chromium-profiles/${TABLET_NAME,,}"
  mkdir -p "$PROFILE_DIR"

  "$CHROMIUM_BIN" \
    --user-data-dir="$PROFILE_DIR" \
    --app="$URL" \
    --window-position=$X,$Y \
    --window-size=$WIDTH,$HEIGHT \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --no-first-run \
    --no-default-browser-check \
    --disable-translate \
    --disable-features=TranslateUI \
    --disable-sync \
    --disable-background-networking \
    --disable-default-apps \
    --disable-extensions \
    --disable-component-update \
    --kiosk-printing \
    --autoplay-policy=no-user-gesture-required \
    > "logs/${TABLET_NAME,,}.log" 2>&1 &

  TABLET_PID=$!
  echo "  PID: $TABLET_PID"
  echo "$TABLET_PID" > "/tmp/tablet-${TABLET_NAME,,}.pid"
  echo
  sleep 1
done

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ ALL TABLETS LAUNCHED${NC}"
echo -e "${GREEN}================================================${NC}"
echo
echo -e "${YELLOW}Controls:${NC}"
echo "  Stop all tablets: ./scripts/stop-tablets.sh"
echo "  Restart a tablet: ./scripts/restart-tablet.sh CAISSE"
echo "  Logs: tail -f logs/*.log"

cat > /tmp/tablets-config.txt <<CONF
BASE_URL=$BASE_URL
CHROMIUM_BIN=$CHROMIUM_BIN
LAUNCHED_AT=$(date +"%Y-%m-%d %H:%M:%S")
TABLETS=${!TABLETS[@]}
CONF

echo -e "${GREEN}✅ Ready for service!${NC}"
