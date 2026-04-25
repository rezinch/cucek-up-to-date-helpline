import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BentoGrid from './components/BentoGrid';
import Helpdesk from './components/tabs/Helpdesk';
import BusTimings from './components/tabs/BusTimings';
import Syllabus from './components/tabs/Syllabus';
import Hostels from './components/tabs/Hostels';
import AdditionalLinks from './components/tabs/AdditionalLinks';
import ContactUs from './components/tabs/ContactUs';
import Notes from './components/tabs/Notes';
import './style.css'; 

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const applyTheme = (isDark) => {
    const mode = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', mode);
    document.body.setAttribute('data-color-scheme', mode);
    document.documentElement.offsetHeight;
  };

  useEffect(() => {
    const hashTab = window.location.hash.substring(1);
    const validTabs = ['dashboard', 'helpdesk', 'bus', 'syllabus', 'hostels', 'qrcodes', 'contact', 'notes'];

    let initialTab = 'dashboard';
    if (validTabs.includes(hashTab)) {
      initialTab = hashTab;
    } else {
      const storedTab = localStorage.getItem('ksu_active_tab');
      if (validTabs.includes(storedTab)) {
        initialTab = storedTab;
      }
    }
    setActiveTab(initialTab);

    const storedTheme = localStorage.getItem('ksu_theme');
    const isDark = storedTheme !== 'light';
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ksu_active_tab', tab);
    window.location.hash = tab;
    setMobileMenuOpen(false); 
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem('ksu_theme', newMode ? 'dark' : 'light');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      
      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? '' : 'hidden'}`} id="mobileMenu">
        <div className="mobile-menu-content">
          <button className="mobile-tab-btn" onClick={() => handleTabChange('dashboard')}>Dashboard</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('helpdesk')}>Helpdesk</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('bus')}>Bus Timings</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('syllabus')}>Syllabus</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('notes')}>Notes</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('helpdesk')}>Helpdesk</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('qrcodes')}>Additional Links</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('contact')}>Contact Us</button>
        </div>
      </div>

      <main id="mainContent">
        {activeTab === 'dashboard' && <BentoGrid setActiveTab={handleTabChange} />}
        {activeTab === 'helpdesk' && <div className="container py-16"><Helpdesk /></div>}
        {activeTab === 'bus' && <div className="container py-16"><BusTimings /></div>}
        {activeTab === 'syllabus' && <div className="container py-16"><Syllabus /></div>}
        {activeTab === 'hostels' && <div className="container py-16"><Hostels /></div>}
        {activeTab === 'qrcodes' && <div className="container py-16"><AdditionalLinks /></div>}
        {activeTab === 'contact' && <div className="container py-16"><ContactUs /></div>}
        {activeTab === 'notes' && <div className="container py-16"><Notes /></div>}
      </main>

      <Footer />
    </>
  );
}

export default App;
