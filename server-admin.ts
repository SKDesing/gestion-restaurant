// server-admin.ts - Serveur dédié à l'application admin/gérant

import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 4003; // Port dédié à l'admin/gérant
const hostname = '127.0.0.1';

async function createCustomServer() {
  try {
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      conf: dev ? undefined : { distDir: './.next' }
    });
    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();
    const server = createServer((req, res) => {
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    server.listen(currentPort, hostname, () => {
      console.log(`> Admin: Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

createCustomServer();
