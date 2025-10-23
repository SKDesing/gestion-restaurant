// Configuration pour les applications tablettes
export const TABLET_CONFIG = {
  // URL du serveur Socket.io - à adapter selon votre configuration
  SOCKET_URL: process.env.NODE_ENV === 'production' 
    ? 'https://votre-restaurant.com' 
    : 'http://localhost:3000',
  
  // Types d'applications tablettes
  APP_TYPES: {
    ADMIN: 'admin',
    CAISSE: 'caisse', 
    SERVEUR: 'serveur',
    CUISINE: 'cuisine'
  },

  // Configuration par application
  ADMIN_CONFIG: {
    type: 'admin',
    name: 'Admin Manager',
    color: '#8B5CF6',
    features: ['stocks', 'personnel', 'comptabilite', 'rapports', 'alertes']
  },
  
  CAISSE_CONFIG: {
    type: 'caisse',
    name: 'Caisse & Bar',
    color: '#10B981',
    features: ['paiements', 'bar', 'ventes_rapides']
  },
  
  SERVEUR_CONFIG: {
    type: 'serveur',
    name: 'Serveur',
    color: '#3B82F6', 
    features: ['tables', 'commandes', 'notifications']
  },
  
  CUISINE_CONFIG: {
    type: 'cuisine',
    name: 'Cuisine',
    color: '#F97316',
    features: ['preparation', 'haccp', 'stocks']
  }
} as const;

// Hook pour identifier le type de tablette
export const useTabletIdentity = () => {
  // Dans une vraie application, ceci pourrait venir de:
  // - localStorage, sessionStorage
  // - URL parameters
  // - Configuration serveur
  // - QR code scan
  
  const getTabletType = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('tablet') || 'admin';
    }
    return 'admin';
  };

  return {
    tabletType: getTabletType(),
    config: TABLET_CONFIG
  };
};