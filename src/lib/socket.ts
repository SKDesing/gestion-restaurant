import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket.io server already running')
    res.end()
    return
  }

  console.log('Setting up Socket.io server')

  const httpServer: NetServer = res.socket.server as any
  const io = new ServerIO(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // Types de stations pour les alertes
  enum StationType {
    KITCHEN = 'kitchen',
    BAR = 'bar',
    SERVER = 'server',
    TAKEAWAY = 'takeaway',
    MANAGER = 'manager'
  }

  // Stockage des utilisateurs connectés par station
  const connectedUsers = new Map<string, Set<string>>()

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Rejoindre une station spécifique
    socket.on('join_station', (data: { station: string; userId?: string }) => {
      const { station, userId } = data
      
      socket.join(station)
      
      if (userId) {
        if (!connectedUsers.has(station)) {
          connectedUsers.set(station, new Set())
        }
        connectedUsers.get(station)!.add(userId)
      }

      console.log(`User ${userId || socket.id} joined station: ${station}`)
      
      // Envoyer les alertes actives pour cette station
      socket.emit('station_joined', { 
        station, 
        connectedUsers: Array.from(connectedUsers.get(station) || []),
        message: `Connecté à la station ${station}`
      })
    })

    // Quitter une station
    socket.on('leave_station', (data: { station: string; userId?: string }) => {
      const { station, userId } = data
      
      socket.leave(station)
      
      if (userId && connectedUsers.has(station)) {
        connectedUsers.get(station)!.delete(userId)
        if (connectedUsers.get(station)!.size === 0) {
          connectedUsers.delete(station)
        }
      }

      console.log(`User ${userId || socket.id} left station: ${station}`)
    })

    // Nouvelle commande - créer des alertes automatiques
    socket.on('new_order', async (orderData: {
      orderId: string
      tableNumber?: string
      items: Array<{ name: string; category: string }>
      type: string
      priority?: string
    }) => {
      const { orderId, tableNumber, items, type, priority } = orderData

      // Déterminer les stations à notifier
      const stationsToNotify = new Set<string>()

      // Vérifier les catégories d'items pour envoyer aux bonnes stations
      const hasFoodItems = items.some(item => 
        ['Plat', 'Entrée', 'Dessert', 'Pâtisserie'].includes(item.category)
      )
      const hasDrinkItems = items.some(item => 
        ['Boisson', 'Alcool', 'Cocktail', 'Chaud', 'Froid'].includes(item.category)
      )

      if (hasFoodItems) {
        stationsToNotify.add(StationType.KITCHEN)
      }
      if (hasDrinkItems) {
        stationsToNotify.add(StationType.BAR)
      }
      if (type === 'TAKEAWAY') {
        stationsToNotify.add(StationType.TAKEAWAY)
      }

  // Créer les alertes pour chaque station concernée
  const alerts: any[] = []
      for (const station of stationsToNotify) {
        const alert = {
          id: `alert_${Date.now()}_${station}`,
          orderId,
          type: 'NEW_ORDER',
          title: 'Nouvelle commande',
          message: `${tableNumber ? `Table ${tableNumber}` : 'Commande à emporter'} - ${items.length} article(s)`,
          station,
          priority: priority || 'NORMAL',
          timestamp: new Date().toISOString(),
          items
        }
  alerts.push(alert)

        // Envoyer à la station spécifique
        io.to(station).emit('new_alert', alert)
      }

      // Notifier les serveurs de la prise en charge
      io.to(StationType.SERVER).emit('order_confirmed', {
        orderId,
        message: `Commande ${orderId} transmise à la cuisine/bar`,
        stations: Array.from(stationsToNotify),
        timestamp: new Date().toISOString()
      })

      console.log(`New order ${orderId} sent to stations:`, Array.from(stationsToNotify))
    })

    // Commande prête - notifier les serveurs
    socket.on('order_ready', (data: {
      orderId: string
      station: string
      items: Array<{ name: string; quantity: number }>
      preparationTime?: number
    }) => {
      const { orderId, station, items, preparationTime } = data

      const readyAlert = {
        id: `ready_${Date.now()}`,
        orderId,
        type: 'ORDER_READY',
        title: 'Commande prête',
        message: `Commande ${orderId} prête à servir`,
        station,
        items,
        preparationTime,
        timestamp: new Date().toISOString()
      }

      // Notifier tous les serveurs
      io.to(StationType.SERVER).emit('order_ready', readyAlert)

      // Notifier le manager
      io.to(StationType.MANAGER).emit('order_ready', readyAlert)

      console.log(`Order ${orderId} ready from ${station}`)
    })

    // Demande de paiement depuis la table
    socket.on('payment_request', (data: {
      tableNumber: string
      orderId: string
      amount: number
      customerName?: string
    }) => {
      const { tableNumber, orderId, amount, customerName } = data

      const paymentAlert = {
        id: `payment_${Date.now()}`,
        orderId,
        type: 'PAYMENT_REQUEST',
        title: 'Demande de paiement',
        message: `Table ${tableNumber} - Montant: €${amount.toFixed(2)}`,
        tableNumber,
        amount,
        customerName,
        timestamp: new Date().toISOString()
      }

      // Notifier la caisse et les serveurs
      io.to(StationType.SERVER).emit('payment_request', paymentAlert)
      io.to('caisse').emit('payment_request', paymentAlert)

      console.log(`Payment request for table ${tableNumber}`)
    })

    // Alerte d'urgence
    socket.on('urgent_alert', (data: {
      type: string
      message: string
      station?: string
      priority: 'HIGH' | 'URGENT' | 'CRITICAL'
    }) => {
      const { type, message, station, priority } = data

      const urgentAlert = {
        id: `urgent_${Date.now()}`,
        type,
        title: 'Alerte urgente',
        message,
        station: station || 'all',
        priority,
        timestamp: new Date().toISOString()
      }

      // Envoyer à tout le monde si c'est critique
      if (priority === 'CRITICAL') {
        io.emit('urgent_alert', urgentAlert)
      } else {
        // Envoyer aux stations concernées
        const targets = station ? [station] : [StationType.KITCHEN, StationType.BAR, StationType.SERVER]
        targets.forEach(target => {
          io.to(target).emit('urgent_alert', urgentAlert)
        })
      }

      console.log(`Urgent alert: ${message}`)
    })

    // Mise à jour du statut d'une commande
    socket.on('update_order_status', (data: {
      orderId: string
      status: string
      station: string
      estimatedTime?: number
    }) => {
      const { orderId, status, station, estimatedTime } = data

      const update = {
        orderId,
        status,
        station,
        estimatedTime,
        timestamp: new Date().toISOString()
      }

      // Notifier les autres stations du changement
      io.emit('order_status_update', update)

      console.log(`Order ${orderId} status updated to ${status} by ${station}`)
    })

    // Appel client depuis la table
    socket.on('customer_call', (data: {
      tableNumber: string
      type: 'service' | 'water' | 'bill' | 'help'
      message?: string
    }) => {
      const { tableNumber, type, message } = data

      const callAlert = {
        id: `call_${Date.now()}`,
        type: 'CUSTOMER_CALL',
        title: 'Appel client',
        message: `Table ${tableNumber} - ${type}${message ? ': ' + message : ''}`,
        tableNumber,
        callType: type,
        timestamp: new Date().toISOString()
      }

      // Notifier les serveurs
      io.to(StationType.SERVER).emit('customer_call', callAlert)

      console.log(`Customer call from table ${tableNumber}: ${type}`)
    })

    // Confirmation de réception d'alerte
    socket.on('acknowledge_alert', (data: {
      alertId: string
      userId: string
      station: string
    }) => {
      const { alertId, userId, station } = data

      // Notifier les autres utilisateurs de la station
      socket.to(station).emit('alert_acknowledged', {
        alertId,
        userId,
        station,
        timestamp: new Date().toISOString()
      })

      console.log(`Alert ${alertId} acknowledged by ${userId} in ${station}`)
    })

    // Gestion de déconnexion
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
      
      // Nettoyer les utilisateurs connectés
      connectedUsers.forEach((users, station) => {
        users.forEach(userId => {
          if (userId === socket.id) {
            users.delete(userId)
          }
        })
        if (users.size === 0) {
          connectedUsers.delete(station)
        }
      })
    })

    // Message de test
    socket.on('test_connection', (data: { station: string }) => {
      socket.emit('test_response', {
        message: 'Connection test successful',
        station: data.station,
        timestamp: new Date().toISOString()
      })
    })
  })

  res.socket.server.io = io
  res.end()
}

export default SocketHandler