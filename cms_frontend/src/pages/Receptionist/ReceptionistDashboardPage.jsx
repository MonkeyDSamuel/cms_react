import React, { useState } from 'react';
import ReceptionistSidebar from '../../elements/Receptionist/ReceptionistSidebar';
import ReceptionistDashboard from '../../components/Receptionist/ReceptionistDashboard';

const ReceptionistDashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState('overview'); // Default section

  return (
    <div className="d-flex receptionist-dashboard">
      <ReceptionistSidebar selected={selectedSection} onSelectSection={setSelectedSection} />
      <main className="receptionist-main-content" style={{ flex: 1 }}>
        <ReceptionistDashboard selectedSection={selectedSection} />
      </main>
    </div>
  );
};

export default ReceptionistDashboardPage;

