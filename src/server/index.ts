import { createServer } from "http";
import express from "express";
import { createSocketServer } from "./socket";

const app = express();
app.get("/health", (_req, res) =>
  res.json({ ok: true, timestamp: Date.now() }),
);

const server = createServer(app);
const io = createSocketServer(server as any);

const port = process.env.SOCKET_PORT || 4001;
server.listen(port, () => {
  console.log(`🚀 Socket server listening on http://localhost:${port}`);
  console.log("📡 Namespaces: /admin, /caisse, /serveur, /cuisine");
});

export { server, io };