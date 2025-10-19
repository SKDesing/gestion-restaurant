import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Utensils, 
  Plus, 
  Minus, 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Table,
  Search,
  Coffee,
  Pizza,
  Salad,
  Soup
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  icon?: React.ReactNode;
  preparationTime?: number;
}

interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface TableOrder {
  tableNumber: string;
  items: OrderItem[];
  status: 'pending' | 'sent' | 'preparing' | 'ready' | 'served';
  timestamp: Date;
  totalAmount: number;
}

interface Table {
  number: string;
  status: 'free' | 'occupied' | 'reserved';
  order?: TableOrder;
  capacity: number;
}

export default function ServeurApp() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeCategory, setActiveCategory] = useState('plats');

  const menuCategories = {
    entrees: {
      name: 'Entrées',
      icon: <Salad className="h-4 w-4" />,
      items: [
        { id: '1', name: 'Salade César', price: 8.5, category: 'entrees', preparationTime: 10 },
        { id: '2', name: 'Soupe du jour', price: 6.5, category: 'entrees', preparationTime: 8 },
        { id: '3', name: 'Bruschetta', price: 7.0, category: 'entrees', preparationTime: 5 }
      ]
    },
    plats: {
      name: 'Plats principaux',
      icon: <Utensils className="h-4 w-4" />,
      items: [
        { id: '4', name: 'Steak frites', price: 18.0, category: 'plats', preparationTime: 20 },
        { id: '5', name: 'Pâtes carbonara', price: 14.0, category: 'plats', preparationTime: 15 },
        { id: '6', name: 'Pizza margherita', price: 12.0, category: 'plats', preparationTime: 12 },
        { id: '7', name: 'Poulet rôti', price: 16.0, category: 'plats', preparationTime: 25 }
      ]
    },
    desserts: {
      name: 'Desserts',
      icon: <Coffee className="h-4 w-4" />,
      items: [
        { id: '8', name: 'Tiramisu', price: 6.0, category: 'desserts', preparationTime: 5 },
        { id: '9', name: 'Crème brûlée', price: 6.5, category: 'desserts', preparationTime: 5 },
        { id: '10', name: 'Mousse au chocolat', price: 5.5, category: 'desserts', preparationTime: 3 }
      ]
    },
    boissons: {
      name: 'Boissons',
      icon: <Coffee className="h-4 w-4" />,
      items: [
        { id: '11', name: 'Eau plate', price: 2.0, category: 'boissons', preparationTime: 2 },
        { id: '12', name: 'Eau gazeuse', price: 2.5, category: 'boissons', preparationTime: 2 },
        { id: '13', name: 'Jus d\'orange', price: 4.0, category: 'boissons', preparationTime: 2 },
        { id: '14', name: 'Vin rouge', price: 6.0, category: 'boissons', preparationTime: 2 }
      ]
    }
  };

  useEffect(() => {
    // Initialiser les tables
    const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
      number: `T${i + 1}`,
      status: Math.random() > 0.7 ? 'occupied' : 'free',
      capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
      order: Math.random() > 0.8 ? {
        tableNumber: `T${i + 1}`,
        items: [],
        status: 'served' as const,
        timestamp: new Date(),
        totalAmount: 0
      } : undefined
    }));
    setTables(initialTables);

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('orderStatusUpdate', (data: { tableNumber: string, status: string }) => {
      setTables(prev => prev.map(table => 
        table.number === data.tableNumber 
          ? { ...table, order: table.order ? { ...table.order, status: data.status as any } : undefined }
          : table
      ));
    });

    newSocket.on('tableUpdate', (tableData: Table) => {
      setTables(prev => prev.map(table => 
        table.number === tableData.number ? tableData : table
      ));
    });

    return () => newSocket.close();
  }, []);

  const addToOrder = (menuItem: MenuItem) => {
    if (!selectedTable) return;

    setCurrentOrder(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: Date.now().toString(), menuItem, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCurrentOrder(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as OrderItem[];
    });
  };

  const removeFromOrder = (itemId: string) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return currentOrder.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  };

  const sendOrderToKitchen = () => {
    if (!selectedTable || currentOrder.length === 0) return;

    const newOrder: TableOrder = {
      tableNumber: selectedTable.number,
      items: currentOrder,
      status: 'sent',
      timestamp: new Date(),
      totalAmount: calculateTotal()
    };

    // Mettre à jour la table
    setTables(prev => prev.map(table => 
      table.number === selectedTable.number 
        ? { ...table, status: 'occupied', order: newOrder }
        : table
    ));

    // Envoyer à la cuisine
    socket?.emit('newOrder', {
      ...newOrder,
      tableInfo: selectedTable
    });

    // Notifier la caisse
    socket?.emit('orderCreated', newOrder);

    // Réinitialiser
    setCurrentOrder([]);
  };

  const selectTable = (table: Table) => {
    setSelectedTable(table);
    setCurrentOrder(table.order?.items || []);
  };

  const getTableColor = (status: string) => {
    switch (status) {
      case 'free': return 'bg-green-100 border-green-300';
      case 'occupied': return 'bg-red-100 border-red-300';
      case 'reserved': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'occupied': return <Users className="h-3 w-3 text-red-600" />;
      case 'reserved': return <Clock className="h-3 w-3 text-yellow-600" />;
      default: return <AlertCircle className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Serveur</h1>
            <p className="text-sm text-gray-500">Tablette de prise de commandes</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedTable && (
              <Badge variant="outline" className="text-lg px-3 py-1">
                Table {selectedTable.number}
              </Badge>
            )}
            <Badge variant="secondary">
              {calculateTotal().toFixed(2)}€
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {tables.map((table) => (
                  <Button
                    key={table.number}
                    variant={selectedTable?.number === table.number ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center relative ${getTableColor(table.status)}`}
                    onClick={() => selectTable(table)}
                  >
                    <div className="text-lg font-bold">{table.number}</div>
                    <div className="text-xs">{table.capacity}p</div>
                    {getStatusIcon(table.status)}
                    {table.order && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {table.order.items.length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu et Commande */}
        <div className="lg:col-span-2 space-y-4">
          {/* Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  {Object.entries(menuCategories).map(([key, category]) => (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                      {category.icon}
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(menuCategories).map(([key, category]) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {category.items.map((item) => (
                        <Button
                          key={item.id}
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center"
                          onClick={() => addToOrder(item)}
                          disabled={!selectedTable}
                        >
                          <div className="text-lg font-semibold">{item.price.toFixed(2)}€</div>
                          <div className="text-sm text-center">{item.name}</div>
                          {item.preparationTime && (
                            <div className="text-xs text-gray-500">{item.preparationTime}min</div>
                          )}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Commande actuelle */}
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Commande Table {selectedTable.number}</span>
                  <Button 
                    onClick={sendOrderToKitchen}
                    disabled={currentOrder.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer en cuisine
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrder.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun article commandé</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {currentOrder.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.menuItem.name}</div>
                          <div className="text-xs text-gray-500">{item.menuItem.price.toFixed(2)}€</div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {currentOrder.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold">{calculateTotal().toFixed(2)}€</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}