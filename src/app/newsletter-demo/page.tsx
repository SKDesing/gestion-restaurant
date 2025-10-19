'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer,
  Calendar,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data pour les campagnes
const mockCampaigns = [
  {
    id: '1',
    name: 'Offre Spéciale Été',
    subject: '🌞 Nos plats d\'été sont arrivés !',
    type: 'PROMOTIONAL',
    status: 'SENT',
    totalRecipients: 245,
    openedCount: 178,
    clickedCount: 67,
    sentAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Nouveau Menu - Dégustation',
    subject: 'Découvrez notre nouveau menu dégustation',
    type: 'NEWSLETTER',
    status: 'SENT',
    totalRecipients: 312,
    openedCount: 234,
    clickedCount: 89,
    sentAt: '2024-01-08T14:30:00Z'
  },
  {
    id: '3',
    name: 'Happy Hour Extension',
    subject: '🍹 Happy Hour prolongé toute la semaine !',
    type: 'PROMOTIONAL',
    status: 'DRAFT',
    totalRecipients: 0,
    openedCount: 0,
    clickedCount: 0,
    scheduledAt: '2024-01-20T18:00:00Z'
  }
]

// Mock data pour les abonnés
const mockSubscribers = [
  {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    loyaltyPoints: 450,
    frequency: 'WEEKLY',
    preferredTime: '10:00',
    subscribedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    loyaltyPoints: 230,
    frequency: 'MONTHLY',
    preferredTime: '19:00',
    subscribedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    loyaltyPoints: 780,
    frequency: 'WEEKLY',
    preferredTime: '12:00',
    subscribedAt: '2024-01-10T00:00:00Z'
  }
]

