import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/AdminApi';
import DoctorSidebar from '../../elements/Doctor/DoctorSidebar';
import DoctorDashboard from '../../components/Doctor/DoctorDashboard';
import AppointmentsSection from '../../components/Doctor/AppointmentsSection';
import ConsultationsSection from '../../components/Doctor/ConsultationsSection';
import MedicinePrescriptionsSection from '../../components/Doctor/MedicinePrescriptionsSection';
import LabTestPrescriptionsSection from '../../components/Doctor/LabTestPrescriptionsSection';
import MedicalRecordsSection from '../../components/Doctor/MedicalRecordsSection';
import SettingsSection from '../../components/Doctor/SettingsSection';

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [staffId, setStaffId] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);

  useEffect(() => {
    // Get staff information from localStorage
    const storedStaffId = localStorage.getItem('staff_id');
    const storedStaffInfo = localStorage.getItem('staff_info');
    
    if (storedStaffId) {
      setStaffId(storedStaffId);
      console.log('Doctor Dashboard - StaffId loaded:', storedStaffId);
    }
    
    if (storedStaffInfo) {
      try {
        const parsedStaffInfo = JSON.parse(storedStaffInfo);
        setStaffInfo(parsedStaffInfo);
        console.log('Doctor Dashboard - StaffInfo loaded:', parsedStaffInfo);
      } catch (error) {
        console.error('Error parsing staff info:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Clear all stored data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_role_display');
      localStorage.removeItem('staff_id');
      localStorage.removeItem('staff_info');
      
      console.log('Doctor logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data and redirect
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  // Component mapping for different sections
  const getSectionComponent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <DoctorDashboard staffId={staffId} staffInfo={staffInfo} />;
      case 'appointments':
        return <AppointmentsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'consultations':
        return <ConsultationsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'medicine-prescriptions':
        return <MedicinePrescriptionsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'lab-prescriptions':
        return <LabTestPrescriptionsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'medical-records':
        return <MedicalRecordsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'settings':
        return <SettingsSection staffId={staffId} staffInfo={staffInfo} />;
      case 'logout':
        // Handle logout logic here
        handleLogout();
        return <DoctorDashboard staffId={staffId} staffInfo={staffInfo} />;
      default:
        return <DoctorDashboard staffId={staffId} staffInfo={staffInfo} />;
    }
  };

  return (
    <div className="d-flex vh-100" style={{ marginTop: '80px' }}>
      <DoctorSidebar 
        selected={selectedSection} 
        onSelectSection={setSelectedSection}
        staffId={staffId}
        staffInfo={staffInfo}
      />
      <main 
        className="flex-grow-1 overflow-auto" 
        style={{ backgroundColor: '#f8f9fa' }}
      >
        {getSectionComponent()}
      </main>
    </div>
  );
};

export default DoctorDashboardPage;
