import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, Download, Bell } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { requestForToken } from '../firebase';

function Header({ activeTab, setActiveTab, isDarkMode, toggleTheme, onMobileMenuToggle }) {
    const { isInstallable, install } = usePWAInstall();
    const [notificationPermission, setNotificationPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    const tabs = [
        /*{ id: 'dashboard', label: 'Dashboard' },*/
        { id: 'notes', label: 'Notes & Prev Qns' },
        { id: 'bus', label: 'Bus Timings' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'hostels', label: 'Hostels' },
        { id: 'helpdesk', label: 'Helpdesk' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'contact', label: 'Contact Us' }
    ];

    const handleEnableNotifications = async () => {
        const token = await requestForToken();
        if (token) {
            setNotificationPermission('granted');
        } else {
            // Update even if denied to keep state in sync
            if (typeof Notification !== 'undefined') {
                setNotificationPermission(Notification.permission);
            }
        }
    };

    // Keep permission in sync (e.g. if granted elsewhere)
    useEffect(() => {
        if (typeof Notification === 'undefined') return;
        const interval = setInterval(() => {
            if (Notification.permission !== notificationPermission) {
                setNotificationPermission(Notification.permission);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [notificationPermission]);

    return (
        <header className="header" id="header">
            <div className="header-container">
                <NavLink to="/dashboard" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0', flexShrink: 0 }}>
                    <h1 className="logo" id="logo">CUCEK UP-TO-DATE</h1>
                    <span className="subheading-text" style={{
                        color: 'var(--color-text-secondary)',
                        letterSpacing: '0.01em',
                        textTransform: 'uppercase',
                        marginTop: '-2px',
                        paddingLeft: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0',
                    }}>by KSU CUCEK<img src="/blah.png" alt="" className="header-mascot" style={{ objectFit: 'contain', display: 'inline-block', marginLeft: '-8px' }} /></span>
                </NavLink>

                <nav className="desktop-tab-nav">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.id}
                            to={`/${tab.id}`}
                            className={({ isActive }) => `desktop-tab-btn ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                // Scroll to top on click natively
                                window.scrollTo(0, 0);
                            }}
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) && notificationPermission !== 'granted' && (
                        <button
                            className="theme-switch"
                            onClick={handleEnableNotifications}
                            aria-label="Enable Notifications"
                            title="Enable Notifications"
                            style={{ color: 'var(--color-electric-blue)' }}
                        >
                            <Bell size={20} />
                        </button>
                    )}
                    {/* Show install button if not already installed */}
                    {!(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) && (
                        <button
                            className="theme-switch"
                            onClick={() => {
                                if (isInstallable) {
                                    install();
                                } else {
                                    // Custom instruction for iOS/other browsers
                                    alert('To install this app:\n\n1. Tap the "Share" button (usually at the bottom)\n2. Scroll down and tap "Add to Home Screen"');
                                }
                            }}
                            aria-label="Install App"
                            title="Install App"
                        >
                            <Download size={20} />
                        </button>
                    )}
                    <button
                        className="theme-switch"
                        onClick={toggleTheme}
                        aria-label="Toggle colour scheme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        className="mobile-menu-toggle"
                        onClick={onMobileMenuToggle}
                        style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--color-text-primary)' }}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
