import React from 'react';
import LiveBusCard from './cards/LiveBusCard';
import SyllabusCard from './cards/SyllabusCard';

export default function BentoGrid({ setActiveTab }) {
    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="bento-grid">
                <LiveBusCard setActiveTab={setActiveTab} />
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

                {/* Notes Card replacing Hostels */}
                <div 
                    className="bento-card col-span-2"
                    style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', cursor: 'pointer', textAlign: 'left', minHeight: '200px', overflow: 'hidden' }}
                    onClick={() => setActiveTab('notes')}
                >
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(245, 158, 11, 0.15)', width: '150px', height: '150px', borderRadius: '50%', filter: 'blur(30px)', zIndex: 0 }}></div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', zIndex: 1 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.5rem', zIndex: 1, letterSpacing: '-0.02em' }}>Prev Year Papers</h3>
                    <p className="card-desc" style={{ marginTop: '0.5rem', zIndex: 1 }}>Access syllabus-wise notes and solved assignments</p>
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



            </div>
        </div>
    );
}
