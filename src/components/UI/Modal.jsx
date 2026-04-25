import React from 'react';

function Modal({ isOpen, onClose, head, content }) {
    if (!isOpen) return null;

    return (
        <div id="overlay" className="cmd-palette-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 0 }}>
            {/* Stop propagation so clicking inside modal doesn't close it */}
            <div
                id="modal"
                className="bento-card"
                style={{ width: '90%', maxWidth: '420px', margin: 'auto', padding: '2rem', zIndex: 101, transform: 'scale(1)', background: 'var(--glass-bg)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700', lineHeight: 1.2 }}>{head}</h2>
                    <button style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', padding: 0 }} onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {content.map((person, index) => (
                        <div key={index} style={{ background: 'var(--color-slate-800)', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)', transition: 'transform 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '1.1rem', margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>{person.name}</p>
                                <p style={{ color: 'var(--color-electric-blue)', margin: 0, fontFamily: 'monospace', fontSize: '1.05rem', letterSpacing: '0.5px' }}>{person.phone}</p>
                            </div>
                            <a href={`tel:${person.phone}`} style={{ textDecoration: 'none', background: 'rgba(0,102,255,0.15)', color: 'var(--color-electric-blue)', padding: '0.75rem', borderRadius: '50%', display: 'flex', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,102,255,0.25)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,102,255,0.15)'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Modal;
