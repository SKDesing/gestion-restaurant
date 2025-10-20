"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">📊 Dashboard Admin</h1>
          <p className="text-slate-600 mt-2">Vue d'ensemble en temps réel</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">CA Journalier</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">2 450 €</div>
              <p className="text-xs text-slate-500 mt-1">+12% vs hier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <span className="text-2xl">📋</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">47</div>
              <p className="text-xs text-slate-500 mt-1">8 en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tables Occupées</CardTitle>
              <span className="text-2xl">🪑</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">12/20</div>
              <p className="text-xs text-slate-500 mt-1">60% taux d'occupation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cuisine</CardTitle>
              <span className="text-2xl">👨‍🍳</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">5 min</div>
              <p className="text-xs text-slate-500 mt-1">Temps moyen</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>🔴 Alertes en Temps Réel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span>Stock fromage bas</span>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                  <span>Table 7 attend depuis 15min</span>
                  <Badge variant="outline">Attention</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span>Service fluide</span>
                  <Badge variant="default">OK</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Top Ventes Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Burger Maison', qty: 23, total: '345€' },
                  { name: 'Pizza Margherita', qty: 18, total: '234€' },
                  { name: 'Salade César', qty: 15, total: '180€' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-slate-500">{item.qty} vendus</div>
                    </div>
                    <div className="font-bold text-green-600">{item.total}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
