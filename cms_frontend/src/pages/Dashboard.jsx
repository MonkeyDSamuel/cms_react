import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

function Dashboard({ section }) {
  let content;
  if (section === 'home') content = <HeroSection />;
  else if (section === 'about') content = <AboutSection />;
  else if (section === 'contact') content = <ContactSection />;
  else content = <HeroSection />; // Fallback

  return (
    <div>
      {content}
    </div>
  );
}

export default Dashboard;