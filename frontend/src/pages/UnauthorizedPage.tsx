import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const homePath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'student'
      ? '/student/dashboard'
      : '/';

  return (
    <div className="min-vh-100 cyber-grid-bg d-flex align-items-center justify-content-center p-4">
      <div className="qm-card p-5 text-center" style={{ maxWidth: 460 }}>
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: 64,
            height: 64,
            backgroundColor: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <ShieldAlert size={30} className="text-danger" />
        </div>
        <h1 className="h3 text-white fw-bold mb-2">403 — Access Denied</h1>
        <p className="text-secondary small mb-4">
          Your current role does not have authorization to access this protected area.
        </p>
        <Link to={homePath} className="btn btn-cyber px-4 py-2">
          Return to Authorized Portal
        </Link>
      </div>
    </div>
  );
};
