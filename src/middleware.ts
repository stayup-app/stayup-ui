import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { COOKIE_NAME, ADMIN_COOKIE_NAME } from '@/lib/constants'
import { decodeJwtPayload } from '@/lib/jwt'

// Convenience redirects only: the payload is not signed, so `role` is not
// proof. Real access is closed off by app/admin/layout.tsx, which has the API
// validate the token.
function isLiveAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const { role, exp } = decodeJwtPayload(token)
  if (exp !== undefined && exp * 1000 <= Date.now()) return false
  return role === 'admin'
}

function isLive(token: string | undefined): boolean {
  if (!token) return false
  const { exp } = decodeJwtPayload(token)
  return exp === undefined || exp * 1000 > Date.now()
}

function hasLiveUserSession(request: NextRequest): boolean {
  return isLive(request.cookies.get(COOKIE_NAME)?.value)
}

const PROTECTED_PATHS = ['/feed', '/profile']
const AUTH_PATHS = ['/login', '/register']

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (isLiveAdminToken(adminToken)) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }
    if (!isLiveAdminToken(adminToken)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const signedIn = hasLiveUserSession(request)

  if (isProtected && !signedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && signedIn) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
