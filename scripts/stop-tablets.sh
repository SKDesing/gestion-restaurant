#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping tablets...${NC}"

pkill -f "chromium.*app.*localhost" 2>/dev/null || true
rm -f /tmp/tablet-*.pid

if [ -f /tmp/nextjs-server.pid ]; then
  SERVER_PID=$(cat /tmp/nextjs-server.pid)
  echo -e "${YELLOW}Stopping Next.js server (PID: $SERVER_PID)...${NC}"
  kill $SERVER_PID 2>/dev/null || true
  rm -f /tmp/nextjs-server.pid
fi

rm -rf /tmp/chromium-profiles/* || true

echo -e "${GREEN}✅ All tablets stopped${NC}"
