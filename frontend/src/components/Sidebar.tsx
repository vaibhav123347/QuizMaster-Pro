import React from 'react';
import {
  BookOpen,
  FileQuestion,
  FolderKanban,
  History,
  LayoutDashboard,
  Layers,
  LogOut,
  Trophy,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/categories', label: 'Categories', icon: Layers },
    { to: '/student/quizzes', label: 'Available Quizzes', icon: BookOpen },
    { to: '/student/history', label: 'Quiz History', icon: History },
    { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/student/profile', label: 'My Profile', icon: UserCheck },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/categories', label: 'Manage Categories', icon: FolderKanban },
    { to: '/admin/quizzes', label: 'Manage Quizzes', icon: BookOpen },
    { to: '/admin/questions', label: 'Manage Questions', icon: FileQuestion },
    { to: '/admin/students', label: 'Manage Students', icon: Users },
    { to: '/admin/profile', label: 'Admin Profile', icon: UserCheck },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10">
          <BrandLogo />
          <button
            type="button"
            className="btn btn-sm text-secondary d-lg-none p-1"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3 flex-grow-1 overflow-auto">
          <div
            className="text-uppercase text-muted fw-semibold px-2 mb-2"
            style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}
          >
            {isAdmin ? 'Admin Console' : 'Student Portal'}
          </div>
          <nav className="d-flex flex-column gap-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-top border-secondary border-opacity-10">
          <div className="qm-surface p-2 px-3 mb-2">
            <div className="small fw-semibold text-white text-truncate">
              {user?.name}
            </div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
              {user?.email}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: '10px' }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
