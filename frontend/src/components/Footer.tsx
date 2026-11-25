import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-auto py-3 px-4 border-top"
      style={{ borderColor: 'var(--qm-border)', backgroundColor: '#070b14' }}
    >
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-secondary small">
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck size={15} className="text-info" />
          <span>QuizMaster Pro — Intelligent Full-Stack Assessment Platform</span>
        </div>
        <span className="text-muted" style={{ fontSize: '0.78rem' }}>
          Server-Verified Grading &amp; Role-Based Security
        </span>
      </div>
    </footer>
  );
};
