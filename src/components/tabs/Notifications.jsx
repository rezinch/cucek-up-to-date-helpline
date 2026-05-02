import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Bell, ExternalLink, Clock } from 'lucide-react';

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
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function Notifications() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
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
        <div className="notifications-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    background: 'rgba(139, 92, 246, 0.18)',
                    color: '#A78BFA',
                    padding: '0.75rem',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(139, 92, 246, 0.2)',
                }}>
                    <Bell size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                        Notifications
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                        Latest announcements and updates from CUCEK
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="bento-card" style={{
                            height: '100px',
                            background: 'rgba(255,255,255,0.04)',
                            animation: 'shimmer 1.5s infinite',
                        }} />
                    ))
                ) : announcements.length === 0 ? (
                    <div className="bento-card" style={{
                        textAlign: 'center', padding: '4rem 2rem',
                        background: 'var(--glass-bg)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <p style={{ fontSize: '1.1rem' }}>No notifications found.</p>
                    </div>
                ) : (
                    announcements.map((item, idx) => (
                        <div
                            key={item.id}
                            className="bento-card"
                            style={{
                                padding: '1.5rem',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`,
                            }}
                        >
                            {idx === 0 && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                                    background: 'linear-gradient(to bottom, #8B5CF6, #EC4899)'
                                }} />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <h3 style={{
                                    margin: 0, fontSize: '1.1rem', fontWeight: '700',
                                    color: idx === 0 ? '#A78BFA' : 'var(--color-text-primary)'
                                }}>
                                    {item.title}
                                </h3>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    color: 'var(--color-text-secondary)', fontSize: '0.75rem'
                                }}>
                                    <Clock size={14} />
                                    {formatRelativeTime(item.timestamp)}
                                </div>
                            </div>

                            <p style={{
                                margin: '0 0 1.25rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: '1.6',
                                fontSize: '0.95rem'
                            }}>
                                {item.text}
                            </p>

                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '10px',
                                        background: 'rgba(139, 92, 246, 0.15)',
                                        color: '#A78BFA',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        border: '1px solid rgba(139, 92, 246, 0.3)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    {item.linkText || 'View Details'}
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
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
