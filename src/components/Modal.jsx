import React from 'react';
import { Icon } from './Icons.jsx';

export default function Modal({ title, subtitle, onClose, children, width = '680px' }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" style={{ maxWidth: width }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal"><Icon name="close" /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
