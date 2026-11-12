import React, { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import { Icon } from '../components/Icons.jsx';

const blankProperty = { name: '', address: '', city: 'Cebu City', type: 'Apartment', description: '', amenities: '' };
const blankUnit = { name: '', bedrooms: 1, bathrooms: 1, monthlyRent: '', status: 'Vacant', size: '' };

export default function PropertyManagementPage({ user, properties, users, onAddProperty, onUpdateProperty, onDeleteProperty, onAddUnit, onUpdateUnit, onDeleteUnit }) {
  const canManage = user.role === 'Admin' || user.role === 'Property Owner';
  const visible = user.role === 'Property Owner' ? properties.filter((p) => p.ownerId === user.id) : properties;
  const owners = users.filter((u) => u.role === 'Property Owner' && u.status === 'Active');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(visible[0]?.id || null);
  const [propertyModal, setPropertyModal] = useState(null);
  const [unitModal, setUnitModal] = useState(null);
  const [propertyForm, setPropertyForm] = useState(blankProperty);
  const [unitForm, setUnitForm] = useState(blankUnit);

  const filtered = useMemo(() => visible.filter((p) => `${p.name} ${p.address} ${p.city}`.toLowerCase().includes(search.toLowerCase())), [visible, search]);
  const selected = visible.find((p) => p.id === selectedId) || filtered[0] || visible[0];

  const newProperty = () => { setPropertyForm({ ...blankProperty, ownerId: user.role === 'Property Owner' ? user.id : owners[0]?.id || '' }); setPropertyModal({ mode: 'add' }); };
  const editProperty = () => { if (!selected) return; setPropertyForm({ ...selected, amenities: selected.amenities.join(', ') }); setPropertyModal({ mode: 'edit', id: selected.id }); };
  const saveProperty = (e) => { e.preventDefault(); const payload = { ...propertyForm, amenities: propertyForm.amenities.split(',').map((a) => a.trim()).filter(Boolean) }; if (propertyModal.mode === 'add') { const id = onAddProperty(payload); setSelectedId(id); } else onUpdateProperty(propertyModal.id, payload); setPropertyModal(null); };
  const openAddUnit = () => { setUnitForm(blankUnit); setUnitModal({ mode: 'add', propertyId: selected.id }); };
  const openEditUnit = (unit) => { setUnitForm(unit); setUnitModal({ mode: 'edit', propertyId: selected.id, unitId: unit.id }); };
  const saveUnit = (e) => { e.preventDefault(); const payload = { ...unitForm, bedrooms: Number(unitForm.bedrooms), bathrooms: Number(unitForm.bathrooms), monthlyRent: Number(unitForm.monthlyRent), size: Number(unitForm.size) }; if (unitModal.mode === 'add') onAddUnit(unitModal.propertyId, payload); else onUpdateUnit(unitModal.propertyId, unitModal.unitId, payload); setUnitModal(null); };

  return (
    <div className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">1.2 Property & Unit Management</span><h1>Properties & units</h1><p>{canManage ? 'Add, view, edit, and manage property records and their rental units.' : 'View current property and unit records. Staff access is read-only in this build.'}</p></div>{canManage && <button className="primary-button" onClick={newProperty}><Icon name="plus" size={18}/>Add property</button>}</div>
      <div className="property-workspace">
        <section className="panel property-list-panel">
          <div className="search-field"><Icon name="search" size={18}/><input placeholder="Search property records" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="property-record-list">
            {filtered.map((p) => {
              const vacant = p.units.filter((u) => u.status === 'Vacant').length;
              return <button key={p.id} className={selected?.id === p.id ? 'selected' : ''} onClick={() => setSelectedId(p.id)}><div className="property-letter">{p.name[0]}</div><div><strong>{p.name}</strong><span>{p.address}</span><small>{p.units.length} units · {vacant} vacant</small></div></button>;
            })}
            {!filtered.length && <div className="empty-inline">No property records found.</div>}
          </div>
        </section>
        <section className="panel property-detail-panel">
          {selected ? <>
            <div className="property-detail-header"><div><span className="eyebrow">Property record</span><h2>{selected.name}</h2><p>{selected.address}, {selected.city}</p></div>{canManage && <div className="button-row"><button className="secondary-button compact" onClick={editProperty}><Icon name="edit" size={16}/>Edit</button><button className="danger-button compact" onClick={() => { if (window.confirm('Delete this property and all units?')) onDeleteProperty(selected.id); }}><Icon name="trash" size={16}/>Delete</button></div>}</div>
            <div className="property-summary-grid"><div><span>Type</span><strong>{selected.type}</strong></div><div><span>Total units</span><strong>{selected.units.length}</strong></div><div><span>Vacant</span><strong>{selected.units.filter((u) => u.status === 'Vacant').length}</strong></div><div><span>Occupied</span><strong>{selected.units.filter((u) => u.status === 'Occupied').length}</strong></div></div>
            <p className="property-description">{selected.description || 'No description provided.'}</p>
            <div className="amenity-row">{selected.amenities.map((a) => <Badge key={a} tone="info">{a}</Badge>)}</div>
            <div className="section-divider" />
            <div className="subsection-heading"><div><h3>Rental units</h3><p>Track unit details and current occupancy status.</p></div>{canManage && <button className="secondary-button" onClick={openAddUnit}><Icon name="plus" size={17}/>Add unit</button>}</div>
            <div className="unit-grid">
              {selected.units.map((unit) => <article key={unit.id} className="unit-card"><div className="unit-card-top"><div><strong>{unit.name}</strong><span>{unit.size} m² · {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} bed`} · {unit.bathrooms} bath</span></div><Badge tone={unit.status === 'Vacant' ? 'success' : 'warning'}>{unit.status}</Badge></div><div className="unit-rent"><span>Monthly rent</span><strong>₱{unit.monthlyRent.toLocaleString()}</strong></div>{canManage && <div className="unit-actions"><button onClick={() => openEditUnit(unit)}>Edit unit</button><button onClick={() => { if (window.confirm('Delete this rental unit?')) onDeleteUnit(selected.id, unit.id); }}>Delete</button></div>}</article>)}
              {!selected.units.length && <div className="empty-state small"><h3>No units yet</h3><p>Add the first rental unit to this property.</p></div>}
            </div>
          </> : <div className="empty-state"><Icon name="building" size={38}/><h3>No property selected</h3><p>Create or select a property record.</p></div>}
        </section>
      </div>
      {propertyModal && <Modal title={propertyModal.mode === 'add' ? 'Add property record' : 'Edit property record'} subtitle="1.2.1 Property Listing & Records" onClose={() => setPropertyModal(null)}>
        <form className="form-stack" onSubmit={saveProperty}><div className="form-grid two"><label>Property name<input value={propertyForm.name} onChange={(e) => setPropertyForm({...propertyForm,name:e.target.value})} required /></label><label>Property type<select value={propertyForm.type} onChange={(e) => setPropertyForm({...propertyForm,type:e.target.value})}><option>Apartment</option><option>Condominium</option><option>Townhouse</option><option>House</option><option>Studio</option><option>Boarding House</option></select></label></div>{user.role === 'Admin' && <label>Property owner<select value={propertyForm.ownerId} onChange={(e) => setPropertyForm({...propertyForm,ownerId:e.target.value})} required>{owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>}<div className="form-grid two"><label>Address<input value={propertyForm.address} onChange={(e) => setPropertyForm({...propertyForm,address:e.target.value})} required /></label><label>City<input value={propertyForm.city} onChange={(e) => setPropertyForm({...propertyForm,city:e.target.value})} required /></label></div><label>Description<textarea rows="3" value={propertyForm.description} onChange={(e) => setPropertyForm({...propertyForm,description:e.target.value})} /></label><label>Amenities <span className="label-hint">comma separated</span><input value={propertyForm.amenities} onChange={(e) => setPropertyForm({...propertyForm,amenities:e.target.value})} placeholder="Parking, CCTV, Wi-Fi Ready" /></label><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setPropertyModal(null)}>Cancel</button><button className="primary-button" type="submit">Save property</button></div></form>
      </Modal>}
      {unitModal && <Modal title={unitModal.mode === 'add' ? 'Add rental unit' : 'Edit rental unit'} subtitle="1.2.2 Unit Management" onClose={() => setUnitModal(null)} width="620px"><form className="form-stack" onSubmit={saveUnit}><label>Unit name / number<input value={unitForm.name} onChange={(e) => setUnitForm({...unitForm,name:e.target.value})} required /></label><div className="form-grid three"><label>Bedrooms<input type="number" min="0" value={unitForm.bedrooms} onChange={(e) => setUnitForm({...unitForm,bedrooms:e.target.value})} required /></label><label>Bathrooms<input type="number" min="1" value={unitForm.bathrooms} onChange={(e) => setUnitForm({...unitForm,bathrooms:e.target.value})} required /></label><label>Size (m²)<input type="number" min="1" value={unitForm.size} onChange={(e) => setUnitForm({...unitForm,size:e.target.value})} required /></label></div><div className="form-grid two"><label>Monthly rent (₱)<input type="number" min="0" value={unitForm.monthlyRent} onChange={(e) => setUnitForm({...unitForm,monthlyRent:e.target.value})} required /></label><label>Occupancy status<select value={unitForm.status} onChange={(e) => setUnitForm({...unitForm,status:e.target.value})}><option>Vacant</option><option>Occupied</option></select></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setUnitModal(null)}>Cancel</button><button className="primary-button" type="submit">Save unit</button></div></form></Modal>}
    </div>
  );
}
