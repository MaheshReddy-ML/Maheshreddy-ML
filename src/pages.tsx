import { Link, useNavigate } from 'react-router'
import type { ReactNode } from 'react'
import { ArrowUpRight, ArrowRight, Compass, AtSign, Link2, GitBranch, Contact as ContactIcon, MapPin, ExternalLink, FileText, Download } from 'lucide-react'
import { Reveal, InkHeading, CompassRose, RoutePath, PageHero } from './ui'
import {
  ROUTES, CONTACT, stats, folioTags, projects, moreRepos, expertise, research, skillGroups, skillTicker,
} from './data'

/* Shared section heading (roman numeral + label + rule) */
function SectionMark({ mark, label, note }: { mark: string; label: string; note?: string }) {
  return (
    <Reveal variant="reveal">
      <div className="mb-10">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-3xl font-light text-[var(--color-accent)]">{mark}</span>
          <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] font-light leading-tight tracking-tight text-[var(--color-ink)]">{label}</h2>
        </div>
        {note && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{note}</p>}
        <div className="rule-dash mt-6 h-px w-full" />
      </div>
    </Reveal>
  )
}

/* Route-forward callout at the bottom of each page */
function NextRoute({ toIdx }: { toIdx: number }) {
  const r = ROUTES[toIdx % ROUTES.length]
  return (
    <Reveal variant="reveal-blur">
      <Link to={r.path} className="folio folio-hover sheen plate group mx-auto mt-4 flex max-w-2xl items-center justify-between gap-6 px-8 py-7">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">continue · route {r.mark}</div>
          <div className="mt-1 font-display text-2xl font-light text-[var(--color-ink)]">{r.title}</div>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)] transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--color-accent)]">
          <ArrowRight size={18} />
        </span>
      </Link>
    </Reveal>
  )
}

function PageWrap({ children }: { children: ReactNode }) {
  return <main className="page-enter pb-28">{children}</main>
}

