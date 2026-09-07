import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/session'
import { getServerTranslations } from '@/lib/serverLang'
import { adminListConnectorKeysAction } from '@/lib/admin-actions'
import { ConnectorKeysPanel } from '@/components/admin/ConnectorKeysPanel'

export default async function AdminConnectorKeysPage() {
  const session = await getAdminSession()
  if (!session || session.role !== 'admin') redirect('/admin/login')

  const [keys, t] = await Promise.all([adminListConnectorKeysAction(), getServerTranslations()])
  const p = t.admin.pages

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{p.connectorKeysTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{p.connectorKeysDesc}</p>
      </div>
      <ConnectorKeysPanel keys={keys} />
    </div>
  )
}
