"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor,
  Tablet,
  Users,
  DollarSign,
  ChefHat,
  Wine,
  Settings,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
// import AdminManagerApp from '@/apps/admin-manager';
import AdminManagerApp from '@/apps/admin-manager';
import CaisseBarApp from '@/apps/caisse-bar';
import ServeurApp from '@/apps/serveur';
import CuisineApp from '@/apps/cuisine';

interface AppStatus {
  name: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: Date;
  component: React.ComponentType;
}

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [appStatuses, setAppStatuses] = useState<AppStatus[]>([
    {
      name: 'admin',
      title: 'Gérant / Admin',
      icon: <Settings className="h-8 w-8" />, 
      description: 'Tableau de bord du gérant, statistiques et gestion avancée',
      color: 'bg-purple-600',
      status: 'online',
      lastUpdate: new Date(),
      component: AdminManagerApp
    },
    {
      name: 'caisse',
      title: 'Caisse & Bar',
      icon: <DollarSign className="h-8 w-8" />, 
      description: 'Paiements rapides et gestion du bar',
      color: 'bg-green-500',
      status: 'online',
      lastUpdate: new Date(),
      component: CaisseBarApp
    },
    {
      name: 'serveur',
      title: 'Serveur',
      icon: <Users className="h-8 w-8" />, 
      description: 'Prise de commandes et gestion des tables',
      color: 'bg-blue-500',
      status: 'online',
      lastUpdate: new Date(),
      component: ServeurApp
    },
    {
      name: 'cuisine',
      title: 'Cuisine',
      icon: <ChefHat className="h-8 w-8" />, 
      description: 'Préparation des commandes et contrôles HACCP',
      color: 'bg-orange-500',
      status: 'online',
      lastUpdate: new Date(),
      component: CuisineApp
    }
  ]);

  useEffect(() => {
    // Simuler la vérification du statut des applications
    const interval = setInterval(() => {
      setAppStatuses(prev => prev.map(app => ({
        ...app,
        lastUpdate: new Date(),
        status: Math.random() > 0.1 ? 'online' : 'warning'
      })));
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge variant="default" className="bg-green-500">En ligne</Badge>;
      case 'offline': return <Badge variant="destructive">Hors ligne</Badge>;
      case 'warning': return <Badge variant="secondary" className="bg-yellow-500">Attention</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (selectedApp) {
    const selectedAppData = appStatuses.find(app => app.name === selectedApp);
    if (selectedAppData) {
      const AppComponent = selectedAppData.component;
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header de navigation */}
          <div className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedApp(null)}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Retour aux applications
                  </Button>
                  <div className="flex items-center gap-2">
                    {selectedAppData.icon}
                    <h1 className="text-xl font-bold">{selectedAppData.title}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedAppData.status)}
                  {getStatusBadge(selectedAppData.status)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Application sélectionnée */}
          <AppComponent />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Management System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            4 Applications Tablettes Coordonnées
          </p>
          <p className="text-sm text-gray-500">
            Communication temps réel entre toutes les tablettes
          </p>
        </div>
      </div>

      {/* Grid des applications */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {appStatuses.map((app) => (
            <Card 
              key={app.name} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300"
              onClick={() => setSelectedApp(app.name)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg text-white ${app.color}`}>
                      {app.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{app.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(app.status)}
                        <span className="text-sm text-gray-500">
                          Dernière mise à jour: {app.lastUpdate.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="flex items-center justify-between">
                  <Button className="flex items-center gap-2">
                    <Tablet className="h-4 w-4" />
                    Ouvrir l'application
                  </Button>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Connecté</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Informations Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">Applications actives</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Temps Réel</div>
                <div className="text-sm text-gray-600">Communication active</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Opérationnel</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Flux de communication:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Admin → Tous</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Serveur → Cuisine</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Cuisine → Serveur</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Caisse → Admin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}