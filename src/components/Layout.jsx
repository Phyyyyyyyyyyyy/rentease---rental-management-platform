import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

const roleMenus = {
  Admin: [
    ['dashboard', 'Dashboard', 'home'],
    ['users', 'Users & Access', 'users'],
    ['properties', 'Properties & Units', 'building'],
    ['browse', 'Browse Properties', 'search'],
    ['applications', 'Applications', 'file'],
    ['profile', 'My Profile', 'user']
  ],
  'Property Owner': [
    ['dashboard', 'Dashboard', 'home'],
    ['properties', 'Properties & Units', 'building'],
    ['browse', 'Browse Properties', 'search'],
    ['applications', 'Applications', 'file'],
    ['profile', 'My Profile', 'user']
  ],
  Tenant: [
    ['dashboard', 'Dashboard', 'home'],
    ['browse', 'Browse Properties', 'search'],
    ['applications', 'My Applications', 'file'],
    ['profile', 'My Profile', 'user']
  ],
  Staff: [
    ['dashboard', 'Dashboard', 'home'],
    ['properties', 'Property Records', 'building'],
    ['browse', 'Browse Properties', 'search'],
    ['applications', 'Applications', 'file'],
    ['profile', 'My Profile', 'user']
  ]
};

export default function Layout({ user, page, onNavigate, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menus = roleMenus[user.role] || roleMenus.Tenant;

  const navigate = (target) => {
    onNavigate(target);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">R</div>
          <div><strong>RentEase</strong><span>Property Management</span></div>
        </div>
        <div className="role-panel">
          <div className="avatar">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <div className="role-copy"><strong>{user.name}</strong><span>{user.role}</span></div>
        </div>
        <nav className="side-nav">
          {menus.map(([id, label, icon]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>
              <Icon name={icon} size={19} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="scope-pill"><span>Build Scope</span><strong>40%</strong></div>
          <button className="logout-button" onClick={onLogout}><Icon name="logout" size={19} />Sign out</button>
        </div>
      </aside>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
          <div className="topbar-title">
            <span>RentEase</span>
            <strong>{menus.find(([id]) => id === page)?.[1] || 'Dashboard'}</strong>
          </div>
          <div className="topbar-user"><div className="avatar avatar-small">{user.name[0]}</div><span>{user.name}</span></div>
        </header>
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
