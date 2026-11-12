import React from 'react';
import Badge from '../components/Badge.jsx';
import { Icon } from '../components/Icons.jsx';

function Stat({ icon, label, value, detail }) {
  return <div className="stat-card"><div className="stat-icon"><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

export default function DashboardPage({ user, users, properties, applications, onNavigate }) {
  const visibleProperties = user.role === 'Property Owner' ? properties.filter((p) => p.ownerId === user.id) : properties;
  const units = visibleProperties.flatMap((p) => p.units);
  const vacant = units.filter((u) => u.status === 'Vacant').length;
  const occupied = units.filter((u) => u.status === 'Occupied').length;
  const relevantApps = user.role === 'Tenant'
    ? applications.filter((a) => a.tenantId === user.id)
    : applications.filter((a) => visibleProperties.some((p) => p.id === a.propertyId));

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div><span className="eyebrow light">RentEase dashboard</span><h1>Good day, {user.name.split(' ')[0]}.</h1><p>Your current portal is configured for <strong>{user.role}</strong> access.</p></div>
        <div className="hero-scope"><span>Current development scope</span><strong>1.1 + 1.2</strong><small>User/Access + Property/Unit Management</small></div>
      </section>

      <section className="stats-grid">
        {user.role === 'Admin' && <Stat icon="users" label="Registered users" value={users.length} detail={`${users.filter((u) => u.status === 'Active').length} active accounts`} />}
        <Stat icon="building" label="Properties" value={visibleProperties.length} detail="property records" />
        <Stat icon="home" label="Vacant units" value={vacant} detail={`${occupied} occupied units`} />
        <Stat icon="file" label={user.role === 'Tenant' ? 'My applications' : 'Applications'} value={relevantApps.length} detail={`${relevantApps.filter((a) => a.status === 'Pending').length} pending`} />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading"><div><span className="eyebrow">Quick actions</span><h2>Continue your work</h2></div></div>
          <div className="quick-actions">
            {(user.role === 'Admin' || user.role === 'Property Owner') && <button onClick={() => onNavigate('properties')}><Icon name="building" /><div><strong>Manage properties</strong><span>Add properties, units, and occupancy information.</span></div><Icon name="chevron" /></button>}
            {user.role === 'Tenant' && <button onClick={() => onNavigate('browse')}><Icon name="search" /><div><strong>Find a rental</strong><span>Browse available properties and submit an application.</span></div><Icon name="chevron" /></button>}
            {user.role === 'Staff' && <button onClick={() => onNavigate('properties')}><Icon name="building" /><div><strong>View property records</strong><span>Review current property and unit information.</span></div><Icon name="chevron" /></button>}
            <button onClick={() => onNavigate('applications')}><Icon name="file" /><div><strong>{user.role === 'Tenant' ? 'Track applications' : 'Review applications'}</strong><span>See submitted applications and current decisions.</span></div><Icon name="chevron" /></button>
            <button onClick={() => onNavigate('profile')}><Icon name="user" /><div><strong>Update profile</strong><span>Keep account and contact information current.</span></div><Icon name="chevron" /></button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading"><div><span className="eyebrow">Module status</span><h2>40% implementation</h2></div></div>
          <div className="module-list">
            <div><span className="module-number">1.1</span><div><strong>User & Access Management</strong><span>Registration, login, roles, profile</span></div><Badge tone="success">Implemented</Badge></div>
            <div><span className="module-number">1.2</span><div><strong>Property & Unit Management</strong><span>Properties, units, search, applications</span></div><Badge tone="success">Implemented</Badge></div>
            <div className="muted-module"><span className="module-number">1.3+</span><div><strong>Remaining RentEase scope</strong><span>Lease/payment, tenant maintenance, integration</span></div><Badge>Not included</Badge></div>
          </div>
        </div>
      </section>
    </div>
  );
}
