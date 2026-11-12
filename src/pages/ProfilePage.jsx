import React, { useEffect, useState } from 'react';
import Badge from '../components/Badge.jsx';

export default function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({ name: user.name, phone: user.phone, email: user.email });
  const [notice, setNotice] = useState('');
  useEffect(() => setForm({ name: user.name, phone: user.phone, email: user.email }), [user]);

  const submit = (e) => {
    e.preventDefault();
    const result = onUpdate(form);
    setNotice(result.message);
  };

  return (
    <div className="page-stack narrow-page">
      <div className="page-heading"><div><span className="eyebrow">1.1.4 User Profile Management</span><h1>My profile</h1><p>View and update the information associated with your RentEase account.</p></div><Badge tone="success">{user.status}</Badge></div>
      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-avatar-large">{user.name.split(' ').map((n) => n[0]).slice(0,2).join('')}</div>
          <h2>{user.name}</h2><p>{user.email}</p>
          <div className="profile-meta"><span>Assigned role</span><strong>{user.role}</strong><span>Account status</span><strong>{user.status}</strong></div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">Profile information</span><h2>Edit account details</h2></div></div>
          {notice && <div className="form-alert success">{notice}</div>}
          <form onSubmit={submit} className="form-stack">
            <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label>Phone number<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
            <div className="form-actions"><button className="primary-button" type="submit">Save profile changes</button></div>
          </form>
        </section>
      </div>
    </div>
  );
}
