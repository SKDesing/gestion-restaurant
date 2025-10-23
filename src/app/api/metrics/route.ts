import { NextResponse } from "next/server";
import client from "prom-client";
import { withErrorHandler } from "@/lib/api/withErrorHandler";

export const GET = withErrorHandler(async () => {
  const registry = client.register;
  const metrics = await registry.metrics();
  return new NextResponse(metrics, {
    status: 200,
    headers: { "Content-Type": client.register.contentType },
  });
});
