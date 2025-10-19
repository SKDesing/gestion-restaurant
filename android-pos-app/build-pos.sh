#!/bin/bash
# Script automatique pour build Android POS

cd "/home/soufiane/Bureau/gestion restaurant/android-pos-app" || exit 1
source "$HOME/.sdkman/bin/sdkman-init.sh"
gradle --version || exit 1
gradle wrapper || exit 1
./gradlew assembleDebug || exit 1

echo "APK généré dans app/build/outputs/apk/debug/app-debug.apk"
