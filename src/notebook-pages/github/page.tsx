import { fallback } from '@/lib/github/client';
import ProjectBrowser from '@/components/github/ProjectBrowser';
import Companion from '@/components/characters/Companion';
export const metadata = {
  title: 'The GitHub Lab',
  description:
    'A live workbench of Mahesh Reddy’s public repositories, source code, README notes, and repository activity.',
  alternates: { canonical: '/github' },
};
export default function GitHub() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">CHAPTER 04 / THE OPEN WORKBENCH</span>
          <h1>
            Welcome to <span className="hand">the lab.</span>
          </h1>
          <p>
            Some ideas become systems. Some stay experiments.
            <br />
            The code, the questions, and the work in progress live here.
          </p>
        </div>
        <Companion kind="fox" />
      </header>
      <div className="lab-note">
        <span className="hand">Nothing here is a pretend GitHub number.</span>
        <p>
          Public repositories are discovered from GitHub. Stars, forks, and
          dates come from the API; saved data stays available when GitHub takes
          a break.
        </p>
      </div>
      <ProjectBrowser initial={fallback()} />
    </div>
  );
}
