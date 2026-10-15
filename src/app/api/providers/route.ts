import { NextResponse } from 'next/server'
import { getConnectorProviders } from '@/lib/api-client'
import { PROVIDERS } from '@/lib/providers'
import { getToken } from '@/lib/session'

// Proxy to GET /connectors/providers — used to build the "add a flux" selector
// without exposing the token to the browser. The display template of each
// provider is bundled with the app.
export async function GET() {
  const token = await getToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const providers = await getConnectorProviders(token)
    return NextResponse.json({
      providers: providers.map((p) => ({ ...p, template: PROVIDERS[p.name]?.template })),
    })
  } catch {
    return NextResponse.json({ providers: [] })
  }
}
