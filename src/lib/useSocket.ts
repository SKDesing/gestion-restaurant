"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectNamespace } from "./socket-client";

export function useSocket(namespace: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = connectNamespace(namespace);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [namespace]);

  return { socket, connected };
}
