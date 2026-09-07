import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { DocNav } from '@/components/docs/DocShell'
import { DocCode, DocList, DocNote, DocSection, DocSubheading } from '@/components/docs/DocPieces'
import { getDoc } from '@/lib/docs'
import { TUTORIAL as T, TUTORIAL_ANCHORS as A } from '@/lib/docs/shared'
import { getServerLang } from '@/lib/serverLang'

export async function generateMetadata(): Promise<Metadata> {
  const d = getDoc(await getServerLang()).tutorial
  return { title: d.meta.title, description: d.meta.description }
}

const FULL_FILE = [T.head, T.helper, T.template, T.fetch, T.collect, T.main].join('\n\n\n')

export default async function TutorialPage() {
  const doc = getDoc(await getServerLang())
  const d = doc.tutorial

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <LandingHeader />

      <div className="mx-auto flex max-w-[1200px] gap-10 px-6 md:px-8">
        <DocNav
          title={doc.common.onThisPage}
          entries={[
            { id: A.intro, label: d.intro.heading },
            { id: A.prereqs, label: d.prereqs.heading },
            { id: A.steps, label: d.steps.heading },
            { id: A.run, label: d.run.heading },
            { id: A.schedule, label: d.schedule.heading },
            { id: A.full, label: d.full.heading },
            { id: A.next, label: d.next.heading },
          ]}
        />

        <main className="min-w-0 flex-1 max-w-[900px] py-12 pb-28">
          <Link
            href="/docs/providers"
            className="mb-6 inline-block text-[13px] transition-colors hover:text-fg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ← {doc.providers.title}
          </Link>
          <p
            className="mb-3 text-[12px] font-mono font-semibold uppercase tracking-widest"
            style={{ color: 'var(--sky)' }}
          >
            {d.eyebrow}
          </p>
          <h1
            className="mb-4 font-serif text-[42px] font-normal leading-[1.15] tracking-editorial"
            style={{ color: 'var(--fg)' }}
          >
            {d.title}
          </h1>
          <p
            className="mb-12 max-w-[640px] text-[16px] leading-relaxed"
            style={{ color: 'var(--fg-soft)' }}
          >
            {d.lede}
          </p>

          <DocSection id={A.intro} title={d.intro.heading}>
            <p className="mb-5 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.intro.body}
            </p>
            <DocNote tone="sky">{d.intro.note}</DocNote>
          </DocSection>

          <DocSection id={A.prereqs} title={d.prereqs.heading}>
            <DocList items={d.prereqs.items} />
          </DocSection>

          <DocSection id={A.steps} title={d.steps.heading}>
            <DocSubheading>1 · Setup</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.setup}
            </p>
            <DocCode>{T.setup}</DocCode>

            <DocSubheading>2 · check_hn.py</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.helper}
            </p>
            <DocCode>{T.helper}</DocCode>

            <DocSubheading>3 · register()</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.template}
            </p>
            <DocCode>{T.template}</DocCode>

            <DocSubheading>4 · fetch_stories()</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.fetch}
            </p>
            <DocCode>{T.fetch}</DocCode>

            <DocSubheading>5 · collect()</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.collect}
            </p>
            <DocCode>{T.collect}</DocCode>

            <DocSubheading>6 · main()</DocSubheading>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.steps.main}
            </p>
            <DocCode>{T.main}</DocCode>
          </DocSection>

          <DocSection id={A.run} title={d.run.heading}>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.run.body}
            </p>
            <DocCode>{T.run}</DocCode>
            <DocNote>{d.run.note}</DocNote>
          </DocSection>

          <DocSection id={A.schedule} title={d.schedule.heading}>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.schedule.body}
            </p>
            <DocCode>{T.workflow}</DocCode>
          </DocSection>

          <DocSection id={A.full} title={d.full.heading}>
            <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.full.body}
            </p>
            <DocCode>{FULL_FILE}</DocCode>
          </DocSection>

          <DocSection id={A.next} title={d.next.heading}>
            <p className="mb-5 text-[15px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {d.next.body}
            </p>
            <Link
              href="/docs/providers#technical-contract"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium"
              style={{ color: 'var(--sky)' }}
            >
              {d.next.cta}
              <ArrowRight size={13} />
            </Link>
          </DocSection>
        </main>
      </div>
    </div>
  )
}
