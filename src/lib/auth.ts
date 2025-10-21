import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { getServerSession } from 'next-auth/next'
import type { Employee } from '@prisma/client'

// Enable additional runtime debugging when NEXTAUTH_DEBUG=1
const enableDebug = process.env.NEXTAUTH_DEBUG === '1'
const enableDebugCookies = process.env.NEXTAUTH_DEBUG_COOKIES === '1'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
          async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

            if (enableDebug) console.log('[NextAuth] authorize: attempt for email=', credentials.email)
        const user = await (db as any).employee.findUnique({ where: { email: credentials.email } })
            if (!user) {
              if (enableDebug) console.log('[NextAuth] authorize: user not found for', credentials.email)
              throw new Error('Identifiants invalides')
            }

            // user is typed by Prisma. Ensure password exists and compare it.
            type EmployeeWithPassword = Employee & { password?: string }
            const userWithPassword = user as unknown as EmployeeWithPassword
            const storedPassword: string | undefined = userWithPassword.password
            if (!storedPassword) {
                      if (enableDebug) console.log('[NextAuth] authorize: no stored password for user', credentials.email)
                      throw new Error('Compte invalide')
                    }

            // Avoid logging the full hash; log length only for debug
            if (enableDebug) console.log('[NextAuth] authorize: storedPassword length=', storedPassword.length)
            const valid = await bcrypt.compare(credentials.password, storedPassword)
            if (enableDebug) console.log('[NextAuth] authorize: bcrypt.compare result=', valid)
            if (!valid) {
              if (enableDebug) console.log('[NextAuth] authorize: invalid credentials for', credentials.email)
              throw new Error('Identifiants invalides')
            }

      // Expose minimal user fields to session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
          }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (enableDebug) console.log('[NextAuth] jwt callback - incoming token:', token, 'user:', user)
      if (user && typeof user === 'object') {
        // user will be the object returned from authorize on first sign in
        if ('role' in user) token.role = (user as any).role
        if ('restaurantId' in user) token.restaurantId = (user as any).restaurantId
      }
      if (enableDebug) console.log('[NextAuth] jwt callback - outgoing token:', token)
      return token
    },
    async session({ session, token }) {
      if (enableDebug) console.log('[NextAuth] session callback - incoming token:', token, 'session before:', session)
      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).restaurantId = token.restaurantId
      }
      if (enableDebug) console.log('[NextAuth] session callback - session after:', session)
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
  // Optionally override cookie naming/secure behavior for local HTTP debugging.
  // Set NEXTAUTH_DEBUG_COOKIES=1 to force a non-__Secure cookie name and secure=false so curl on HTTP can capture it.
  
} as any

// Append cookie override when debugging cookies over HTTP
if (enableDebugCookies) {
  ;(authOptions as any).cookies = {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  }
}

export async function authenticate(req: Request | any) {
  // helper used in routes
  const session = await getServerSession(authOptions as any)
  return session
}
