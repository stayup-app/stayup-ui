import Link from 'next/link'
import { AdminLoginContent } from '@/components/admin/AdminLoginContent'
import { AuroraWordmark } from '@/components/ui/aurora-mark'

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <Link href="/" className="mb-8">
        <AuroraWordmark size={15} />
      </Link>

      <AdminLoginContent />
    </div>
  )
}
