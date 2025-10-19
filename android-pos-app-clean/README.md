# android-pos-app-clean — build automation

Ce dossier contient une application Android minimaliste (Kotlin + WebView) qui embarque
le site Next.js exporté en statique.

But du script
- Exporter le site Next.js (commande `next build` puis `next export`).
- Copier le contenu exporté (`out/`) dans `app/src/main/assets/`.
- Builder l'APK avec Gradle 8.1.1 et copier l'APK dans `release/`.

Usage
1. Assurez-vous que Gradle 8.1.1 est disponible localement à :

   ~/.gradle-dist/gradle-8.1.1/bin/gradle

   (Le dépôt contient déjà un binaire téléchargé lors des diagnostics précédents.)

2. Rendre le script exécutable si nécessaire :

```bash
chmod +x build-pos.sh
```

3. Lancer le script depuis ce dossier :

```bash
./build-pos.sh
```

Résultat
- L'APK debug sera copié dans `release/app-debug.apk`.

Notes
- Si votre projet Next.js utilise pnpm ou yarn, adaptez les commandes d'export dans le script.
- Pour des builds reproductibles, je recommande d'ajouter un Gradle wrapper fixé à 8.1.1.
