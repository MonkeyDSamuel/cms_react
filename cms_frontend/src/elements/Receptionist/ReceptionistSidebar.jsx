import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/AdminApi';
import { FaHome, FaUserInjured, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';

function ReceptionistSidebar({ onSelectSection, selected }) {
  const navigate = useNavigate();

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
    <div className="bg-light border-end vh-100 p-3 d-flex flex-column" style={{ width: 250 }}>
      <div className="flex-grow-1">
        <h5 className="mb-4">Receptionist Menu</h5>
        <Nav variant="pills" className="flex-column">
          {menuItems.map((item) => (
            <Nav.Item key={item.eventKey}>
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
      <div className="mt-auto pt-3 border-top">
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
  );
}

export default ReceptionistSidebar;
