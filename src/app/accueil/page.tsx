'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Coffee, 
  Users, 
  ChefHat, 
  Settings,
  TrendingUp,
  Bell,
  Monitor,
  Tablet,
  Smartphone,
  QrCode,
  CreditCard,
  Utensils,
  Clock,
  CheckCircle
} from 'lucide-react'

interface AccessPoint {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  path: string
  color: string
  badge?: string
  status: 'active' | 'maintenance' | 'coming-soon'
}

export default function AccueilRestaurant() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const accessPoints: AccessPoint[] = [
    {
      id: 'caisse',
      title: 'Caisse Centrale',
      description: 'Gestion des ventes et encaissements du bar',
      icon: <Coffee className="h-8 w-8" />,
      path: '/caisse',
      color: 'bg-blue-600',
      badge: 'Bar',
      status: 'active'
    },
    {
      id: 'serveur',
      title: 'Serveur Mobile',
      description: 'Prise de commandes et gestion des tables',
      icon: <Users className="h-8 w-8" />,
      path: '/serveur',
      color: 'bg-green-600',
      badge: 'Salle',
      status: 'active'
    },
    {
      id: 'cuisine',
      title: 'Cuisine',
      description: 'Tablette de gestion des commandes',
      icon: <ChefHat className="h-8 w-8" />,
      path: '/cuisine',
      color: 'bg-red-600',
      badge: 'Cuisine',
      status: 'active'
    },
    {
      id: 'management',
      title: 'Management',
      description: 'Administration complète du restaurant',
      icon: <Settings className="h-8 w-8" />,
      path: '/',
      color: 'bg-purple-600',
      badge: 'Admin',
      status: 'active'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'coming-soon': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'maintenance': return 'Maintenance'
      case 'coming-soon': return 'Bientôt disponible'
      default: return 'Inconnu'
    }
  }

  const handleAccess = (accessPoint: AccessPoint) => {
    if (accessPoint.status === 'active') {
      window.location.href = accessPoint.path
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Système de Gestion Restaurant
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Accès aux différentes interfaces de gestion pour la caisse, les serveurs, la cuisine et l'administration
          </p>
        </div>

        {/* État du système */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">État du Système</h2>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              En ligne
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Services actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Utilisateurs connectés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
          </div>
        </div>

        {/* Points d'accès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {accessPoints.map((accessPoint) => (
            <Card 
              key={accessPoint.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                accessPoint.status === 'active' ? 'hover:scale-105' : 'opacity-75'
              }`}
              onClick={() => handleAccess(accessPoint)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${accessPoint.color} rounded-xl flex items-center justify-center text-white`}>
                      {accessPoint.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{accessPoint.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {accessPoint.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {accessPoint.badge && (
                      <Badge variant="outline">{accessPoint.badge}</Badge>
                    )}
                    <Badge className={getStatusColor(accessPoint.status)}>
                      {getStatusText(accessPoint.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {accessPoint.status === 'active' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Accessible</span>
                      </>
                    )}
                    {accessPoint.status === 'maintenance' && (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Maintenance en cours</span>
                      </>
                    )}
                    {accessPoint.status === 'coming-soon' && (
                      <>
                        <Bell className="h-4 w-4 text-gray-600" />
                        <span>Bientôt disponible</span>
                      </>
                    )}
                  </div>
                  <Button 
                    variant={accessPoint.status === 'active' ? 'default' : 'secondary'}
                    disabled={accessPoint.status !== 'active'}
                    className="flex items-center gap-2"
                  >
                    {accessPoint.status === 'active' ? (
                      <>
                        Accéder
                        <Monitor className="h-4 w-4" />
                      </>
                    ) : (
                      'Indisponible'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Accès Rapide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Scannez les QR codes pour accéder rapidement aux interfaces mobiles
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  Serveur
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Tablet className="h-3 w-3" />
                  Cuisine
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Moyens de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carte bancaire</span>
                  <Badge variant="outline">Actif</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Espèces</span>
                  <Badge variant="outline">Actif</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mobile</span>
                  <Badge variant="outline">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Chiffre d'affaires</span>
                  <span className="font-medium">€2,847.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Commandes</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Client moyen</span>
                  <span className="font-medium">€18.25</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-600 text-sm">
            Système de Gestion Restaurant v1.0 • Support technique disponible 24/7
          </p>
        </div>
      </div>
    </div>
  )
}