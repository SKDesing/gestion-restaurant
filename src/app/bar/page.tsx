"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BarPage() {
  const [orders, setOrders] = useState([
    { id: 1, table: 5, items: ['Mojito', 'Cocktail Maison'], status: 'pending', time: '2 min' },
    { id: 2, table: 3, items: ['Bière Pression x2'], status: 'preparing', time: '1 min' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">🍹 Bar</h1>
            <p className="text-amber-700">Gestion des boissons</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-900">{new Date().toLocaleTimeString('fr-FR')}</div>
            <Badge variant="outline" className="mt-1">{orders.filter(o => o.status === 'pending').length} commandes</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(order => (
            <Card key={order.id} className="border-2 border-amber-200">
              <CardHeader className="bg-amber-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Table {order.table}</CardTitle>
                  <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>{order.time}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-lg">
                      <span className="mr-2">🥃</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button 
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      onClick={() => setOrders(orders.map(o => o.id === order.id ? {...o, status: 'preparing'} : o))}
                    >
                      Préparer
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => setOrders(orders.filter(o => o.id !== order.id))}
                    >
                      ✓ Terminé
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
