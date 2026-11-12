import React, { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import { LoginPage, RegisterPage } from './pages/AuthPages.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import PropertyManagementPage from './pages/PropertyManagementPage.jsx';
import BrowsePropertiesPage from './pages/BrowsePropertiesPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import { seedApplications, seedProperties, seedUsers } from './data/seed.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const load = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : clone(fallback); }
  catch { return clone(fallback); }
};
const id = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const pageAccess = {
  dashboard: ['Admin', 'Property Owner', 'Tenant', 'Staff'],
  users: ['Admin'],
  properties: ['Admin', 'Property Owner', 'Staff'],
  browse: ['Admin', 'Property Owner', 'Tenant', 'Staff'],
  applications: ['Admin', 'Property Owner', 'Tenant', 'Staff'],
  profile: ['Admin', 'Property Owner', 'Tenant', 'Staff']
};

export default function App() {
  const [users, setUsers] = useState(() => load('rentease.users', seedUsers));
  const [properties, setProperties] = useState(() => load('rentease.properties', seedProperties));
  const [applications, setApplications] = useState(() => load('rentease.applications', seedApplications));
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('rentease.session'));
  const [authView, setAuthView] = useState('login');
  const [page, setPage] = useState('dashboard');

  useEffect(() => localStorage.setItem('rentease.users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('rentease.properties', JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem('rentease.applications', JSON.stringify(applications)), [applications]);

  const currentUser = useMemo(() => users.find((u) => u.id === sessionId && u.status === 'Active') || null, [users, sessionId]);
  useEffect(() => { if (sessionId && !currentUser) { localStorage.removeItem('rentease.session'); setSessionId(null); } }, [sessionId, currentUser]);
  useEffect(() => { if (currentUser && !pageAccess[page]?.includes(currentUser.role)) setPage('dashboard'); }, [currentUser, page]);

  const login = (email, password) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) return { ok: false, message: 'Incorrect email or password.' };
    if (user.status !== 'Active') return { ok: false, message: 'This account is inactive. Contact an administrator.' };
    localStorage.setItem('rentease.session', user.id); setSessionId(user.id); setPage('dashboard'); return { ok: true };
  };
  const logout = () => { localStorage.removeItem('rentease.session'); setSessionId(null); setAuthView('login'); };
  const register = (form) => {
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) return { ok: false, message: 'An account with this email already exists.' };
    setUsers((prev) => [...prev, { id: id('u'), name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), role: form.role, password: form.password, status: 'Active', createdAt: new Date().toISOString() }]); return { ok: true };
  };
  const navigate = (target) => { if (currentUser && pageAccess[target]?.includes(currentUser.role)) setPage(target); else setPage('dashboard'); };
  const updateProfile = (form) => {
    if (users.some((u) => u.id !== currentUser.id && u.email.toLowerCase() === form.email.trim().toLowerCase())) return { ok: false, message: 'That email is already used by another account.' };
    setUsers((prev) => prev.map((u) => u.id === currentUser.id ? { ...u, ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() } : u)); return { ok: true, message: 'Profile information updated.' };
  };
  const updateUser = (userId, form) => setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), role: form.role, status: form.status } : u));
  const addUser = (form) => { if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) return; setUsers((prev) => [...prev, { id: id('u'), ...form, createdAt: new Date().toISOString() }]); };
  const addProperty = (payload) => { const newId = id('p'); setProperties((prev) => [...prev, { id: newId, ...payload, ownerId: payload.ownerId || currentUser.id, units: [] }]); return newId; };
  const updateProperty = (propertyId, payload) => setProperties((prev) => prev.map((p) => p.id === propertyId ? { ...p, ...payload, units: p.units } : p));
  const deleteProperty = (propertyId) => { setProperties((prev) => prev.filter((p) => p.id !== propertyId)); setApplications((prev) => prev.filter((a) => a.propertyId !== propertyId)); };
  const addUnit = (propertyId, unit) => setProperties((prev) => prev.map((p) => p.id === propertyId ? { ...p, units: [...p.units, { id: id('un'), ...unit }] } : p));
  const updateUnit = (propertyId, unitId, unit) => setProperties((prev) => prev.map((p) => p.id === propertyId ? { ...p, units: p.units.map((u) => u.id === unitId ? { ...u, ...unit } : u) } : p));
  const deleteUnit = (propertyId, unitId) => { setProperties((prev) => prev.map((p) => p.id === propertyId ? { ...p, units: p.units.filter((u) => u.id !== unitId) } : p)); setApplications((prev) => prev.filter((a) => a.unitId !== unitId)); };
  const apply = (propertyId, unitId, message) => {
    if (applications.some((a) => a.tenantId === currentUser.id && a.unitId === unitId && a.status === 'Pending')) return { ok: false, message: 'You already have a pending application for this unit.' };
    setApplications((prev) => [...prev, { id: id('a'), propertyId, unitId, tenantId: currentUser.id, message: message.trim(), status: 'Pending', createdAt: new Date().toISOString() }]); return { ok: true, message: 'Application submitted successfully.' };
  };
  const updateApplicationStatus = (applicationId, status) => {
    const app = applications.find((a) => a.id === applicationId); if (!app) return;
    setApplications((prev) => prev.map((a) => a.id === applicationId ? { ...a, status } : (status === 'Approved' && a.unitId === app.unitId && a.id !== applicationId && a.status === 'Pending' ? { ...a, status: 'Rejected' } : a)));
    if (status === 'Approved') setProperties((prev) => prev.map((p) => p.id === app.propertyId ? { ...p, units: p.units.map((u) => u.id === app.unitId ? { ...u, status: 'Occupied' } : u) } : p));
  };

  if (!currentUser) return authView === 'register' ? <RegisterPage onRegister={register} onShowLogin={() => setAuthView('login')} /> : <LoginPage onLogin={login} onShowRegister={() => setAuthView('register')} />;

  let content;
  if (page === 'users') content = <UserManagementPage users={users} currentUser={currentUser} onUpdateUser={updateUser} onAddUser={addUser} />;
  else if (page === 'properties') content = <PropertyManagementPage user={currentUser} users={users} properties={properties} onAddProperty={addProperty} onUpdateProperty={updateProperty} onDeleteProperty={deleteProperty} onAddUnit={addUnit} onUpdateUnit={updateUnit} onDeleteUnit={deleteUnit} />;
  else if (page === 'browse') content = <BrowsePropertiesPage user={currentUser} properties={properties} applications={applications} onApply={apply} />;
  else if (page === 'applications') content = <ApplicationsPage user={currentUser} applications={applications} properties={properties} users={users} onUpdateStatus={updateApplicationStatus} />;
  else if (page === 'profile') content = <ProfilePage user={currentUser} onUpdate={updateProfile} />;
  else content = <DashboardPage user={currentUser} users={users} properties={properties} applications={applications} onNavigate={navigate} />;

  return <Layout user={currentUser} page={page} onNavigate={navigate} onLogout={logout}>{content}</Layout>;
}
