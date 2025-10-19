'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Plus, 
  Minus, 
  Trash2,
  Bell,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Utensils,
  Wine,
  Coffee,
  ChefHat,
  Tablet,
  QrCode,
  Camera,
  Eye
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  tableId: string
}

interface Table {
  id: string
  number: string
  capacity: number
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'NEEDS_CLEANING'
  location: string
  currentOrder?: {
    id: string
    items: CartItem[]
    total: number
    status: string
    createdAt: string
  }
}

interface Notification {
  id: string
  type: 'ORDER_READY' | 'PAYMENT_REQUEST' | 'TABLE_CALL' | 'KITCHEN_ALERT'
  message: string
  tableNumber?: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export default function ServeurInterface() {
  const [activeTab, setActiveTab] = useState('tables')
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showScanner, setShowScanner] = useState(false)

  const [tables] = useState<Table[]>([
    {
      id: '1',
      number: 'T1',
      capacity: 4,
      status: 'OCCUPIED',
      location: 'Terrasse',
      currentOrder: {
        id: 'order1',
        items: [
          { id: '1', name: 'Café', price: 2.50, quantity: 2, category: 'Boisson', tableId: '1' },
          { id: '2', name: 'Croissant', price: 2.00, quantity: 2, category: 'Pâtisserie', tableId: '1' }
        ],
        total: 9.00,
        status: 'SERVED',
        createdAt: '2024-01-15T10:30:00Z'
      }
    },
    {
      id: '2',
      number: 'T2',
      capacity: 2,
      status: 'OCCUPIED',
      location: 'Terrasse',
      currentOrder: {
        id: 'order2',
        items: [
          { id: '3', name: 'Salade César', price: 12.00, quantity: 1, category: 'Entrée', tableId: '2' },
          { id: '4', name: 'Steak Frites', price: 18.50, quantity: 1, category: 'Plat', tableId: '2' }
        ],
        total: 30.50,
        status: 'PREPARING',
        createdAt: '2024-01-15T12:15:00Z'
      }
    },
    {
      id: '3',
      number: 'T3',
      capacity: 4,
      status: 'AVAILABLE',
      location: 'Salle Principale'
    },
    {
      id: '4',
      number: 'T4',
      capacity: 6,
      status: 'OCCUPIED',
      location: 'Salle Principale',
      currentOrder: {
        id: 'order4',
        items: [
          { id: '5', name: 'Vin Rouge', price: 6.00, quantity: 2, category: 'Boisson', tableId: '4' }
        ],
        total: 12.00,
        status: 'READY',
        createdAt: '2024-01-15T12:45:00Z'
      }
    },
    {
      id: '5',
      number: 'T5',
      capacity: 8,
      status: 'RESERVED',
      location: 'Privé'
    },
    {
      id: '6',
      number: 'T6',
      capacity: 2,
      status: 'NEEDS_CLEANING',
      location: 'Bar'
    }
  ])

