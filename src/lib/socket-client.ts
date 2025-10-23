import { io, type Socket } from 'socket.io-client';

export function connectNamespace(ns: string, opts = {}): Socket {
  const port = (typeof window !== 'undefined' && window.location.port) || process.env.SOCKET_PORT || '4001';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return io(`${protocol}//${host}:${port}${ns}`, { path: '/socket.io', ...opts });
}
