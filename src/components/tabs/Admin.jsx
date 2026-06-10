import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, getCountFromServer, addDoc, updateDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconDevices = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ─── Toast Component ─────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      padding: '1rem 1.5rem',
      borderRadius: '14px',
      background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
      color: toast.type === 'success' ? '#10B981' : '#EF4444',
      fontWeight: '600',
      fontSize: '0.9rem',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      maxWidth: '360px',
    }}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      {toast.text}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Quick verify by calling the send-notification endpoint with an empty payload
    // We use it purely to validate credentials
    try {
      const res = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.status === 401) {
        setError('Invalid username or password.');
      } else if (res.ok) {
        onLogin({ username, password });
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('Network error. Is vercel dev running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="bento-card" style={{
        width: '100%', maxWidth: '420px', padding: '2.5rem',
        background: 'var(--glass-bg)',
        animation: 'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Logo/Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #0066FF, #A78BFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,102,255,0.4)',
          }}>
            <IconLock />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              Admin Portal
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              CUCEK Helpline Management
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.875rem 1rem', marginBottom: '1.5rem', borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)', color: '#EF4444',
            border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.875rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Enter username"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>
          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              ...primaryBtnStyle,
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--color-text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const primaryBtnStyle = {
  padding: '0.875rem 1.5rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #0066FF, #3385ff)',
  color: 'white',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s',
  boxShadow: '0 4px 16px rgba(0,102,255,0.35)',
  width: '100%',
};