export default function NewsletterDemo() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [subscribers, setSubscribers] = useState(mockSubscribers)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'NEWSLETTER',
    scheduledAt: ''
  })
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    frequency: 'WEEKLY',
    preferredTime: '10:00'
  })

  const calculateOpenRate = (campaign: any) => {
    if (campaign.totalRecipients === 0) return 0
    return ((campaign.openedCount / campaign.totalRecipients) * 100).toFixed(1)
  }

  const calculateClickRate = (campaign: any) => {
    if (campaign.openedCount === 0) return 0
    return ((campaign.clickedCount / campaign.openedCount) * 100).toFixed(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateCampaign = () => {
    const campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      status: 'DRAFT',
      totalRecipients: 0,
      openedCount: 0,
      clickedCount: 0,
      createdAt: new Date().toISOString()
    }
    setCampaigns(prev => [campaign, ...prev])
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      type: 'NEWSLETTER',
      scheduledAt: ''
    })
  }

  const handleSendCampaign = async (campaignId: string) => {
    // Simuler l'envoi
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: 'SENT',
            totalRecipients: subscribers.length,
            sentAt: new Date().toISOString()
          }
        : campaign
    ))

    // Simuler les ouvertures et clics après quelques secondes
    setTimeout(() => {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { 
              ...campaign, 
              openedCount: Math.floor(subscribers.length * 0.7),
              clickedCount: Math.floor(subscribers.length * 0.3)
            }
          : campaign
      ))
    }, 3000)
  }

  const handleAddSubscriber = () => {
    const subscriber = {
      id: Date.now().toString(),
      ...newSubscriber,
      loyaltyPoints: 0,
      subscribedAt: new Date().toISOString()
    }
    setSubscribers(prev => [subscriber, ...prev])
    setNewSubscriber({
      name: '',
      email: '',
      frequency: 'WEEKLY',
      preferredTime: '10:00'
    })
  }

  const totalStats = {
    totalCampaigns: campaigns.length,
    totalSubscribers: subscribers.length,
    avgOpenRate: campaigns.filter(c => c.status === 'SENT').length > 0 
      ? (campaigns.filter(c => c.status === 'SENT')
          .reduce((acc, c) => acc + parseFloat(calculateOpenRate(c)), 0) / 
          campaigns.filter(c => c.status === 'SENT').length).toFixed(1)
      : 0,
    totalSent: campaigns.reduce((acc, c) => acc + c.totalRecipients, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Marketing & Newsletters</h1>
                <p className="text-sm text-gray-600">Gestion des campagnes et abonnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total campagnes</p>
                  <p className="text-xl font-bold">{totalStats.totalCampaigns}</p>
                </div>
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Abonnés</p>
                  <p className="text-xl font-bold">{totalStats.totalSubscribers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux d'ouverture</p>
                  <p className="text-xl font-bold">{totalStats.avgOpenRate}%</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emails envoyés</p>
                  <p className="text-xl font-bold">{totalStats.totalSent}</p>
                </div>
                <Send className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            <TabsTrigger value="subscribers">Abonnés</TabsTrigger>
            <TabsTrigger value="create">Créer</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Campagnes récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{campaign.name}</h3>
                              <Badge variant="outline" className={getStatusColor(campaign.status)}>
                                {campaign.status === 'SENT' ? 'Envoyée' : 
                                 campaign.status === 'DRAFT' ? 'Brouillon' : 'Programmée'}
                              </Badge>
                              <Badge variant="outline">
                                {campaign.type === 'NEWSLETTER' ? 'Newsletter' : 'Promotion'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                            
                            {campaign.status === 'SENT' && (
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Send className="h-4 w-4 text-gray-500" />
                                  <span>{campaign.totalRecipients} envoyés</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4 text-green-500" />
                                  <span>{campaign.openedCount} ouverts ({calculateOpenRate(campaign)}%)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MousePointer className="h-4 w-4 text-blue-500" />
                                  <span>{campaign.clickedCount} clics ({calculateClickRate(campaign)}%)</span>
                                </div>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500 mt-2">
                              {campaign.sentAt ? `Envoyée le ${new Date(campaign.sentAt).toLocaleDateString('fr-FR')}` : 
                               campaign.scheduledAt ? `Programmée pour le ${new Date(campaign.scheduledAt).toLocaleDateString('fr-FR')}` : 
                               'Non envoyée'}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            {campaign.status === 'DRAFT' && (
                              <Button
                                size="sm"
                                onClick={() => handleSendCampaign(campaign.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Envoyer
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Ajouter un abonné */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajouter un abonné</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Nom complet"
                    value={newSubscriber.name}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newSubscriber.email}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newSubscriber.frequency}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, frequency: e.target.value }))}
                  >
                    <option value="DAILY">Quotidien</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="MONTHLY">Mensuel</option>
                  </select>
                  <Input
                    type="time"
                    value={newSubscriber.preferredTime}
                    onChange={(e) => setNewSubscriber(prev => ({ ...prev, preferredTime: e.target.value }))}
                  />
                  <Button 
                    onClick={handleAddSubscriber}
                    className="w-full"
                    disabled={!newSubscriber.name || !newSubscriber.email}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardContent>
              </Card>

              {/* Liste des abonnés */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Liste des abonnés ({subscribers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subscribers.map((subscriber) => (
                        <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{subscriber.name}</p>
                            <p className="text-sm text-gray-600">{subscriber.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {subscriber.frequency === 'WEEKLY' ? 'Hebdo' : 
                                 subscriber.frequency === 'MONTHLY' ? 'Mensuel' : 'Quotidien'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {subscriber.preferredTime}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {subscriber.loyaltyPoints} pts
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nouvelle campagne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom de la campagne</label>
                    <Input
                      placeholder="Ex: Offre Spéciale Été"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="NEWSLETTER">Newsletter</option>
                      <option value="PROMOTIONAL">Promotion</option>
                      <option value="EVENT">Événement</option>
                      <option value="ANNOUNCEMENT">Annonce</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <Input
                    placeholder="Sujet de l'email"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <Textarea
                    placeholder="Contenu de l'email..."
                    rows={8}
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Programmer pour (optionnel)</label>
                  <Input
                    type="datetime-local"
                    value={newCampaign.scheduledAt}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleCreateCampaign}
                    disabled={!newCampaign.name || !newCampaign.subject || !newCampaign.content}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer la campagne
                  </Button>
                  <Button variant="outline">
                    Enregistrer comme brouillon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}