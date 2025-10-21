import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { io, Socket } from "socket.io-client";
import { createServer } from "http";
import { createSocketServer } from "../../src/server/socket";

describe("Socket.IO Namespaces", () => {
  let httpServer: any;
  let ioServer: any;
  let clientSocket: Socket;

  beforeAll((done) => {
    const server = createServer();
    ioServer = createSocketServer(server as any);
    httpServer = server.listen(4002, done);
  });

  afterAll(() => {
    ioServer.close();
    httpServer.close();
  });

  it("should connect to /admin namespace", (done) => {
    clientSocket = io("http://localhost:4002/admin");
    clientSocket.on("connect", () => {
      expect(clientSocket.connected).toBe(true);
      clientSocket.disconnect();
      done();
    });
  });

  it("should handle ping/pong", (done) => {
    clientSocket = io("http://localhost:4002/admin");
    clientSocket.on("connect", () => {
      clientSocket.emit("ping", { test: true });
    });
    clientSocket.on("pong", (data) => {
      expect(data.test).toBe(true);
      expect(data.timestamp).toBeDefined();
      clientSocket.disconnect();
      done();
    });
  });
});
