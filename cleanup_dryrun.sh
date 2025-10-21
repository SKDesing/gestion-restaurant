#!/bin/bash
# Script de nettoyage en mode DRY-RUN (ne modifie rien)

set -e

echo "════════════════════════════════════════════════════════════════"
echo "🔍 MODE DRY-RUN - AUCUNE MODIFICATION APPLIQUÉE"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1. Fichiers qui SERAIENT retirés du tracking
echo "📦 1. Fichiers à retirer du tracking Git :"
echo "─────────────────────────────────────────"
git ls-files | grep -E "^(\.next|out|build|dist|node_modules)/" || echo "✅ Aucun fichier problématique tracké"
echo ""

# 2. Différences .gitignore
echo "📝 2. Comparaison .gitignore :"
echo "─────────────────────────────────────────"
echo "ACTUEL :"
cat .gitignore 2>/dev/null || echo "(fichier manquant)"
echo ""
echo "RECOMMANDÉ :"
cat << 'EOF'
# node
node_modules/

# next
.next/
out/

# build artifacts
dist/
build/

# local env
.env
.env.local
.env.*.local

EOF
echo ""

# 3. Packages à installer
echo "📦 3. Packages manquants à installer :"
echo "─────────────────────────────────────────"
pnpm list @types/node @types/react @types/react-dom 2>&1 | grep "not found" || echo "✅ Vérification terminée (installer si nécessaire)"
echo ""

# 4. Fichiers HTML à traiter
echo "📄 4. Fichiers HTML détectés :"
echo "─────────────────────────────────────────"
find . -name "*.html" ! -path "./node_modules/*" ! -path "./.next/*" -type f || true
echo ""

# 5. Erreurs TypeScript
echo "🔧 5. Erreurs TypeScript actuelles :"
echo "─────────────────────────────────────────"
pnpm tsc --noEmit 2>&1 | head -20 || echo "✅ Aucune erreur TypeScript ou pnpm absent"
echo ""

# 6. Gain d'espace estimé
echo "💾 6. Gain d'espace estimé :"
echo "─────────────────────────────────────────"
echo "Taille actuelle .git/ : $(du -sh .git | cut -f1)"
echo "Taille fichiers .next/ trackés : $(git ls-files | grep "^\.next/" | xargs du -ch 2>/dev/null | tail -1 || echo "0B")"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ ANALYSE TERMINÉE - AUCUNE MODIFICATION APPLIQUÉE"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Réviser les fichiers générés (diagnostic_AVANT.md, etc.)"
echo "   2. Valider le plan d'action dans ACTION_PLAN.md"
echo "   3. Exécuter cleanup_apply.sh quand prêt"
echo "════════════════════════════════════════════════════════════════"
