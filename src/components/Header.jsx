import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';

function Header({ activeTab, setActiveTab, isDarkMode, toggleTheme, onMobileMenuToggle }) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'bus', label: 'Bus Timings' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'notes', label: 'Notes' },
        { id: 'helpdesk', label: 'Helpdesk' }
    ];

    return (
        <header className="header" id="header">
            <div className="header-container">
                <h1 className="logo" id="logo">CUCEK UP-TO-DATE</h1>

                <nav className="desktop-tab-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`desktop-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
