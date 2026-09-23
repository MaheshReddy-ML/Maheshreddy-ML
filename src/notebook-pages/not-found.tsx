import Link from '@/shims/link';
export default function NotFound() {
  return (
    <div className="page not-found">
      <span className="hand">A page slipped out of the notebook…</span>
      <h1>Page not found.</h1>
      <p>This notebook page doesn’t exist. Let’s return to the experiments.</p>
      <Link className="button primary" href="/projects">
        Back to the experiments →
      </Link>
    </div>
  );
}
