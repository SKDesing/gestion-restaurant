import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // res.socket.server has a non-standard `io` property attached at runtime.
  // Cast to any to access server for Socket.IO setup.
  const sock: any = res.socket as any
  if (!sock.server.io) {
    console.log('Setting up Socket.io server...');
    
    const io = new Server(sock.server, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Gestion des connexions
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Identifier le type de client
      socket.on('identify', (data) => {
        socket.join(data.type); // 'admin', 'caisse', 'serveur', 'cuisine'
        socket.emit('identified', { type: data.type, socketId: socket.id });
        console.log(`Client ${socket.id} identified as ${data.type}`);
      });

      // Nouvelle commande du serveur
      socket.on('newOrder', (orderData) => {
        console.log('New order received:', orderData);
        
        // Envoyer à la cuisine
        io.to('cuisine').emit('newOrder', {
          ...orderData,
          id: orderData.id || Date.now().toString(),
          timestamp: new Date()
        });

        // Envoyer à l'admin/manager
        io.to('admin').emit('newOrder', orderData);

        // Envoyer à la caisse
        io.to('caisse').emit('orderCreated', orderData);
      });

      // Mise à jour du statut d'une commande
      socket.on('orderStatusUpdate', (data) => {
        console.log('Order status update:', data);
        
        // Diffuser à tous les clients
        io.emit('orderStatusUpdate', {
          orderId: data.orderId,
          status: data.status,
          tableNumber: data.tableNumber,
          timestamp: new Date()
        });
      });

      // Mise à jour du statut d'un item
      socket.on('itemStatusUpdate', (data) => {
        console.log('Item status update:', data);
        
        // Envoyer au serveur et admin
        io.to('serveur').emit('itemStatusUpdate', data);
        io.to('admin').emit('itemStatusUpdate', data);
      });

      // Commande prête (cuisine vers serveur)
      socket.on('orderReady', (data) => {
        console.log('Order ready:', data);
        
        // Notifier le serveur spécifique
        io.to('serveur').emit('orderReadyNotification', {
          orderId: data.orderId,
          tableNumber: data.tableNumber,
          message: `Commande table ${data.tableNumber} prête à servir!`,
          timestamp: new Date()
        });

        // Notifier l'admin
        io.to('admin').emit('orderReady', data);
      });

      // Paiement effectué (caisse vers admin)
      socket.on('paymentProcessed', (data) => {
        console.log('Payment processed:', data);
        
        // Envoyer à l'admin
        io.to('admin').emit('paymentProcessed', {
          ...data,
          timestamp: new Date()
        });
      });

      // Mise à jour des tables (serveur vers admin)
      socket.on('tableUpdate', (tableData) => {
        console.log('Table update:', tableData);
        
        // Envoyer à l'admin
        io.to('admin').emit('tableUpdate', tableData);
      });

      // Alertes stocks (admin vers tous)
      socket.on('stockAlert', (alertData) => {
        console.log('Stock alert:', alertData);
        
        // Diffuser à tous
        io.emit('stockAlert', {
          ...alertData,
          timestamp: new Date()
        });
      });

      // Alertes personnel (admin vers tous)
      socket.on('personnelAlert', (alertData) => {
        console.log('Personnel alert:', alertData);
        
        // Diffuser à tous
        io.emit('personnelAlert', {
          ...alertData,
          timestamp: new Date()
        });
      });

      // Contrôle HACCP (cuisine vers admin)
      socket.on('haccpRecord', (recordData) => {
        console.log('HACCP record:', recordData);
        
        // Envoyer à l'admin
        io.to('admin').emit('haccpRecord', {
          ...recordData,
          timestamp: new Date()
        });

        // Alerte si critique
        if (recordData.status === 'critical') {
          io.emit('haccpAlert', {
            ...recordData,
            timestamp: new Date()
          });
        }
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    sock.server.io = io;
  }

  res.end();
}