  const [menuCategories] = useState([
    {
      name: 'Boissons',
      icon: <Wine className="h-5 w-5" />,
      items: [
        { id: 'coca', name: 'Coca-Cola', price: 3.00, category: 'Boisson' },
        { id: 'eau', name: 'Eau Minérale', price: 2.00, category: 'Boisson' },
        { id: 'vin_rouge', name: 'Vin Rouge (verre)', price: 6.00, category: 'Boisson' },
        { id: 'vin_blanc', name: 'Vin Blanc (verre)', price: 6.00, category: 'Boisson' },
        { id: 'biere', name: 'Bière', price: 4.50, category: 'Boisson' },
        { id: 'cafe', name: 'Café', price: 2.50, category: 'Boisson' },
      ]
    },
    {
      name: 'Entrées',
      icon: <Utensils className="h-5 w-5" />,
      items: [
        { id: 'salade', name: 'Salade César', price: 12.00, category: 'Entrée' },
        { id: 'soupe', name: 'Soupe à l\'oignon', price: 8.50, category: 'Entrée' },
        { id: 'bruschetta', name: 'Bruschetta', price: 7.50, category: 'Entrée' },
      ]
    },
    {
      name: 'Plats Principaux',
      icon: <ChefHat className="h-5 w-5" />,
      items: [
        { id: 'steak', name: 'Steak Frites', price: 18.50, category: 'Plat' },
        { id: 'saumon', name: 'Saumon Grillé', price: 22.00, category: 'Plat' },
        { id: 'risotto', name: 'Risotto', price: 16.50, category: 'Plat' },
        { id: 'burger', name: 'Burger Maison', price: 15.00, category: 'Plat' },
      ]
    },
    {
      name: 'Desserts',
      icon: <Coffee className="h-5 w-5" />,
      items: [
        { id: 'tiramisu', name: 'Tiramisu', price: 7.50, category: 'Dessert' },
        { id: 'creme', name: 'Crème Brûlée', price: 8.00, category: 'Dessert' },
        { id: 'chocolat', name: 'Fondant Chocolat', price: 7.00, category: 'Dessert' },
      ]
    }
  ])

