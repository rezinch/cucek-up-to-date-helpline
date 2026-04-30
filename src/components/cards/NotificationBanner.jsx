import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function NotificationBanner() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'), limit(20));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching announcements: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="bento-card col-span-4" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
        }}>
            {/* Ambient glow */}
            <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.07) 0%, transparent 60%)',
                pointerEvents: 'none',
                animation: 'pulse-slow 4s infinite alternate',
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                marginBottom: '1.1rem',
                position: 'relative',
                zIndex: 1,
            }}>
                <div style={{
                    background: 'rgba(139, 92, 246, 0.18)',
                    color: '#A78BFA',
                    padding: '0.6rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(139, 92, 246, 0.2)',
                    flexShrink: 0,
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ animation: 'wiggle 3s infinite' }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase',
                            letterSpacing: '0.07em',
                            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                            color: 'white', padding: '0.15rem 0.55rem', borderRadius: '99px',
                        }}>Announcements</span>
                        {!loading && announcements.length > 0 && (
                            <span style={{
                                fontSize: '0.72rem', fontWeight: '600',
                                color: 'rgba(139,92,246,0.8)',
                                background: 'rgba(139,92,246,0.1)',
                                padding: '0.1rem 0.45rem', borderRadius: '99px',
                                border: '1px solid rgba(139,92,246,0.2)',
                            }}>
                                {announcements.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* List */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '0.25rem',
            }}>
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '52px', borderRadius: '10px',
                            background: 'var(--color-slate-700)',
                            animation: 'shimmer 1.5s infinite',
                        }} />
                    ))
                ) : announcements.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '1.5rem',
                        color: 'var(--color-text-secondary)', fontSize: '0.875rem',
                    }}>
                        No announcements yet.
                    </div>
                ) : (
                    announcements.map((item, idx) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                background: idx === 0
                                    ? 'rgba(139,92,246,0.1)'
                                    : 'var(--color-slate-700)',
                                border: idx === 0
                                    ? '1px solid rgba(139,92,246,0.25)'
                                    : '1px solid var(--glass-border)',
                                transition: 'background 0.2s',
                                animation: `fadeInUp 0.3s ease ${idx * 0.04}s both`,
                            }}
                        >
                            {/* Dot */}
                            <div style={{
                                width: '7px', height: '7px',
                                borderRadius: '50%',
                                background: idx === 0 ? '#A78BFA' : 'var(--color-text-secondary)',
                                flexShrink: 0,
                                marginTop: '0.45rem',
                                opacity: idx === 0 ? 1 : 0.5,
                            }} />

                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <span style={{
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        color: idx === 0 ? '#8B5CF6' : 'var(--color-text-primary)',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {item.title}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-text-secondary)',
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {formatRelativeTime(item.timestamp)}
                                    </span>
                                </div>
                                {item.text && (
                                    <p style={{
                                        margin: '0.15rem 0 0',
                                        fontSize: '0.82rem',
                                        color: 'var(--color-text-primary)',
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {item.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
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
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-color: rgba(255,255,255,0.04); }
                    50%  { background-color: rgba(255,255,255,0.08); }
                    100% { background-color: rgba(255,255,255,0.04); }
                }
            `}</style>
        </div>
    );
}
