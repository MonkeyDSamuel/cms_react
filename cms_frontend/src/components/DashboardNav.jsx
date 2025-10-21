import React, { useState } from 'react';
import Dashboard from './Dashboard';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

function DashboardNav() {
  const [section, setSection] = useState('home');

  // Update section based on navbar clicks
  const handleNavigate = (sec) => setSection(sec);

  return (
    <>
      <Dashboard
        section={section}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default DashboardNav;