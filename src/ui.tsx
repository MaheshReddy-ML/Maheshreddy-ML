import { useEffect, useRef, type ReactNode } from 'react'

/* ── Scroll-into-view ─────────────────────────────────────── */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

export function Reveal({ children, variant = 'reveal', delay = 0, className = '' }:
  { children: ReactNode; variant?: string; delay?: number; className?: string }) {
  const ref = useInView()
  return (
    <div ref={ref} className={`${variant} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ── Per-word ink-rise heading ────────────────────────────── */
export function InkHeading({ text, base = 0, className = '' }: { text: string; base?: number; className?: string }) {
  return (
    <span className={`ink-line ${className}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="ink-word" style={{ animationDelay: `${base + i * 90}ms` }}>{w}&nbsp;</span>
      ))}
    </span>
  )
}

/* ── Warm cursor glow ─────────────────────────────────────── */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ref.current) { ref.current.style.left = e.clientX + 'px'; ref.current.style.top = e.clientY + 'px' }
      })
    }
    window.addEventListener('mousemove', move)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

/* ── Compass rose (rotating brass ring + fixed star) ──────── */
export function CompassRose({ size = 260 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className="overflow-visible">
      <g className="anim-spin-slow" style={{ transformOrigin: '100px 100px' }}>
        <circle cx="100" cy="100" r="92" stroke="var(--color-line)" strokeWidth="1" />
        <circle cx="100" cy="100" r="78" stroke="var(--color-ink-faint)" strokeWidth="1" strokeDasharray="2 6" />
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i * 5 * Math.PI) / 180
          const long = i % 6 === 0
          const r1 = long ? 68 : 74
          return (
            <line key={i}
              x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)}
              x2={100 + 78 * Math.cos(a)} y2={100 + 78 * Math.sin(a)}
              stroke="var(--color-ink-faint)" strokeWidth={long ? 1.4 : 0.7} />
          )
        })}
      </g>
      <g>
        <path d="M100 24 L112 88 L100 100 L88 88 Z" fill="var(--color-accent)" />
        <path d="M100 176 L88 112 L100 100 L112 112 Z" fill="var(--color-ink-soft)" />
        <path d="M24 100 L88 88 L100 100 L88 112 Z" fill="var(--color-ink-soft)" />
        <path d="M176 100 L112 112 L100 100 L112 88 Z" fill="var(--color-gold)" />
        <circle cx="100" cy="100" r="6" fill="var(--color-ink)" />
      </g>
      <text x="100" y="18" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--color-ink-soft)">N</text>
      <text x="100" y="192" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--color-ink-faint)">S</text>
      <text x="188" y="104" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--color-ink-faint)">E</text>
      <text x="12" y="104" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--color-ink-faint)">W</text>
    </svg>
  )
}

/* ── Self-drawing route path (SVG overlay) ────────────────── */
export function RoutePath({ d = 'M -50 420 C 250 380, 420 520, 720 340 S 1200 200, 1500 380' }: { d?: string }) {
  const ref = useInView<SVGPathElement>(0.01)
  return (
    <g>
      <path ref={ref} className="route-draw" d={d} stroke="var(--color-accent)" strokeWidth="1.5" fill="none" opacity="0.35" />
      <path className="route-dash" d={d} stroke="var(--color-accent)" strokeWidth="1.5" fill="none" opacity="0.22" />
    </g>
  )
}

/* ── Topographic contour field (decorative, per-page seed) ── */
export function ContourField({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const lines = Array.from({ length: 7 })
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} preserveAspectRatio="none" viewBox="0 0 1200 600" fill="none">
      {lines.map((_, i) => {
        const y = 90 + i * 70 + (seed % 30)
        const amp = 26 + ((i + seed) % 4) * 12
        const d = `M -50 ${y} C 200 ${y - amp}, 380 ${y + amp}, 620 ${y - amp / 2} S 1050 ${y + amp}, 1250 ${y - amp / 2}`
        return <path key={i} d={d} stroke="var(--color-ink)" strokeWidth="1" fill="none" opacity="0.05" />
      })}
    </svg>
  )
}

/* ── Big page banner: roman numeral + title + coordinates ─── */
export function PageHero({ mark, title, kicker, coord, seed = 0 }:
  { mark: string; title: string; kicker: string; coord: string; seed?: number }) {
  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-36">
      <div className="graticule pointer-events-none absolute inset-0" />
      <ContourField seed={seed} />
      <div className="anim-drift pointer-events-none absolute right-[-140px] top-[-90px] h-[440px] w-[440px] rounded-full border border-[var(--color-line)] opacity-40" />
      <div className="relative mx-auto max-w-6xl">
        <div className="anim-fade-up mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">
          <span className="h-px w-10 bg-[var(--color-accent)]" /> {kicker}
        </div>
        <div className="flex items-end gap-6">
          <span className="anim-fade-up font-display text-[clamp(3rem,10vw,8rem)] font-light leading-none text-[var(--color-accent)]">{mark}</span>
          <h1 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-light leading-[0.95] tracking-tight text-[var(--color-ink)]">
            <InkHeading text={title} base={120} />
          </h1>
        </div>
        <Reveal variant="reveal" delay={200}>
          <div className="mt-6 flex items-center gap-4">
            <div className="rule-dash h-px flex-1" />
            <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">{coord}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
