import React, { useState } from 'react';
import ReceptionistSidebar from '../../elements/Receptionist/ReceptionistSidebar';
import ReceptionistDashboard from '../../components/Receptionist/ReceptionistDashboard';

const ReceptionistDashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState('overview'); // Default section

  return (
    <div className="d-flex">
      <ReceptionistSidebar selected={selectedSection} onSelectSection={setSelectedSection} />
      <main style={{ flex: 1, padding: '20px' }}>
        <ReceptionistDashboard selectedSection={selectedSection} />
      </main>
    </div>
  );
};

export default ReceptionistDashboardPage;
