'use client';
import Link from '@/shims/link';
import { useState } from 'react';
import { skillGroups } from '@/data/studies';
import Cat from '@/components/characters/Cat';
const evidence: Record<string, string> = {
  PyTorch: '/projects/minigpt',
  'Transformer Architecture': '/projects/minigpt',
  'BPE Tokenization': '/projects/minigpt',
  TensorFlow: '/projects/sign-language',
  Keras: '/projects/sign-language',
  CNN: '/projects/sign-language',
  MediaPipe: '/projects/sign-language',
  'scikit-learn': '/projects/student-risk',
  FastAPI: '/projects/customer-intelligence',
  Render: '/projects/student-risk',
  'RFM Analysis': '/projects/customer-intelligence',
  'K-Means Clustering': '/projects/customer-intelligence',
  'Silhouette Score Evaluation': '/projects/customer-intelligence',
  Python: '/projects/logistic-regression',
  NumPy: '/projects/logistic-regression',
  'Multimodal AI': '/projects/emora',
  'Human-AI Interaction': '/projects/emora',
  'Ethical AI Design': '/projects/sentinelai',
};
export default function SkillLab() {
  const [focus, setFocus] = useState('');
  const inspect = (s: string) => {
    setFocus(s);
    window.dispatchEvent(new CustomEvent('notebook-interest', { detail: s }));
  };
  return (
    <>
      <div className="lab-assistant">
        <Cat small />
        <div className="sticky yellow">
          <span className="hand">
            {focus ? `${focus}? Let’s investigate.` : 'Tools I think with.'}
          </span>
          <p>
            {focus && evidence[focus]
              ? 'Open the linked project to see this tool in context.'
              : 'Some are tools I build with; others are areas I study. No made-up proficiency percentages.'}
          </p>
        </div>
      </div>
      <div className="skill-grid">
        {skillGroups.map(([name, ...skills], i) => (
          <section
            className={`skill-station ${['blue', 'pink', 'green', 'yellow', 'lavender'][i % 5]}`}
            key={name}
          >
            <span className="station-number">
              BENCH {String(i + 1).padStart(2, '0')}
            </span>
            <h2>{name}</h2>
            <div className="skill-tags">
              {skills.map((s) =>
                evidence[s] ? (
                  <Link
                    key={s}
                    href={evidence[s]}
                    onMouseEnter={() => inspect(s)}
                    onFocus={() => inspect(s)}
                  >
                    {s} <span>↗</span>
                  </Link>
                ) : (
                  <span key={s}>{s}</span>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
      <p className="small-print">
        Skills and research areas come from the supplied résumé. MediaPipe is
        documented in the sign-language project. Research interests do not imply
        published results in each field.
      </p>
    </>
  );
}
