import React, { useState } from 'react';

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, title, message })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', text: `Sent successfully to ${data.stats?.tokensFound || 0} devices!` });
                setTitle('');
                setMessage('');
            } else {
                setStatus({ type: 'error', text: data.message || data.error || 'Failed to send' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Network error. Make sure you are running via Vercel Dev.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <div className="bento-card" style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '24px' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)', fontSize: '1.75rem' }}>Push Notification Panel</h2>
                
                {status && (
                    <div style={{ 
                        padding: '1rem', 
                        marginBottom: '1.5rem', 
                        borderRadius: '12px',
                        background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: status.type === 'success' ? '#10B981' : '#EF4444',
                        border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                            />
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '1rem 0' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Notification Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Holiday Tomorrow"
                            style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Message Body</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows="4"
                            placeholder="Type your announcement here..."
                            style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', resize: 'vertical' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            marginTop: '1rem',
                            padding: '1rem', 
                            borderRadius: '12px', 
                            background: isLoading ? 'var(--color-border)' : 'var(--color-primary)', 
                            color: 'white', 
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Blast Notification'}
                    </button>
                </form>
            </div>
        </div>
    );
}
