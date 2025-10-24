import React from 'react';
import { AuthService } from '../../service/AdminApi';

const AdminSidebar = ({ onSelectSection, selected }) => {
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="bg-light border-end vh-100 p-3 d-flex flex-column" style={{ width: 220 }}>
      <div className="flex-grow-1">
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
      
      {/* Logout Button */}
      <div className="mt-auto pt-3 border-top">
        <button 
          className="btn btn-outline-danger w-100"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
