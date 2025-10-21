#!/bin/bash

set -euo pipefail

if [ -z "${1-}" ]; then
  echo "Usage: $0 <CAISSE|CUISINE|SERVEUR|BAR|ADMIN>"
  exit 1
fi

TABLET_NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
TABLET_LOWER=$(echo "$1" | tr '[:upper:]' '[:lower:]')

if [ ! -f /tmp/tablets-config.txt ]; then
  echo "❌ No configuration found. Run launch-tablets.sh first."
  exit 1
fi

source /tmp/tablets-config.txt

if [ -f "/tmp/tablet-${TABLET_LOWER}.pid" ]; then
  OLD_PID=$(cat "/tmp/tablet-${TABLET_LOWER}.pid")
  kill $OLD_PID 2>/dev/null || true
  rm -f "/tmp/tablet-${TABLET_LOWER}.pid"
fi

echo "🔄 Restarting tablet $TABLET_NAME..."

case $TABLET_NAME in
  CAISSE)
    URL="$BASE_URL/caisse-avancee"; POS="0,0"; SIZE="960,540";;
  CUISINE)
    URL="$BASE_URL/cuisine-avancee"; POS="960,0"; SIZE="960,540";;
  SERVEUR)
    URL="$BASE_URL/serveur"; POS="0,540"; SIZE="960,540";;
  BAR)
    URL="$BASE_URL/bar"; POS="960,540"; SIZE="960,540";;
  ADMIN)
    URL="$BASE_URL/admin"; POS="1920,0"; SIZE="1920,1080";;
  *)
    echo "❌ Unknown tablet: $TABLET_NAME"; exit 1;;
esac

IFS=',' read -r X Y <<< "$POS"
IFS=',' read -r WIDTH HEIGHT <<< "$SIZE"

PROFILE_DIR="/tmp/chromium-profiles/${TABLET_LOWER}"
mkdir -p "$PROFILE_DIR"

"$CHROMIUM_BIN" \
  --user-data-dir="$PROFILE_DIR" \
  --app="$URL" \
  --window-position=$X,$Y \
  --window-size=$WIDTH,$HEIGHT \
  --disable-infobars \
  --no-first-run \
  > "logs/${TABLET_LOWER}.log" 2>&1 &

NEW_PID=$!
echo "$NEW_PID" > "/tmp/tablet-${TABLET_LOWER}.pid"

echo "✅ $TABLET_NAME restarted (PID: $NEW_PID)"
