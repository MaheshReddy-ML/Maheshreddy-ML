import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Compass } from 'lucide-react'
import { CursorGlow } from './ui'
import { ROUTES, CONTACT } from './data'

export function Root() {
  const loc = useLocation()
  const [progress, setProgress] = useState(0)
  const [wipe, setWipe] = useState<'idle' | 'in' | 'out'>('idle')
  const [wipeMark, setWipeMark] = useState('')
  const prev = useRef(loc.pathname)

  /* scroll progress meridian */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? h.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* map-travel wipe on route change */
  useEffect(() => {
    if (prev.current === loc.pathname) return
    prev.current = loc.pathname
    const r = ROUTES.find((x) => x.path === loc.pathname)
    setWipeMark(r ? r.mark : '✦')
    setWipe('in')
    window.scrollTo({ top: 0, behavior: 'auto' })
    const t1 = setTimeout(() => setWipe('out'), 430)
    const t2 = setTimeout(() => setWipe('idle'), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [loc.pathname])

  return (
    <div className="relative min-h-screen">
      <CursorGlow />

      {/* scroll meridian */}
      <div className="fixed left-0 top-0 z-[95] h-0.5 w-full bg-transparent">
        <div className="meridian h-full bg-[var(--color-accent)]" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* route-transition overlay */}
      {wipe !== 'idle' && (
        <div className={`route-wipe ${wipe}`}>
          <span className="compass-mark">{wipeMark}</span>
        </div>
      )}

      {/* header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-line)]/70 bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)] transition-transform duration-700 group-hover:rotate-180">
              <Compass size={17} />
            </span>
            <span className="font-display text-lg font-light tracking-tight text-[var(--color-ink)]">Mahesh Reddy</span>
          </Link>
          <nav className="flex items-center gap-6">
            {ROUTES.map((r) => (
              <NavLink key={r.path} to={r.path}
                className={({ isActive }) =>
                  `navlink hidden font-mono text-[12px] uppercase tracking-[0.15em] transition-colors sm:inline ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'}`
                }>
                <span className="text-[var(--color-ink-faint)]">{r.mark}·</span>{r.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <Outlet />

      {/* footer */}
      <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg-deep)]/40 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-xl font-light text-[var(--color-ink)]">Mahesh Reddy</div>
            <div className="mt-1 font-mono text-[11px] text-[var(--color-ink-faint)]">23.19°N / 72.63°E · charting machine learning</div>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-mono text-[12px]">
            <a href={`mailto:${CONTACT.email}`} className="navlink text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{CONTACT.email}</a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" className="navlink text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">GitHub</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="navlink text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">LinkedIn</a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">© 2026 · plotted by hand</div>
      </footer>
    </div>
  )
}
