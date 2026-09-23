import Link from '@/shims/link';
import { studies } from '@/data/studies';
import { fallback } from '@/lib/github/client';
import ProjectBrowser from '@/components/github/ProjectBrowser';
import Companion from '@/components/characters/Companion';
export const metadata = {
  title: 'Experiments & Projects',
  description:
    'Explore seven résumé-documented case studies and discover Mahesh Reddy’s public GitHub repositories.',
  alternates: { canonical: '/projects' },
};
export default function Projects() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">CHAPTER 02 / THE EXPERIMENTS</span>
          <h1>
            Ideas, made <span className="hand">real.</span>
          </h1>
          <p>
            Models, experiments, and systems. Open a notebook to follow the
            thinking behind the build.
          </p>
        </div>
        <Companion />
      </header>
      <div className="section-heading">
        <h2>Seven studies. A closer look.</h2>
        <span className="hand muted">
          from my résumé, with the details left in ↴
        </span>
      </div>
      <div className="study-index">
        {studies.map((s, i) => (
          <Link
            href={`/projects/${s.slug}`}
            key={s.slug}
            className={`study-row ${s.color}`}
          >
            <span className="index-number">0{i + 1}</span>
            <div>
              <span className="kicker">
                {s.category} / {s.year}
              </span>
              <h3>{s.name}</h3>
              <p>{s.subtitle}</p>
            </div>
            <span className="row-arrow">↗</span>
          </Link>
        ))}
      </div>
      <div className="section-heading section">
        <div>
          <span className="kicker">THE OPEN WORKBENCH</span>
          <h2>Discover everything on GitHub.</h2>
        </div>
      </div>
      <ProjectBrowser initial={fallback()} />
    </div>
  );
}
