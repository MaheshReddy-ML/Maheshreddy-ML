"use client"
import Link from "@/shims/link"
import { useState, useEffect } from "react"
import type { Project } from "@/lib/projects/normalize"
import { categories } from "@/lib/projects/normalize"
import { getCatalog } from "@/lib/github/client"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
type Data = {
  projects: Project[]
  fetchedAt: string
  source: string
  message?: string
}
export default function ProjectBrowser({ initial }: { initial: Data }) {
  const [data, setData] = useState(initial)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [sort, setSort] = useState("updated")
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState("")
  const refresh = async () => {
    setBusy(true)
    setError("")
    try {
      setData(await getCatalog(true))
    } catch {
      setError("Could not refresh GitHub. The saved projects remain available.")
    } finally {
      setBusy(false)
    }
  }
  useEffect(() => {
    let active = true
    void getCatalog()
      .then((next) => {
        if (active) setData(next)
      })
      .catch(() => {
        if (active)
          setError(
            "Could not refresh GitHub. The saved projects remain available.",
          )
      })
      .finally(() => {
        if (active) setBusy(false)
      })
    return () => {
      active = false
    }
  }, [])
  const visible = data.projects
    .filter(
      (p) =>
        (filter === "All" || p.categories.includes(filter)) &&
        `${p.name} ${p.summary} ${p.topics?.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "stars"
          ? b.stargazers_count - a.stargazers_count
          : b.updated_at.localeCompare(a.updated_at),
    )
  return (
    <section className="project-browser">
      <div className="browser-controls">
        <label className="search">
          <span>Search the workbench</span>
          <input
            type="search"
            placeholder="A project, a topic, an idea…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="sort-control">
          <span id="sort-label">Arrange by</span>
          <Select value={sort} onValueChange={(v) => setSort(v ?? "updated")}>
            <SelectTrigger aria-labelledby="sort-label">
              <SelectValue>
                {sort === "updated"
                  ? "Recently updated"
                  : sort === "name"
                    ? "Name A–Z"
                    : "Stars"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="filters" aria-label="Project categories">
        {[
          "All",
          ...categories.filter((c) =>
            data.projects.some((p) => p.categories.includes(c)),
          ),
        ].map((c) => (
          <button
            key={c}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="source-line">
        <output>
          {visible.length} of {data.projects.length} public repositories ·{" "}
          {data.source === "live" ? "GitHub synced" : "Saved GitHub data"} ·{" "}
          {data.fetchedAt.slice(0, 10)}
        </output>
        <button onClick={refresh} disabled={busy}>
          {busy ? "Refreshing…" : "Refresh ↻"}
        </button>
      </div>
      {(error || data.message) && (
        <output className="data-notice">{error || data.message}</output>
      )}
      <div className="repo-grid">
        {visible.map((p) => (
          <Link
            href={`/github/${encodeURIComponent(p.name)}`}
            className={`repo-card ${p.color}`}
            key={p.id}
          >
            <div className="card-top">
              <span>{p.categories[0]}</span>
              <span>↗</span>
            </div>
            <h3>{p.displayName}</h3>
            <p>{p.summary}</p>
            <div className="tags">
              {p.language && <span>{p.language}</span>}
              {p.fork && <span>Fork</span>}
              {p.archived && <span>Archived</span>}
              {p.topics?.slice(0, 2).map((t) => <span key={t}>{t}</span>)}
            </div>
            <div className="repo-bottom">
              <span>
                ☆ {p.stargazers_count}{" "}
                <span className="fork-count">⑂ {p.forks_count}</span>
              </span>
              <span>Open lab notebook →</span>
            </div>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className="empty">
          <h3>No experiments on this page.</h3>
          <p>Try a different search or clear the category.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("")
              setFilter("All")
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
