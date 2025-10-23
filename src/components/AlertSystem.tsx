'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, 
  ChefHat, 
  Beer, 
  Users, 
  CreditCard, 
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react'
import { useSocket, AlertData } from '@/hooks/useSocket'

interface AlertSystemProps {
  station: 'kitchen' | 'bar' | 'server' | 'takeaway' | 'manager'
  userId?: string
  className?: string
}

const stationConfig = {
  kitchen: {
    name: 'Cuisine',
    icon: <ChefHat className="h-5 w-5" />,
    color: 'bg-orange-500'
  },
  bar: {
    name: 'Bar',
    icon: <Beer className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  server: {
    name: 'Service',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-green-500'
  },
  takeaway: {
    name: 'À emporter',
    icon: <Phone className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  manager: {
    name: 'Manager',
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'bg-red-500'
  }
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  NORMAL: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
  CRITICAL: 'bg-red-200 text-red-900 animate-pulse'
}

const typeIcons = {
  NEW_ORDER: <Bell className="h-4 w-4" />,
  ORDER_READY: <CheckCircle className="h-4 w-4" />,
  PAYMENT_REQUEST: <CreditCard className="h-4 w-4" />,
  CUSTOMER_CALL: <Phone className="h-4 w-4" />,
  ORDER_CANCELLED: <X className="h-4 w-4" />,
  URGENT_ORDER: <AlertTriangle className="h-4 w-4" />
}

export function AlertSystem({ station, userId, className }: AlertSystemProps) {
  const { alerts, connected, connectionStatus, acknowledgeAlert, clearAlerts } = useSocket(station, userId)
  const [expanded, setExpanded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const config = stationConfig[station]
  const unreadCount = alerts.length

  // Jouer un son pour les nouvelles alertes
  useEffect(() => {
    if (alerts.length > 0 && soundEnabled && connected) {
      // Créer un son simple avec l'API Web Audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }, [alerts.length, soundEnabled, connected])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAlertMessage = (alert: AlertData) => {
    switch (alert.type) {
      case 'NEW_ORDER':
        return `Nouvelle commande: ${alert.message}`
      case 'ORDER_READY':
        return `Prête: ${alert.message}`
      case 'PAYMENT_REQUEST':
        return `Paiement demandé: ${alert.message}`
      case 'CUSTOMER_CALL':
        return `Appel client: ${alert.message}`
      default:
        return alert.message
    }
  }

  return (
    <div className={className}>
      {/* Bouton d'alerte compact */}
      <Card className="relative">
        <CardHeader 
          className="pb-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg text-white ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <CardTitle className="text-sm">Alertes {config.name}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                  {connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {unreadCount}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSoundEnabled(!soundEnabled)
                }}
                className="h-8 w-8 p-0"
              >
                <Bell className={`h-4 w-4 ${soundEnabled ? 'text-gray-600' : 'text-gray-300'}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Panneau d'alertes étendu */}
        {expanded && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Alertes récentes</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearAlerts()}
                    className="text-xs"
                  >
                    Tout effacer
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="h-64 w-full">
              {alerts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune alerte</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <Card 
                      key={alert.id} 
                      className={`p-3 cursor-pointer hover:shadow-md transition-all ${
                        alert.priority === 'CRITICAL' ? 'border-red-500 bg-red-50' : 
                        alert.priority === 'URGENT' ? 'border-orange-500 bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="mt-1">
                            {typeIcons[alert.type as keyof typeof typeIcons] || <Bell className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {getAlertMessage(alert)}
                            </p>
                            {alert.items && alert.items.length > 0 && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-600">
                                  {alert.items.slice(0, 3).map(item => item.name).join(', ')}
                                  {alert.items.length > 3 && `... +${alert.items.length - 3}`}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${priorityColors[alert.priority]}`}
                              >
                                {alert.priority}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(alert.timestamp)}
                              </span>
                              {alert.station && (
                                <Badge variant="outline" className="text-xs">
                                  {stationConfig[alert.station as keyof typeof stationConfig]?.name || alert.station}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  )
}