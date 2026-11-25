import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell cyber-grid-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar
          showSidebarToggle
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-grow-1 p-3 p-md-4">
          <div className="container-fluid px-0" style={{ maxWidth: 1360 }}>
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
