import React, { useState, useEffect } from 'react';

function Notes() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    // Manage folder navigation stack
    const ROOT_FOLDER_ID = "1TgroPw28Ql1OXHkGBeg1MTDZwSHAEAlT";
    const [folderHistory, setFolderHistory] = useState([{ id: ROOT_FOLDER_ID, name: 'Root' }]);

    const currentFolder = folderHistory[folderHistory.length - 1];

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            setError(null);
            
            const API_KEY = "AIzaSyA8V_jXBMrMXdqbceva2j1LtGsZQj672pw";
            
            // Fetch mimeType to distinguish folders from files, orderBy folder first
            const url = `https://www.googleapis.com/drive/v3/files?q='${currentFolder.id}'+in+parents&fields=files(id,name,mimeType)&orderBy=folder,name&key=${API_KEY}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch files from Google Drive.");
                }
                const data = await response.json();
                setFiles(data.files || []);
            } catch (err) {
                console.error("Error loading notes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [currentFolder.id]);

    const handleItemClick = (item) => {
        if (item.mimeType === 'application/vnd.google-apps.folder') {
            // It's a folder, dive securely inside
            setFolderHistory([...folderHistory, { id: item.id, name: item.name }]);
        } else {
            // It's a file, preview it
            setSelectedFile(item);
        }
    };

    const handleGoBack = () => {
        if (folderHistory.length > 1) {
            // Pop the last folder off the stack sequence to go back
            const newHistory = [...folderHistory];
            newHistory.pop();
            setFolderHistory(newHistory);
        }
    };

    const closeViewer = () => {
        setSelectedFile(null);
    };

    return (
        <section id="notes" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Prev. Year Qns and Notes</h2>
                <p className="section-description">Access previous year question papers and study materials.</p>
            </div>
            
            <div style={{ marginTop: '2rem', maxWidth: '900px', margin: '2rem auto 0 auto' }}>
                {selectedFile ? (
                    // Inline PDF Viewer
                    <div className="bento-card zoom-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary)', wordBreak: 'break-word', flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>📄</span> {selectedFile.name}
                            </h3>
                            <button 
                                onClick={closeViewer} 
                                style={{ background: 'rgba(0,102,255,0.15)', color: 'var(--color-electric-blue)', padding: '0.6rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap', borderRadius: '999px', border: '1px solid rgba(0,102,255,0.3)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,102,255,0.25)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,102,255,0.15)'}
                            >
                                &larr; Back to list
                            </button>
                        </div>
                        <div style={{ width: '100%', background: '#fff' }}>
                            <iframe 
                                src={`https://drive.google.com/file/d/${selectedFile.id}/preview`} 
                                style={{ width: '100%', height: '75vh', border: 'none', display: 'block' }}
                                title={selectedFile.name}
                                allow="autoplay"
                            >
                                Loading Document...
                            </iframe>
                        </div>
                    </div>
                ) : (
                    // File / Folder List View
                    <div className="bento-card" style={{ padding: '2rem' }}>
                        
                        {/* Folder Breadcrumbs & Back Button */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            {folderHistory.length > 1 && (
                                <button 
                                    onClick={handleGoBack}
                                    style={{ 
                                        padding: '0.5rem 1rem', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        color: 'var(--color-text-primary)', 
                                        border: '1px solid var(--glass-border)', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-slate-700)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                >
                                    &larr; Back
                                </button>
                            )}
                            <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: '500', wordBreak: 'break-word', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>📂</span> 
                                {folderHistory.map((f, i) => (
                                    <React.Fragment key={i}>
                                        <span style={{ color: i === folderHistory.length - 1 ? 'var(--color-electric-blue)' : 'inherit', fontWeight: i === folderHistory.length - 1 ? '600' : '500' }}>
                                            {f.name}
                                        </span>
                                        {i < folderHistory.length - 1 && <span style={{ opacity: 0.4 }}>/</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {loading && <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', margin: '3rem 0', fontWeight: '500', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}><span style={{ animation: 'pulse 1.5s infinite', color: 'var(--color-electric-blue)' }}>●</span> Fetching files...</p>}
                        
                        {error && (
                            <p style={{ textAlign: 'center', color: '#fda4af', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', padding: '1rem', borderRadius: '8px', margin: '2rem 0' }}>
                                Error: {error}
                            </p>
                        )}

                        {!loading && !error && files.length === 0 && (
                            <div style={{ textAlign: 'center', margin: '4rem 0', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--color-text-secondary)' }}>
                                <span style={{ fontSize: '3rem', opacity: 0.5, display: 'block', marginBottom: '1rem' }}>📭</span>
                                <p style={{ margin: 0, fontWeight: '500' }}>This folder is perfectly empty.</p>
                            </div>
                        )}

                        {!loading && !error && files.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                {files.map((item, i) => {
                                    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
                                    
                                    return (
                                        <li 
                                            key={item.id} 
                                            style={{ display: 'block', animationDelay: `${i * 0.03}s` }} 
                                            className="section-animate"
                                        >
                                            <button 
                                                onClick={() => handleItemClick(item)}
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between',
                                                    padding: '1.25rem', 
                                                    background: isFolder ? 'var(--color-slate-800)' : 'rgba(255,255,255,0.02)', 
                                                    border: '1px solid',
                                                    borderColor: isFolder ? 'rgba(0,102,255,0.2)' : 'var(--glass-border)', 
                                                    borderRadius: '12px', 
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s ease',
                                                    color: 'var(--color-text-primary)'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--color-electric-blue)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.3)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = isFolder ? 'rgba(0,102,255,0.2)' : 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                                                    <div style={{ background: isFolder ? 'rgba(0,102,255,0.1)' : 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: '1.5rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{isFolder ? '📂' : '📄'}</span>
                                                    </div>
                                                    <span style={{ fontWeight: isFolder ? '600' : '500', wordBreak: 'break-word', fontSize: '0.95rem', lineHeight: '1.3' }}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', paddingLeft: '0.5rem', opacity: 0.5 }}>&rarr;</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Notes;
