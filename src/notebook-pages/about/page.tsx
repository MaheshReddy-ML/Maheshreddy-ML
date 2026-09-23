import Link from '@/shims/link';
import Cat from '@/components/characters/Cat';
export const metadata = {
  title: 'About Mahesh',
  description:
    'Mahesh Reddy’s background, education, research interests, open-source experience, and documented achievements.',
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">
            CHAPTER 01 / THE PERSON BEHIND THE NOTEBOOK
          </span>
          <h1>
            How I got <span className="hand">obsessed with AI.</span>
          </h1>
          <p>For me, understanding a model means getting inside it.</p>
        </div>
        <Cat small />
      </header>
      <div className="about-grid">
        <article className="about-story">
          <p className="lead">
            I’m Mahesh Reddy, a Machine Learning Engineer and AI Researcher
            pursuing a B.Tech in AI & Data Science at Parul University.
          </p>
          <p>
            My work spans language, vision, and classification. I’ve implemented
            a GPT-style transformer from scratch, investigated feature scaling
            in logistic regression, and built systems that carry models into
            APIs and browser-based experiences.
          </p>
          <p>
            The thread connecting these projects is a question: what happens
            between the model architecture and the person using it? That
            question shows up in Emora’s memory controls, SentinelAI’s
            deterministic decisions, and my research interests in human–AI
            interaction and ethical AI design.
          </p>
          <p>
            I also contribute to open source through GSSoC’26 and write about
            the mechanics behind AI systems.
          </p>
          <div className="actions">
            <Link className="button primary" href="/journey">
              Follow my AI journey →
            </Link>
            <a
              className="text-link"
              href="/Mahesh_Reddy_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Read my résumé ↗
            </a>
          </div>
        </article>
        <aside className="sticky yellow">
          <span className="hand">The short version</span>
          <dl>
            <dt>Studying</dt>
            <dd>
              B.Tech · Computer Science
              <br />
              AI & Data Science
            </dd>
            <dt>At</dt>
            <dd>Parul University, Gujarat</dd>
            <dt>Graduating</dt>
            <dd>Expected May 2027</dd>
            <dt>Based in</dt>
            <dd>Andhra Pradesh, India</dd>
          </dl>
        </aside>
      </div>
      <section className="section">
        <span className="kicker">
          AN INTELLECTUAL PATH, NOT AN INVENTED CHRONOLOGY
        </span>
        <h2>One question leads to another.</h2>
        <div className="learning-path">
          {[
            'Python',
            'Classical ML',
            'Deep learning',
            'NLP & vision',
            'Transformers / LLMs',
            'AI research',
            'Open source',
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="kicker">SMALL MOMENTS, MEANINGFUL MILESTONES</span>
            <h2>Pinned to the board.</h2>
          </div>
        </div>
        <div className="achievement-grid">
          <article className="paper-panel yellow">
            <span className="hand">a little proud of this ✧</span>
            <h3>Top 50 nationally</h3>
            <p>Nothing Playground Hackathon</p>
            <span className="small-print">
              Selected for an original creation.
            </span>
          </article>
          <article className="paper-panel pink">
            <span className="hand">another page in the story</span>
            <h3>Top 100 · internal round</h3>
            <p>Vadodara Hackathon 6.0</p>
            <span className="small-print">
              Within Parul University’s internal round.
            </span>
          </article>
          <article className="paper-panel blue">
            <span className="hand">the foundations matter</span>
            <h3>CS50 Python</h3>
            <p>Harvard University · edX · 2025</p>
            <span className="small-print">
              Introduction to Programming with Python.
            </span>
          </article>
        </div>
        <p className="small-print">
          Education, experience, and achievements are documented in the supplied
          résumé.
        </p>
      </section>
    </div>
  );
}
