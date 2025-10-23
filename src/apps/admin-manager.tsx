import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Settings, DollarSign, ChefHat, Tablet } from 'lucide-react';

export default function AdminManagerApp() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-7 w-7 text-purple-700" />
        Tableau de bord Gérant
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 250 €</div>
            <div className="text-sm text-gray-500">Aujourd'hui</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Employés connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-gray-500">Actuellement</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-orange-600" />
              Commandes en cuisine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-gray-500">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tablet className="h-5 w-5 text-gray-700" />
              Tablettes actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-gray-500">Connectées</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dernières actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Commande #123 validée par le serveur</li>
            <li>Réception de marchandises enregistrée</li>
            <li>Nouvel employé ajouté</li>
            <li>Température frigo vérifiée</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
