import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/AdminApi';
import { FaHome, FaUserInjured, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';

function ReceptionistSidebar({ onSelectSection, selected }) {
  const navigate = useNavigate();
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

  const menuItems = [
    { eventKey: 'overview', icon: <FaHome className="me-2" />, label: 'Overview' },
    { eventKey: 'patients', icon: <FaUserInjured className="me-2" />, label: 'Patients' },
    { eventKey: 'appointments', icon: <FaCalendarCheck className="me-2" />, label: 'Appointments' },
  ];

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
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
      <div className="p-3" style={{ flexShrink: 0 }}>
        <h5 className="mb-4">Receptionist Menu</h5>
        <Nav variant="pills" className="flex-column">
          {menuItems.map((item) => (
            <Nav.Item key={item.eventKey} className="mb-2">
              <Nav.Link
                eventKey={item.eventKey}
                active={selected === item.eventKey}
                onClick={() => onSelectSection(item.eventKey)}
                className="d-flex align-items-center"
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Logout Button */}
      <div className="px-3 pb-3 border-top" style={{ marginTop: 'auto', flexShrink: 0 }}>
        <Button 
          variant="outline-danger" 
          className="w-100" 
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
    </div>
    </>
  );
}

export default ReceptionistSidebar;
