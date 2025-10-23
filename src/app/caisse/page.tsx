'use client';

import { useSocket } from '@/lib/useSocket';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  table: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'paid';
  timestamp: number;
}

export default function CaissePage() {
  const { socket, connected } = useSocket('/caisse');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {

    socket.on('order:new', (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on('order:paid', (orderId: string) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'paid' } : o))
      );
    });

    socket.emit('orders:fetch');

    return () => {
      socket.off('order:new');
      socket.off('order:paid');
    };
  }, [socket]);

  const handlePayment = (orderId: string) => {
    socket?.emit('order:pay', orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Caisse 💰</h1>
          <Badge variant={connected ? 'default' : 'destructive'}>
            {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </Badge>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Aucune commande en attente
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Table {order.table}</CardTitle>
                    <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                      {order.status === 'paid' ? 'Payé' : 'En attente'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">{item.price * item.quantity}€</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{order.total}€</span>
                    </div>
                    {order.status === 'pending' && (
                      <Button onClick={() => handlePayment(order.id)} className="w-full mt-4">
                        Encaisser
                      </Button>
                    )}
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
