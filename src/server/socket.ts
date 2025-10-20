import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export function createSocketServer(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  // Redis adapter (optional)
  if (process.env.REDIS_URL) {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Redis adapter enabled");
      })
      .catch((err) => {
        console.warn(
          "⚠️ Redis adapter failed, using in-memory:",
          err?.message || err,
        );
      });
  } else {
    console.log("ℹ️ Using in-memory adapter (no REDIS_URL)");
  }

  // namespaces
  const admin = io.of("/admin");
  const caisse = io.of("/caisse");
  const serveur = io.of("/serveur");
  const cuisine = io.of("/cuisine");

  const makeBasicHandler = (ns) => {
    ns.on("connection", (socket) => {
      console.log(`socket connected to ${ns.name}:`, socket.id);

      socket.on("ping", (payload) => {
        socket.emit("pong", { ...payload, timestamp: Date.now() });
      });

      socket.on("disconnect", (reason) => {
        console.log(
          `socket ${socket.id} disconnected from ${ns.name}:`,
          reason,
        );
      });
    });
  };

  [admin, caisse, serveur, cuisine].forEach((ns) => makeBasicHandler(ns));

  return io;
}
