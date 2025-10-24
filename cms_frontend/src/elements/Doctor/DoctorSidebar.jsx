import React from 'react';
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

const DoctorSidebar = ({ onSelectSection, selected, staffId, staffInfo }) => (
  <div className="bg-light border-end vh-100 p-3" style={{ width: 250 }}>
    {/* Doctor Profile Section */}
    <div className="text-center mb-4 pb-3 border-bottom">
      <div className="avatar-lg bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px' }}>
        <FaUserMd className="text-primary" size={24} />
      </div>
      <h6 className="mb-1">
        {staffInfo ? `Dr. ${staffInfo.first_name} ${staffInfo.last_name}` : 'Dr. Loading...'}
      </h6>
      <small className="text-muted">
        {staffInfo ? staffInfo.role_display : 'Loading...'}
      </small>
      {staffId && (
        <small className="text-muted d-block mt-1">
          ID: {staffId}
        </small>
      )}
    </div>

    {/* Navigation Menu */}
    <div className="mb-4">
      <h6 className="text-muted text-uppercase small mb-3">Main Menu</h6>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('dashboard')}
          >
            <FaHome className="me-3" size={16} />
            Dashboard
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'appointments' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('appointments')}
          >
            <FaCalendarAlt className="me-3" size={16} />
            Appointments
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'consultations' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('consultations')}
          >
            <FaStethoscope className="me-3" size={16} />
            Consultations
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'medicine-prescriptions' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('medicine-prescriptions')}
          >
            <FaPills className="me-3" size={16} />
            Medicine Prescriptions
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'lab-prescriptions' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('lab-prescriptions')}
          >
            <FaFlask className="me-3" size={16} />
            Lab Test Prescriptions
          </button>
        </li>
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'medical-records' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('medical-records')}
          >
            <FaFileMedicalAlt className="me-3" size={16} />
            Medical Records
          </button>
        </li>
      </ul>
    </div>

    {/* Settings Section */}
    <div className="mb-4">
      <h6 className="text-muted text-uppercase small mb-3">Settings</h6>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-1">
          <button
            className={`nav-link w-100 text-start d-flex align-items-center ${
              selected === 'settings' ? 'active' : ''
            }`}
            onClick={() => onSelectSection('settings')}
          >
            <FaCog className="me-3" size={16} />
            Settings
          </button>
        </li>
      </ul>
    </div>

    {/* Logout Button */}
    <div className="mt-auto pt-3 border-top">
      <button
        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        onClick={() => onSelectSection('logout')}
      >
        <FaSignOutAlt className="me-2" size={16} />
        Logout
      </button>
    </div>
  </div>
);

export default DoctorSidebar;
