import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api/withErrorHandler";

// App Router: minimal JSON endpoints to keep route present for clients that probe /api/socketio
// The full Socket.IO server remains implemented in the legacy pages API at `src/pages/api/socket/io.ts`

export const GET = withErrorHandler(async () => {
  return NextResponse.json({
    ok: true,
    message:
      "Socket endpoint (noop on App Router). Use /api/socket/io for Socket.IO server.",
  });
});

export const POST = withErrorHandler(async () => {
  return NextResponse.json({ ok: true });
});
