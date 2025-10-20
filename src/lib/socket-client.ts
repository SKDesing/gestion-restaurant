import { io as clientIo, Socket } from "socket.io-client";

export function connectNamespace(ns: string, opts = {}): Socket {
  return clientIo(`${location.protocol}//${location.hostname}:4001${ns}`, opts);
}
