import { NextResponse } from 'next/server'
import { getItemState } from '@/lib/api-client'
import { decodeToken, getToken } from '@/lib/session'

export async function GET() {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getItemState(decodeToken(token).userId, token))
}
