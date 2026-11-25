import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-vh-100 cyber-grid-bg d-flex align-items-center justify-content-center p-4">
      <div className="qm-card p-5 text-center" style={{ maxWidth: 460 }}>
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: 64,
            height: 64,
            backgroundColor: 'rgba(6, 182, 212, 0.14)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
          }}
        >
          <Compass size={30} className="text-info" />
        </div>
        <h1 className="h3 text-white fw-bold mb-2">404 — Page Not Found</h1>
        <p className="text-secondary small mb-4">
          The requested route does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-cyber px-4 py-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
