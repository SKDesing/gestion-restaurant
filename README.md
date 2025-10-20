# 🍽️ Système de Gestion Restaurant

Une solution complète et moderne pour la gestion de restaurants, développée avec Next.js 15, TypeScript, Tailwind CSS et Prisma.

## 🌟 Fonctionnalités

### 📊 Dashboard Principal

- **Vue d'ensemble en temps réel** : Chiffre d'affaires, commandes, clients, tables actives
- **Statistiques détaillées** : Tendances, performances, indicateurs clés
- **Alertes intelligentes** : Notifications pour stocks bas, réservations, etc.

### 🪑 Gestion des Tables

- **Visualisation des tables** : État en temps réel (disponible, occupée, réservée, maintenance)
- **Capacité et emplacement** : Gestion des espaces (terrasse, salle principale, privé)
- **QR Codes** : Génération automatique pour les commandes mobiles

### 📝 Gestion des Commandes

- **Suivi complet** : Du statut "en attente" à "terminé"
- **Paiements multiples** : Espèces, carte, mobile, chèque
- **Historique détaillé** : Notes, clients, serveurs assignés

### 🍽️ Gestion du Menu

- **Catégories organisées** : Entrées, plats, desserts, boissons
- **Informations complètes** : Prix, calories, temps de préparation, allergènes
- **Options diététiques** : Végétarien, vegan, sans gluten, épicé
- **Gestion des stocks** : Intégration automatique avec l'inventaire

### 📦 Gestion des Stocks

- **Suivi en temps réel** : Niveaux de stock actuels
- **Alertes de réapprovisionnement** : Notifications automatiques
- **Fournisseurs intégrés** : Gestion des commandes d'achat
- **Coûts et marges** : Calcul automatique de la rentabilité

### 👥 Gestion du Personnel

- **Rôles et permissions** : Manager, serveur, chef, barman, etc.
- **Planning de travail** : Création et suivi des horaires
- **Performance** : Statistiques individuelles et d'équipe

### 📈 Analytics et Rapports

- **Rapports financiers** : Chiffre d'affaires, marges, profits
- **Analyse des ventes** : Plats les plus populaires, tendances
- **Performance client** : Fréquentation, satisfaction, fidélité

### 📅 Réservations

- **Calendrier intelligent** : Gestion des disponibilités
- **Confirmation automatique** : Emails et SMS
- **Historique client** : Préférences et visites passées

## 🛠️ Architecture Technique

### Frontend

- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage strict pour la robustesse
- **Tailwind CSS** : Design responsive et moderne
- **shadcn/ui** : Composants UI de haute qualité
- **Lucide React** : Icônes professionnelles

### Backend

- **API Routes** : RESTful API avec Next.js
- **Prisma ORM** : Gestion de base de données moderne
- **SQLite** : Base de données légère et performante
- **Socket.io** : Communication temps réel

### Base de Données

Le schéma complet inclut :

- **Restaurants** : Informations générales
- **Tables** : Gestion des espaces
- **MenuItems** : Articles du menu avec détails
- **Orders** : Commandes et paiements
- **Customers** : Gestion client
- **Employees** : Personnel et plannings
- **Inventory** : Stocks et fournisseurs
- **Reservations** : Réservations et disponibilités

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 20+
- pnpm 8+ (préféré)

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd restaurant-management-system

# Installer les dépendances
pnpm install

# Configurer la base de données
cp .env.example .env
# Éditer .env avec votre configuration

# Pousser le schéma de base de données
pnpm run db:push

# Initialiser les données de démonstration
pnpm exec tsx src/lib/seed.ts

# Démarrer le serveur de développement
pnpm dev
```

### Scripts Disponibles

```bash
pnpm dev              # Serveur de développement
pnpm build            # Build de production
pnpm start            # Serveur de production
pnpm lint             # Vérification du code
pnpm db:push          # Mettre à jour le schéma BDD
```

## 📱 Utilisation

### Navigation

L'interface est organisée en 9 sections principales :

1. **Dashboard** : Vue d'ensemble et statistiques
2. **Tables** : Gestion des tables et réservations
3. **Commandes** : Suivi des commandes en cours
4. **Menu** : Gestion des articles et catégories
5. **Stocks** : Inventaire et fournisseurs
6. **Fournisseurs** : Gestion des partenaires
7. **Personnel** : Employés et plannings
8. **Analytics** : Rapports et analyses
9. **Paramètres** : Configuration du système

### Fonctionnalités Clés

- **Interface responsive** : Fonctionne sur desktop, tablette et mobile
- **Mises à jour en temps réel** : grâce à Socket.io
- **Design moderne** : Interface intuitive et professionnelle
- **Gestion multi-restaurants** : Supporte plusieurs établissements

## 🔧 API Endpoints

### Restaurants

- `GET /api/restaurants` - Lister tous les restaurants
- `POST /api/restaurants` - Créer un restaurant

### Tables

- `GET /api/tables` - Lister les tables
- `POST /api/tables` - Ajouter une table

### Commandes

- `GET /api/orders` - Lister les commandes
- `POST /api/orders` - Créer une commande

### Menu

- `GET /api/menu` - Lister les articles du menu
- `POST /api/menu` - Ajouter un article

### Personnel

- `GET /api/employees` - Lister les employés
- `POST /api/employees` - Ajouter un employé

### Stocks

- `GET /api/inventory` - Lister les articles en stock
- `POST /api/inventory` - Ajouter un article

### Analytics

- `GET /api/analytics` - Obtenir les statistiques

## 🎯 Personnalisation

### Thème et Design

Le système utilise Tailwind CSS avec une configuration personnalisable :

- Couleurs principales modifiables
- Thème clair/sombre supporté
- Composants réutilisables avec shadcn/ui

### Extensions Possibles

- **Module Livraison** : Intégration avec services de livraison
- **Application Mobile** : Version native iOS/Android
- **Intégration Paiement** : Stripe, PayPal, etc.
- **Multi-langues** : Support international
- **Advanced Analytics** : Machine learning pour prédictions

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour détails.

## 🆘 Support

Pour toute question ou support :

- Email : support@restaurant-system.com
- Documentation : [docs.restaurant-system.com](https://docs.restaurant-system.com)
- Issues : [GitHub Issues](https://github.com/your-repo/issues)

---

**Développé avec ❤️ pour les restaurateurs modernes**