/* ═══════════════════ HOME — overview of all routes ═══════════════════ */
export function Home() {
  return (
    <PageWrap>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-36">
        <div className="graticule pointer-events-none absolute inset-0" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <RoutePath />
          <RoutePath d="M -50 180 C 300 260, 500 60, 820 200 S 1300 340, 1600 160" />
        </svg>
        <div className="anim-float pointer-events-none absolute right-[6%] top-24 opacity-90">
          <CompassRose size={300} />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="anim-fade-up mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-faint)]">
            <span className="pin-ring relative inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <span className="relative z-10">23.19°N / 72.63°E · Gujarat, India</span>
          </div>
          <h1 className="font-display text-[clamp(2.6rem,8.5vw,7rem)] font-light leading-[0.92] tracking-tight text-[var(--color-ink)]">
            <InkHeading text="Mahesh Reddy" base={0} />
            <span className="block text-[var(--color-accent)]"><InkHeading text="charts machine learning" base={280} /></span>
          </h1>
          <Reveal variant="reveal" delay={200} className="mt-8 max-w-xl">
            <p className="text-[17px] leading-relaxed text-[var(--color-ink-soft)]">
              An explorer's atlas of AI/ML work — from scratch-built algorithms to deployed
              intelligence systems. Every route on this map leads to a working artifact.
            </p>
          </Reveal>
          <Reveal variant="reveal" delay={340} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/projects" className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-[14px] font-medium text-[var(--color-paper-hi)] transition-all duration-400 hover:bg-[var(--color-accent-hi)]">
              Chart the routes <Compass size={16} className="transition-transform duration-700 group-hover:rotate-180" />
            </Link>
            <Link to="/contact" className="navlink inline-flex items-center gap-2 text-[14px] text-[var(--color-ink)]">
              Send correspondence <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-bg-deep)]/40 px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} variant="reveal-s" delay={i * 90}>
              <div className="text-center sm:text-left">
                <div className="font-display text-[clamp(2.4rem,5vw,3.4rem)] font-light leading-none text-[var(--color-accent)]">{s.value}</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]">{s.label}</div>
                <div className="text-[13px] text-[var(--color-ink-faint)]">{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Route index — overview cards linking to each page */}
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <SectionMark mark="✦" label="The Route Index" note="Four charted routes. Each opens onto its own map plate — follow any line to see the full survey." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ROUTES.map((r, i) => {
            const Icon = r.icon
            return (
              <Reveal key={r.path} variant={i % 2 ? 'reveal-r' : 'reveal-l'} delay={i * 80}>
                <Link to={r.path} className="folio folio-hover sheen plate group flex h-full items-start gap-5 p-7">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper-hi)] text-[var(--color-accent)] transition-colors duration-500 group-hover:border-[var(--color-accent)]">
                    <Icon size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">route {r.mark}</span>
                      <ArrowUpRight size={16} className="text-[var(--color-ink-faint)] transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-light text-[var(--color-ink)]">{r.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{r.note}</p>
                    <div className="mt-4 font-mono text-[11px] text-[var(--color-accent)]">{r.coord}</div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Explorer's Folio — tag drift */}
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <SectionMark mark="✧" label="The Explorer's Folio" note="Instruments and terrain covered across the atlas." />
        <div className="flex flex-wrap gap-3">
          {folioTags.map((t, i) => (
            <Reveal key={t} variant="reveal-s" delay={i * 45}>
              <span className="chip inline-block rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2 font-mono text-[12px] text-[var(--color-ink-soft)]">{t}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="px-6 pt-20"><NextRoute toIdx={0} /></div>
    </PageWrap>
  )
}

/* ═══════════════════ PROJECTS ═══════════════════ */
export function Projects() {
  return (
    <PageWrap>
      <PageHero mark="I" title="Project Route" kicker="route I · charted builds" coord="06 surveyed artifacts · idea → deployment" seed={3} />
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6">
          {projects.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.n} variant={i % 2 ? 'reveal-r' : 'reveal-l'} delay={i * 60}>
                <article className={`folio folio-hover tilt plate group grid grid-cols-1 gap-6 p-8 md:grid-cols-[auto_1fr] ${p.featured ? 'ring-1 ring-[var(--color-accent-soft)]' : ''}`}>
                  <div className="flex flex-col items-start gap-4">
                    <span className="tilt-ico anim-bob grid h-16 w-16 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper-hi)] text-[var(--color-accent)]" style={{ animationDelay: `${i * 0.5}s` }}>
                      <Icon size={26} />
                    </span>
                    <span className="font-display text-5xl font-light text-[var(--color-line)]">{p.n}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">{p.kicker}</span>
                      {p.featured && <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-paper-hi)]">featured survey</span>}
                    </div>
                    <h3 className="mt-2 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-light text-[var(--color-ink)]">{p.name}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{p.desc}</p>
                    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[13.5px] text-[var(--color-ink-soft)]">
                          <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]" /> {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-faint)]">{t}</span>
                      ))}
                      <span className="ml-auto font-mono text-[11px] text-[var(--color-accent)]">{p.coord}</span>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <a href={p.repo} target="_blank" rel="noreferrer"
                        className="group/btn inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] transition-all duration-400 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper-hi)]">
                        <GitBranch size={14} /> View repository
                      </a>
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-[var(--color-paper-hi)] transition-all duration-400 hover:bg-[var(--color-accent-hi)]">
                          <ExternalLink size={14} /> Live demo
                        </a>
                      )}
                      <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)]">{p.lang}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* Further expeditions */}
        <div className="mt-16">
          <SectionMark mark="↳" label="Further Expeditions" note="Smaller surveys and open-source contributions across the atlas." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreRepos.map((m, i) => {
              const Icon = m.icon
              return (
                <Reveal key={m.name} variant="reveal-s" delay={i * 45}>
                  <a href={m.repo} target="_blank" rel="noreferrer" className="folio folio-hover sheen plate group flex h-full flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)] transition-colors duration-500 group-hover:border-[var(--color-accent)]">
                        <Icon size={16} />
                      </span>
                      <GitBranch size={13} className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent)]" />
                    </div>
                    <div className="font-display text-[15px] font-light leading-snug text-[var(--color-ink)]">{m.name}</div>
                    <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">{m.note}</p>
                    <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)]">{m.lang}</span>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>

        <div className="pt-16"><NextRoute toIdx={1} /></div>
      </section>
    </PageWrap>
  )
}

