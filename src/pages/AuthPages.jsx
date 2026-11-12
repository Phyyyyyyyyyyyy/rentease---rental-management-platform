import React, { useState } from 'react';
import { Icon } from '../components/Icons.jsx';

export function LoginPage({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const result = onLogin(form.email, form.password);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="auth-layout">
      <section className="auth-visual">
        <div className="auth-visual-inner">
          <div className="auth-logo"><span>R</span>RentEase</div>
          <div className="auth-copy">
            <span className="eyebrow light">Streamlined rental management</span>
            <h1>Manage access, properties, and rental units in one place.</h1>
            <p>This partial implementation covers User & Access Management plus Property & Unit Management.</p>
          </div>
          <div className="auth-feature-grid">
            <div><Icon name="shield" /><strong>Role-based access</strong><span>Admin, owner, tenant, and staff portals</span></div>
            <div><Icon name="building" /><strong>Property records</strong><span>Properties, units, occupancy, and applications</span></div>
          </div>
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-heading"><span className="eyebrow">Welcome back</span><h2>Sign in to RentEase</h2><p>Use a registered account to access features allowed for its role.</p></div>
          {error && <div className="form-alert error">{error}</div>}
          <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" required /></label>
          <button className="primary-button full" type="submit">Sign in <Icon name="arrow" size={18} /></button>
          <div className="auth-divider"><span>Demo accounts</span></div>
          <div className="demo-credentials">
            <span>Admin: admin@rentease.local / admin123</span>
            <span>Owner: owner@rentease.local / owner123</span>
            <span>Tenant: tenant@rentease.local / tenant123</span>
            <span>Staff: staff@rentease.local / staff123</span>
          </div>
          <p className="auth-switch">No account yet? <button type="button" onClick={onShowRegister}>Create an account</button></p>
        </form>
      </section>
    </div>
  );
}

export function RegisterPage({ onRegister, onShowLogin }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Tenant', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must contain at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    const result = onRegister(form);
    if (!result.ok) return setError(result.message);
    setSuccess('Account created successfully. You can now sign in.');
    setTimeout(onShowLogin, 900);
  };

  return (
    <div className="auth-layout">
      <section className="auth-visual register-visual">
        <div className="auth-visual-inner">
          <div className="auth-logo"><span>R</span>RentEase</div>
          <div className="auth-copy"><span className="eyebrow light">Account registration</span><h1>Start with the portal that matches your rental role.</h1><p>Public registration is limited to Tenant and Property Owner accounts. Admin and Staff roles are assigned by an administrator.</p></div>
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-card wide-auth-card" onSubmit={submit}>
          <div className="auth-card-heading"><span className="eyebrow">Create account</span><h2>Register for RentEase</h2><p>Complete the required information below.</p></div>
          {error && <div className="form-alert error">{error}</div>}
          {success && <div className="form-alert success">{success}</div>}
          <div className="form-grid two">
            <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Phone number<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
          </div>
          <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Account type<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Tenant</option><option>Property Owner</option></select></label>
          <div className="form-grid two">
            <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
            <label>Confirm password<input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required /></label>
          </div>
          <button className="primary-button full" type="submit">Create account</button>
          <p className="auth-switch">Already registered? <button type="button" onClick={onShowLogin}>Back to sign in</button></p>
        </form>
      </section>
    </div>
  );
}
