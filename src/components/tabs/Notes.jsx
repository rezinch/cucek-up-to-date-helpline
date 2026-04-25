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
            
            <div style={{ marginTop: '2rem' }}>
                {selectedFile ? (
                    // Inline PDF Viewer
                    <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }} className="zoom-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-color)', wordBreak: 'break-word', flex: 1 }}>
                                📄 {selectedFile.name}
                            </h3>
                            <button 
                                onClick={closeViewer} 
                                className="btn btn--primary" 
                                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                            >
                                ← Back to list
                            </button>
                        </div>
                        <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <iframe 
                                src={`https://drive.google.com/file/d/${selectedFile.id}/preview`} 
                                style={{ width: '100%', height: '70vh', border: 'none' }}
                                title={selectedFile.name}
                                allow="autoplay"
                            >
                                Loading Document...
                            </iframe>
                        </div>
                    </div>
                ) : (
                    // File / Folder List View
                    <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                        
                        {/* Folder Breadcrumbs & Back Button */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem', gap: '1rem', paddingBottom: '1rem', borderBottom: folderHistory.length > 1 ? '1px solid var(--border-color)' : 'none' }}>
                            {folderHistory.length > 1 && (
                                <button 
                                    onClick={handleGoBack}
                                    style={{ 
                                        padding: '0.5rem 1rem', 
                                        background: 'transparent', 
                                        color: 'var(--primary-color)', 
                                        border: '1px solid var(--primary-color)', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                                >
                                    <span>←</span> Back
                                </button>
                            )}
                            <div style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500', wordBreak: 'break-word', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>📂</span> 
                                {folderHistory.map((f, i) => (
                                    <React.Fragment key={i}>
                                        <span style={{ color: i === folderHistory.length - 1 ? 'var(--primary-color)' : 'inherit', fontWeight: i === folderHistory.length - 1 ? 'bold' : 'normal' }}>
                                            {f.name}
                                        </span>
                                        {i < folderHistory.length - 1 && <span style={{ opacity: 0.5 }}>/</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {loading && <p style={{ textAlign: 'center', color: 'var(--text-color)', margin: '2rem 0' }}>Loading folder contents...</p>}
                        
                        {error && (
                            <p style={{ textAlign: 'center', color: '#dc2626', background: '#fee2e2', padding: '1rem', borderRadius: '8px', margin: '2rem 0' }}>
                                Error: {error}
                            </p>
                        )}

                        {!loading && !error && files.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-color)', margin: '2rem 0' }}>This folder is empty.</p>
                        )}

                        {!loading && !error && files.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {files.map((item, i) => {
                                    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
                                    
                                    return (
                                        <li 
                                            key={item.id} 
                                            style={{ display: 'block', animationDelay: `${i * 0.05}s` }} 
                                            className="section-animate"
                                        >
                                            <button 
                                                onClick={() => handleItemClick(item)}
                                                style={{ 
                                                    width: '100%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between',
                                                    padding: '1.2rem 1.5rem', 
                                                    background: isFolder ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--background-color)', 
                                                    border: '1px solid',
                                                    borderColor: isFolder ? 'var(--primary-color)' : 'var(--border-color)', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s ease',
                                                    color: 'var(--text-color)',
                                                    fontSize: '1.05rem'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span style={{ fontSize: '1.5rem' }}>{isFolder ? '📂' : '📄'}</span>
                                                    <span style={{ fontWeight: isFolder ? '600' : '400', wordBreak: 'break-word', color: isFolder ? 'var(--primary-color)' : 'inherit' }}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
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
