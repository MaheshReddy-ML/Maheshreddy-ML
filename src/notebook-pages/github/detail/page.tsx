import Link from "@/shims/link"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import {
  fallback,
  getCatalog,
  getDetail,
  type Catalog,
  type RepoDetail,
} from "@/lib/github/client"
import Readme from "@/components/github/Readme"
import { getStudy } from "@/data/studies"
import NotFound from "@/notebook-pages/not-found"

export default function RepoPage() {
  const { name = "" } = useParams()
  const [catalog, setCatalog] = useState<Catalog>(fallback)
  const [detail, setDetail] = useState<RepoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    setLoading(true)
    void getCatalog().then(async (next) => {
      const found = next.projects.find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      )
      const nextDetail = found ? await getDetail(found.name) : null
      if (active) {
        setCatalog(next)
        setDetail(nextDetail)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [name])
  if (loading)
    return (
      <div className="page">
        <h1>Opening repository notebook…</h1>
      </div>
    )
  const repo = catalog.projects.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  )
  if (!repo) return <NotFound />
  const study = repo.studySlug ? getStudy(repo.studySlug) : undefined
  return (
    <article className="page repo-detail">
      <Link href="/github" className="back-link">
        ← Back to the lab
      </Link>
      <header className="page-heading">
        <div>
          <span className="kicker">
            PUBLIC REPOSITORY / {repo.owner.login}
            {repo.fork ? " / FORK" : ""}
          </span>
          <h1>{repo.displayName}</h1>
          <p>{repo.summary}</p>
          <div className="tags">
            {repo.language && <span>{repo.language}</span>}
            {repo.topics?.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </header>
      <div className="repo-meta">
        <span>☆ {repo.stargazers_count} stars</span>
        <span>⑂ {repo.forks_count} forks</span>
        <span>Created {repo.created_at.slice(0, 10)}</span>
        <span>Updated {repo.updated_at.slice(0, 10)}</span>
        <span>Last push {repo.pushed_at.slice(0, 10)}</span>
      </div>
      <div className="actions detail-actions">
        <a
          className="button primary"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
        >
          Open on GitHub ↗
        </a>
        {repo.homepage && (
          <a
            className="button"
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
          >
            Project homepage ↗
          </a>
        )}
        {study && (
          <Link className="button" href={`/projects/${study.slug}`}>
            Interactive architecture ↗
          </Link>
        )}
      </div>
      {study && (
        <div className="paper-panel">
          <span className="kicker">PROBLEM & APPROACH</span>
          <h2>{study.question}</h2>
          <p>{study.approach}</p>
          <div className="tags">
            {study.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div className="repo-columns">
        <section className="paper-panel">
          <div className="section-heading">
            <div>
              <span className="kicker">FROM THE SOURCE</span>
              <h2>The README</h2>
            </div>
            <span className="small-print">
              {detail?.source === "live" ? "GitHub" : "Saved copy"}
            </span>
          </div>
          <p className="small-print readme-notice">
            Repository-authored content. Claims below belong to the repository;
            diagrams and HTML are shown as source text when needed.
          </p>
          {detail?.readme ? (
            <Readme
              text={detail.readme.text}
              repo={repo.name}
              branch={repo.default_branch}
              path={detail.readme.path}
            />
          ) : (
            <p>
              No README is currently available.{" "}
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                Explore the source on GitHub ↗
              </a>
            </p>
          )}
        </section>
        <aside>
          <section className="paper-panel">
            <span className="hand">Fresh from the bench</span>
            <h2>Recent commits</h2>
            {detail?.activityUnavailable ? (
              <p>Recent activity is temporarily unavailable.</p>
            ) : detail?.commits.length ? (
              detail.commits.map((c) => (
                <a
                  className="commit"
                  href={c.html_url}
                  key={c.sha}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{c.commit.message.split("\n")[0]}</span>
                  <small>
                    {c.sha.slice(0, 7)} · {c.commit.committer.date.slice(0, 10)}
                  </small>
                </a>
              ))
            ) : (
              <p>No commits returned for this repository.</p>
            )}
          </section>
          <section className="paper-panel">
            <h2>Contributors</h2>
            {detail?.contributors.length ? (
              detail.contributors.map((c) => (
                <a
                  className="contributor"
                  href={c.html_url}
                  target="_blank"
                  rel="noreferrer"
                  key={c.login}
                >
                  <strong>@{c.login}</strong>
                  <span>{c.contributions} contributions ↗</span>
                </a>
              ))
            ) : (
              <p>Contributor information is unavailable.</p>
            )}
          </section>
          <p className="small-print">
            Repository metadata: {catalog.fetchedAt.slice(0, 10)}. Activity is
            fetched on demand and cached.
          </p>
        </aside>
      </div>
    </article>
  )
}
