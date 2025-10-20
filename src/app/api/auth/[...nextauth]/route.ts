import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Structured stderr-only debug logging (avoid writing to disk in production)
        const append = (msg: string) => {
          try {
            const line = `${new Date().toISOString()} ${msg}`;
            // eslint-disable-next-line no-console
            console.error(line);
          } catch (err) {
            // swallow to avoid crashing auth flow
            // eslint-disable-next-line no-console
            console.error('Failed logging debug message', err);
          }
        };

        append('⚙️ authorize() called');
        if (!credentials?.email || !credentials?.password) {
          append('⚠️ authorize: missing credentials');
          return null;
        }

        // Note: we intentionally do not write the plaintext password to disk.
        append(`🔍 authorize: lookup email=${credentials.email}`);

        try {
          const employee = await prisma.employee.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          append(`🔎 authorize: employee found=${!!employee}`);
          if (!employee) return null;

          // If passwords were hashed with bcrypt in seed, compare
          const valid = await bcrypt.compare(credentials.password, employee.password);
          append(`🔐 authorize: bcrypt.compare result=${valid}`);
          if (!valid) return null;

          const user = {
            id: employee.id,
            email: employee.email,
            name: employee.name,
            role: employee.role,
            restaurantId: employee.restaurantId,
          } as any;

          append(`✅ authorize: success for email=${employee.email} id=${employee.id}`);
          return user;
        } catch (e) {
          append(`Auth error: ${(e as Error).message}`);
          // also log stack to stderr
          // eslint-disable-next-line no-console
          console.error('Auth error', e);
          return null;
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET || 'change-me',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.restaurantId = (user as any).restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).restaurantId = token.restaurantId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
