import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Receipt,
  Plus,
  Minus,
  Trash2,
  Wine,
  Utensils,
  Coffee,
  Cake
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'bar' | 'food';
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  timestamp: Date;
  table?: string;
}

export default function CaisseBarApp() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'caisse' | 'bar'>('caisse');

  const barItems = [
    { id: '1', name: 'Café', price: 2.5, category: 'bar' as const },
    { id: '2', name: 'Thé', price: 2.0, category: 'bar' as const },
    { id: '3', name: 'Jus d\'orange', price: 3.0, category: 'bar' as const },
    { id: '4', name: 'Bière pression', price: 4.0, category: 'bar' as const },
    { id: '5', name: 'Vin rouge', price: 6.0, category: 'bar' as const },
    { id: '6', name: 'Vin blanc', price: 6.0, category: 'bar' as const },
    { id: '7', name: 'Cocktail', price: 8.0, category: 'bar' as const },
    { id: '8', name: 'Eau minérale', price: 1.5, category: 'bar' as const }
  ];

  const foodItems = [
    { id: '9', name: 'Sandwich', price: 5.5, category: 'food' as const },
    { id: '10', name: 'Salade', price: 7.0, category: 'food' as const },
    { id: '11', name: 'Pizza part', price: 4.0, category: 'food' as const },
    { id: '12', name: 'Dessert', price: 4.5, category: 'food' as const }
  ];

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('orderUpdate', (order: Order) => {
      setOrders(prev => [order, ...prev.slice(0, 19)]);
    });

    return () => newSocket.close();
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const processPayment = (method: 'cash' | 'card') => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: getTotal(),
      status: 'paid',
      timestamp: new Date(),
      table: activeTab === 'bar' ? 'Bar' : 'Comptoir'
    };

    setOrders(prev => [newOrder, ...prev.slice(0, 19)]);
    setCart([]);

    // Notifier les autres tablettes
    socket?.emit('newOrder', newOrder);
    socket?.emit('paymentProcessed', { order: newOrder, method });
  };

  const currentItems = activeTab === 'bar' ? barItems : foodItems;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'bar' ? 'Bar' : 'Caisse Rapide'}
            </h1>
            <p className="text-sm text-gray-500">Tablette de paiement</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {getTotal().toFixed(2)}€
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produits */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'caisse' | 'bar')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="caisse" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Caisse Rapide
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Bar
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {activeTab === 'bar' ? <Wine className="h-5 w-5" /> : <Utensils className="h-5 w-5" />}
                    {activeTab === 'bar' ? 'Boissons' : 'Nourriture Rapide'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currentItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => addToCart(item)}
                      >
                        <div className="text-lg font-semibold">{item.price.toFixed(2)}€</div>
                        <div className="text-sm text-center">{item.name}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panier */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Panier vide</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.price.toFixed(2)}€</div>
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
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
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
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold">{getTotal().toFixed(2)}€</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => processPayment('cash')}
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Espèces
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => processPayment('card')}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Carte
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Dernières ventes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Aucune vente</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{order.total.toFixed(2)}€</div>
                        <Badge variant="default" className="text-xs">Payé</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}