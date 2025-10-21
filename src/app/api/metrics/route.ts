import { NextResponse } from 'next/server'
import client from 'prom-client'

export async function GET() {
  try {
    const registry = client.register
    const metrics = await registry.metrics()
    return new NextResponse(metrics, { status: 200, headers: { 'Content-Type': client.register.contentType } })
  } catch (e) {
    return NextResponse.json({ error: 'metricsUnavailable' }, { status: 500 })
  }
}
