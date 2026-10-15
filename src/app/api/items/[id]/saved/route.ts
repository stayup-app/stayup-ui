import { NextResponse } from 'next/server'
import { setItemSaved } from '@/lib/api-client'
import { decodeToken, getToken } from '@/lib/session'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const itemId = Number.parseInt((await params).id, 10)
  const { saved } = (await request.json()) as { saved?: unknown }
  if (Number.isNaN(itemId) || typeof saved !== 'boolean') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  await setItemSaved(decodeToken(token).userId, itemId, saved, token)
  return NextResponse.json({ success: true })
}
