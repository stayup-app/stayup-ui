import { NextResponse } from 'next/server'
import { markItemsRead } from '@/lib/api-client'
import { decodeToken, getToken } from '@/lib/session'

export async function POST(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { ids } = (await request.json()) as { ids?: unknown }
  if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) {
    return NextResponse.json({ error: 'ids must be an array of integers' }, { status: 400 })
  }
  await markItemsRead(decodeToken(token).userId, ids as number[], token)
  return NextResponse.json({ success: true })
}
