# 📘 Guide Opérationnel - Gestion Restaurant

## 🚀 Démarrage de l'application

### Démarrage manuel

```bash
cd /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512
npx pm2 start ecosystem.config.js
npx pm2 save
```

### Démarrage automatique au boot

L'application démarre automatiquement via crontab:

```bash
@reboot sleep 10 && export PM2_HOME=/home/soufiane/.pm2 && \
  /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512/node_modules/pm2/bin/pm2 resurrect
```

## 🔍 Monitoring

### Vérifier l'état de l'application

```bash
npx pm2 status
```

### Monitorer en temps réel

```bash
npx pm2 monit
```

### Voir les logs

```bash
# Logs en temps réel
npx pm2 logs restaurant-app

# Dernières 100 lignes
npx pm2 logs restaurant-app --lines 100

# Logs d'erreur uniquement
tail -f logs/pm2-error.log
```

## 🔄 Gestion des processus

### Redémarrer l'application (zero-downtime)

```bash
npx pm2 reload restaurant-app
```

### Redémarrage complet

```bash
npx pm2 restart restaurant-app
```

### Arrêter l'application

```bash
npx pm2 stop restaurant-app
```

### Supprimer de PM2

```bash
npx pm2 delete restaurant-app
```

## 🐛 Debugging

### Erreur Prisma détectée

**Symptôme:** Erreurs Prisma dans `logs/pm2-error.log`

```bash
# Vérifier la connexion DB
npx prisma db push --accept-data-loss

# Régénérer le client Prisma
npx prisma generate

# Copier les engines
cp -r node_modules/.prisma/client/*.node .next/standalone/node_modules/.prisma/client/ || true

# Redémarrer
npx pm2 reload restaurant-app
```

### L'application ne démarre pas au boot

```bash
# Vérifier la crontab
crontab -l | grep pm2

# Vérifier les logs de démarrage
cat /home/soufiane/.pm2/pm2-start.log

# Tester manuellement la résurrection
npx pm2 resurrect
```

### HTTP 500 / Erreurs Next.js

```bash
# Vérifier les variables d'environnement
cat .env.local

# Rebuild l'application
pnpm build
npx pm2 reload restaurant-app

# Vérifier les logs détaillés
npx pm2 logs --err --lines 500
```

## 📊 Emplacements des fichiers

```
Application: /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512
Base de données: /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512/prisma/dev.db
Logs PM2: /home/soufiane/.pm2/logs/
Logs app: /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512/logs/
Config PM2: /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512/ecosystem.config.js
Crontab: crontab -l
```

## 🔐 Endpoints de santé

```bash
# Page de login (public)
curl -I http://localhost:3000/auth/login

# Health check (authentifié)
curl -s http://localhost:3000/api/health
```

## 📝 Checklist post-reboot

Après chaque redémarrage du serveur:

```bash
# 1. Attendre 15 secondes
sleep 15

# 2. Vérifier PM2
npx pm2 status

# 3. Tester l'application
curl -I http://localhost:3000/auth/login

# 4. Vérifier les logs de démarrage
cat /home/soufiane/.pm2/pm2-start.log
```

## 🚨 Procédure d'urgence

### Application crashée

```bash
npx pm2 resurrect
```

### Corruption PM2

```bash
npx pm2 kill
npx pm2 start ecosystem.config.js
npx pm2 save
```

### Rollback rapide

```bash
cd /home/soufiane/Bureau/gestion-restaurant-clean-20251023-210512
git log --oneline -5  # Voir les derniers commits
git reset --hard <commit-hash>
pnpm install
pnpm build
npx pm2 reload restaurant-app
```

---

## 🔄 MIGRATION VERS PRODUCTION

### Configuration actuelle

```
Environnement: DÉVELOPPEMENT
Base de données: SQLite (prisma/dev.db)
Schema PostgreSQL: Sauvegardé dans prisma/schema.prisma.postgres.bak
```

### Pour passer en production

Voir le guide complet: `.deploy/MIGRATION_POSTGRES.md`

### Credentials de test (développement)

```
Email: admin@restaurant.local
Password: admin123
```

---

## 📊 MONITORING

### Vérifier l'état de l'application

```bash
# Status PM2
npx pm2 status

# Logs en temps réel
npx pm2 logs restaurant-app

# Métriques
npx pm2 monit

# Health check
curl -I http://localhost:3000/auth/login
```

### Métriques importantes

- **Temps de réponse**: < 100ms
- **Mémoire PM2**: < 200MB par instance
- **CPU**: < 50% en moyenne
- **Uptime**: > 99.9%
