Keystore de release (répertoire ignoré)

Ce dossier contient le keystore utilisé pour signer les APK de release.

IMPORTANT : Ce dossier est listé dans la racine `.gitignore` et ne doit pas être committé.

Si vous voulez générer un keystore de test :

```bash
keytool -genkeypair -v -keystore release-keystore.jks -alias gestion_pos_alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

Placez ensuite le fichier `release-keystore.jks` dans ce dossier et configurez
`app/build.gradle` signingConfigs pour effectuer un build release.
