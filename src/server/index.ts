import { createServer } from "http";
import express from "express";
import { createSocketServer } from "./socket";

const app = express();
app.get("/health", (req, res) => res.json({ ok: true }));

const server = createServer(app);
const io = createSocketServer(server);

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Socket server listening on ${port}`));

export { server, io };
