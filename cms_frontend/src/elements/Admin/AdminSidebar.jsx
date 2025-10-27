import React, { useState, useEffect } from 'react';
import { AuthService } from '../../service/AdminApi';

const AdminSidebar = ({ onSelectSection, selected }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && event.target.classList.contains('sidebar-overlay')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        className="mobile-menu-toggle d-lg-none"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`bg-light border-end position-sticky top-0 ${isOpen ? 'show' : ''}`} 
        style={{ width: 220, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Close button for mobile */}
        <button 
          className="sidebar-close-btn d-lg-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>
      <div className="px-3 pt-3" style={{ flexShrink: 0 }}>
        <h5 className="mb-4">Admin Menu</h5>
        <ul className="nav nav-pills flex-column" style={{ margin: 0, padding: 0 }}>
          <li className="nav-item mb-2">
            <button
              className={`nav-link ${selected === 'view' ? 'active' : ''}`}
              onClick={() => onSelectSection('view')}
            >
              View Staff
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link ${selected === 'add' ? 'active' : ''}`}
              onClick={() => onSelectSection('add')}
            >
              Add Staff
            </button>
          </li>
          <li className="nav-item mb-2">
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
      <div className="pt-3 px-3 pb-3 border-top" style={{ marginTop: 'auto', flexShrink: 0 }}>
        <button 
          className="btn btn-outline-danger w-100"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default AdminSidebar;
