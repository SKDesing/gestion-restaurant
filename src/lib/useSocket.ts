"use client";

import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { connectNamespace } from "./socket-client";

export function useSocket(namespace: string): { socket: Socket; connected: boolean } {
  const socketRef = useRef<Socket | null>(null);
  if (typeof window !== "undefined" && !socketRef.current) {
    socketRef.current = connectNamespace(namespace);
  }

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = socketRef.current!
    if (!s) return

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    s.on("connect", onConnect)
    s.on("disconnect", onDisconnect)

    return () => {
      s.off("connect", onConnect)
      s.off("disconnect", onDisconnect)
      s.disconnect()
      socketRef.current = null
    }
  }, [namespace])

  return { socket: socketRef.current as Socket, connected }
}
