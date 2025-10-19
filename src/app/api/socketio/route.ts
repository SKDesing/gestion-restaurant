// export statique : route API désactivée
// ...existing code...
import { NextRequest } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextRequest) => {
  if (res.socket.server.io) {
    console.log('Socket.io server already running')
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
      const alerts = []
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

    // Gestion de déconnexion
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  res.socket.server.io = io
}

export default SocketHandler