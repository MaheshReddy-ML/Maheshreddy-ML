import Link from '@/shims/link';
import Companion from '@/components/characters/Companion';
export const metadata = {
  title: 'Research & Writing',
  description:
    'Emora’s local-first AI companion paper and independent research on feature scaling and gradient descent.',
  alternates: { canonical: '/research' },
};
export default function Research() {
  return (
    <div className="page">
      <header className="page-heading">
        <div>
          <span className="kicker">
            CHAPTER 03 / QUESTIONS, METHODS, OBSERVATIONS
          </span>
          <h1>
            The research <span className="hand">notebook.</span>
          </h1>
          <p>
            Building gives me something to investigate.
            <br />
            Research gives me a better question to build around.
          </p>
        </div>
        <Companion kind="penguin" />
      </header>
      <article className="research-paper blue">
        <div className="paper-number hand">paper 01</div>
        <div>
          <span className="kicker">2026 / RESEARCH PAPER / ZENODO</span>
          <h2>Emora</h2>
          <h3>Local-First, Emotion-Aware AI Companion</h3>
          <p>
            A browser-based companion investigating local inference, selective
            persistent memory, deterministic emotion estimation, and constrained
            avatar behavior.
          </p>
          <div className="research-notes">
            <div>
              <span className="hand">The question</span>
              <p>
                How can emotionally aware interaction preserve user control and
                bounded behavior?
              </p>
            </div>
            <div>
              <span className="hand">The implementation</span>
              <p>
                Qwen3-4B on Apple Silicon, FastAPI, MongoDB, vision and voice
                components, and a WebGL VRM avatar.
              </p>
            </div>
            <div>
              <span className="hand">The reported evidence</span>
              <p>
                170 automated tests: 169 passed, 1 skipped. Local Qwen3-4B and
                TTS benchmarks are documented without numerical timings in the
                résumé.
              </p>
            </div>
          </div>
          <div className="actions">
            <a
              className="button primary"
              href="https://doi.org/10.5281/zenodo.22267180"
              target="_blank"
              rel="noreferrer"
            >
              Read on Zenodo ↗
            </a>
            <Link className="text-link" href="/projects/emora">
              Explore the system →
            </Link>
          </div>
          <span className="small-print doi">
            DOI: 10.5281/zenodo.22267180 · Publication and test results reported
            in the résumé.
          </span>
        </div>
      </article>
      <article className="research-paper yellow">
        <div className="paper-number hand">paper 02</div>
        <div>
          <span className="kicker">
            2025 / INDEPENDENT RESEARCH / SELF-PUBLISHED
          </span>
          <h2>Feature Scaling and Gradient Descent in Logistic Regression</h2>
          <h3>A Breast Cancer Detection Case Study</h3>
          <p>
            A Python/NumPy training pipeline, implemented from scratch, compares
            min-max normalization and standardization on the Breast Cancer
            Wisconsin dataset.
          </p>
          <div className="research-notes">
            <div>
              <span className="hand">The question</span>
              <p>
                How does the choice of scaler influence convergence behavior?
              </p>
            </div>
            <div>
              <span className="hand">The experiment</span>
              <p>
                Compare two scaling approaches within a from-scratch gradient
                descent pipeline.
              </p>
            </div>
            <div>
              <span className="hand">The reported result</span>
              <p>
                92%+ accuracy. No per-scaler accuracy, split details, or
                clinical validation is supplied in the résumé.
              </p>
            </div>
          </div>
          <Link className="button primary" href="/projects/logistic-regression">
            Open the interactive notebook ↗
          </Link>
        </div>
      </article>
      <section className="writing-section">
        <div>
          <span className="kicker">ALSO IN THE MARGINS</span>
          <h2>Thinking out loud.</h2>
          <p>
            Technical writing on gradient descent, from-scratch ML, NLP
            architecture, and ethical AI design.
          </p>
          <a
            className="text-link"
            href="https://throughmyeyesaiml.blogspot.com"
            target="_blank"
            rel="noreferrer"
          >
            Through My Eyes · AI/ML blog ↗
          </a>
        </div>
        <div className="sticky pink">
          <span className="hand">Read. Try. Question. Repeat.</span>
          <p>A notebook is a good place for ideas that aren’t finished yet.</p>
        </div>
      </section>
    </div>
  );
}
