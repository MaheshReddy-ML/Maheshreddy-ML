/* oxlint-disable next/no-img-element -- Repository image dimensions are unknown; external images are lazy loaded and never used as LCP content. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Overflowing source-code blocks need tab stops for keyboard scrolling; verified by Axe. */
import { safeUrl } from '@/lib/projects/normalize';
function assetUrl(src: string, repo: string, branch: string, path: string) {
  try {
    const base = `https://raw.githubusercontent.com/MaheshReddy-ML/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${path.includes('/') ? path.slice(0, path.lastIndexOf('/') + 1) : ''}`;
    const u = new URL(src, base);
    return [
      'raw.githubusercontent.com',
      'github.com',
      'user-images.githubusercontent.com',
      'github.com',
    ].includes(u.hostname)
      ? safeUrl(u.href)
      : null;
  } catch {
    return null;
  }
}
export default function Readme({
  text,
  repo,
  branch,
  path,
}: {
  text: string;
  repo: string;
  branch: string;
  path: string;
}) {
  const lines = text.split('\n');
  let fenced = false;
  let code: string[] = [];
  const nodes: React.ReactNode[] = [];
  const inline = (line: string) =>
    line.split(/(!?\[[^\]]*\]\([^\s)]+\)|`[^`]+`)/g).map((part, j) => {
      const match = part.match(/^(!?)\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        if (match[1]) {
          const url = assetUrl(match[3], repo, branch, path);
          return url ? (
            <img
              key={j}
              loading="lazy"
              src={url}
              alt={match[2] || `${repo} README image`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span key={j}>[Image: {match[2] || 'see GitHub README'}]</span>
          );
        }
        const url =
          safeUrl(match[3]) ||
          safeUrl(
            `https://github.com/MaheshReddy-ML/${encodeURIComponent(repo)}/blob/${encodeURIComponent(branch)}/${match[3]}`,
          );
        return url ? (
          <a key={j} href={url} target="_blank" rel="noreferrer">
            {match[2]} ↗
          </a>
        ) : (
          match[2]
        );
      }
      return part.startsWith('`') ? (
        <code key={j}>{part.slice(1, -1)}</code>
      ) : (
        part.replace(/\*\*/g, '')
      );
    });
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (fenced) {
        nodes.push(
          <pre key={i} tabIndex={0} aria-label="Repository code block">
            <code>{code.join('\n')}</code>
          </pre>,
        );
        code = [];
      }
      fenced = !fenced;
      return;
    }
    if (fenced) {
      code.push(line);
      return;
    }
    if (/^#{1,6} /.test(line)) {
      nodes.push(<h3 key={i}>{inline(line.replace(/^#+ /, ''))}</h3>);
    } else if (line.trim()) {
      nodes.push(<p key={i}>{inline(line)}</p>);
    }
  });
  if (code.length)
    nodes.push(
      <pre key="last" tabIndex={0} aria-label="Repository code block">
        <code>{code.join('\n')}</code>
      </pre>,
    );
  return <div className="readme">{nodes}</div>;
}
