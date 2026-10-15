import { redirect } from 'next/navigation'
import { getAdminSession, getAdminToken } from '@/lib/session'
import { getServerTranslations } from '@/lib/serverLang'
import { adminListUsers } from '@/lib/api-client'
import { UsersTable } from '@/components/admin/UsersTable'

export default async function AdminUsersPage() {
  const session = await getAdminSession()
  if (!session || session.role !== 'admin') redirect('/admin/login')

  const token = await getAdminToken()
  const [users, t] = await Promise.all([
    adminListUsers(token as string).catch(() => []),
    getServerTranslations(),
  ])
  const p = t.admin.pages

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{p.usersTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {p.usersCount.replace('{n}', String(users.length))}
          </p>
        </div>
        <UsersTable users={users} />
      </div>
    </div>
  )
}
