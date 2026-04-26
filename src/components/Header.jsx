import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

function Header({ activeTab, setActiveTab, isDarkMode, toggleTheme, onMobileMenuToggle }) {
    const { isInstallable, install } = usePWAInstall();
    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'bus', label: 'Bus Timings' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'notes', label: 'Notes' },
        { id: 'helpdesk', label: 'Helpdesk' },
        { id: 'contact', label: 'Contact Us' }
    ];

    return (
        <header className="header" id="header">
            <div className="header-container">
                <h1 className="logo" id="logo">CUCEK UP-TO-DATE</h1>

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

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isInstallable && (
                        <button
                            className="theme-switch"
                            onClick={install}
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