  useEffect(() => {
    // Simuler les notifications en temps réel
    const interval = setInterval(() => {
      const notifications: Notification[] = [
        {
          id: Date.now().toString(),
          type: 'ORDER_READY',
          message: 'Commande prête pour la table T4',
          tableNumber: 'T4',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'TABLE_CALL',
          message: 'La table T2 vous appelle',
          tableNumber: 'T2',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      ]
      
      setNotifications(prev => [...notifications, ...prev.slice(0, 8)])
    }, 20000) // Nouvelle notification toutes les 20 secondes

    return () => clearInterval(interval)
  }, [])

  const selectTable = (table: Table) => {
    setSelectedTable(table)
    if (table.currentOrder) {
      setCart(table.currentOrder.items)
    } else {
      setCart([])
    }
    setActiveTab('commande')
  }

  const addToCart = (item: any) => {
    if (!selectedTable) return
    
    const cartItem: CartItem = {
      ...item,
      tableId: selectedTable.id
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, cartItem]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const sendToKitchen = () => {
    if (!selectedTable || cart.length === 0) return

    // Envoyer la commande à la cuisine
    const order = {
      tableNumber: selectedTable.number,
      items: cart,
      total: calculateTotal(),
      timestamp: new Date().toISOString()
    }
    
    console.log('Envoi à la cuisine:', order)
    
    // Simuler l'envoi
    alert(`Commande envoyée à la cuisine pour la table ${selectedTable.number}`)
    
    // Mettre à jour le statut de la table
    setSelectedTable({
      ...selectedTable,
      currentOrder: {
        id: Date.now().toString(),
        items: cart,
        total: calculateTotal(),
        status: 'PREPARING',
        createdAt: new Date().toISOString()
      }
    })
  }

  const processPayment = (method: string) => {
    if (!selectedTable || cart.length === 0) return

    const total = calculateTotal()
    
    // Envoyer la demande de paiement à la caisse
    const paymentRequest = {
      tableNumber: selectedTable.number,
      items: cart,
      total,
      method,
      timestamp: new Date().toISOString()
    }
    
    console.log('Demande de paiement:', paymentRequest)
    
    // Simuler l'envoi à la caisse
    alert(`Demande de paiement envoyée à la caisse (${method}) - Total: €${total.toFixed(2)}`)
    
    // Vider le panier et libérer la table
    setCart([])
    setSelectedTable({
      ...selectedTable,
      status: 'AVAILABLE',
      currentOrder: undefined
    })
    setActiveTab('tables')
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'OCCUPIED': return 'bg-blue-100 text-blue-800'
      case 'RESERVED': return 'bg-yellow-100 text-yellow-800'
      case 'NEEDS_CLEANING': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_READY': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PAYMENT_REQUEST': return <CreditCard className="h-4 w-4 text-blue-600" />
      case 'TABLE_CALL': return <Bell className="h-4 w-4 text-yellow-600" />
      case 'KITCHEN_ALERT': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Serveur</h1>
                <p className="text-xs text-gray-600">Gestion des tables et commandes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                En service
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Tablet className="h-4 w-4" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="commande" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Commande
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alertes
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="outils" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Outils
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tables.map((table) => (
                <Card 
                  key={table.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTable?.id === table.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => selectTable(table)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">Table {table.number}</h3>
                      <Badge className={getTableStatusColor(table.status)}>
                        {table.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <div>{table.capacity} personnes • {table.location}</div>
                      {table.currentOrder && (
                        <div className="mt-1">
                          <div className="font-medium">Commande en cours</div>
                          <div>{table.currentOrder.items.length} articles</div>
                          <div className="font-bold">€{table.currentOrder.total.toFixed(2)}</div>
                          <Badge variant="outline" className="mt-1">
                            {table.currentOrder.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      {table.status === 'AVAILABLE' && (
                        <Button size="sm" className="flex-1">
                          <Plus className="h-3 w-3 mr-1" />
                          Commander
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commande" className="space-y-4">
            {selectedTable ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tablet className="h-5 w-5" />
                      Table {selectedTable.number} - {selectedTable.location}
                    </CardTitle>
                    <CardDescription>
                      {selectedTable.capacity} personnes • {selectedTable.status}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Menu */}
                  <div className="lg:col-span-2 space-y-4">
                    {menuCategories.map((category) => (
                      <Card key={category.name}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            {category.icon}
                            {category.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2">
                            {category.items.map((item) => (
                              <Button
                                key={item.id}
                                variant="outline"
                                className="h-auto p-3 flex flex-col items-center gap-1"
                                onClick={() => addToCart(item)}
                              >
                                <span className="text-sm font-medium">{item.name}</span>
                                <span className="text-sm font-bold text-blue-600">€{item.price.toFixed(2)}</span>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Panier */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Panier</CardTitle>
                        <CardDescription>{cart.length} articles</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {cart.length === 0 ? (
                          <div className="text-center py-6 text-gray-500">
                            <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Panier vide</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.name}</div>
                                  <div className="text-xs text-gray-600">€{item.price.toFixed(2)}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between items-center pt-2">
                              <span className="font-bold">Total:</span>
                              <span className="font-bold">€{calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={sendToKitchen}
                        disabled={cart.length === 0}
                      >
                        <ChefHat className="h-4 w-4 mr-2" />
                        Envoyer à la cuisine
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => processPayment('CASH')}
                          disabled={cart.length === 0}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Espèces
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => processPayment('CARD')}
                          disabled={cart.length === 0}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Carte
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Tablet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Aucune table sélectionnée</h3>
                  <p className="text-gray-600">Sélectionnez une table pour commencer une commande</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications et Alertes</CardTitle>
                <CardDescription>Alertes en temps réel de la cuisine et des clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucune notification</p>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{notification.message}</p>
                              <Badge variant={notification.priority === 'high' ? 'destructive' : 'outline'}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>
                              {notification.tableNumber && (
                                <Badge variant="outline" className="text-xs">
                                  Table {notification.tableNumber}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outils" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium mb-1">Scanner QR Code</h3>
                  <p className="text-sm text-gray-600 mb-3">Scanner une table</p>
                  <Button onClick={() => setShowScanner(true)} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Scanner
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <h3 className="font-medium mb-1">Appeler Table</h3>
                  <p className="text-sm text-gray-600 mb-3">Notifier une table</p>
                  <Button variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Utensils className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium mb-1">Menu du Jour</h3>
                  <p className="text-sm text-gray-600 mb-3">Voir les suggestions</p>
                  <Button variant="outline" className="w-full">
                    <Utensils className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium mb-1">Réservations</h3>
                  <p className="text-sm text-gray-600 mb-3">Gérer les réservations</p>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}