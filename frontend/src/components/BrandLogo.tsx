import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const BrandLogo: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none">
      <div
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{
          width: 36,
          height: 36,
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
          boxShadow: '0 0 18px rgba(6, 182, 212, 0.35)',
        }}
      >
        <ShieldCheck size={20} color="#ffffff" />
      </div>
      {!compact && (
        <div className="d-flex flex-column lh-1">
          <span className="fw-bold text-white fs-6 font-display">
            QuizMaster <span style={{ color: '#38bdf8' }}>Pro</span>
          </span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            Assessment Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
