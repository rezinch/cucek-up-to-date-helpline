import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Helpdesk from './components/tabs/Helpdesk';
import BusTimings from './components/tabs/BusTimings';
import Syllabus from './components/tabs/Syllabus';
import Hostels from './components/tabs/Hostels';
import AdditionalLinks from './components/tabs/AdditionalLinks';
import ContactUs from './components/tabs/ContactUs';
import Notes from './components/tabs/Notes';
import './style.css'; // Global Styles

function App() {
  const [activeTab, setActiveTab] = useState('helpdesk');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial format from Hash or localStorage
    const hashTab = window.location.hash.substring(1);
    const validTabs = ['helpdesk', 'bus', 'syllabus', 'hostels', 'qrcodes', 'contact', 'notes'];

    let initialTab = 'helpdesk';
    if (validTabs.includes(hashTab)) {
      initialTab = hashTab;
    } else {
      const storedTab = localStorage.getItem('ksu_active_tab');
      if (validTabs.includes(storedTab)) {
        initialTab = storedTab;
      }
    }
    setActiveTab(initialTab);

    // Initial Dark Mode Check
    const storedTheme = localStorage.getItem('ksu_theme');
    const isDark = storedTheme === 'dark';
    setIsDarkMode(isDark);
    applyTheme(isDark);

    // Service Worker Logic from Vanilla JS
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Scroll Progress
    const bar = document.getElementById('scrollProgress');
    const updateScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h ? (window.scrollY / h) * 100 : 0;
      if (bar) {
        bar.style.width = pct + '%';
        bar.style.opacity = window.scrollY > 60 ? '1' : '0';
      }
    };
    document.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    return () => {
      document.removeEventListener('scroll', updateScroll);
    };
  }, []);

  const applyTheme = (isDark) => {
    const mode = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', mode);
    document.body.setAttribute('data-color-scheme', mode);
    // force reflow
    document.documentElement.offsetHeight;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ksu_active_tab', tab);
    window.location.hash = tab;
    setMobileMenuOpen(false); // Close mobile menu on tab click
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
          <button className="mobile-tab-btn" onClick={() => handleTabChange('helpdesk')}>Helpdesk</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('bus')}>Bus Timings</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('syllabus')}>Syllabus</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('hostels')}>Approved Hostels</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('qrcodes')}>Additional Links</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('contact')}>Contact Us</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('notes')}>Prev. Year Qns and Notes</button>
        </div>
      </div>

      <main className="container py-16" id="mainContent">
        {activeTab === 'helpdesk' && <Helpdesk />}
        {activeTab === 'bus' && <BusTimings />}
        {activeTab === 'syllabus' && <Syllabus />}
        {activeTab === 'hostels' && <Hostels />}
        {activeTab === 'qrcodes' && <AdditionalLinks />}
        {activeTab === 'contact' && <ContactUs />}
        {activeTab === 'notes' && <Notes />}
      </main>

      <Footer />
    </>
  );
}

export default App;
