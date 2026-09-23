import Link from '@/shims/link';
export default function Journey() {
  return (
    <ol className="timeline">
      <li>
        <span className="timeline-year">2025</span>
        <div>
          <span className="kicker">
            FOUNDATIONS / UNDERSTANDING THE MECHANICS
          </span>
          <h2>Start with the gradient.</h2>
          <p>
            Implemented logistic regression and gradient descent from scratch in
            Python/NumPy. Investigated min-max normalization and standardization
            on the Breast Cancer Wisconsin dataset.
          </p>
          <p className="timeline-reflection">
            The investigation: how feature scaling affects convergence.
          </p>
          <Link href="/projects/logistic-regression" className="text-link">
            Read the research notebook ↗
          </Link>
          <div className="timeline-side">
            CS50: Introduction to Programming with Python
            <br />
            <span>Harvard University · edX · 2025</span>
          </div>
        </div>
      </li>
      <li>
        <span className="timeline-year">2026</span>
        <div>
          <span className="kicker">ARCHITECTURES / FROM MODELS TO SYSTEMS</span>
          <h2>Build what you want to understand.</h2>
          <p>
            A GPT-style transformer with RMSNorm and SwiGLU. A CNN and
            SignFormer for gesture recognition. Customer segmentation with RFM,
            K-Means, and learned embeddings. A student-risk model deployed
            through an API.
          </p>
          <p className="timeline-reflection">
            The progression: architecture, evaluation, and delivery in the same
            project.
          </p>
          <Link href="/projects" className="text-link">
            Open the experiments ↗
          </Link>
        </div>
      </li>
      <li>
        <span className="timeline-year">MAY ’26</span>
        <div>
          <span className="kicker">OPEN SOURCE / GIRLSCRIPT FOUNDATION</span>
          <h2>Make useful changes, together.</h2>
          <p>
            GSSoC’26 contributor, May 2026–present in the résumé. Merged pull
            requests across 3+ production ML repositories, working on
            preprocessing, training pipelines, and classification systems.
          </p>
          <p className="timeline-reflection">
            The work: code review, issue tracking, and collaborative
            engineering.
          </p>
          <div className="tags">
            <span>GitHub Pull Shark recognition</span>
          </div>
          <Link href="/github" className="text-link">
            Into the open workbench ↗
          </Link>
        </div>
      </li>
      <li>
        <span className="timeline-year">2026</span>
        <div>
          <span className="kicker">RESEARCH / RESPONSIBLE AI SYSTEMS</span>
          <h2>Ask what the system should do.</h2>
          <p>
            Emora explores local-first, emotion-aware interaction with selective
            memory and bounded avatar behavior. SentinelAI separates language
            understanding from deterministic financial governance.
          </p>
          <p className="timeline-reflection">
            The design question: where should an AI system’s authority end?
          </p>
          <Link href="/research" className="text-link">
            Explore the research ↗
          </Link>
        </div>
      </li>
      <li className="future">
        <span className="timeline-year">MAY ’27</span>
        <div>
          <span className="kicker">EXPECTED / THE NEXT CHAPTER</span>
          <h2>Keep the notebook open.</h2>
          <p>
            Expected graduation: B.Tech in Computer Science (Artificial
            Intelligence & Data Science), Parul University, Gujarat, India.
          </p>
          <span className="hand">
            Not a finished story. A continuing investigation.
          </span>
        </div>
      </li>
    </ol>
  );
}
