export const dynamic = "force-dynamic"

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
