import React, { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import { Icon } from '../components/Icons.jsx';

const tones = { Admin: 'purple', 'Property Owner': 'info', Tenant: 'success', Staff: 'warning' };

export default function UserManagementPage({ users, currentUser, onUpdateUser, onAddUser }) {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Staff', password: 'rentease123', status: 'Active' });

  const filtered = useMemo(() => users.filter((user) => {
    const q = search.trim().toLowerCase();
    return (!q || `${user.name} ${user.email}`.toLowerCase().includes(q)) && (role === 'All' || user.role === role);
  }), [users, search, role]);

  const openEdit = (user) => { setEditing(user); setForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, password: user.password, status: user.status }); };
  const save = (event) => { event.preventDefault(); if (editing) onUpdateUser(editing.id, form); else onAddUser(form); setEditing(null); setAdding(false); };

  return (
    <div className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">1.1 User & Access Management</span><h1>Users & access</h1><p>Administrator tools for role assignment, account status, and role-based access verification.</p></div><button className="primary-button" onClick={() => { setAdding(true); setForm({ name: '', email: '', phone: '', role: 'Staff', password: 'rentease123', status: 'Active' }); }}><Icon name="plus" size={18}/>Add user</button></div>
      <section className="panel">
        <div className="filter-bar"><div className="search-field"><Icon name="search" size={18}/><input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><select value={role} onChange={(e) => setRole(e.target.value)}><option>All</option><option>Admin</option><option>Property Owner</option><option>Tenant</option><option>Staff</option></select></div>
        <div className="table-wrap">
          <table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Phone</th><th>Created</th><th></th></tr></thead><tbody>
            {filtered.map((user) => <tr key={user.id}><td><div className="table-user"><div className="avatar avatar-small">{user.name[0]}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td><Badge tone={tones[user.role]}>{user.role}</Badge></td><td><Badge tone={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge></td><td>{user.phone}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><button className="text-button" onClick={() => openEdit(user)}>Edit</button></td></tr>)}
          </tbody></table>
        </div>
      </section>
      {(editing || adding) && <Modal title={editing ? 'Edit user access' : 'Add user account'} subtitle="Admin and Staff roles are assigned through administrator access." onClose={() => { setEditing(null); setAdding(false); }}>
        <form className="form-stack" onSubmit={save}>
          <div className="form-grid two"><label>Full name<input value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({...form, phone:e.target.value})} required /></label></div>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} required /></label>
          <div className="form-grid two"><label>Role<select value={form.role} onChange={(e) => setForm({...form, role:e.target.value})}><option>Admin</option><option>Property Owner</option><option>Tenant</option><option>Staff</option></select></label><label>Status<select value={form.status} disabled={editing?.id === currentUser.id} onChange={(e) => setForm({...form, status:e.target.value})}><option>Active</option><option>Inactive</option></select></label></div>
          {!editing && <label>Temporary password<input value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} minLength={6} required /></label>}
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => { setEditing(null); setAdding(false); }}>Cancel</button><button className="primary-button" type="submit">Save user</button></div>
        </form>
      </Modal>}
    </div>
  );
}
