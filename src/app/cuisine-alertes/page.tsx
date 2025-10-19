'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertSystem } from '@/components/AlertSystem'
import { useSocket } from '@/hooks/useSocket'
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  Flame,
  Timer
} from 'lucide-react'

// Mock data pour les commandes
const mockOrders = [
  {
    id: 'ORD-001',
    tableNumber: 'T5',
    items: [
      { name: 'Steak Frites', quantity: 2, category: 'Plat' },
      { name: 'Salade César', quantity: 1, category: 'Entrée' }
    ],
    priority: 'NORMAL',
    orderTime: '12:30',
    estimatedTime: 25,
    status: 'PREPARING'
  },
  {
    id: 'ORD-002',
    tableNumber: 'T8',
    items: [
      { name: 'Burger Maison', quantity: 1, category: 'Plat' },
      { name: 'Frites', quantity: 1, category: 'Accompagnement' }
    ],
    priority: 'HIGH',
    orderTime: '12:35',
    estimatedTime: 15,
    status: 'PENDING'
  },
  {
    id: 'ORD-003',
    type: 'TAKEAWAY',
    customerName: 'Client à emporter',
    items: [
      { name: 'Pizza Margherita', quantity: 2, category: 'Plat' },
      { name: 'Tiramisu', quantity: 1, category: 'Dessert' }
    ],
    priority: 'URGENT',
    orderTime: '12:40',
    estimatedTime: 10,
    status: 'PENDING'
  }
]

export default function CuisineAlertes() {
  const [orders, setOrders] = useState(mockOrders)
  const { sendNewOrder, markOrderReady, connected } = useSocket('kitchen', 'chef-001')

  const handleOrderReady = (orderId: string) => {
    // Mettre à jour le statut local
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'READY' as const }
        : order
    ))

    // Notifier les serveurs via Socket.io
    const order = orders.find(o => o.id === orderId)
    if (order) {
      markOrderReady({
        orderId,
        station: 'kitchen',
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        preparationTime: 20 // temps de préparation simulé
      })
    }
  }

  const handleStartPreparation = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'PREPARING' as const }
        : order
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'NORMAL': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READY': return <CheckCircle className="h-4 w-4 text-green-600" />
  case 'PREPARING': return <Flame className="h-4 w-4 text-orange-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-100 text-green-800'
      case 'PREPARING': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cuisine - Alertes en temps réel</h1>
                <p className="text-sm text-gray-600">Gestion des commandes et notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={connected ? 'default' : 'destructive'}>
                {connected ? 'Connecté' : 'Déconnecté'}
              </Badge>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Système d'alertes */}
          <div className="lg:col-span-1">
            <AlertSystem station="kitchen" userId="chef-001" />
          </div>

          {/* Liste des commandes */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Commandes en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{order.id}</span>
                              <Badge className={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">
                                  {order.status === 'READY' ? 'Prête' : 
                                   order.status === 'PREPARING' ? 'En préparation' : 'En attente'}
                                </span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.tableNumber ? `Table ${order.tableNumber}` : order.customerName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Commande: {order.orderTime} • 
                              Temps estimé: {order.estimatedTime} min
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStartPreparation(order.id)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Flame className="h-4 w-4 mr-1" />
                                Commencer
                              </Button>
                            )}
                            {order.status === 'PREPARING' && (
                              <Button
                                size="sm"
                                onClick={() => handleOrderReady(order.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Prête
                              </Button>
                            )}
                            {order.status === 'READY' && (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                En attente de service
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Articles:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.priority === 'URGENT' && (
                          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Commande urgente - Priorité maximale
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune commande en cours</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Instructions du système d'alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Nouvelles commandes</p>
                  <p className="text-gray-600">Les alertes apparaissent automatiquement quand les serveurs prennent des commandes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Priorités</p>
                  <p className="text-gray-600">Les commandes urgentes sont signalées en rouge et doivent être traitées en priorité</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Notification serveurs</p>
                  <p className="text-gray-600">Quand vous marquez une commande comme prête, les serveurs sont automatiquement notifiés</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}