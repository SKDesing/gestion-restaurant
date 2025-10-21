'use client';

import { useSocket } from '@/lib/useSocket';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Table {
  id: number;
  status: 'free' | 'occupied' | 'reserved';
  guests: number;
  serverId?: string;
}

export default function ServeurPage() {
  const { socket, connected } = useSocket('/serveur');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {

    socket.on('tables:update', (data: Table[]) => {
      setTables(data);
    });

    socket.on('table:assigned', (tableId: number) => {
      setSelectedTable(tableId);
    });

    socket.emit('tables:fetch');

    return () => {
      socket.off('tables:update');
      socket.off('table:assigned');
    };
  }, [socket]);

  const handleTakeTable = (tableId: number) => {
    socket?.emit('table:take', tableId);
  };

  const handleFreeTable = (tableId: number) => {
    socket?.emit('table:free', tableId);
    setSelectedTable(null);
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Serveur 🍽️</h1>
          <Badge variant={connected ? 'default' : 'destructive'}>
            {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <Card key={table.id} className="relative">
              <CardHeader>
                <CardTitle className="text-center">Table {table.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge className={getStatusColor(table.status)}>
                    {table.status === 'free' ? 'Libre' : table.status === 'occupied' ? 'Occupée' : 'Réservée'}
                  </Badge>

                  {table.status === 'occupied' && (
                    <p className="text-sm text-center text-gray-600">
                      {table.guests} {table.guests > 1 ? 'personnes' : 'personne'}
                    </p>
                  )}

                  {table.status === 'free' && (
                    <Button onClick={() => handleTakeTable(table.id)} className="w-full" size="sm">
                      Prendre en charge
                    </Button>
                  )}

                  {table.status === 'occupied' && table.serverId === socket?.id && (
                    <Button onClick={() => handleFreeTable(table.id)} variant="outline" className="w-full" size="sm">
                      Libérer
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
