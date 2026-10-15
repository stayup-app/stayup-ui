import { NextResponse } from 'next/server'
import { getProviderFluxes, subscribeFlux, unsubscribeFlux } from '@/lib/api-client'
import { getToken } from '@/lib/session'

// GET    /api/providers/:provider/fluxes           → list existing fluxes
// POST   /api/providers/:provider/fluxes  { id }   → subscribe to an existing flux
// DELETE /api/providers/:provider/fluxes  { id }   → unsubscribe
export async function GET(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { provider } = await params
  try {
    return NextResponse.json({ fluxes: await getProviderFluxes(provider, token) })
  } catch {
    return NextResponse.json({ fluxes: [] })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { provider } = await params
  const { id } = (await req.json().catch(() => ({}))) as { id?: number }
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  try {
    await subscribeFlux(provider, id, token)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    const message = (err as Error).message ?? 'Erreur'
    return NextResponse.json(
      { error: message },
      { status: message.includes('subscribed') ? 409 : 500 },
    )
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { provider } = await params
  const { id } = (await req.json().catch(() => ({}))) as { id?: number }
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  try {
    await unsubscribeFlux(provider, id, token)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 })
  }
}
