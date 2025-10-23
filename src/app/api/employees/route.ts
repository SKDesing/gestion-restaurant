import { NextResponse } from 'next/server'

export const GET = async () => {
	return NextResponse.json({ ok: true, message: 'employees endpoint placeholder' })
}

export const POST = async () => {
	return NextResponse.json({ ok: false, message: 'not implemented' }, { status: 501 })
}
// export statique : route API désactivée
export {};