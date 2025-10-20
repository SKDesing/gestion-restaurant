#!/usr/bin/env bash
set -euo pipefail

# Script d'automatisation pour :
# 1) exporter le site Next.js (out/)
# 2) copier les fichiers statiques dans app/src/main/assets/
# 3) builder l'APK avec Gradle 8.1.1 local
# 4) copier l'APK dans release/

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_PROJECT_DIR="$ROOT_DIR/android-pos-app-clean"
# Le projet Next.js est à la racine du repo (ROOT_DIR)
NEXT_PROJECT_DIR="$ROOT_DIR"

# Chemin vers le binaire Gradle 8.1.1 (pré-téléchargé)
GRADLE_BIN="$HOME/.gradle-dist/gradle-8.1.1/bin/gradle"

OUT_DIR="$NEXT_PROJECT_DIR/out"
ASSETS_DIR="$ANDROID_PROJECT_DIR/app/src/main/assets"
RELEASE_DIR="$ANDROID_PROJECT_DIR/release"

echo "ROOT_DIR: $ROOT_DIR"
echo "NEXT_PROJECT_DIR: $NEXT_PROJECT_DIR"
echo "ANDROID_PROJECT_DIR: $ANDROID_PROJECT_DIR"

if [ ! -x "$GRADLE_BIN" ]; then
  echo "Gradle 8.1.1 binaire introuvable ou non exécutable: $GRADLE_BIN" >&2
  echo "Merci d'installer ou de télécharger Gradle 8.1.1 dans ~/.gradle-dist/gradle-8.1.1/bin/gradle" >&2
  exit 1
fi

echo "1) Export Next.js (next build && next export)"

# Wrapper local (préférer si présent)
GRADLE_WRAPPER="./gradlew"
cd "$NEXT_PROJECT_DIR"
if [ -f package.json ]; then
  # Use npm if available, prefer pnpm/yarn if project uses them? Keep simple: npm.
  if command -v npm >/dev/null 2>&1; then
    npm run build --if-present
    npm run export --if-present
  else
    echo "npm introuvable, saute l'étape d'export (attendu: dossier $OUT_DIR existant)"
  fi
else
  echo "package.json introuvable dans $NEXT_PROJECT_DIR, saute l'export" 
fi

if [ ! -d "$OUT_DIR" ]; then
  echo "Dossier d'export statique introuvable: $OUT_DIR" >&2
echo "3) Builder l'APK (préférence: ./gradlew, sinon Gradle local $GRADLE_BIN)"
fi
GRADLE_CMD=""
if [ -x "$GRADLE_WRAPPER" ]; then
  echo "Utilisation de ./gradlew"
  chmod +x "$GRADLE_WRAPPER" || true
  GRADLE_CMD="$GRADLE_WRAPPER"
else
  echo "./gradlew introuvable, utilisation de $GRADLE_BIN"
  GRADLE_CMD="$GRADLE_BIN"
fi

echo "2) Copier fichiers statiques vers Android assets"

# Prefer the exported `out/` folder. If absent, fallback to .next/static
if [ -d "$OUT_DIR" ]; then
  mkdir -p "$ASSETS_DIR"
  rsync -a --delete "$OUT_DIR/" "$ASSETS_DIR/"
else
  echo "Dossier d'export statique introuvable: $OUT_DIR — tentative de copie depuis .next/static"
  if [ -d ".next/static" ]; then
    mkdir -p "$ASSETS_DIR"
    rsync -a --delete ".next/static/" "$ASSETS_DIR/"
  else
    echo "Aucun dossier statique trouvé (.next/static ou out/). Continue sans copier d'actifs." >&2
  fi
fi

echo "3) Builder l'APK avec Gradle ($GRADLE_CMD)"
cd "$ANDROID_PROJECT_DIR"
"$GRADLE_CMD" assembleDebug --no-daemon --stacktrace --info

APK_PATH="$ANDROID_PROJECT_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK_PATH" ]; then
  echo "APK introuvable: $APK_PATH" >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR"
cp -v "$APK_PATH" "$RELEASE_DIR/"

echo "APK généré et copié dans: $RELEASE_DIR/$(basename "$APK_PATH")"

exit 0
