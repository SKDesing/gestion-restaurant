import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  Thermometer,
  Timer,
  Utensils,
  Pizza,
  Soup,
  Salad
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface KitchenOrder {
  id: string;
  tableNumber: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  timestamp: Date;
  priority: 'normal' | 'urgent';
  notes?: string;
}

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready';
  preparationTime: number;
  notes?: string;
}

interface HACCPRecord {
  id: string;
  type: 'temperature' | 'cleaning' | 'delivery';
  item: string;
  value: number;
  unit: string;
  threshold: { min: number; max: number };
  status: 'ok' | 'warning' | 'critical';
  timestamp: Date;
  recordedBy: string;
}

export default function CuisineApp() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [haccpRecords, setHaccpRecords] = useState<HACCPRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'haccp'>('orders');

  useEffect(() => {
    // Simuler des commandes initiales
    const initialOrders: KitchenOrder[] = [
      {
        id: '1',
        tableNumber: 'T3',
        items: [
          { id: '1', name: 'Steak frites', quantity: 2, status: 'pending', preparationTime: 20 },
          { id: '2', name: 'Pâtes carbonara', quantity: 1, status: 'pending', preparationTime: 15 }
        ],
        status: 'pending',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        priority: 'normal'
      },
      {
        id: '2',
        tableNumber: 'T5',
        items: [
          { id: '3', name: 'Pizza margherita', quantity: 1, status: 'preparing', preparationTime: 12 }
        ],
        status: 'preparing',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'urgent'
      }
    ];
    setOrders(initialOrders);

    // Simuler des enregistrements HACCP
    const initialHACCP: HACCPRecord[] = [
      {
        id: '1',
        type: 'temperature',
        item: 'Frigo 1',
        value: 4,
        unit: '°C',
        threshold: { min: 0, max: 8 },
        status: 'ok',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        recordedBy: 'Chef Pierre'
      },
      {
        id: '2',
        type: 'temperature',
        item: 'Chambre froide',
        value: 2,
        unit: '°C',
        threshold: { min: 0, max: 4 },
        status: 'ok',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        recordedBy: 'Chef Pierre'
      }
    ];
    setHaccpRecords(initialHACCP);

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('newOrder', (order: KitchenOrder) => {
      setOrders(prev => [order, ...prev]);
    });

    newSocket.on('orderUpdate', (data: { orderId: string, status: string }) => {
      setOrders(prev => prev.map(order => 
        order.id === data.orderId 
          ? { ...order, status: data.status as any }
          : order
      ));
    });

    return () => {
      newSocket.close();
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));

    // Notifier les autres tablettes
    socket?.emit('orderStatusUpdate', { orderId, status: newStatus });
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: KitchenOrderItem['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        // Mettre à jour le statut de la commande si tous les items sont prêts
        const allReady = updatedItems.every(item => item.status === 'ready');
        const anyPreparing = updatedItems.some(item => item.status === 'preparing');
        
        let newOrderStatus: KitchenOrder['status'] = order.status;
        if (allReady && order.status !== 'ready') {
          newOrderStatus = 'ready';
        } else if (anyPreparing && order.status === 'pending') {
          newOrderStatus = 'preparing';
        }
        
        return { ...order, items: updatedItems, status: newOrderStatus };
      }
      return order;
    }));

    // Notifier les autres tablettes
    socket?.emit('itemStatusUpdate', { orderId, itemId, status: newStatus });
  };

  const startPreparation = (orderId: string, itemId: string) => {
    updateItemStatus(orderId, itemId, 'preparing');
  };

  const markItemReady = (orderId: string, itemId: string) => {
    updateItemStatus(orderId, itemId, 'ready');
  };

  const markOrderReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
    
    // Notifier le serveur
    const order = orders.find(o => o.id === orderId);
    if (order) {
      socket?.emit('orderReady', {
        orderId,
        tableNumber: order.tableNumber
      });
    }
  };

  const addHACCPRecord = (type: HACCPRecord['type']) => {
    const newRecord: HACCPRecord = {
      id: Date.now().toString(),
      type,
      item: type === 'temperature' ? 'Frigo 1' : type === 'cleaning' ? 'Plan de travail' : 'Livraison',
      value: type === 'temperature' ? 4 : 1,
      unit: type === 'temperature' ? '°C' : '',
      threshold: type === 'temperature' ? { min: 0, max: 8 } : { min: 0, max: 2 },
      status: 'ok',
      timestamp: new Date(),
      recordedBy: 'Chef Pierre'
    };
    
    setHaccpRecords(prev => [newRecord, ...prev.slice(0, 9)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-300';
      case 'preparing': return 'bg-blue-100 border-blue-300';
      case 'ready': return 'bg-green-100 border-green-300';
      case 'served': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'preparing': return <ChefHat className="h-4 w-4 text-blue-600" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'served': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-500' : 'bg-blue-500';
  };

  const getTimeElapsed = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    return `${minutes}min`;
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cuisine</h1>
            <p className="text-sm text-gray-500">Tablette de préparation</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-lg px-3 py-1">
              {pendingOrders.length} En attente
            </Badge>
            <Badge variant="default" className="text-lg px-3 py-1">
              {preparingOrders.length} En préparation
            </Badge>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {readyOrders.length} Prêtes
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'orders' | 'haccp')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="haccp" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            HACCP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Commandes en attente */}
          {pendingOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  Commandes en attente ({pendingOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className={`border rounded-lg p-4 ${getStatusColor(order.status)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Table {order.tableNumber}</span>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority === 'urgent' ? 'Urgent' : 'Normal'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {getTimeElapsed(order.timestamp)}
                          </span>
                        </div>
                        {getStatusIcon(order.status)}
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                              <div className="text-xs text-gray-500">
                                <Timer className="h-3 w-3 inline mr-1" />
                                {item.preparationTime}min
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => startPreparation(order.id, item.id)}
                              className="flex items-center gap-1"
                            >
                              <ChefHat className="h-3 w-3" />
                              Commencer
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Commandes en préparation */}
          {preparingOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ChefHat className="h-5 w-5" />
                  En préparation ({preparingOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {preparingOrders.map((order) => (
                    <div key={order.id} className={`border rounded-lg p-4 ${getStatusColor(order.status)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Table {order.tableNumber}</span>
                          <span className="text-sm text-gray-500">
                            {getTimeElapsed(order.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Button
                            size="sm"
                            onClick={() => markOrderReady(order.id)}
                            disabled={!order.items.every(item => item.status === 'ready')}
                          >
                            Marquer prête
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                              <div className="mt-1">
                                <Badge variant={item.status === 'ready' ? 'default' : 'secondary'}>
                                  {item.status === 'ready' ? 'Prêt' : 'En préparation'}
                                </Badge>
                              </div>
                            </div>
                            {item.status === 'preparing' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markItemReady(order.id, item.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Prêt
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Commandes prêtes */}
          {readyOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Prêtes à servir ({readyOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readyOrders.map((order) => (
                    <div key={order.id} className={`border rounded-lg p-4 ${getStatusColor(order.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Table {order.tableNumber}</span>
                          <span className="text-sm text-gray-500">
                            {getTimeElapsed(order.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'served')}
                          >
                            Servi
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-sm text-gray-600">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {orders.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune commande en cours</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="haccp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contrôles température */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Contrôles température
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {haccpRecords.filter(r => r.type === 'temperature').map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{record.item}</div>
                        <div className="text-sm text-gray-500">
                          {record.value}{record.unit} (max: {record.threshold.max}{record.unit})
                        </div>
                        <div className="text-xs text-gray-400">
                          {record.timestamp.toLocaleTimeString()} - {record.recordedBy}
                        </div>
                      </div>
                      <Badge variant={record.status === 'ok' ? 'default' : 'destructive'}>
                        {record.status === 'ok' ? 'OK' : 'Alerte'}
                      </Badge>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addHACCPRecord('temperature')}
                  >
                    <Thermometer className="h-4 w-4 mr-2" />
                    Nouveau contrôle température
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contrôles nettoyage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Contrôles nettoyage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Plan de travail</div>
                    <div className="text-sm text-gray-500">Nettoyé il y a 2h</div>
                    <Badge variant="default">OK</Badge>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">Sol cuisine</div>
                    <div className="text-sm text-gray-500">Nettoyé il y a 4h</div>
                    <Badge variant="secondary">À vérifier</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => addHACCPRecord('cleaning')}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Nouveau contrôle nettoyage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertes HACCP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Alertes HACCP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                  <div>
                    <div className="font-medium text-red-800">Frigo 2 - Température élevée</div>
                    <div className="text-sm text-red-600">9°C (max: 8°C)</div>
                  </div>
                  <Badge variant="destructive">Critique</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}