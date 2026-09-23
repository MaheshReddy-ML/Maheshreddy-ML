import snapshot from '@/data/github-snapshot.json';
import { normalize, type RawRepo } from '@/lib/projects/normalize';
const TTL = 30 * 60 * 1000;
const headers = {
  Accept: 'application/vnd.github+json',
};
const owner = 'MaheshReddy-ML';
export type Catalog = {
  projects: ReturnType<typeof normalize>[];
  fetchedAt: string;
  source: 'live' | 'cached' | 'snapshot';
  message?: string;
};
let cached: Catalog | undefined;
let expires = 0;
let pending: Promise<Catalog> | undefined;
export function fallback(): Catalog {
  return {
    projects: (snapshot.repos as RawRepo[]).map(normalize),
    fetchedAt: snapshot.fetchedAt,
    source: 'snapshot',
  };
}
export async function getCatalog(force = false): Promise<Catalog> {
  if (!force && cached && Date.now() < expires)
    return {
      ...cached,
      source: cached.source === 'snapshot' ? 'snapshot' : 'cached',
    };
  if (pending) return pending;
  pending = (async () => {
    try {
      const repos: RawRepo[] = [];
      for (let page = 1; page <= 20; page++) {
        const r = await fetch(
          `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&page=${page}`,
          { headers, signal: AbortSignal.timeout(6500) },
        );
        if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
        const list = (await r.json()) as RawRepo[];
        if (!Array.isArray(list)) throw Error('Invalid repository response');
        repos.push(...list);
        if (list.length < 100) break;
      }
      cached = {
        projects: repos.map(normalize),
        fetchedAt: new Date().toISOString(),
        source: 'live',
      };
      expires = Date.now() + TTL;
      return cached;
    } catch {
      expires = Date.now() + 5 * 60 * 1000;
      cached = {
        ...(cached ?? fallback()),
        message:
          'GitHub is temporarily unavailable. Showing the last saved repository snapshot.',
      };
      return cached;
    } finally {
      pending = undefined;
    }
  })();
  return pending;
}
export type RepoDetail = {
  readme: { text: string; path: string; html_url: string } | null;
  contributors: { login: string; html_url: string; contributions: number }[];
  commits: {
    sha: string;
    html_url: string;
    commit: { message: string; committer: { date: string } };
  }[];
  activityUnavailable: boolean;
  source: string;
};
const details = new Map<string, { data: RepoDetail; expires: number }>();
export async function getDetail(name: string): Promise<RepoDetail | null> {
  const catalog = await getCatalog();
  const repo = catalog.projects.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );
  if (!repo) return null;
  const hit = details.get(repo.name);
  if (hit && hit.expires > Date.now()) return hit.data;
  const url = `https://api.github.com/repos/${owner}/${encodeURIComponent(repo.name)}`;
  const get = async (path: string) => {
    try {
      const r = await fetch(url + path, {
        headers,
        signal: AbortSignal.timeout(6000),
      });
      return r.ok ? await r.json() : null;
    } catch {
      return null;
    }
  };
  const [readme, contributors, commits] = await Promise.all([
    get('/readme'),
    get('/contributors?per_page=10'),
    get('/commits?per_page=5'),
  ]);
  const readmeData = readme as {
    encoding?: string;
    content?: string;
    path: string;
    html_url: string;
  } | null;
  const saved =
    (
      snapshot.readmes as Record<
        string,
        { text: string; path: string; html_url: string }
      >
    )[repo.name] ?? null;
  let decoded = saved;
  if (readmeData?.encoding === 'base64' && readmeData.content) {
    try {
      const bytes = Uint8Array.from(
        atob(readmeData.content.replace(/\s/g, '')),
        (c) => c.charCodeAt(0),
      );
      decoded = {
        text: new TextDecoder().decode(bytes).slice(0, 160000),
        path: readmeData.path,
        html_url: readmeData.html_url,
      };
    } catch {}
  }
  const data: RepoDetail = {
    readme: decoded,
    contributors: Array.isArray(contributors) ? contributors : [],
    commits: Array.isArray(commits) ? commits : [],
    activityUnavailable: !Array.isArray(commits),
    source: readme ? 'live' : 'snapshot',
  };
  details.set(repo.name, { data, expires: Date.now() + TTL });
  return data;
}
