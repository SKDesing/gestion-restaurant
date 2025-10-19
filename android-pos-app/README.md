# README Android POS App

## Prérequis
- Java JDK 17 ou supérieur
- Gradle 9.x (installé via SDKMAN)
- Android Studio (optionnel mais recommandé)

## Structure du projet
- `app/build.gradle` : configuration du module Android
- `settings.gradle` : gestion des plugins et des repositories
- `app/src/main/assets/` : assets statiques exportés de Next.js

## Étapes pour compiler l'APK

1. Ouvre un terminal dans le dossier du projet Android :
   ```bash
   cd "/home/soufiane/Bureau/gestion restaurant/android-pos-app"
   source "$HOME/.sdkman/bin/sdkman-init.sh"
   ```

2. Supprime le cache Gradle si besoin :
   ```bash
   rm -rf .gradle
   ```

3. Génère le wrapper Gradle :
   ```bash
   gradle wrapper
   ```

4. Compile l'application en mode debug :
   ```bash
   ./gradlew assembleDebug
   ```

5. L'APK sera généré dans :
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

## En cas de problème
- Si le plugin Android ou Kotlin n'est pas trouvé, vérifie que le bloc `pluginManagement` est bien en haut de `settings.gradle`.
- Si tu utilises Android Studio, fais "Sync Project with Gradle Files".
- Vérifie que tu utilises bien Gradle 9.x :
   ```bash
   gradle --version
   ```

## Astuce
- Pour une build propre, tu peux aussi lancer :
   ```bash
   ./gradlew clean assembleDebug
   ```

---

Ce README est généré pour automatiser et documenter la compilation de ton application Android POS.