const dangerBtnStyle = {
  padding: '0.5rem 0.875rem',
  borderRadius: '8px',
  background: 'rgba(239,68,68,0.12)',
  color: '#EF4444',
  fontWeight: '600',
  border: '1px solid rgba(239,68,68,0.25)',
  cursor: 'pointer',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
};

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(0,102,255,0.2), rgba(167,139,250,0.2))',
          border: '1px solid rgba(0,102,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#60a5fa',
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Delete Section ───────────────────────────────────────────────────────────
function DeleteSection({ creds, showToast }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(),
      }));
      setNotifications(items);
    } catch (e) {
      showToast({ type: 'error', text: 'Failed to load notifications.' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch('/api/delete-notification', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: creds.username, password: creds.password, id }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast({ type: 'success', text: 'Notification deleted.' });
      } else {
        showToast({ type: 'error', text: data.message || 'Delete failed.' });
      }
    } catch {
      showToast({ type: 'error', text: 'Network error during delete.' });
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  return (
    <div className="bento-card" style={{ padding: '1.75rem', background: 'var(--glass-bg)' }}>
      <SectionHeader
        icon={<IconTrash />}
        title="Existing Notifications"
        subtitle={`${notifications.length} announcement${notifications.length !== 1 ? 's' : ''} in database`}
        action={
          <button
            id="admin-refresh-btn"
            onClick={fetchNotifications}
            disabled={loading}
            style={{
              ...dangerBtnStyle,
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <IconRefresh />
            Refresh
          </button>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height: '72px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem 1rem',
          color: 'var(--color-text-secondary)', fontSize: '0.9rem',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
          <p style={{ margin: 0 }}>No announcements yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--glass-border)',
                gap: '1rem',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 0.2rem',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {n.title}
                </p>
                <p style={{
                  margin: '0 0 0.35rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {n.text}
                </p>
                <span style={{
                  fontSize: '0.7rem', color: 'rgba(156,163,175,0.7)',
                  background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem',
                  borderRadius: '99px',
                }}>
                  {formatDate(n.timestamp)}
                </span>
              </div>

              {confirmId === n.id ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    id={`confirm-delete-${n.id}`}
                    onClick={() => handleDelete(n.id)}
                    disabled={deletingId === n.id}
                    style={{ ...dangerBtnStyle, fontSize: '0.78rem' }}
                  >
                    {deletingId === n.id ? '…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    style={{
                      ...dangerBtnStyle,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.78rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id={`delete-btn-${n.id}`}
                  onClick={() => setConfirmId(n.id)}
                  style={{ ...dangerBtnStyle, flexShrink: 0 }}
                >
                  <IconTrash />
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Add Notification Section ─────────────────────────────────────────────────
function AddSection({ creds, showToast }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [linkText, setLinkText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: creds.username, password: creds.password, title, message, link, linkText }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ type: 'success', text: `Sent to ${data.stats?.tokensFound || 0} device(s)!` });
        setTitle('');
        setMessage('');
        setLink('');
        setLinkText('');
      } else {
        showToast({ type: 'error', text: data.message || data.error || 'Failed to send.' });
      }
    } catch {
      showToast({ type: 'error', text: 'Network error. Is vercel dev running?' });
    } finally {
      setLoading(false);
    }
  };

  const charLimit = 200;

  return (
    <div className="bento-card" style={{ padding: '1.75rem', background: 'var(--glass-bg)' }}>
      <SectionHeader
        icon={<IconBell />}
        title="Send Notification"
        subtitle="Blast a push notification to all subscribed users"
      />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="notif-title" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Title
          </label>
          <input
            id="notif-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g. Holiday Tomorrow 🎉"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="notif-message" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Message Body
            </label>
            <span style={{ fontSize: '0.75rem', color: message.length > charLimit ? '#EF4444' : 'var(--color-text-secondary)' }}>
              {message.length}/{charLimit}
            </span>
          </div>
          <textarea
            id="notif-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows="4"
            placeholder="Type your announcement here…"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6', minHeight: '100px' }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="notif-link" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Optional Link URL
          </label>
          <input
            id="notif-link"
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="e.g. https://google.com"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="notif-link-text" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Link Text (if URL provided)
          </label>
          <input
            id="notif-link-text"
            type="text"
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            placeholder="e.g. Register Now"
            style={inputStyle}
          />
        </div>

        {/* Preview */}
        {(title || message) && (
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: 'rgba(0,102,255,0.06)',
            border: '1px solid rgba(0,102,255,0.2)',
          }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Preview
            </p>
            <p style={{ margin: '0 0 0.1rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              {title || 'Title…'}
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {message || 'Message body…'}
            </p>
            {link && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#A78BFA', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                🔗 {linkText || 'Link'}: {link}
              </p>
            )}
          </div>
        )}

        <button
          id="send-notification-btn"
          type="submit"
          disabled={loading || message.length > charLimit}
          style={{
            ...primaryBtnStyle,
            opacity: (loading || message.length > charLimit) ? 0.6 : 1,
            cursor: (loading || message.length > charLimit) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Sending…
            </>
          ) : (
            <>
              <IconSend />
              Blast Notification
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── FIFA Admin Section ──────────────────────────────────────────────────────────
function FifaAdminSection({ showToast }) {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchType, setMatchType] = useState('normal'); // 'normal', 'semi_final', 'final'
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const fetchMatches = useCallback(async () => {
    try {
      const q = query(collection(db, 'fifa_matches'), orderBy('matchDate', 'asc'));
      const snapshot = await getDocs(q);
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const handleAddMatch = async (e) => {
    e.preventDefault();
    if (!teamA || !teamB || !matchDate) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'fifa_matches'), {
        teamA, teamB, matchDate: new Date(matchDate), status: 'upcoming', matchType, visible: true
      });
      showToast({ type: 'success', text: 'Match added!' });
      setTeamA(''); setTeamB(''); setMatchDate(''); setMatchType('normal');
      fetchMatches();
    } catch {
      showToast({ type: 'error', text: 'Failed to add match.' });
    } finally { setLoading(false); }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;
    setLoading(true);
    let matchesToAdd = [];
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(bulkInput);
      if (Array.isArray(parsed)) {
        matchesToAdd = parsed.map(m => ({
          teamA: m.teamA || '',
          teamB: m.teamB || '',
          matchDate: new Date(m.date || m.matchDate),
          matchType: m.matchType || 'normal',
          status: 'upcoming',
          visible: true
        }));
      }
    } catch (err) {
      // Parse line-by-line: "Team A vs Team B, YYYY-MM-DDTHH:MM" or similar
      const lines = bulkInput.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(',');
        if (parts.length >= 2) {
          const teamsPart = parts[0].trim();
          const datePart = parts[1].trim();
          const matchTypePart = parts[2]?.trim() || 'normal';
          
          const teamParts = teamsPart.split(/\s+vs\s+/i);
          if (teamParts.length === 2) {
            matchesToAdd.push({
              teamA: teamParts[0].trim(),
              teamB: teamParts[1].trim(),
              matchDate: new Date(datePart),
              matchType: matchTypePart,
              status: 'upcoming',
              visible: true
            });
          }
        }
      }
    }

    if (matchesToAdd.length === 0) {
      showToast({ type: 'error', text: 'No valid matches found in input.' });
      setLoading(false);
      return;
    }

    try {
      let count = 0;
      for (const match of matchesToAdd) {
        if (!match.teamA || !match.teamB || isNaN(match.matchDate.getTime())) continue;
        await addDoc(collection(db, 'fifa_matches'), match);
        count++;
      }
      showToast({ type: 'success', text: `Successfully imported ${count} matches!` });
      setBulkInput('');
      setShowBulk(false);
      fetchMatches();
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', text: 'Error importing matches.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMatch = async (matchId, tA, tB, mType = 'normal') => {
    const sAInput = document.getElementById(`adminScoreA-${matchId}`).value;
    const sBInput = document.getElementById(`adminScoreB-${matchId}`).value;

    if (!sAInput || !sBInput) {
      showToast({ type: 'error', text: 'Please enter both scores.' });
      return;
    }

    const actScoreA = parseInt(sAInput);
    const actScoreB = parseInt(sBInput);
    let actWinner = 'Draw';
    if (actScoreA > actScoreB) actWinner = tA;
    if (actScoreB > actScoreA) actWinner = tB;

    let pointsToAward = 1;
    if (mType === 'semi_final') pointsToAward = 2;
    if (mType === 'final') pointsToAward = 4;

    try {
      // 1. Update match
      await updateDoc(doc(db, 'fifa_matches', matchId), {
        status: 'completed',
        actualScoreA: actScoreA,
        actualScoreB: actScoreB,
        actualWinner: actWinner
      });

      // 2. Fetch predictions
      const pq = query(collection(db, 'fifa_predictions'), where('matchId', '==', matchId));
      const pSnap = await getDocs(pq);
      
      let correctUsers = [];
      pSnap.forEach(d => {
        const p = d.data();
        if (p.predictedScoreA === actScoreA && p.predictedScoreB === actScoreB && p.predictedWinner === actWinner) {
          correctUsers.push(p.userId);
        }
      });

      // 3. Update points
      for (const uid of correctUsers) {
        const uq = query(collection(db, 'fifa_users'), where('uid', '==', uid));
        const uSnap = await getDocs(uq);
        if (!uSnap.empty) {
          const userDoc = uSnap.docs[0];
          await updateDoc(doc(db, 'fifa_users', userDoc.id), {
            points: (userDoc.data().points || 0) + pointsToAward
          });
        }
      }

      showToast({ type: 'success', text: `Match completed. ${correctUsers.length} user(s) awarded ${pointsToAward} point(s).` });
      fetchMatches();
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', text: 'Error updating match' });
    }
  };

  const handleDeleteMatch = async (m) => {
    if (!window.confirm('Are you sure you want to delete this match? This will also withdraw points from users who predicted it correctly.')) return;
    try {
      // Fetch all predictions for this match
      const pq = query(collection(db, 'fifa_predictions'), where('matchId', '==', m.id));
      const pSnap = await getDocs(pq);
      
      let pointsToWithdraw = 1;
      if (m.matchType === 'semi_final') pointsToWithdraw = 2;
      if (m.matchType === 'final') pointsToWithdraw = 4;

      for (const d of pSnap.docs) {
        const p = d.data();
        
        // If the match was completed, check if this prediction was correct and withdraw points
        if (m.status === 'completed') {
          if (p.predictedScoreA === m.actualScoreA && p.predictedScoreB === m.actualScoreB && p.predictedWinner === m.actualWinner) {
            const uq = query(collection(db, 'fifa_users'), where('uid', '==', p.userId));
            const uSnap = await getDocs(uq);
            if (!uSnap.empty) {
              const userDoc = uSnap.docs[0];
              const currentPoints = userDoc.data().points || 0;
              await updateDoc(doc(db, 'fifa_users', userDoc.id), {
                points: Math.max(0, currentPoints - pointsToWithdraw)
              });
            }
          }
        }
        
        // Delete the prediction document to keep database clean
        await deleteDoc(doc(db, 'fifa_predictions', d.id));
      }

      // Delete the match itself
      await deleteDoc(doc(db, 'fifa_matches', m.id));
      
      showToast({ type: 'success', text: 'Match deleted successfully.' });
      fetchMatches();
    } catch (e) {
      console.error("Delete match error:", e);
      showToast({ type: 'error', text: 'Failed to delete match.' });
    }
  };

  return (
    <div className="bento-card" style={{ padding: '1.75rem', background: 'var(--glass-bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', margin: 0 }}>⚽ FIFA Matches Management</h2>
        <button 
          type="button"
          onClick={() => setShowBulk(!showBulk)} 
          style={{
            ...dangerBtnStyle,
            background: 'rgba(96,165,250,0.1)',
            color: '#60A5FA',
            border: '1px solid rgba(96,165,250,0.2)',
            padding: '0.4rem 0.8rem'
          }}
        >
          {showBulk ? 'Add Single Match' : 'Bulk Import Matches'}
        </button>
      </div>

      {showBulk ? (
        <form onSubmit={handleBulkAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>PASTE FIXTURES LIST (JSON or Comma-Separated)</label>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Format: <code>Team A vs Team B, YYYY-MM-DDTHH:MM</code> (one per line) or a JSON array of match objects.
            </p>
          </div>
          <textarea
            value={bulkInput}
            onChange={e => setBulkInput(e.target.value)}
            placeholder={`Mexico vs South Africa, 2026-06-12T00:30\nSouth Korea vs Czechia, 2026-06-12T07:30`}
            rows="6"
            style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }}
            required
          />
          <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, width: 'fit-content', padding: '0.5rem 1rem' }}>
            {loading ? 'Importing...' : 'Bulk Import Matches'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAddMatch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <input type="text" placeholder="Team A" value={teamA} onChange={e => setTeamA(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '100px'}} required />
          <span style={{alignSelf: 'center'}}>vs</span>
          <input type="text" placeholder="Team B" value={teamB} onChange={e => setTeamB(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '100px'}} required />
          <input type="datetime-local" value={matchDate} onChange={e => setMatchDate(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '150px'}} required />
          <select value={matchType} onChange={e => setMatchType(e.target.value)} style={{...inputStyle, flex: 1, minWidth: '130px'}} required>
            <option value="normal" style={{background: '#1a1a1a', color: '#f3f4f6'}}>Normal Match (1pt)</option>
            <option value="semi_final" style={{background: '#1a1a1a', color: '#f3f4f6'}}>Semi-Final (2pts)</option>
            <option value="final" style={{background: '#1a1a1a', color: '#f3f4f6'}}>Final (4pts)</option>
          </select>
          <button type="submit" disabled={loading} style={{...primaryBtnStyle, flex: '0 0 auto', padding: '0.5rem 1rem'}}>Add Match</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {matches.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: 0 }}>
              <div>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 'bold' }}>
                  {m.teamA} vs {m.teamB}
                  {m.matchType && m.matchType !== 'normal' && (
                    <span style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', background: m.matchType === 'final' ? 'rgba(245,158,11,0.2)' : 'rgba(96,165,250,0.2)', color: m.matchType === 'final' ? '#F59E0B' : '#60A5FA' }}>
                      {m.matchType === 'final' ? 'Final' : 'Semi-Final'}
                    </span>
                  )}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{m.matchDate?.toDate ? m.matchDate.toDate().toLocaleString() : new Date(m.matchDate).toLocaleString()} - {m.status}</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={m.visible !== false}
                  onChange={async (e) => {
                    try {
                      await updateDoc(doc(db, 'fifa_matches', m.id), {
                        visible: e.target.checked
                      });
                      showToast({ type: 'success', text: 'Visibility updated' });
                      fetchMatches();
                    } catch (err) {
                      showToast({ type: 'error', text: 'Failed to update visibility' });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
                Visible
              </label>
            </div>
            {m.status === 'upcoming' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="number" id={`adminScoreA-${m.id}`} placeholder={`${m.teamA}`} style={{...inputStyle, width: '70px', padding: '0.4rem'}} min="0" />
                <input type="number" id={`adminScoreB-${m.id}`} placeholder={`${m.teamB}`} style={{...inputStyle, width: '70px', padding: '0.4rem'}} min="0" />
                <button onClick={() => handleCompleteMatch(m.id, m.teamA, m.teamB, m.matchType)} style={dangerBtnStyle}>Mark Complete</button>
                <button onClick={() => handleDeleteMatch(m)} style={{...dangerBtnStyle, padding: '0.4rem', display: 'flex', alignItems: 'center'}} title="Delete Match"><IconTrash/></button>
              </div>
            )}
            {m.status === 'completed' && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 'bold' }}>{m.actualScoreA} - {m.actualScoreB} ({m.actualWinner})</span>
                <button onClick={() => handleDeleteMatch(m)} style={{...dangerBtnStyle, padding: '0.4rem', display: 'flex', alignItems: 'center'}} title="Delete Match"><IconTrash/></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FIFA Admin Leaderboard Section ──────────────────────────────────────────
function FifaLeaderboardAdminSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'fifa_users'), orderBy('points', 'desc'));
        const snapshot = await getDocs(q);
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching admin leaderboard:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bento-card" style={{ padding: '1.75rem', background: 'var(--glass-bg)', marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>📋 FIFA Players Data</h2>
      {loading ? <p style={{ color: 'var(--color-text-secondary)' }}>Loading players...</p> : users.length === 0 ? <p style={{ color: 'var(--color-text-secondary)' }}>No registered users yet.</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text-primary)', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Branch</th>
                <th style={{ padding: '0.75rem' }}>Sem</th>
                <th style={{ padding: '0.75rem' }}>Phone</th>
                <th style={{ padding: '0.75rem' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '0.75rem' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.branch || '-'}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.sem || '-'}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.phone || '-'}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#60A5FA' }}>{u.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const [creds, setCreds] = useState(() => {
    const saved = localStorage.getItem('adminCreds');
    return saved ? JSON.parse(saved) : null;
  });
  const [toast, setToast] = useState(null);
  const [deviceCount, setDeviceCount] = useState(null);

  const showToast = useCallback((t) => setToast(t), []);

  const fetchDeviceCount = useCallback(async () => {
    try {
      const coll = collection(db, 'tokens');
      const snapshot = await getCountFromServer(coll);
      setDeviceCount(snapshot.data().count);
    } catch (e) {
      console.error("Error fetching device count:", e);
    }
  }, []);

  useEffect(() => {
    if (creds) {
      fetchDeviceCount();
    }
  }, [creds, fetchDeviceCount]);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-color: rgba(255,255,255,0.04); }
          50%  { background-color: rgba(255,255,255,0.08); }
          100% { background-color: rgba(255,255,255,0.04); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .admin-input:focus { border-color: var(--color-electric-blue) !important; }
        .admin-del-btn:hover { background: rgba(239,68,68,0.22) !important; }
      `}</style>

      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {!creds ? (
        <LoginScreen onLogin={(c) => {
          setCreds(c);
          localStorage.setItem('adminCreds', JSON.stringify(c));
        }} />
      ) : (
        <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <h1 style={{
                fontSize: '1.75rem', fontWeight: '700', margin: 0,
                background: 'linear-gradient(135deg, #60a5fa, #A78BFA)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Admin Panel
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Logged in as <strong style={{ color: 'var(--color-text-primary)' }}>{creds.username}</strong>
                </p>
                <div style={{ 
                  height: '14px', width: '1px', background: 'var(--glass-border)' 
                }} />
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  color: '#60a5fa', fontSize: '0.875rem', fontWeight: '600'
                }}>
                  <IconDevices />
                  <span>{deviceCount !== null ? deviceCount : '…'} devices installed</span>
                </div>
              </div>
            </div>
            <button
              id="admin-logout-btn"
              onClick={() => {
                setCreds(null);
                localStorage.removeItem('adminCreds');
              }}
              style={{
                ...dangerBtnStyle,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--glass-border)',
                padding: '0.625rem 1rem',
              }}
            >
              <IconLogout />
              Logout
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}>
            <DeleteSection creds={creds} showToast={showToast} />
            <AddSection creds={creds} showToast={showToast} />
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <FifaAdminSection showToast={showToast} />
            <FifaLeaderboardAdminSection />
          </div>
        </div>
      )}
    </>
  );
}
