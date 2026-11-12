import React, { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import { Icon } from '../components/Icons.jsx';

const tones = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

export default function ApplicationsPage({ user, applications, properties, users, onUpdateStatus }) {
  const [status, setStatus] = useState('All');
  const ownerPropertyIds = properties.filter((p) => p.ownerId === user.id).map((p) => p.id);
  const relevant = useMemo(() => applications.filter((a) => {
    const roleMatch = user.role === 'Tenant' ? a.tenantId === user.id : user.role === 'Property Owner' ? ownerPropertyIds.includes(a.propertyId) : true;
    return roleMatch && (status === 'All' || a.status === status);
  }), [applications, user, status, ownerPropertyIds.join('|')]);
  const canDecide = user.role === 'Property Owner' || user.role === 'Admin';

  const details = (app) => {
    const property = properties.find((p) => p.id === app.propertyId);
    const unit = property?.units.find((u) => u.id === app.unitId);
    const tenant = users.find((u) => u.id === app.tenantId);
    return { property, unit, tenant };
  };

  return (
    <div className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">1.2.4 Rental Application Handling</span><h1>{user.role === 'Tenant' ? 'My rental applications' : 'Rental applications'}</h1><p>{user.role === 'Tenant' ? 'Track the current status of applications you submitted.' : canDecide ? 'Review tenant applications and update their status.' : 'View current rental application records.'}</p></div></div>
      <section className="panel">
        <div className="filter-bar"><div className="application-summary"><span><strong>{relevant.length}</strong> records shown</span></div><select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
        <div className="application-list">
          {relevant.map((app) => { const { property, unit, tenant } = details(app); return <article className="application-card" key={app.id}><div className="application-icon"><Icon name="file" /></div><div className="application-main"><div className="application-title"><div><strong>{property?.name || 'Property unavailable'} · {unit?.name || 'Unit unavailable'}</strong><span>{user.role === 'Tenant' ? `Submitted ${new Date(app.createdAt).toLocaleDateString()}` : `${tenant?.name || 'Unknown tenant'} · ${tenant?.email || ''}`}</span></div><Badge tone={tones[app.status]}>{app.status}</Badge></div><p>{app.message}</p><div className="application-meta"><span>Monthly rent: <strong>{unit ? `₱${unit.monthlyRent.toLocaleString()}` : '—'}</strong></span><span>Occupancy: <strong>{unit?.status || '—'}</strong></span></div>{canDecide && app.status === 'Pending' && <div className="decision-row"><button className="secondary-button" onClick={() => onUpdateStatus(app.id, 'Rejected')}>Reject</button><button className="primary-button" onClick={() => onUpdateStatus(app.id, 'Approved')}><Icon name="check" size={17}/>Approve</button></div>}</div></article>; })}
          {!relevant.length && <div className="empty-state"><Icon name="file" size={38}/><h3>No applications found</h3><p>There are no application records matching this filter.</p></div>}
        </div>
      </section>
    </div>
  );
}
