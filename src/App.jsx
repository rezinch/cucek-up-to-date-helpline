import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
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
import Admin from './components/tabs/Admin';
import BottomNav from './components/BottomNav';
import './style.css';
import InstallHint from './components/InstallHint';
import { requestForToken, onMessageListener } from './firebase';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Analytics (replace G-XXXXXXXXXX with your actual Measurement ID)
    ReactGA.initialize('G-8M9V8L9FHD');
  }, []);

  useEffect(() => {
    // Track page views on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  useEffect(() => {
    requestForToken().then((token) => {
      if (token) {
        console.log('Firebase registration token:', token);
        // Save token to state or local storage if needed
      }
    });

    const unsubscribe = onMessageListener((payload) => {
      if (payload) {
        console.log('Received foreground message', payload);
        alert(`New Notification: ${payload?.notification?.title}\n${payload?.notification?.body}`);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Extract activeTab from URL path
  const activeTab = location.pathname.replace('/', '') || 'dashboard';

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const applyTheme = (isDark) => {
    const mode = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', mode);
    document.body.setAttribute('data-color-scheme', mode);
    document.documentElement.offsetHeight;
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('ksu_theme');
    const isDark = storedTheme !== 'light';
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const handleTabChange = (tab) => {
    navigate(`/${tab}`);
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
      <InstallHint />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? '' : 'hidden'}`} id="mobileMenu">
        <div className="mobile-menu-content">
          <button className="mobile-tab-btn" onClick={() => handleTabChange('dashboard')}>Dashboard</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('helpdesk')}>Helpdesk</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('bus')}>Bus Timings</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('syllabus')}>Syllabus</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('notes')}>Notes</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('qrcodes')}>Additional Links</button>
          <button className="mobile-tab-btn" onClick={() => handleTabChange('contact')}>Contact Us</button>
        </div>
      </div>

      <main id="mainContent">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<BentoGrid setActiveTab={handleTabChange} />} />
          <Route path="/helpdesk" element={<div className="container py-16"><Helpdesk /></div>} />
          <Route path="/bus" element={<div className="container py-16"><BusTimings /></div>} />
          <Route path="/syllabus" element={<div className="container py-16"><Syllabus /></div>} />
          <Route path="/hostels" element={<div className="container py-16"><Hostels /></div>} />
          <Route path="/qrcodes" element={<div className="container py-16"><AdditionalLinks /></div>} />
          <Route path="/contact" element={<div className="container py-16"><ContactUs /></div>} />
          <Route path="/notes" element={<div className="container py-16"><Notes /></div>} />
          <Route path="/adminkuttan" element={<div className="container py-16"><Admin /></div>} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

export default App;