/* ═══════════════════ EXPERTISE ═══════════════════ */
export function Expertise() {
  return (
    <PageWrap>
      <PageHero mark="II" title="Expertise Route" kicker="route II · disciplines" coord="08 regions surveyed · foundations → delivery" seed={12} />
      <section className="mx-auto max-w-6xl px-6">
        {/* Discipline cards — 3D tilt + floating icon */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e, i) => {
            const Icon = e.icon
            return (
              <Reveal key={e.title} variant="reveal-s" delay={i * 70}>
                <div className="folio folio-hover tilt sheen plate group h-full p-7">
                  <span className="tilt-ico anim-bob grid h-12 w-12 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper-hi)] text-[var(--color-accent)]" style={{ animationDelay: `${i * 0.4}s` }}>
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-light text-[var(--color-ink)]">{e.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{e.note}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Skills Atlas — categorized regions with popping chips */}
        <div className="mt-20">
          <SectionMark mark="✦" label="The Skills Atlas" note="Every instrument in the kit, charted by region. Hover a region to survey it." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {skillGroups.map((g, i) => <SkillCluster key={g.region} group={g} idx={i} />)}
          </div>
        </div>

        {/* Instrument ticker */}
        <div className="mt-20">
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">
            <span className="h-px w-10 bg-[var(--color-accent)]" /> the full toolkit, drifting past
          </div>
          <div className="ticker-mask relative overflow-hidden rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[var(--color-paper)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[var(--color-paper)] to-transparent" />
            <div className="ticker-track gap-8 px-4">
              {[...skillTicker, ...skillTicker].map((s, i) => (
                <span key={i} className="flex shrink-0 items-center gap-8 font-mono text-[13px] uppercase tracking-[0.15em] text-[var(--color-ink-soft)]">
                  {s} <span className="text-[var(--color-accent)]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-20"><NextRoute toIdx={2} /></div>
      </section>
    </PageWrap>
  )
}

function SkillCluster({ group, idx }: { group: import('./data').SkillGroup; idx: number }) {
  const { ref, seen } = useInViewDiv()
  const Icon = group.icon
  return (
    <div ref={ref} className={`cluster folio folio-hover plate group relative overflow-hidden p-7 ${seen ? 'visible' : ''}`}>
      <div className="anim-drift pointer-events-none absolute right-[-50px] top-[-50px] h-32 w-32 rounded-full border border-[var(--color-line)] opacity-40" style={{ animationDelay: `${idx * 0.6}s` }} />
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper-hi)] text-[var(--color-accent)] transition-transform duration-500 group-hover:rotate-12">
          <Icon size={20} />
        </span>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">region {group.mark}</div>
          <h3 className="font-display text-xl font-light text-[var(--color-ink)]">{group.region}</h3>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {group.skills.map((s, j) => (
          <span key={s} className="skill-node chip inline-block rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-1.5 font-mono text-[12px] text-[var(--color-ink-soft)]"
            style={{ animationDelay: `${idx * 60 + j * 55}ms` }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* tiny local hook to toggle 'visible' when a block scrolls into view */
import { useEffect, useRef, useState } from 'react'
function useInViewDiv() {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect() } }, { threshold: 0.25 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, seen }
}

/* ═══════════════════ RESEARCH ═══════════════════ */
export function Research() {
  return (
    <PageWrap>
      <PageHero mark="III" title="Research Route" kicker="route III · frameworks & evidence" coord="01 framework · comparative studies · OSS evidence" seed={21} />
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6">
          {research.map((r, i) => (
            <Reveal key={r.title} variant={i % 2 ? 'reveal-r' : 'reveal-l'} delay={i * 70}>
              <article className="folio folio-hover tilt plate group relative overflow-hidden p-8">
                <div className="anim-drift pointer-events-none absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full border border-[var(--color-line)] opacity-40" />
                <div className="anim-twinkle pointer-events-none absolute right-10 top-10 text-[var(--color-accent)]" style={{ animationDelay: `${i * 0.7}s` }}>✦</div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">{r.tag}</span>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-light text-[var(--color-ink)]">{r.title}</h3>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">{r.note}</p>
                {(r.pdf || r.link) && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {r.pdf && (
                      <a href={r.pdf} target="_blank" rel="noreferrer"
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-[var(--color-paper-hi)] transition-all duration-400 hover:bg-[var(--color-accent-hi)]">
                        <FileText size={14} /> Read paper
                        <ArrowUpRight size={13} className="transition-transform duration-400 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </a>
                    )}
                    {r.pdf && (
                      <a href={r.pdf} download
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] transition-all duration-400 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper-hi)]">
                        <Download size={14} /> PDF
                      </a>
                    )}
                    {r.link && !r.pdf && (
                      <a href={r.link} target="_blank" rel="noreferrer"
                        className="group/btn inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] transition-all duration-400 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper-hi)]">
                        <GitBranch size={14} /> View evidence
                      </a>
                    )}
                  </div>
                )}
                <div className="mt-5 flex items-center gap-3">
                  <div className="rule-dash h-px flex-1" />
                  <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">{r.meta}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="pt-16"><NextRoute toIdx={3} /></div>
      </section>
    </PageWrap>
  )
}

/* ═══════════════════ CONTACT ═══════════════════ */
export function Contact() {
  const links = [
    { icon: AtSign, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: GitBranch, label: 'GitHub', value: `github.com/${CONTACT.handle}`, href: CONTACT.github },
    { icon: ContactIcon, label: 'LinkedIn', value: 'linkedin.com/in/maheshreddy', href: CONTACT.linkedin },
  ]
  return (
    <PageWrap>
      <PageHero mark="IV" title="Correspondence" kicker="route IV · open channel" coord="open to internships · collaboration · roles" seed={7} />
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal variant="reveal">
              <p className="max-w-xl font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-light leading-snug text-[var(--color-ink)]">
                Charting a new route together? I'm open to internships, research collaboration,
                and engineering roles in <span className="text-[var(--color-accent)]">AI / ML</span>.
              </p>
            </Reveal>
            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {links.map((l, i) => {
                const Icon = l.icon
                return (
                  <Reveal key={l.label} variant="reveal-s" delay={i * 80}>
                    <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      className="folio folio-hover sheen plate group flex h-full flex-col gap-3 p-6">
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)] transition-colors duration-500 group-hover:border-[var(--color-accent)]">
                        <Icon size={18} />
                      </span>
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">{l.label}</div>
                        <div className="mt-1 flex items-center gap-1 text-[14px] text-[var(--color-ink)]">
                          {l.value} <Link2 size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                    </a>
                  </Reveal>
                )
              })}
            </div>
          </div>
          <div className="anim-float mx-auto hidden lg:block"><CompassRose size={280} /></div>
        </div>
        <Reveal variant="reveal-blur" className="pt-16">
          <a href={`mailto:${CONTACT.email}`} className="group mx-auto flex max-w-xl items-center justify-center gap-3 rounded-full bg-[var(--color-accent)] px-8 py-4 text-[15px] font-medium text-[var(--color-paper-hi)] transition-all duration-400 hover:bg-[var(--color-accent-hi)]">
            Begin correspondence <ArrowUpRight size={17} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </section>
    </PageWrap>
  )
}

/* ═══════════════════ NOT FOUND ═══════════════════ */
export function NotFound() {
  const nav = useNavigate()
  return (
    <PageWrap>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-48 text-center">
        <div className="anim-float"><CompassRose size={220} /></div>
        <h1 className="mt-10 font-display text-[clamp(3rem,10vw,7rem)] font-light leading-none text-[var(--color-accent)]">Off the map</h1>
        <p className="mt-4 max-w-md text-[16px] text-[var(--color-ink-soft)]">This route was never charted. Let's steer back to known coordinates.</p>
        <button onClick={() => nav('/')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-[14px] font-medium text-[var(--color-paper-hi)] transition-all hover:bg-[var(--color-accent-hi)]">
          <Compass size={16} /> Return to base
        </button>
      </section>
    </PageWrap>
  )
}
