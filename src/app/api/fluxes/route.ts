import { NextResponse } from 'next/server'
import { ApiError, addUserRepository } from '@/lib/api-client'
import { getServerTranslations } from '@/lib/serverLang'
import { resolveInstance } from '@/lib/instances'
import { decodeToken } from '@/lib/session'
import { z } from 'zod'

// A single add path, whatever the provider: the client sends a URL already
// built (from the connector template's `form`). If the provider is in
// `manual` mode, the API answers 202 and the flux goes to the approval queue.
// `?instanceId=` targets a specific API instance (multi-API) — default: primary.
const createFluxSchema = z.object({
  provider: z.string().min(1),
  url: z.string().url().max(2000),
})

export async function POST(request: Request) {
  const t = await getServerTranslations()
  const instanceId = new URL(request.url).searchParams.get('instanceId')
  const instance = await resolveInstance(instanceId)
  if (!instance) return NextResponse.json({ error: t.errors.notAuthenticated }, { status: 401 })

  const session = decodeToken(instance.token)

  const body = await request.json()
  const parsed = createFluxSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: t.errors.invalidData, details: parsed.error.issues },
      { status: 400 },
    )
  }

  const { provider, url } = parsed.data
  const config = { max_scraps: 5, retention_days: 15 }

  try {
    const result = await addUserRepository(
      session.userId,
      instance.token,
      { provider, url, config },
      instance.url,
    )
    if (result.status === 'pending') {
      return NextResponse.json({ status: 'pending' }, { status: 202 })
    }
    // The display label is computed by the client from the connector template
    // (resolveFeedLabel) after revalidation — not here.
    return NextResponse.json({ flux: result.repository }, { status: 201 })
  } catch (err) {
    return NextResponse.json(...toResponse(err, t))
  }
}

// The API answers in English ('Already subscribed'): we branch on the HTTP
// status, the only stable contract, and translate here.
function toResponse(
  err: unknown,
  t: Awaited<ReturnType<typeof getServerTranslations>>,
): [{ error: string }, { status: number }] {
  const status = err instanceof ApiError ? err.status : 500
  if (status === 409) {
    const message = err instanceof ApiError ? err.message : ''
    return [
      {
        error: message.includes('another provider')
          ? t.errors.urlOtherProvider
          : t.errors.alreadySubscribed,
      },
      { status: 409 },
    ]
  }
  return [{ error: t.errors.generic }, { status: status >= 400 ? status : 500 }]
}
