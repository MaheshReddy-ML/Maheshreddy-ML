import Journey from '@/components/notebook/Journey';
export const metadata = {
  title: 'AI Journey',
  description:
    'A documented timeline of Mahesh Reddy’s research, projects, open-source work, and education.',
  alternates: { canonical: '/journey' },
};
export default function Page() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">MARGIN NOTES / THE JOURNEY SO FAR</span>
          <h1>
            Learning. Building.
            <br />
            <span className="hand">Asking better questions.</span>
          </h1>
          <p>
            A timeline of the work, using the dates recorded in my résumé.
            Projects sharing a year are grouped without implying a
            month-by-month order.
          </p>
        </div>
        <span className="journey-scribble hand" aria-hidden="true">
          Python
          <br />
          　↓
          <br />
          “what if?”
          <br />
          　↓
          <br />
          keep going ♡
        </span>
      </header>
      <Journey />
    </div>
  );
}
