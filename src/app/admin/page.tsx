'use client';

import { useSocket } from '@/lib/useSocket';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { socket, connected } = useSocket('/admin');
  const [stats, setStats] = useState({ orders: 0, revenue: 0, tables: 0, staff: 0 });

  useEffect(() => {

    socket.on('stats:update', (data) => {
      setStats(data);
    });

    socket.emit('stats:request');

    return () => {
      socket.off('stats:update');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
          <Badge variant={connected ? 'default' : 'destructive'}>
            {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Commandes du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.revenue}€</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Tables actives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.tables}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Personnel en ligne</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.staff}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activité en temps réel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Socket ID: {socket?.id || 'Non connecté'}</p>
              <p className="text-sm text-gray-500">Namespace: /admin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
