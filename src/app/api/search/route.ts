import { NextResponse } from 'next/server'
import { searchItems } from '@/lib/api-client'
import { decodeToken, getToken } from '@/lib/session'

export async function GET(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ items: [] })
  return NextResponse.json({ items: await searchItems(decodeToken(token).userId, q, token) })
}
