import React, { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUserInjured, 
  FaPrescriptionBottleAlt, 
  FaFileMedicalAlt, 
  FaCog,
  FaSignOutAlt,
  FaUserMd,
  FaPills,
  FaFlask,
  FaStethoscope
} from 'react-icons/fa';

const DoctorSidebar = ({ onSelectSection, selected, staffId, staffInfo }) => {
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
        className={`bg-light border-end position-sticky top-0 ${isOpen ? 'show' : ''} doctor-sidebar`} 
        style={{ width: 250, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Close button for mobile */}
        <button 
          className="sidebar-close-btn d-lg-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>
    {/* Doctor Profile Section */}
    <div className="text-center p-3 pb-3 border-bottom" style={{ flexShrink: 0 }}>
      <div className="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
        <FaUserMd className="text-primary" size={20} />
      </div>
      <h6 className="mb-1 small">
        {staffInfo ? `Dr. ${staffInfo.first_name} ${staffInfo.last_name}` : 'Dr. Loading...'}
      </h6>
      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
        {staffInfo ? staffInfo.role_display : 'Loading...'}
      </small>
      {staffId && (
        <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
          ID: {staffId}
        </small>
      )}
    </div>

    {/* Navigation Menu */}
    <div className="p-3" style={{ flex: '1 1 auto', overflow: 'hidden' }}>
      <h6 className="text-muted text-uppercase small mb-2">Main Menu</h6>
      <ul className="nav nav-pills flex-column" style={{ margin: 0, padding: 0 }}>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('dashboard')}
          >
            <FaHome className="me-2" size={14} />
            Dashboard
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'appointments' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('appointments')}
          >
            <FaCalendarAlt className="me-2" size={14} />
            Appointments
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'consultations' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('consultations')}
          >
            <FaStethoscope className="me-2" size={14} />
            Consultations
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'medicine-prescriptions' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('medicine-prescriptions')}
          >
            <FaPills className="me-2" size={14} />
            Medicine Prescriptions
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'lab-prescriptions' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('lab-prescriptions')}
          >
            <FaFlask className="me-2" size={14} />
            Lab Test Prescriptions
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center small ${
              selected === 'medical-records' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('medical-records')}
          >
            <FaFileMedicalAlt className="me-2" size={14} />
            Medical Records
          </button>
        </li>
      </ul>

      {/* Settings Section */}
      <div className="mt-3">
        <h6 className="text-muted text-uppercase small mb-2">Settings</h6>
        <ul className="nav nav-pills flex-column" style={{ margin: 0, padding: 0 }}>
          <li className="nav-item mb-1">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center small ${
                selected === 'settings' ? 'active' : ''
              }`}
              onClick={() => onSelectSection('settings')}
            >
              <FaCog className="me-2" size={14} />
              Settings
            </button>
          </li>
        </ul>
      </div>
    </div>

    {/* Logout Button */}
    <div className="p-3 border-top" style={{ marginTop: 'auto', flexShrink: 0 }}>
      <button
        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        onClick={() => onSelectSection('logout')}
        style={{ fontSize: '0.875rem' }}
      >
        <FaSignOutAlt className="me-2" size={14} />
        Logout
      </button>
    </div>
  </div>
    </>
  );
};

export default DoctorSidebar;
