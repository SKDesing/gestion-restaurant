import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { getServerSession } from 'next-auth/next'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
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

  const user = await db.employee.findUnique({ where: { email: credentials.email } })
  if (!user) throw new Error('Identifiants invalides')

  // prisma client types may be stale until `prisma generate` has been run against the
  // PostgreSQL schema in the repo. Cast to any to access password at runtime.
  const storedPassword = (user as any).password
  const valid = await bcrypt.compare(credentials.password, storedPassword)
        if (!valid) throw new Error('Identifiants invalides')

        // Expose minimal user fields to session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId
        } as any
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.restaurantId = (user as any).restaurantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).restaurantId = token.restaurantId
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export async function authenticate(req: Request | any) {
  // helper used in routes
  const session = await getServerSession(authOptions as any)
  return session
}
