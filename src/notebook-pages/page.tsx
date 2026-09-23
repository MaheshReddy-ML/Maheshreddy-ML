import Link from '@/shims/link';
import Cat from '@/components/characters/Cat';
export default function Home() {
  return (
    <div className="page home">
      <div className="folio-line">
        <span>THE PERSONAL NOTEBOOK OF MAHESH REDDY</span>
        <span>VOL. 01 / ALWAYS EXPLORING</span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hand eyebrow">
            a mind full of questions & a notebook full of code
          </span>
          <h1>
            Hi, I’m <span>Mahesh.</span>
            <span className="hello-star" aria-hidden="true">
              ✳
            </span>
          </h1>
          <h2>
            Machine Learning Engineer
            <br />& AI Researcher
          </h2>
          <p>
            I build models from scratch, investigate how they work, and turn AI
            ideas into systems you can actually use.
          </p>
          <div className="actions">
            <Link className="button primary" href="/projects">
              Explore my experiments <span>↗</span>
            </Link>
            <Link className="text-link" href="/about">
              A little about me <span>→</span>
            </Link>
          </div>
          <span className="hero-foot">
            BASED IN INDIA <span>✳</span> BUILDING WITH CURIOSITY
          </span>
        </div>
        <div className="hero-art">
          <span className="paper-label">FIELD NOTES / 2026</span>
          <Cat />
          <span className="hand hero-note">
            Usually thinking about the next experiment.
          </span>
        </div>
      </section>
      <div className="interests">
        <span className="hand">Currently in my head</span>
        <span>From-scratch ML</span>
        <i>✧</i>
        <span>Transformers</span>
        <i>✧</i>
        <span>Human–AI interaction</span>
        <i>✧</i>
        <span>Responsible AI</span>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="kicker">01 / SELECTED EXPERIMENTS</span>
            <h2>
              From “what if” to working code<span className="ink-dot">.</span>
            </h2>
          </div>
          <Link className="text-link" href="/projects">
            All experiments ↗
          </Link>
        </div>
        <div className="featured-grid">
          <Link href="/projects/emora" className="feature-card blue">
            <span className="card-top">
              01 — AI SYSTEMS <span>↗</span>
            </span>
            <div className="card-sketch">( memory ) ── ♡ ── ( you )</div>
            <h3>Emora</h3>
            <p>
              A local-first AI companion.
              <br />
              Built to remember. Designed with boundaries.
            </p>
            <div className="tags">
              <span>Qwen3-4B</span>
              <span>MLX</span>
              <span>FastAPI</span>
            </div>
            <span className="hand card-note">Can an AI feel more human?</span>
          </Link>
          <Link href="/projects/minigpt" className="feature-card pink">
            <span className="card-top">
              02 — FROM SCRATCH <span>↗</span>
            </span>
            <div className="card-sketch token-sketch">
              <span>text</span> → <span>attention</span> → <span>♡</span>
            </div>
            <h3>MiniGPT V2</h3>
            <p>
              A GPT-style transformer, built from the inside out. Every block
              understood.
            </p>
            <div className="tags">
              <span>PyTorch</span>
              <span>16k BPE</span>
              <span>52,137 pairs</span>
            </div>
            <span className="hand card-note">Small model. Big questions.</span>
          </Link>
          <Link href="/projects/sentinelai" className="feature-card green">
            <span className="card-top">
              03 — AI GOVERNANCE <span>↗</span>
            </span>
            <div className="card-sketch">request → ⬡ → decision</div>
            <h3>SentinelAI</h3>
            <p>
              Language models interpret.
              <br />
              Deterministic rules decide.
            </p>
            <div className="tags">
              <span>Python</span>
              <span>Pydantic</span>
              <span>MLX</span>
            </div>
            <span className="hand card-note">Trust should be traceable.</span>
          </Link>
        </div>
      </section>
      <section className="home-bottom">
        <div className="research-teaser">
          <span className="kicker">02 / QUESTIONS WORTH ASKING</span>
          <h2>
            Not just building.
            <br />
            <span className="hand">Understanding.</span>
          </h2>
          <p>
            From feature scaling to emotionally aware systems, I write down the
            questions, methods, and observations behind the code.
          </p>
          <Link className="text-link" href="/research">
            Inside the research notebook ↗
          </Link>
        </div>
        <div className="sticky yellow">
          <span className="hand">A note in the margin</span>
          <p>
            Building the model is only half the work. Understanding its behavior
            is where the investigation begins.
          </p>
          <span>— my approach to AI</span>
        </div>
        <div className="open-source">
          <span className="kicker">BUILDING IN THE OPEN</span>
          <h3>Better together.</h3>
          <p>
            GSSoC ’26 contributor.
            <br />
            GirlScript Foundation.
          </p>
          <Link className="text-link" href="/github">
            Visit the workbench ↗
          </Link>
          <span className="hand branch-doodle" aria-hidden="true">
            ⌁───┬───❧
            <br />
            　　╰────❧
          </span>
        </div>
      </section>
      <section className="closing">
        <span className="hand">
          A good idea usually starts with a conversation.
        </span>
        <Link href="/contact">Let’s build something ↗</Link>
      </section>
    </div>
  );
}
