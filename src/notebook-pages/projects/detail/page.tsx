import Link from "@/shims/link"
import { useParams } from "react-router"
import NotFound from "@/notebook-pages/not-found"
import { getStudy, studies } from "@/data/studies"
import Architecture from "@/components/architecture/Architecture"
import Scaling from "@/components/architecture/Scaling"
import { fallback } from "@/lib/github/client"
import Companion from "@/components/characters/Companion"
export default function StudyPage() {
  const { slug = "" } = useParams()
  const s = getStudy(slug)
  if (!s) return <NotFound />
  const repo = fallback().projects.find((p) => p.studySlug === s.slug)
  return (
    <article className="page study-page">
      <Link className="back-link" href="/projects">
        ← Back to the experiments
      </Link>
      <header className={`study-hero ${s.color}`}>
        <div>
          <span className="kicker">
            RESEARCH NOTEBOOK / {s.year} / {s.category}
          </span>
          <h1>{s.name}</h1>
          <p>{s.subtitle}</p>
          <div className="tags">
            {s.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <Companion
          kind={
            slug === "sign-language"
              ? "robot"
              : slug === "emora"
                ? "cat"
                : slug === "minigpt"
                  ? "robot"
                  : "fox"
          }
        />
      </header>
      <div className="study-intro">
        <div>
          <span className="kicker">THE QUESTION</span>
          <h2>{s.question}</h2>
        </div>
        <div>
          <span className="kicker">THE APPROACH</span>
          <p>{s.approach}</p>
        </div>
      </div>
      <div className="evidence-row">
        {s.evidence.map((e) => (
          <div key={e.label}>
            <strong>{e.value}</strong>
            <span>{e.label}</span>
          </div>
        ))}
      </div>
      <div className="section-heading section">
        <div>
          <span className="kicker">UNDER THE HOOD</span>
          <h2>
            {slug === "minigpt"
              ? "One transformer, block by block."
              : "The architecture, annotated."}
          </h2>
        </div>
        <span className="hand muted">tap a block. follow the thought.</span>
      </div>
      <Architecture steps={s.steps} governance={slug === "sentinelai"} />
      {slug === "logistic-regression" && <Scaling />}
      <section className="observations">
        <div>
          <span className="kicker">NOTES FROM THE BUILD</span>
          <h2>What matters here.</h2>
        </div>
        <div>
          {s.observations.map((o, i) => (
            <p key={o}>
              <span className="hand">0{i + 1}.</span>
              {o}
            </p>
          ))}
        </div>
      </section>
      <aside className="evidence-note">
        <h3>Reading the evidence</h3>
        <p>{s.limits}</p>
        <p>
          Project claims and metrics:{" "}
          <a href="/Mahesh_Reddy_Resume.pdf" target="_blank" rel="noreferrer">
            Mahesh Reddy’s résumé ↗
          </a>
          .
        </p>
      </aside>
      <div className="actions detail-actions">
        {repo ? (
          <Link
            className="button primary"
            href={`/github/${encodeURIComponent(repo.name)}`}
          >
            README & repository activity ↗
          </Link>
        ) : (
          <Link className="button" href="/github">
            Find the repository ↗
          </Link>
        )}
        {s.paper && (
          <a className="button" href={s.paper} target="_blank" rel="noreferrer">
            Research paper · Zenodo ↗
          </a>
        )}
        <Link
          className="text-link"
          href={`/projects/${studies[(studies.indexOf(s) + 1) % studies.length].slug}`}
        >
          Next notebook →
        </Link>
      </div>
    </article>
  )
}
