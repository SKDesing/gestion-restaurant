# 🔄 Migration vers PostgreSQL (Production)

## 📋 Prérequis

- Instance PostgreSQL accessible
- Credentials administrateur
- Backup de la base SQLite (optionnel)

---

## 🚀 Procédure de migration

### 1. Préparer PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE restaurant_prod;
CREATE USER restaurant_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE restaurant_prod TO restaurant_user;
\q
```

### 2. Configurer l'environnement

```bash
# Éditer .env.production (ou .env.local pour production)
cat > .env.production << ENV_EOF
DATABASE_URL="postgresql://restaurant_user:votre_mot_de_passe@localhost:5432/restaurant_prod?schema=public"
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NODE_ENV="production"
PORT=3000
ENV_EOF
```

### 3. Restaurer le schema PostgreSQL

```bash
# Remplacer le schema SQLite par PostgreSQL
cp prisma/schema.prisma.postgres.bak prisma/schema.prisma

# Vérifier le provider
grep "provider" prisma/schema.prisma
# Devrait afficher: provider = "postgresql"
```

### 4. Appliquer les migrations

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Ou créer une migration initiale
npx prisma migrate dev --name init
```

### 5. Migrer les données (optionnel)

```bash
# Exporter les données SQLite
npx prisma db execute --stdin < export_data.sql > data_backup.sql

# Importer dans PostgreSQL
psql -U restaurant_user -d restaurant_prod < data_backup.sql
```

### 6. Seed la base PostgreSQL

```bash
# Exécuter le seed
npx tsx prisma/seed.ts
```

### 7. Déployer

```bash
# Rebuild avec le nouveau schema
pnpm build

# Recharger PM2
npx pm2 reload restaurant-app
npx pm2 save

# Vérifier
curl -I http://localhost:3000/auth/login
```

---

## 🔙 Rollback vers SQLite

```bash
# Restaurer le schema SQLite
cp prisma/schema.prisma prisma/schema.prisma.postgres.bak
git checkout prisma/schema.prisma

# Recréer la base SQLite
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts

# Recharger
pnpm build
npx pm2 reload restaurant-app
```

---

## ✅ Vérifications post-migration

```bash
# 1. Vérifier la connexion DB
npx prisma db execute --stdin <<< "SELECT 1"

# 2. Vérifier les tables
npx prisma db execute --stdin <<< "\dt"

# 3. Vérifier l'admin
npx prisma db execute --stdin <<< "SELECT email, role FROM \"User\" WHERE role='ADMIN'"

# 4. Health check
curl -f http://localhost:3000/auth/login

# 5. Test login
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.local","password":"admin123"}'
```

---

## 📊 Comparaison SQLite vs PostgreSQL

| Critère | SQLite | PostgreSQL |
|---------|--------|------------|
| **Performance** | Excellent (petit volume) | Excellent (gros volume) |
| **Concurrence** | Limitée | Excellente |
| **Backup** | Fichier unique | Dump SQL ou backup binaire |
| **Production** | ❌ Non recommandé | ✅ Recommandé |
| **Développement** | ✅ Idéal | ⚠️ Setup plus complexe |

---

## �� Dépannage

### Erreur P1001 (connexion impossible)
```bash
# Vérifier que PostgreSQL écoute
sudo systemctl status postgresql
sudo netstat -plnt | grep 5432

# Vérifier pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Ajouter: host all all 127.0.0.1/32 md5
```

### Erreur P3018 (migrations non appliquées)
```bash
# Réinitialiser les migrations
npx prisma migrate reset
npx prisma migrate deploy
```

### Performance lente
```bash
# Créer les index
npx prisma db execute --stdin <<< "
CREATE INDEX idx_user_email ON \"User\"(email);
CREATE INDEX idx_session_token ON \"Session\"(\"sessionToken\");
"
```
