'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface NotificationData {
  type: 'NEW_ORDER' | 'ORDER_READY' | 'ORDER_COMPLETED' | 'PAYMENT_REQUEST' | 'KITCHEN_ALERT' | 'SERVER_CALL';
  message: string;
  data?: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: any[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  priority: 'low' | 'medium' | 'high';
  orderTime: string;
  notes?: string;
  serverName?: string;
}

export const useSocket = (role: string, name?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [activeOrders, setActiveOrders] = useState<KitchenOrder[]>([])

  useEffect(() => {
    // Initialiser la connexion Socket.io
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      console.log(`Connected to socket server as ${role}`)
      setConnected(true)
      
      // S'enregistrer avec le rôle
      socketInstance.emit('register', { role, name })
      
      // Rejoindre la salle appropriée
      socketInstance.emit('join_room', role)
      
      // Demander les commandes actives si c'est la cuisine
      if (role === 'kitchen') {
        socketInstance.emit('request_active_orders')
      }
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setConnected(false)
    })

    // Écouter les notifications
    socketInstance.on('notification', (notification: NotificationData) => {
      console.log('New notification:', notification)
      setNotifications(prev => [notification, ...prev.slice(0, 19)]) // Garder les 20 dernières
    })

    // Écouter les nouvelles commandes (pour la cuisine)
    socketInstance.on('new_order', (order: KitchenOrder) => {
      console.log('New order received:', order)
      setActiveOrders(prev => [order, ...prev])
    })

    // Écouter les commandes actives (pour la cuisine)
    socketInstance.on('active_orders', (orders: KitchenOrder[]) => {
      console.log('Active orders received:', orders)
      setActiveOrders(orders)
    })

    // Écouter les mises à jour de commandes
    socketInstance.on('order_updated', (order: KitchenOrder) => {
      console.log('Order updated:', order)
      setActiveOrders(prev => 
        prev.map(o => o.id === order.id ? order : o)
      )
    })

    // Écouter les commandes prêtes (pour les serveurs)
    socketInstance.on('order_ready', (order: KitchenOrder) => {
      console.log('Order ready:', order)
      // Jouer un son de notification (si disponible)
      try {
        const audio = new Audio('/notification.mp3')
        audio.play().catch(e => console.log('Could not play notification sound'))
      } catch (e) {
        console.log('Notification sound not available')
      }
    })

    // Écouter les demandes de paiement (pour la caisse)
    socketInstance.on('payment_request', (data: any) => {
      console.log('Payment request received:', data)
    })

    // Écouter les appels de table (pour les serveurs)
    socketInstance.on('table_call', (data: any) => {
      console.log('Table call received:', data)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [role, name])

  // Envoyer une nouvelle commande
  const sendOrder = (order: KitchenOrder) => {
    if (socket) {
      socket.emit('new_order', order)
    }
  }

  // Mettre à jour le statut d'un article
  const updateItemStatus = (orderId: string, itemId: string, status: string) => {
    if (socket) {
      socket.emit('update_item_status', { orderId, itemId, status })
    }
  }

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = (orderId: string, status: string) => {
    if (socket) {
      socket.emit('update_order_status', { orderId, status })
    }
  }

  // Envoyer une demande de paiement
  const requestPayment = (data: any) => {
    if (socket) {
      socket.emit('payment_request', data)
    }
  }

  // Confirmer un paiement
  const confirmPayment = (data: any) => {
    if (socket) {
      socket.emit('payment_confirmed', data)
    }
  }

  // Appeler une table
  const callTable = (tableNumber: string, message?: string) => {
    if (socket) {
      socket.emit('table_call', { tableNumber, message })
    }
  }

  // Marquer une notification comme lue
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  // Effacer toutes les notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    socket,
    connected,
    notifications,
    activeOrders,
    sendOrder,
    updateItemStatus,
    updateOrderStatus,
    requestPayment,
    confirmPayment,
    callTable,
    markNotificationAsRead,
    clearNotifications,
  }
}