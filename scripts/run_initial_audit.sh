#!/bin/bash
set -euo pipefail
ROOT="/home/soufiane/Bureau/gestion restaurant"
cd "$ROOT"

# Generate project tree (limit depth to 4)
tree -L 4 -I 'node_modules|.next|.git|dist|build' > PROJECT_STRUCTURE.txt || true

# Identify config files
find . -maxdepth 2 -type f \( -name "*.config.*" -o -name "*.json" -o -name ".env*" -o -name "Dockerfile*" -o -name "docker-compose*" -o -name ".gitignore" \) | sort > CONFIG_FILES.txt || true

# Snapshot dependencies (if package.json exists)
if [ -f package.json ]; then
  cat package.json | jq '{name, version, dependencies: (.dependencies // {} ) | keys, devDependencies: (.devDependencies // {}) | keys}' > DEPENDENCIES_SNAPSHOT.json || true
fi

# Git state
git status --porcelain > GIT_STATUS.txt || true
git log --oneline --graph --all -20 > GIT_HISTORY.txt || true
git branch -av > GIT_BRANCHES.txt || true
git remote -v > GIT_REMOTES.txt || true

# Detect potential incoherences
echo "=== ANALYSE D'INCOHERENCES ===" > INCOHERENCES.txt
echo "" >> INCOHERENCES.txt

echo "--- Next.js Config vs Package.json ---" >> INCOHERENCES.txt
grep -o "next.*[0-9]\+\.[0-9]\+\.[0-9]\+" package.json 2>/dev/null >> INCOHERENCES.txt || true
head -n 40 next.config.* 2>/dev/null >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- Prisma Schema vs .env ---" >> INCOHERENCES.txt
grep "provider" prisma/schema.prisma 2>/dev/null >> INCOHERENCES.txt || true
grep "DATABASE_URL" .env.example .env 2>/dev/null >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- NextAuth Configuration ---" >> INCOHERENCES.txt
find . -type f -name "*auth*" ! -path "*/node_modules/*" ! -path "*/.next/*" >> INCOHERENCES.txt 2>/dev/null || true
grep -r "NEXTAUTH" .env.example .env 2>/dev/null >> INCOHERENCES.txt || true

echo "" >> INCOHERENCES.txt
echo "--- Docker Configuration ---" >> INCOHERENCES.txt
ls -la Dockerfile* docker-compose* 2>/dev/null >> INCOHERENCES.txt || true
docker ps -a --format '{{.Names}} {{.Image}}' 2>/dev/null | grep -E "postgres|gestion" >> INCOHERENCES.txt || true

# Create initial audit
cat > INITIAL_AUDIT.md << 'EOF'
# Audit Initial - $(date +"%Y-%m-%d %H:%M:%S")

## Structure Projet
$(cat PROJECT_STRUCTURE.txt 2>/dev/null || echo 'N/A')

## Fichiers Configuration
$(cat CONFIG_FILES.txt 2>/dev/null || echo 'N/A')

## État Git
**Branche Actuelle:** $(git branch --show-current 2>/dev/null || echo 'unknown')
**Derniers Commits:**
$(cat GIT_HISTORY.txt 2>/dev/null || echo 'N/A')

## Dépendances
$(cat DEPENDENCIES_SNAPSHOT.json 2>/dev/null || echo 'N/A')

## Incohérences Détectées
$(cat INCOHERENCES.txt 2>/dev/null || echo 'N/A')

## Actions Requises
- À revoir manuellement: NextAuth cookie settings in production, Docker env vars, and any tracked .env files.
EOF

echo "✅ ÉTAPE 0 TERMINÉE - Fichiers générés:"
ls -lh *.{txt,json,md} 2>/dev/null | tail -n 20 || true

echo "\n--- CONTENT OF INCOHERENCES.txt ---\n"
sed -n '1,200p' INCOHERENCES.txt || true

echo "\n--- CONTENT OF INITIAL_AUDIT.md ---\n"
sed -n '1,240p' INITIAL_AUDIT.md || true

echo "\nPAUSE: Review the reports above and confirm to continue."
