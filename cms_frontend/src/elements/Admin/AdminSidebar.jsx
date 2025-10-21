import React from 'react';

const AdminSidebar = ({ onSelectSection, selected }) => (
  <div className="bg-light border-end vh-100 p-3" style={{ width: 220 }}>
    <h5 className="mb-4">Admin Menu</h5>
    <ul className="nav nav-pills flex-column">
      <li className="nav-item">
        <button
          className={`nav-link ${selected === 'view' ? 'active' : ''}`}
          onClick={() => onSelectSection('view')}
        >
          View Staff
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${selected === 'add' ? 'active' : ''}`}
          onClick={() => onSelectSection('add')}
        >
          Add Staff
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${selected === 'update' ? 'active' : ''}`}
          onClick={() => onSelectSection('update')}
        >
          Update Staff
        </button>
      </li>
    </ul>
  </div>
);

export default AdminSidebar;
