'use client';
import { useState } from 'react';
import type { Step } from '@/data/studies';
export default function Architecture({
  steps,
  governance = false,
}: {
  steps: Step[];
  governance?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <section className="architecture" aria-label="Interactive architecture">
      <div className="architecture-top">
        <span className="hand">Follow the idea through the system</span>
        <span className="small-print">Select any block to open a note</span>
      </div>
      {steps.some((s) => s.name === 'SwiGLU') && (
        <p className="transformer-note hand">
          Inside each transformer block: RMSNorm → causal self-attention →
          RMSNorm → SwiGLU. Repeat the block, then project to the vocabulary.
        </p>
      )}
      <div className={governance ? 'flow governance' : 'flow'}>
        {steps.map((s, i) => (
          <button
            key={s.name}
            className={`flow-node ${i === selected ? 'selected' : ''} ${governance && i >= 3 && i <= 8 ? 'expert' : ''}`}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            aria-controls="architecture-note"
          >
            <span className="node-number">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{s.name}</span>
            <span aria-hidden="true" className="flow-arrow">
              ↓
            </span>
          </button>
        ))}
      </div>
      <div
        id="architecture-note"
        className="architecture-note"
        aria-live="polite"
      >
        <span className="hand">
          {steps[selected].name === 'SwiGLU'
            ? 'Why this activation?'
            : 'A closer look ↴'}
        </span>
        <h3>{steps[selected].name}</h3>
        <p>{steps[selected].note}</p>
      </div>
      <p className="small-print">
        Architecture walkthrough · explanatory diagram, not live model inference
      </p>
    </section>
  );
}
