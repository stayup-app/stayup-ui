import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/session'
import { getServerTranslations } from '@/lib/serverLang'
import { adminGetRetentionAction } from '@/lib/admin-actions'
import { MaintenancePanel } from '@/components/admin/MaintenancePanel'

export default async function AdminMaintenancePage() {
  const session = await getAdminSession()
  if (!session || session.role !== 'admin') redirect('/admin/login')

  const [settings, t] = await Promise.all([adminGetRetentionAction(), getServerTranslations()])
  const p = t.admin.pages

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{p.maintenanceTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{p.maintenanceDesc}</p>
      </div>
      <MaintenancePanel settings={settings} />
    </div>
  )
}
