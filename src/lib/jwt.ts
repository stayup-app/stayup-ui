// Edge-runtime-compatible payload decoder. It does NOT verify the signature:
// anyone can craft a payload. So it is only for convenience redirects
// (middleware); any real access decision must be confirmed by the API, the only
// one that knows JWT_SECRET — see isAdminTokenValid() in lib/session.ts.
export function decodeJwtPayload(token: string): {
  role?: string
  sub?: string
  exp?: number
} {
  try {
    const part = token.split('.')[1]
    if (!part) return {}
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as { role?: string; sub?: string; exp?: number }
  } catch {
    return {}
  }
}
