import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function NotificationBanner() {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(fetched);
        }, (error) => {
            console.error("Error fetching announcements: ", error);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (announcements.length <= 1) return;
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % announcements.length);
                setIsAnimating(false);
            }, 300); // 300ms fade out
        }, 5000);
        return () => clearInterval(timer);
    }, [announcements.length]);

    const currentAnnouncement = announcements[currentIndex] || {
        title: announcements.length === 0 ? "Welcome to the KSU Helpline!" : "Loading...",
        text: announcements.length === 0 ? "Stay tuned for important updates and announcements." : ""
    };

    return (
        <div className="bento-card col-span-4" style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '1.25rem 1.5rem',
            gap: '1.25rem',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer'
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
                animation: 'pulse-slow 4s infinite alternate',
                pointerEvents: 'none'
            }}></div>

            {/* Icon */}
            <div style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8B5CF6',
                padding: '0.85rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                boxShadow: 'inset 0 0 0 1px rgba(139, 92, 246, 0.2)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'wiggle 3s infinite' }}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
            </div>
            
            {/* Content */}
            <div style={{ zIndex: 1, flex: 1, transition: 'opacity 0.3s ease', opacity: isAnimating ? 0 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', 
                        color: 'white', 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '12px' 
                    }}>Announcement</span>
                    {announcements.length > 1 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {currentIndex + 1} of {announcements.length}
                        </span>
                    )}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: '1.4' }}>
                    {currentAnnouncement.title}
                </h3>
                {currentAnnouncement.text && (
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {currentAnnouncement.text}
                    </p>
                )}
            </div>
            
            <style>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    5%, 15%, 25% { transform: rotate(15deg); }
                    10%, 20% { transform: rotate(-15deg); }
                    30% { transform: rotate(0deg); }
                }
                @keyframes pulse-slow {
                    0% { opacity: 0.5; transform: scale(1); }
                    100% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
}
