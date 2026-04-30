import React, { useEffect, useState } from 'react';
import './InstallHint.css';

export default function InstallHint() {
  const [isVisible, setIsVisible] = useState(false);
  const [os, setOs] = useState('other'); // 'ios', 'android', 'other'

  useEffect(() => {
    // 1. Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // 2. Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('installPromptDismissed') === 'true';

    if (!isStandalone && !dismissed) {
      // Determine OS
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setOs('ios');
      } else if (/android/.test(userAgent)) {
        setOs('android');
      }
      
      // Add a slight delay before showing the popup so it doesn't interrupt initial load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  return (
    <div className="install-modal-overlay">
      <div className="install-modal-content">
        <button className="install-modal-close" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="install-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        
        <h3 className="install-title">Install App for Notifications</h3>
        
        <p className="install-desc">
          Install the CUCEK Helpline app to your home screen to receive important push notifications and never miss an update!
        </p>

        <div className="install-instructions">
          {os === 'ios' ? (
            <p>Tap the <strong>Share</strong> button <svg width="16" height="16" style={{display: 'inline', verticalAlign: 'middle', margin: '0 2px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> and select <strong>"Add to Home Screen"</strong>.</p>
          ) : os === 'android' ? (
            <p>Tap the browser menu <strong>(⋮)</strong> and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</p>
          ) : (
            <p>Click the install icon in your browser's address bar to install.</p>
          )}
        </div>
        
        <button className="install-btn-primary" onClick={handleClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
