import React from 'react';
import LiveBusCard from './cards/LiveBusCard';
import SyllabusCard from './cards/SyllabusCard';

export default function BentoGrid({ setActiveTab }) {
    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="bento-grid">
                <LiveBusCard setActiveTab={setActiveTab} />


                {/* Notes Card replacing Hostels */}
                <div
                    className="bento-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => setActiveTab('notes')}
                >
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem' }}>Prev Papers & Notes</h3>
                    <p className="card-desc" style={{ marginTop: '0.5rem' }}>Access notes & assignments</p>
                </div>

                <SyllabusCard />

                {/* Helpdesk / Contact Card */}
                <div
                    className="bento-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => setActiveTab('helpdesk')}
                >
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-electric-blue)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem' }}>Helpdesk Contacts</h3>
                    <p className="card-desc" style={{ marginTop: '0.5rem' }}>View student coordinators</p>
                </div>



                {/* Additional Links Card */}
                <div
                    className="bento-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => setActiveTab('qrcodes')}
                >
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.25rem' }}>Additional Links</h3>
                    <p className="card-desc" style={{ marginTop: '0.5rem' }}>Other university portals and resources</p>
                </div>

                {/* Contact Us Card */}
                <div
                    className="bento-card col-span-4"
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'left', gap: '1.5rem', padding: '2rem' }}
                    onClick={() => setActiveTab('contact')}
                >
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', padding: '1.25rem', borderRadius: '50%', flexShrink: 0, border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2a9 9 0 0 1 8 7.94"></path><path d="M14.05 6A5 5 0 0 1 18 10"></path></svg>
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Contact Us &rarr;</h3>
                        <p className="card-desc" style={{ fontSize: '1.05rem', margin: 0 }}>Reach out directly to submit a complaint, report an issue, or ask general queries.</p>
                    </div>
                </div>



            </div>
        </div>
    );
}
