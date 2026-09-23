'use client';
import Link from '@/shims/link';
import { usePathname } from '@/shims/navigation';
import { useState, useEffect, useSyncExternalStore } from 'react';
const links = [
  ['/', 'Cover'],
  ['/about', 'About'],
  ['/projects', 'Projects'],
  ['/research', 'Research'],
  ['/github', 'The lab'],
  ['/contact', 'Contact'],
];
const subscribe = (fn: () => void) => {
  window.addEventListener('notebook-theme-change', fn);
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener('notebook-theme-change', fn);
    window.removeEventListener('storage', fn);
  };
};
const themeSnapshot = () => {
  try {
    return localStorage.getItem('notebook-theme') === 'dark';
  } catch {
    return document.documentElement.dataset.theme === 'dark';
  }
};
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const dark = useSyncExternalStore(subscribe, themeSnapshot, () => false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Mahesh's notebook home">
          <span className="brand-mark">
            m<span>✳</span>
          </span>
          <span>
            mahesh’s notebook
            <span className="brand-caption">AI, ideas & things I build.</span>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          Menu {open ? '−' : '+'}
        </button>
        <nav
          id="navigation"
          className={open ? 'open' : ''}
          aria-label="Main navigation"
        >
          {links.map(([url, title]) => (
            <Link
              href={url}
              onClick={() => setOpen(false)}
              key={url}
              aria-current={path === url ? 'page' : undefined}
            >
              {title}
            </Link>
          ))}
        </nav>
        <button
          className="theme-button"
          aria-label={dark ? 'Switch to light mode' : 'Switch to midnight mode'}
          onClick={() => {
            const d = !dark;
            document.documentElement.dataset.theme = d ? 'dark' : 'light';
            try {
              localStorage.setItem('notebook-theme', d ? 'dark' : 'light');
            } catch {}
            window.dispatchEvent(new Event('notebook-theme-change'));
          }}
        >
          {dark ? '☀' : '☾'}
        </button>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <Link href="/" className="hand">
          Always a work in curiosity.
        </Link>
        <div>
          <Link href="/skills">Skills</Link>
          <Link href="/journey">Journey</Link>
          <a
            href="https://throughmyeyesaiml.blogspot.com"
            target="_blank"
            rel="noreferrer"
          >
            Writing ↗
          </a>
          <a
            href="https://github.com/MaheshReddy-ML"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
        <span>Mahesh Reddy · 2026</span>
      </footer>
    </>
  );
}
