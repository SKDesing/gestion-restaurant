#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Generating PROJECT_STRUCTURE.txt"
tree -L 4 -I 'node_modules|.next|.git|dist|build' > PROJECT_STRUCTURE.txt || true

echo "Generating CONFIG_FILES.txt"
find . -maxdepth 2 -type f \( -name "*.config.*" -o -name "*.json" -o -name ".env*" -o -name "Dockerfile*" -o -name "docker-compose*" -o -name ".gitignore" \) -not -path "./node_modules/*" | sort > CONFIG_FILES.txt || true

echo "Generating DEPENDENCIES_SNAPSHOT.json"
jq '{name: .name, version: .version, dependencies: (.dependencies|keys), devDependencies: (.devDependencies|keys)}' package.json > DEPENDENCIES_SNAPSHOT.json

echo "Generating GIT_STATUS and history"
git status --porcelain > GIT_STATUS.txt || true
git log --oneline --graph --all -20 > GIT_HISTORY.txt || true
git branch -av > GIT_BRANCHES.txt || true
git remote -v > GIT_REMOTES.txt || true

echo "Checking incoherences"
echo "=== ANALYSE D'INCOHERENCES ===" > INCOHERENCES.txt
echo "" >> INCOHERENCES.txt
echo "--- Next.js Config vs Package.json ---" >> INCOHERENCES.txt
grep -o "next.*[0-9]\+\.[0-9]\+\.[0-9]\+" package.json 2>/dev/null >> INCOHERENCES.txt || true
cat next.config.* 2>/dev/null | head -20 >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- Prisma Schema vs .env ---" >> INCOHERENCES.txt
grep "provider" prisma/schema.prisma 2>/dev/null >> INCOHERENCES.txt || true
grep "DATABASE_URL" .env.example .env 2>/dev/null >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- NextAuth Configuration ---" >> INCOHERENCES.txt
find . -type f -name "*auth*" ! -path "*/node_modules/*" ! -path "*/.next/*" >> INCOHERENCES.txt || true
grep -r "NEXTAUTH" .env.example .env 2>/dev/null >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- Docker Configuration ---" >> INCOHERENCES.txt
ls -la Dockerfile* docker-compose* 2>/dev/null >> INCOHERENCES.txt || true
docker ps -a 2>/dev/null | grep -E "postgres|gestion" >> INCOHERENCES.txt || true

echo "Creating INITIAL_AUDIT.md"
cat > INITIAL_AUDIT.md << 'EOF'
# Audit Initial - $(date +"%Y-%m-%d %H:%M:%S")

## Structure Projet
`$(cat PROJECT_STRUCTURE.txt | sed -e "s/`/`\\`/g")`

## Fichiers Configuration
`$(cat CONFIG_FILES.txt | sed -e "s/`/`\\`/g")`

## État Git
**Branche Actuelle:** `$(git branch --show-current 2>/dev/null || echo "unknown")`
**Derniers Commits:**
`$(cat GIT_HISTORY.txt | sed -e "s/`/`\\`/g")`

## Dépendances
`$(cat DEPENDENCIES_SNAPSHOT.json | sed -e "s/`/`\\`/g")`

## Incohérences Détectées
`$(cat INCOHERENCES.txt | sed -e "s/`/`\\`/g")`

## Actions Requises
À compléter après analyse
EOF

echo "Initial audit files generated:"
ls -lh PROJECT_STRUCTURE.txt CONFIG_FILES.txt DEPENDENCIES_SNAPSHOT.json GIT_STATUS.txt GIT_HISTORY.txt GIT_BRANCHES.txt GIT_REMOTES.txt INCOHERENCES.txt INITIAL_AUDIT.md || true

echo "Done"
