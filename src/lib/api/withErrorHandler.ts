import { NextResponse } from "next/server";

// Minimal error wrapper for App Router route handlers.
// Usage: export const GET = withErrorHandler(async (req) => { ... })
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T,
) {
  return async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (err: any) {
      // Log for debug; keep message generic for clients
      console.error("[api] unhandled error:", err);
      return NextResponse.json(
        { error: "internal_server_error" },
        { status: 500 },
      );
    }
  };
}
