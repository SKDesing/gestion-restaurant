'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface AlertData {
  id: string
  orderId?: string
  type: string
  title: string
  message: string
  station?: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL'
  timestamp: string
  items?: Array<{ name: string; category: string }>
}

export const useSocket = (station: string, userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')

  useEffect(() => {
    // Créer la connexion Socket.io
    const socketInstance = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    })

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.io server')
      setConnected(true)
      setConnectionStatus('connected')
      
      // Rejoindre la station spécifiée
      socketInstance.emit('join_station', { station, userId })
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.io server')
      setConnected(false)
      setConnectionStatus('disconnected')
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error)
      setConnectionStatus('disconnected')
    })

    // Écouter les nouvelles alertes
    socketInstance.on('new_alert', (alert: AlertData) => {
      console.log('New alert received:', alert)
      setAlerts(prev => [alert, ...prev.slice(0, 9)]) // Garder seulement les 10 plus récentes
    })

    // Écouter les commandes prêtes
    socketInstance.on('order_ready', (data: AlertData) => {
      console.log('Order ready:', data)
      setAlerts(prev => [data, ...prev.slice(0, 9)])
    })

    // Écouter les demandes de paiement
    socketInstance.on('payment_request', (data: AlertData) => {
      console.log('Payment request:', data)
      setAlerts(prev => [data, ...prev.slice(0, 9)])
    })

    // Écouter les appels clients
    socketInstance.on('customer_call', (data: AlertData) => {
      console.log('Customer call:', data)
      setAlerts(prev => [data, ...prev.slice(0, 9)])
    })

    // Écouter les confirmations de station
    socketInstance.on('station_joined', (data: any) => {
      console.log('Station joined:', data)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [station, userId])

  // Envoyer une nouvelle commande
  const sendNewOrder = (orderData: {
    orderId: string
    tableNumber?: string
    items: Array<{ name: string; category: string }>
    type: string
    priority?: string
  }) => {
    if (socket && connected) {
      socket.emit('new_order', orderData)
    }
  }

  // Marquer une commande comme prête
  const markOrderReady = (data: {
    orderId: string
    station: string
    items: Array<{ name: string; quantity: number }>
    preparationTime?: number
  }) => {
    if (socket && connected) {
      socket.emit('order_ready', data)
    }
  }

  // Demander le paiement
  const requestPayment = (data: {
    tableNumber: string
    orderId: string
    amount: number
    customerName?: string
  }) => {
    if (socket && connected) {
      socket.emit('payment_request', data)
    }
  }

  // Appel client
  const customerCall = (data: {
    tableNumber: string
    type: 'service' | 'water' | 'bill' | 'help'
    message?: string
  }) => {
    if (socket && connected) {
      socket.emit('customer_call', data)
    }
  }

  // Acknowledger une alerte
  const acknowledgeAlert = (alertId: string) => {
    if (socket && connected) {
      socket.emit('acknowledge_alert', {
        alertId,
        userId,
        station
      })
      // Retirer l'alerte de la liste locale
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }
  }

  // Effacer toutes les alertes
  const clearAlerts = () => {
    setAlerts([])
  }

  return {
    socket,
    connected,
    connectionStatus,
    alerts,
    sendNewOrder,
    markOrderReady,
    requestPayment,
    customerCall,
    acknowledgeAlert,
    clearAlerts
  }
}