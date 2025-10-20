# Restaurant Management System - 4 Applications Tablettes

## 🎯 Vue d'ensemble

Ce système restaurant est composé de **4 applications tablettes coordonnées** qui communiquent en temps réel pour gérer toutes les opérations du restaurant.

## 📱 Les 4 Applications

### 1. 🟣 **Admin Manager** - Tablette Administration

**Accès complet et gestion centralisée**

- **Gestion des stocks**: Alertes automatiques en cas de stock faible
- **Gestion du personnel**: Planning, présence, absences
- **Comptabilité**: Revenus, dépenses, bénéfices en temps réel
- **Rapports**: Ventes, performance, analytics
- **Alertes**: Centralisation de toutes les alertes système
- **Suppression du secrétaire et comptable**: Automatisation complète

### 2. 🟢 **Caisse & Bar** - Tablette Paiements

**Traitement rapide des paiements**

- **Paiements rapides**: Espèces et carte bancaire
- **Gestion bar**: Boissons, cocktails, consommation
- **Ventes rapides**: Articles pré-configurés
- **Historique**: Dernières ventes et transactions
- **Communication temps réel**: Envoi automatique des paiements à l'admin

### 3. 🔵 **Serveur** - Tablette Service

**Prise de commandes et gestion des tables**

- **Gestion des tables**: Visualisation des statuts (libre, occupée, réservée)
- **Prise de commandes**: Menu complet avec catégories
- **Notifications temps réel**: Alertes cuisine, paiements, appels tables
- **Envoi cuisine**: Transmission instantanée des commandes
- **Demandes de paiement**: Communication avec la caisse

### 4. 🟠 **Cuisine** - Tablette Préparation

**Préparation et contrôles qualité**

- **Gestion des commandes**: File d'attente, temps de préparation
- **Contrôles HACCP**: Températures, nettoyage, conformité
- **Alertes qualité**: Notifications en cas d'anomalie
- **Communication serveur**: Notification quand les plats sont prêts
- **Traçabilité**: Enregistrement de tous les contrôles

## 🔄 Communication Temps Réel

### Flux de communication:

- **Serveur → Cuisine**: Nouvelles commandes
- **Cuisine → Serveur**: Commandes prêtes à servir
- **Caisse → Admin**: Paiements effectués
- **Admin → Tous**: Alertes stocks et personnel
- **Cuisine → Admin**: Contrôles HACCP et alertes

### Socket.io Events:

```javascript
// Nouvelle commande
socket.emit("newOrder", orderData);

// Mise à jour statut
socket.emit("orderStatusUpdate", { orderId, status });

// Paiement effectué
socket.emit("paymentProcessed", paymentData);

// Alerte stock
socket.emit("stockAlert", alertData);

// Contrôle HACCP
socket.emit("haccpRecord", recordData);
```

## 🚀 Déploiement et Configuration

### Configuration des tablettes:

1. **URL du serveur**: Configurer l'adresse du serveur Socket.io
2. **Type de tablette**: Définir le rôle (admin, caisse, serveur, cuisine)
3. **Identification**: Chaque tablette s'identifie automatiquement

### Options de configuration:

```javascript
// Via URL parameters
?tablet=admin
?tablet=caisse
?tablet=serveur
?tablet=cuisine

// Via configuration locale
localStorage.setItem('tabletType', 'admin')
```

## 💡 Cas d'usage

### Scénario 1: Service complet

1. **Serveur** prend la commande à table T3
2. **Cuisine** reçoit instantanément la commande
3. **Cuisine** prépare et notifie quand c'est prêt
4. **Serveur** est notifié et sert les plats
5. **Client** demande l'addition
6. **Serveur** envoie la demande de paiement
7. **Caisse** traite le paiement
8. **Admin** voit tout en temps réel

### Scénario 2: Gestion des stocks

1. **Cuisine** constate un stock faible de tomates
2. **Admin** reçoit une alerte automatique
3. **Admin** peut créer un ordre d'achat
4. **Toutes les tablettes** sont notifiées si nécessaire

### Scénario 3: Contrôle qualité

1. **Cuisine** enregistre une température anormale
2. **Admin** reçoit une alerte critique HACCP
3. **Actions correctives** peuvent être déclenchées
4. **Traçabilité** complète maintenue

## 🔧 Installation Technique

### Prérequis:

- Node.js 20+
- Next.js 15
- Socket.io
- 4 tablettes (iOS/Android/Windows)

### Démarrage:

```bash
pnpm install
pnpm dev
```

### Configuration serveur:

```javascript
// server.ts
const io = new Server(server, {
  cors: { origin: "*" },
});
```

## 📊 Avantages

### ✅ Pour le restaurant:

- **Efficacité**: Communication instantanée entre services
- **Réduction des erreurs**: Pas de perte d'information
- **Optimisation**: Meilleure gestion des ressources
- **Conformité**: Contrôles HACCP intégrés
- **Économie**: Suppression secrétaire + comptable

### ✅ Pour le personnel:

- **Simplicité**: Interfaces adaptées à chaque rôle
- **Réactivité**: Notifications en temps réel
- **Clarté**: Informations claires et organisées
- **Mobilité**: Tablettes portables partout

### ✅ Pour les clients:

- **Service rapide**: Commandes traitées instantanément
- **Qualité**: Contrôles rigoureux
- **Fluidité**: Expérience sans friction

## 🎯 Conclusion

Ce système de 4 applications tablettes coordonnées transforme complètement la gestion d'un restaurant en automatisant les processus, améliorant la communication et garantissant la qualité tout en réduisant les coûts opérationnels.

**L'admin manager remplace efficacement secrétaire et comptable** tout en offrant une vision complète et en temps réel de toute l'activité du restaurant.
