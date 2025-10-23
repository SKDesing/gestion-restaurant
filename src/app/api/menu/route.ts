import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({ ok: true, message: 'menu endpoint placeholder' })
}

export async function POST() {
	return NextResponse.json({ ok: false, message: 'not implemented' }, { status: 501 })
}