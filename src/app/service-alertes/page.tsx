"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertSystem } from '@/components/AlertSystem'
import { useSocket } from '@/hooks/useSocket'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Phone,
  ChefHat,
  Beer,
  AlertTriangle,
  Bell
} from 'lucide-react'

type TableType = {
  id: string
  capacity: number
  status: string
  currentOrder?: string | null
  orderTime?: string
  amount?: number
  customers: number
  paymentRequested?: boolean
}

// Mock data pour les tables
const mockTables: TableType[] = [
  {
    id: 'T1',
    capacity: 4,
    status: 'OCCUPIED',
    currentOrder: 'ORD-001',
    orderTime: '12:30',
    amount: 45.50,
    customers: 3
  },
  {
    id: 'T2',
    capacity: 2,
    status: 'OCCUPIED',
    currentOrder: 'ORD-002',
    orderTime: '12:45',
    amount: 28.00,
    customers: 2
  },
  {
    id: 'T3',
    capacity: 6,
    status: 'AVAILABLE',
    currentOrder: null,
    customers: 0
  },
  {
    id: 'T4',
    capacity: 4,
    status: 'OCCUPIED',
    currentOrder: 'ORD-003',
    orderTime: '13:00',
    amount: 67.80,
    customers: 4,
    paymentRequested: true
  }
]

// Mock data pour les commandes prêtes
const mockReadyOrders = [
  {
    id: 'ORD-005',
    tableNumber: 'T5',
    items: [
      { name: 'Steak Frites', quantity: 2 },
      { name: 'Salade César', quantity: 1 }
    ],
    station: 'kitchen',
    readyTime: '13:15',
    temperature: 'HOT'
  },
  {
    id: 'ORD-006',
    tableNumber: 'T7',
    items: [
      { name: 'Mojito', quantity: 2 },
      { name: 'Coca-Cola', quantity: 1 }
    ],
    station: 'bar',
    readyTime: '13:18',
    temperature: 'COLD'
  }
]

export default function ServiceAlertes() {
  const [tables, setTables] = useState<TableType[]>(mockTables)
  const [readyOrders, setReadyOrders] = useState(mockReadyOrders)
  const { requestPayment, customerCall, connected } = useSocket('server', 'server-001')

  const handleRequestPayment = (tableId: string, orderId: string, amount: number) => {
    // Mettre à jour le statut local
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, paymentRequested: true }
        : table
    ))

    // Notifier la caisse via Socket.io
    requestPayment({
      tableNumber: tableId,
      orderId,
      amount,
      customerName: `Table ${tableId}`
    })
  }

  const handleCustomerCall = (tableId: string, callType: 'service' | 'water' | 'bill' | 'help') => {
    customerCall({
      tableNumber: tableId,
      type: callType,
      message: callType === 'service' ? 'Service demandé' : 
               callType === 'water' ? 'Eau demandée' :
               callType === 'bill' ? 'Addition demandée' : 'Aide demandée'
    })
  }

  const handleOrderServed = (orderId: string) => {
    setReadyOrders(prev => prev.filter(order => order.id !== orderId))
  }

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'OCCUPIED': return 'bg-green-100 text-green-800'
      case 'AVAILABLE': return 'bg-gray-100 text-gray-800'
      case 'RESERVED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStationIcon = (station: string) => {
    switch (station) {
      case 'kitchen': return <ChefHat className="h-4 w-4" />
      case 'bar': return <Beer className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'HOT': return 'bg-red-100 text-red-800'
      case 'COLD': return 'bg-blue-100 text-blue-800'
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
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Service - Alertes en temps réel</h1>
                <p className="text-sm text-gray-600">Gestion des tables et notifications</p>
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
            <AlertSystem station="server" userId="server-001" />
          </div>

          {/* Tables et commandes */}
          <div className="lg:col-span-3 space-y-4">
            {/* Commandes prêtes à servir */}
            {readyOrders.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Bell className="h-5 w-5" />
                    Commandes prêtes ({readyOrders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readyOrders.map((order) => (
                      <Card key={order.id} className="border-orange-300">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getStationIcon(order.station)}
                                <span className="font-medium">{order.id}</span>
                                <Badge variant="outline" className={getTemperatureColor(order.temperature)}>
                                  {order.temperature === 'HOT' ? 'Chaud' : 'Froid'}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Table {order.tableNumber}</p>
                                <p className="text-xs text-gray-600">
                                  {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                </p>
                                <p className="text-xs text-gray-500">Prête à {order.readyTime}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleOrderServed(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Servi
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tables du restaurant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  État des tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map((table) => (
                    <Card key={table.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{table.id}</span>
                            <Badge variant="outline" className={getTableStatusColor(table.status)}>
                              {table.status === 'OCCUPIED' ? 'Occupée' : 
                               table.status === 'AVAILABLE' ? 'Disponible' : 'Réservée'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {table.customers}/{table.capacity}
                          </div>
                        </div>

                        {table.currentOrder && (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <p className="font-medium">Commande: {table.currentOrder}</p>
                              <p className="text-gray-600">Montant: €{(table.amount ?? 0).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">Depuis: {table.orderTime}</p>
                            </div>

                            <Separator />

                            <div className="flex gap-2">
                              {!table.paymentRequested ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRequestPayment(table.id, table.currentOrder!, table.amount ?? 0)}
                                  className="flex-1"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Demander paiement
                                </Button>
                              ) : (
                                <Badge variant="secondary" className="flex-1 justify-center">
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Paiement demandé
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {table.status === 'OCCUPIED' && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-600 mb-2">Appels client:</p>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCustomerCall(table.id, 'service')}
                                className="text-xs h-8"
                              >
                                Service
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCustomerCall(table.id, 'water')}
                                className="text-xs h-8"
                              >
                                Eau
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCustomerCall(table.id, 'bill')}
                                className="text-xs h-8"
                              >
                                Addition
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCustomerCall(table.id, 'help')}
                                className="text-xs h-8"
                              >
                                Aide
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Instructions du système de service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Commandes prêtes</p>
                  <p className="text-gray-600">Les alertes oranges indiquent qu'une commande est prête à être servie</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Demandes de paiement</p>
                  <p className="text-gray-600">Cliquez sur "Demander paiement" pour notifier la caisse</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">Appels client</p>
                  <p className="text-gray-600">Utilisez les boutons d'appel pour simuler les demandes des clients</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}