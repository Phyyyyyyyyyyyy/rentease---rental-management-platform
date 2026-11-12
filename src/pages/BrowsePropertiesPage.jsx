import React, { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import { Icon } from '../components/Icons.jsx';

export default function BrowsePropertiesPage({ user, properties, applications, onApply }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [maxRent, setMaxRent] = useState('');
  const [selected, setSelected] = useState(null);
  const [appUnit, setAppUnit] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');

  const cards = useMemo(() => properties.map((property) => ({ ...property, vacantUnits: property.units.filter((u) => u.status === 'Vacant') })).filter((p) => {
    const q = query.toLowerCase();
    const matchesText = !q || `${p.name} ${p.address} ${p.city} ${p.type}`.toLowerCase().includes(q);
    const matchesType = type === 'All' || p.type === type;
    const matchesRent = !maxRent || p.vacantUnits.some((u) => u.monthlyRent <= Number(maxRent));
    return matchesText && matchesType && matchesRent && p.vacantUnits.length > 0;
  }), [properties, query, type, maxRent]);

  const open = (property) => { setSelected(property); setAppUnit(property.units.find((u) => u.status === 'Vacant')?.id || ''); setMessage(''); setNotice(''); };
  const submit = (e) => { e.preventDefault(); const result = onApply(selected.id, appUnit, message); setNotice(result.message); };

  return (
    <div className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">1.2.3 Browse & Search Properties</span><h1>Find available rentals</h1><p>Search current property listings and inspect vacant rental units.</p></div></div>
      <section className="browse-hero"><div><h2>Find a place that fits your needs.</h2><p>Only properties with currently vacant units are shown.</p></div><div className="browse-search"><div className="search-field large"><Icon name="search" size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by property, address, or city" /></div><select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Apartment</option><option>Condominium</option><option>Townhouse</option><option>House</option><option>Studio</option><option>Boarding House</option></select><input className="rent-filter" type="number" min="0" placeholder="Max rent" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} /></div></section>
      <div className="listing-grid">
        {cards.map((property, index) => {
          const minRent = Math.min(...property.vacantUnits.map((u) => u.monthlyRent));
          return <article className="listing-card" key={property.id}><div className={`listing-visual visual-${index % 3}`}><span>{property.type}</span><div>{property.name.split(' ').map((w) => w[0]).slice(0,2).join('')}</div></div><div className="listing-content"><div><h3>{property.name}</h3><p>{property.address}, {property.city}</p></div><div className="listing-facts"><span><strong>{property.vacantUnits.length}</strong> vacant</span><span><strong>₱{minRent.toLocaleString()}</strong> from / month</span></div><p className="listing-desc">{property.description}</p><div className="amenity-row">{property.amenities.slice(0,3).map((a) => <Badge key={a}>{a}</Badge>)}</div><button className="primary-button full" onClick={() => open(property)}>View available units</button></div></article>;
        })}
        {!cards.length && <div className="empty-state listing-empty"><Icon name="search" size={38}/><h3>No matching vacant properties</h3><p>Try changing your search or rent filters.</p></div>}
      </div>
      {selected && <Modal title={selected.name} subtitle={`${selected.address}, ${selected.city}`} onClose={() => setSelected(null)} width="760px">
        <div className="detail-unit-list">{selected.units.filter((u) => u.status === 'Vacant').map((unit) => <label key={unit.id} className={`select-unit-card ${appUnit === unit.id ? 'selected' : ''}`}><input type="radio" name="unit" value={unit.id} checked={appUnit === unit.id} onChange={() => setAppUnit(unit.id)} /><div><strong>{unit.name}</strong><span>{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} bedroom`} · {unit.bathrooms} bath · {unit.size} m²</span></div><strong>₱{unit.monthlyRent.toLocaleString()}<small>/mo</small></strong></label>)}</div>
        {user.role === 'Tenant' ? <form className="application-form" onSubmit={submit}><div className="section-divider"/><h3>Submit rental application</h3><p>Your RentEase profile will be attached to this application.</p>{notice && <div className={`form-alert ${notice.includes('already') ? 'error' : 'success'}`}>{notice}</div>}<label>Message to property owner<textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Introduce yourself or add relevant rental information." required /></label><button className="primary-button" type="submit" disabled={!appUnit}>Submit application</button></form> : <div className="form-alert info">Sign in as a Tenant account to submit a rental application. Your current role is {user.role}.</div>}
      </Modal>}
    </div>
  );
}
