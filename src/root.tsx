import { useEffect } from "react"
import { Outlet, useLocation } from "react-router"
import Shell from "./components/notebook/Shell"
import { getStudy } from "./data/studies"

const origin = "https://maheshreddyml.netlify.app"
const defaultDescription =
  "Inside Mahesh Reddy’s AI notebook: from-scratch transformers, local-first AI companions, deterministic governance, computer vision, and independent research."
const titles: Record<string, string> = {
  "/": "Mahesh Reddy — Machine Learning Engineer & AI Researcher",
  "/about": "About Mahesh Reddy · AI Notebook",
  "/projects": "Experiments & Projects · AI Notebook",
  "/research": "Research · AI Notebook",
  "/github": "The GitHub Lab · AI Notebook",
  "/skills": "Skills · AI Notebook",
  "/journey": "Journey · AI Notebook",
  "/contact": "Contact · AI Notebook",
}

export function Root() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const slug = pathname.startsWith("/projects/")
      ? pathname.slice("/projects/".length)
      : ""
    const study = slug ? getStudy(slug) : undefined
    const repoPath = pathname.startsWith("/github/")
      ? pathname.slice("/github/".length)
      : ""
    let repoName = repoPath
    try {
      repoName = decodeURIComponent(repoPath)
    } catch {
      // Malformed URLs still render the recovery route without crashing metadata.
    }
    const title = study
      ? `${study.name} · AI Notebook`
      : repoName
        ? `${repoName} · GitHub Lab`
        : (titles[pathname] ?? "Page not found · AI Notebook")
    const description =
      study?.subtitle ??
      (repoName ? `Repository notebook for ${repoName}` : defaultDescription)
    document.title = title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description)
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.append(canonical)
    }
    canonical.href = origin + pathname
  }, [pathname])

  return (
    <Shell>
      <Outlet />
    </Shell>
  )
}
