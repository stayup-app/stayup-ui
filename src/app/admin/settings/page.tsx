import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/session'
import { getServerTranslations } from '@/lib/serverLang'
import { AdminPasswordForm } from '@/components/admin/AdminPasswordForm'

export default async function AdminSettingsPage() {
  const session = await getAdminSession()
  if (!session || session.role !== 'admin') redirect('/admin/login')

  const t = await getServerTranslations()

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-2xl font-semibold">{t.admin.pages.accountTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{session.email}</p>
      </div>
      <AdminPasswordForm />
    </div>
  )
}
