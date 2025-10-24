import React, { useState } from 'react';
import DoctorSidebar from '../../elements/Doctor/DoctorSidebar';
import DoctorDashboard from '../../components/Doctor/DoctorDashboard';
import AppointmentsSection from '../../components/Doctor/AppointmentsSection';
import PatientsSection from '../../components/Doctor/PatientsSection';
import MedicinePrescriptionsSection from '../../components/Doctor/MedicinePrescriptionsSection';
import LabTestPrescriptionsSection from '../../components/Doctor/LabTestPrescriptionsSection';
import MedicalRecordsSection from '../../components/Doctor/MedicalRecordsSection';
import SettingsSection from '../../components/Doctor/SettingsSection';

const DoctorDashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  // Component mapping for different sections
  const getSectionComponent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <DoctorDashboard />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'patients':
        return <PatientsSection />;
      case 'medicine-prescriptions':
        return <MedicinePrescriptionsSection />;
      case 'lab-prescriptions':
        return <LabTestPrescriptionsSection />;
      case 'medical-records':
        return <MedicalRecordsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'logout':
        // Handle logout logic here
        alert('Logout functionality would be implemented here');
        return <DoctorDashboard />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="d-flex vh-100">
      <DoctorSidebar 
        selected={selectedSection} 
        onSelectSection={setSelectedSection} 
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
