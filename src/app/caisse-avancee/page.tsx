'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Plus, 
  Minus, 
  Trash2,
  Receipt,
  Bell,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Coffee,
  Wine,
  Beer,
  Package,
  Phone,
  User,
  Calendar,
  Timer,
  ChefHat,
  Utensils,
  AlertTriangle,
  Send,
  Search
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  notes?: string
}

interface TakeoutOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone?: string
  items: CartItem[]
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED'
  estimatedTime?: number
  pickupTime?: string
  notes?: string
  createdAt: string
}

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description?: string
  preparationTime?: number
  available: boolean
}

export default function CaisseAvancee() {
  const [activeTab, setActiveTab] = useState('ventes')
  const [cart, setCart] = useState<CartItem[]>([])
  const [takeoutOrders, setTakeoutOrders] = useState<TakeoutOrder[]>([])
  const [currentOrderType, setCurrentOrderType] = useState<'sur_place' | 'emporter'>('sur_place')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    notes: '',
    pickupTime: '',
    estimatedTime: 20
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [todayStats, setTodayStats] = useState({
    totalSales: 2847.50,
    totalOrders: 156,
    cashSales: 1247.50,
    cardSales: 1600.00,
    averageOrder: 18.25,
    takeoutOrders: 45
  })

  const [menuItems] = useState<MenuItem[]>([
    // Boissons Chaudes
    { id: 'cafe1', name: 'Café Expresso', price: 2.50, category: 'Boissons Chaudes', preparationTime: 2, available: true },
    { id: 'cafe2', name: 'Café Crème', price: 3.00, category: 'Boissons Chaudes', preparationTime: 3, available: true },
    { id: 'the1', name: 'Thé Nature', price: 2.50, category: 'Boissons Chaudes', preparationTime: 3, available: true },
    { id: 'choco1', name: 'Chocolat Chaud', price: 3.50, category: 'Boissons Chaudes', preparationTime: 4, available: true },
    
    // Boissons Froides
    { id: 'coca1', name: 'Coca-Cola', price: 3.00, category: 'Boissons Froides', preparationTime: 1, available: true },
    { id: 'eau1', name: 'Eau Minérale', price: 2.00, category: 'Boissons Froides', preparationTime: 1, available: true },
    { id: 'jus1', name: 'Jus d\'Orange', price: 4.00, category: 'Boissons Froides', preparationTime: 2, available: true },
    { id: 'smoothie1', name: 'Smoothie', price: 5.50, category: 'Boissons Froides', preparationTime: 5, available: true },
    
    // Vins & Alcools
    { id: 'vin1', name: 'Vin Rouge (verre)', price: 6.00, category: 'Vins & Alcools', preparationTime: 2, available: true },
    { id: 'vin2', name: 'Vin Blanc (verre)', price: 6.00, category: 'Vins & Alcools', preparationTime: 2, available: true },
    { id: 'biere1', name: 'Bière Pression', price: 4.50, category: 'Vins & Alcools', preparationTime: 3, available: true },
    { id: 'cocktail1', name: 'Cocktail Maison', price: 8.00, category: 'Vins & Alcools', preparationTime: 8, available: true },
    
    // Plats à emporter
    { id: 'burger1', name: 'Burger Classic', price: 12.00, category: 'Plats', preparationTime: 15, available: true },
    { id: 'burger2', name: 'Burger Veggie', price: 11.00, category: 'Plats', preparationTime: 15, available: true },
    { id: 'sandwich1', name: 'Sandwich Poulet', price: 8.50, category: 'Plats', preparationTime: 10, available: true },
    { id: 'sandwich2', name: 'Croque-monsieur', price: 7.50, category: 'Plats', preparationTime: 8, available: true },
    { id: 'salade1', name: 'Salade César', price: 9.00, category: 'Plats', preparationTime: 5, available: true },
    { id: 'salade2', name: 'Salade Complète', price: 10.50, category: 'Plats', preparationTime: 7, available: true },
    { id: 'frites1', name: 'Frites', price: 4.00, category: 'Accompagnements', preparationTime: 8, available: true },
    { id: 'nuggets1', name: 'Nuggets Poulet', price: 6.50, category: 'Accompagnements', preparationTime: 12, available: true },
    
    // Pâtisseries
    { id: 'croissant1', name: 'Croissant', price: 2.00, category: 'Pâtisseries', preparationTime: 1, available: true },
    { id: 'pain1', name: 'Pain au Chocolat', price: 2.50, category: 'Pâtisseries', preparationTime: 1, available: true },
    { id: 'gateau1', name: 'Part de Gâteau', price: 4.50, category: 'Pâtisseries', preparationTime: 2, available: true }
  ])

  const [mockTakeoutOrders] = useState<TakeoutOrder[]>([
    {
      id: '1',
      orderNumber: 'EM-001',
      customerName: 'Marie Dubois',
      customerPhone: '0612345678',
      items: [
        { id: 'burger1', name: 'Burger Classic', price: 12.00, quantity: 2, category: 'Plats' },
        { id: 'frites1', name: 'Frites', price: 4.00, quantity: 2, category: 'Accompagnements' }
      ],
      total: 32.00,
      status: 'PREPARING',
      estimatedTime: 20,
      pickupTime: '2024-01-15T13:00:00Z',
      createdAt: '2024-01-15T12:40:00Z'
    },
    {
      id: '2',
      orderNumber: 'EM-002',
      customerName: 'Jean Martin',
      customerPhone: '0623456789',
      items: [
        { id: 'sandwich1', name: 'Sandwich Poulet', price: 8.50, quantity: 1, category: 'Plats' },
        { id: 'cafe1', name: 'Café Expresso', price: 2.50, quantity: 1, category: 'Boissons Chaudes' }
      ],
      total: 11.00,
      status: 'READY',
      estimatedTime: 10,
      pickupTime: '2024-01-15T12:50:00Z',
      createdAt: '2024-01-15T12:30:00Z'
    }
  ])

  useEffect(() => {
    setTakeoutOrders(mockTakeoutOrders)
  }, [mockTakeoutOrders])

  const categories = Array.from(new Set(menuItems.map(item => item.category)))

  const filteredMenuItems = menuItems.filter(item => 
    item.available && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
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

  const calculateEstimatedTime = () => {
    if (cart.length === 0) return 0
    const maxTime = Math.max(...cart.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.id)
      return menuItem?.preparationTime || 5
    }))
    return maxTime + 5 // Marge de sécurité
  }

  const createTakeoutOrder = async () => {
    if (cart.length === 0 || !customerInfo.name) {
      alert('Veuillez remplir les informations du client et ajouter des articles')
      return
    }

    const orderData = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      items: cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        notes: item.notes
      })),
      notes: customerInfo.notes,
      estimatedTime: calculateEstimatedTime(),
      pickupTime: customerInfo.pickupTime || new Date(Date.now() + calculateEstimatedTime() * 60000).toISOString()
    }

    try {
      const response = await fetch('/api/orders/takeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Ajouter la commande à la liste locale
        const newOrder: TakeoutOrder = {
          id: result.order.id,
          orderNumber: result.order.orderNumber,
          customerName: result.order.customerName,
          customerPhone: customerInfo.phone,
          items: cart,
          total: result.order.total,
          status: 'PENDING',
          estimatedTime: result.order.estimatedTime,
          pickupTime: result.order.pickupTime,
          notes: customerInfo.notes,
          createdAt: new Date().toISOString()
        }

        setTakeoutOrders(prev => [newOrder, ...prev])
        
        // Réinitialiser le formulaire
        setCart([])
        setCustomerInfo({
          name: '',
          phone: '',
          notes: '',
          pickupTime: '',
          estimatedTime: 20
        })

        alert(`Commande ${result.order.orderNumber} créée avec succès!`)
      } else {
        alert('Erreur lors de la création de la commande')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de la commande')
    }
  }

  const processPayment = (method: string) => {
    if (cart.length === 0) return

    if (currentOrderType === 'emporter') {
      createTakeoutOrder()
    } else {
      // Traitement normal pour sur place
      const total = calculateTotal()
      
      // Mettre à jour les statistiques
      setTodayStats(prev => ({
        ...prev,
        totalSales: prev.totalSales + total,
        totalOrders: prev.totalOrders + 1,
        [method === 'CASH' ? 'cashSales' : 'cardSales']: prev[method === 'CASH' ? 'cashSales' : 'cardSales'] + total
      }))

      // Vider le panier
      setCart([])
      
      alert(`Paiement de €${total.toFixed(2)} par ${method} traité avec succès!`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PREPARING': return 'bg-orange-100 text-orange-800'
      case 'READY': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />
      case 'PREPARING': return <ChefHat className="h-4 w-4" />
      case 'READY': return <Package className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Coffee className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Caisse Centrale Avancée</h1>
                <p className="text-sm text-gray-600">Ventes, commandes à emporter et gestion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Type de commande:</Label>
                <Select value={currentOrderType} onValueChange={(value: any) => setCurrentOrderType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sur_place">Sur place</SelectItem>
                    <SelectItem value="emporter">À emporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Ouvert
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats du jour */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Ventes du jour</p>
                  <p className="text-lg font-bold">€{todayStats.totalSales.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Commandes</p>
                  <p className="text-lg font-bold">{todayStats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Espèces</p>
                  <p className="text-lg font-bold">€{todayStats.cashSales.toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Carte</p>
                  <p className="text-lg font-bold">€{todayStats.cardSales.toFixed(2)}</p>
                </div>
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Moyenne</p>
                  <p className="text-lg font-bold">€{todayStats.averageOrder.toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">À emporter</p>
                  <p className="text-lg font-bold">{todayStats.takeoutOrders}</p>
                </div>
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu et Panier */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ventes">Ventes</TabsTrigger>
                <TabsTrigger value="emporter">À emporter</TabsTrigger>
                <TabsTrigger value="historique">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="ventes" className="space-y-4">
                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Menu Categories */}
                <div className="space-y-4">
                  {categories.map((category) => (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="text-lg">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {filteredMenuItems
                            .filter(item => item.category === category)
                            .map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="h-auto p-3 flex flex-col items-center gap-2"
                              onClick={() => addToCart(item)}
                            >
                              <span className="font-medium text-sm text-center">{item.name}</span>
                              <span className="text-lg font-bold text-blue-600">€{item.price.toFixed(2)}</span>
                              {item.preparationTime && (
                                <span className="text-xs text-gray-500">{item.preparationTime} min</span>
                              )}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="emporter" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Commandes à emporter en cours
                    </CardTitle>
                    <CardDescription>Suivi des commandes à emporter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {takeoutOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.orderNumber}</span>
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{order.status}</span>
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3" />
                                  {order.customerName}
                                </div>
                                {order.customerPhone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    {order.customerPhone}
                                  </div>
                                )}
                                {order.pickupTime && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Retrait: {new Date(order.pickupTime).toLocaleTimeString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">€{order.total.toFixed(2)}</div>
                              {order.estimatedTime && (
                                <div className="text-sm text-gray-500">
                                  <Timer className="h-3 w-3 inline mr-1" />
                                  {order.estimatedTime} min
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1 mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          {order.status === 'READY' && (
                            <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                              <div className="flex items-center gap-2 text-sm text-green-800">
                                <Package className="h-4 w-4" />
                                <span className="font-medium">Commande prête à retirer!</span>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Printer className="h-4 w-4 mr-1" />
                              Ticket
                            </Button>
                            {order.status === 'READY' && (
                              <Button size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Notifier
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historique" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des ventes</CardTitle>
                    <CardDescription>Dernières transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Receipt className="h-12 w-12 mx-auto mb-2" />
                      <p>L'historique détaillé sera bientôt disponible</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panier et Informations Client */}
          <div className="space-y-4">
            {/* Informations client pour emporter */}
            {currentOrderType === 'emporter' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations Client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nom du client *</Label>
                    <Input
                      id="customerName"
                      placeholder="Nom complet"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Téléphone</Label>
                    <Input
                      id="customerPhone"
                      placeholder="Numéro de téléphone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupTime">Heure de retrait souhaitée</Label>
                    <Input
                      id="pickupTime"
                      type="datetime-local"
                      value={customerInfo.pickupTime}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, pickupTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Instructions spéciales..."
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Panier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Panier
                  {cart.length > 0 && (
                    <Badge variant="secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)} articles</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                    <p>Panier vide</p>
                    <p className="text-sm">Ajoutez des articles pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">€{item.price.toFixed(2)} × {item.quantity}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total:</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>TVA (10%):</span>
                        <span>€{(calculateTotal() * 0.1).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>€{(calculateTotal() * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    {currentOrderType === 'emporter' && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                          <Timer className="h-4 w-4" />
                          <span>Temps de préparation estimé: {calculateEstimatedTime()} minutes</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => processPayment('CASH')}
                        disabled={cart.length === 0 || (currentOrderType === 'emporter' && !customerInfo.name)}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {currentOrderType === 'emporter' ? 'Créer la commande' : 'Payer en espèces'}
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => processPayment('CARD')}
                        disabled={cart.length === 0 || (currentOrderType === 'emporter' && !customerInfo.name)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {currentOrderType === 'emporter' ? 'Créer la commande' : 'Payer par carte'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}