import { createServer } from "http";
import { Server } from "socket.io";

export function createSocketServer(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  // namespaces
  const admin = io.of("/admin");
  const caisse = io.of("/caisse");
  const serveur = io.of("/serveur");
  const cuisine = io.of("/cuisine");

  const makeBasicHandler = (ns) => {
    ns.on("connection", (socket) => {
      console.log(`socket connected to ${ns.name}:`, socket.id);
      socket.on("ping", (payload) => socket.emit("pong", payload));

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
