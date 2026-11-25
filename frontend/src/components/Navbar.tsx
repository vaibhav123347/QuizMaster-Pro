import React from 'react';
import { LogOut, Menu, Shield, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  showSidebarToggle = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky-top px-3 px-md-4 py-3 border-bottom"
      style={{
        backgroundColor: 'rgba(8, 13, 24, 0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--qm-border)',
        zIndex: 1020,
      }}
    >
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          {showSidebarToggle && (
            <button
              type="button"
              className="btn btn-cyber-outline btn-sm d-lg-none p-2"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation"
            >
              <Menu size={18} />
            </button>
          )}
          <Link to="/" className="text-decoration-none d-lg-none">
            <BrandLogo />
          </Link>
          {!showSidebarToggle && (
            <Link to="/" className="text-decoration-none d-none d-lg-inline-flex">
              <BrandLogo />
            </Link>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          {isAuthenticated && user ? (
            <>
              <div className="d-none sm-flex d-sm-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-secondary border-opacity-25 bg-dark bg-opacity-50">
                <Shield size={14} className="text-info" />
                <span className="small text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>
                  {user.role}
                </span>
              </div>
              <Link
                to={user.role === 'admin' ? '/admin/profile' : '/student/profile'}
                className="btn btn-cyber-outline btn-sm d-inline-flex align-items-center gap-2 px-3"
              >
                <UserIcon size={15} className="text-info" />
                <span className="d-none d-sm-inline">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 px-3"
                style={{ borderRadius: '10px' }}
              >
                <LogOut size={15} />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-cyber-outline btn-sm px-3 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-cyber btn-sm px-3 py-2">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
