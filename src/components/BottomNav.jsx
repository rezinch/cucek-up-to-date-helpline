import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Bus, BookOpen } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { id: 'notes', label: 'Notes', icon: <FileText size={20} />, path: '/notes' },
        { id: 'bus', label: 'Bus', icon: <Bus size={20} />, path: '/bus' },
        { id: 'syllabus', label: 'Syllabus', icon: <BookOpen size={20} />, path: '/syllabus' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
