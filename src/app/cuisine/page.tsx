'use client';

import { useSocket } from '@/lib/useSocket';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface KitchenOrder {
  id: string;
  table: number;
  items: { name: string; quantity: number; notes?: string }[];
  status: 'pending' | 'preparing' | 'ready';
  timestamp: number;
  priority: 'normal' | 'urgent';
}

export default function CuisinePage() {
  const { socket, connected } = useSocket('/cuisine');
  const [orders, setOrders] = useState<KitchenOrder[]>([]);

  useEffect(() => {

    socket.on('order:kitchen', (order: KitchenOrder) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on('order:statusChanged', ({ id, status }) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    });

    socket.emit('orders:kitchen:fetch');

    return () => {
      socket.off('order:kitchen');
      socket.off('order:statusChanged');
    };
  }, [socket]);

  const handleStatusChange = (orderId: string, newStatus: KitchenOrder['status']) => {
    socket?.emit('order:updateStatus', { id: orderId, status: newStatus });
  };

  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Cuisine 👨‍🍳</h1>
          <Badge variant={connected ? 'default' : 'destructive'}>{connected ? '🟢 Connecté' : '🔴 Déconnecté'}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center text-gray-500">Aucune commande en cours</CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className={order.priority === 'urgent' ? 'border-red-500 border-2' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Table {order.table}
                      {order.priority === 'urgent' && ' 🔥'}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status === 'pending' ? 'En attente' : order.status === 'preparing' ? 'En préparation' : 'Prêt'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString('fr-FR')}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="border-b pb-2">
                        <p className="font-medium">{item.quantity}x {item.name}</p>
                        {item.notes && <p className="text-sm text-gray-600 italic">Note: {item.notes}</p>}
                      </div>
                    ))}

                    <div className="flex gap-2 mt-4">
                      {order.status === 'pending' && (
                        <Button onClick={() => handleStatusChange(order.id, 'preparing')} className="flex-1" size="sm">Commencer</Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button onClick={() => handleStatusChange(order.id, 'ready')} className="flex-1" size="sm">Terminer</Button>
                      )}
                      {order.status === 'ready' && (
                        <Badge variant="outline" className="flex-1 justify-center">En attente de service</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
