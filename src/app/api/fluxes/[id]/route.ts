import { NextResponse } from 'next/server'
import { deleteUserRepository } from '@/lib/api-client'
import { decodeToken, getToken } from '@/lib/session'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = decodeToken(token)
  const { id } = await params

  try {
    await deleteUserRepository(session.userId, id, token)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = (err as Error).message
    if (message.includes('introuvable')) {
      return NextResponse.json({ error: message }, { status: 404 })
    }
    throw err
  }
}
