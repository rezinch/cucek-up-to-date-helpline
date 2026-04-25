import React from 'react';

function Notes() {
    return (
        <section id="notes" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Prev. Year Qns and Notes</h2>
                <p className="section-description">Access previous year question papers and study materials.</p>
            </div>
            
            <div style={{ marginTop: '2rem', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <iframe 
                    src="https://drive.google.com/embeddedfolderview?id=1TgroPw28Ql1OXHkGBeg1MTDZwSHAEAlT#grid" 
                    style={{ width: '100%', height: '75vh', border: 'none' }}
                    title="Google Drive Folder for Previous Year Questions and Notes"
                >
                    Loading Drive Folder...
                </iframe>
            </div>
        </section>
    );
}

export default Notes;
