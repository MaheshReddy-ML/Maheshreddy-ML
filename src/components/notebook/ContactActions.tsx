'use client';
import { useState } from 'react';
export default function ContactActions() {
  const [status, setStatus] = useState('');
  return (
    <>
      <div className="actions">
        <a className="button primary" href="mailto:maheshreddygit@gmail.com">
          Start a conversation ↗
        </a>
        <button
          className="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText('maheshreddygit@gmail.com');
              setStatus('Email copied.');
            } catch {
              setStatus('Copy this address: maheshreddygit@gmail.com');
            }
          }}
        >
          Copy email
        </button>
      </div>
      <output className="copy-status">{status}</output>
    </>
  );
}
