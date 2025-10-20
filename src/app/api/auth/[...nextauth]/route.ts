export const dynamic = "force-dynamic"

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Small wrapper to log requests for debugging local auth flows.
async function logAndHandle(req: Request) {
	try {
		// Log method and some headers that matter for cookies/CSRF
		console.error('[NextAuthWrapper] incoming auth request', req.method, {
			url: req.url,
			headers: {
				cookie: req.headers.get('cookie'),
				'content-type': req.headers.get('content-type')
			}
		})
	} catch (e) {
		console.error('[NextAuthWrapper] logging failed', e)
	}
	const handler = NextAuth(authOptions as any)
	return handler(req as any)
}

export async function GET(req: Request) {
	return await logAndHandle(req)
}

export async function POST(req: Request) {
	return await logAndHandle(req)
}
