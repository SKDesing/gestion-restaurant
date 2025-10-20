import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}
    if (!email || !password) return NextResponse.json({ error: 'missing' }, { status: 400 })

    const user = await (db as any).employee.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    const storedPassword = (user as any).password
    if (!storedPassword) return NextResponse.json({ error: 'no_password' }, { status: 400 })
    const valid = await bcrypt.compare(password, storedPassword)
    return NextResponse.json({ ok: valid ? true : false, user: valid ? { id: user.id, email: user.email, role: user.role } : null })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
