import React, { useState } from 'react';

function Header({ activeTab, setActiveTab, isDarkMode, toggleTheme, onMobileMenuToggle }) {
    const tabs = [
        { id: 'helpdesk', label: 'Helpdesk' },
        { id: 'bus', label: 'Bus Timings' },
        { id: 'syllabus', label: 'Syllabus' },
        { id: 'hostels', label: 'Approved Hostels' },
        { id: 'qrcodes', label: 'Additional Links' },
        { id: 'contact', label: 'Contact Us' },
        { id: 'notes', label: 'Prev. Year Qns and Notes' }
    ];

    return (
        <>
            <header className="header" id="header">
                <div className="container flex justify-between items-center py-16">
                    <h1 className="logo" id="logo">KSU CUCEK</h1>
                    <nav className="desktop-nav" id="desktopNav" aria-label="Primary">
                        <div className="tab-buttons flex gap-8" role="tablist">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                    <div className="header-controls">
                        <button
                            className="mobile-menu-toggle"
                            id="mobileMenuToggle"
                            aria-label="Toggle navigation menu"
                            onClick={onMobileMenuToggle}
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                        <button id="installBtn" className="btn btn--primary" style={{ display: 'none' }}>
                            Install App
                        </button>
                        <label className="theme-toggle" htmlFor="darkModeToggle" aria-label="Toggle colour scheme">
                            <input
                                type="checkbox"
                                id="darkModeToggle"
                                className="sr-only"
                                aria-label="Dark mode switch"
                                checked={isDarkMode}
                                onChange={toggleTheme}
                            />
                            <span className="toggle-slider">
                                <span className="toggle-icon sun">☀️</span>
                                <span className="toggle-icon moon">🌙</span>
                            </span>
                        </label>
                    </div>
                </div>
            </header>

            <div className="tab-strip" id="tabStrip" role="tablist" aria-label="Quick navigation">
                <div className="tab-strip-wrapper">
                    {tabs.map((tab) => (
                        <button
                            key={`strip-${tab.id}`}
                            className={`tab-strip-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.id === 'hostels' ? 'Hostels' : tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Header;
