'use client'

import { AdminLoginForm } from './AdminLoginForm'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useLanguage } from '@/context/LanguageContext'

export function AdminLoginContent() {
  const { t } = useLanguage()

  return (
    <div
      className="w-full max-w-sm rounded-[14px] p-8"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div className="text-center mb-6">
        <h1 className="font-serif text-[24px] leading-[1.15] tracking-editorial font-normal mb-1">
          {t.admin.login.title}
        </h1>
        <p className="text-[13px] text-muted-foreground">{t.admin.login.subtitle}</p>
      </div>

      <AdminLoginForm />

      <div className="mt-6 border-t border-[var(--border-soft)] pt-4 flex justify-end">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
