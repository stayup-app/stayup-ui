import { NextResponse } from 'next/server'
import { getConnectorProviders } from '@/lib/api-client'
import { resolveInstance } from '@/lib/instances'

// Proxy to GET /connectors/providers — used to build provider lists dynamically
// on the client (e.g. the "add a flux" selector), without exposing the token to
// the browser. `?instanceId=` targets a specific API instance (multi-API).
export async function GET(request: Request) {
  const instanceId = new URL(request.url).searchParams.get('instanceId')
  const instance = await resolveInstance(instanceId)
  if (!instance) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const providers = await getConnectorProviders(instance.token, instance.url)
    return NextResponse.json({ providers })
  } catch {
    return NextResponse.json({ providers: [] })
  }
}
