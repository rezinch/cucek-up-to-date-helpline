import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, doc, updateDoc, where } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../../firebase';

export default function FifaChallenge() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [sem, setSem] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('predictions');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchMatchesAndPredictions = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // Fetch Matches
      const q = query(collection(db, 'fifa_matches'), orderBy('matchDate', 'asc'));
      const snapshot = await getDocs(q);
      const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMatches(matchesData);

      // Fetch User's Predictions
      const pq = query(collection(db, 'fifa_predictions'), where('userId', '==', user.uid));
      const pSnapshot = await getDocs(pq);
      const preds = {};
      pSnapshot.docs.forEach(doc => {
        const data = doc.data();
        preds[data.matchId] = { id: doc.id, ...data };
      });
      setPredictions(preds);

      // Fetch Leaderboard
      fetchLeaderboard();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const lq = query(collection(db, 'fifa_users'), where('points', '>', 0), orderBy('points', 'desc'));
      const lSnapshot = await getDocs(lq);
      const lData = lSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(lData);
    } catch (e) {
      console.error("Error fetching leaderboard:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatchesAndPredictions();
    }
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isSignUp) {
        if (!name.trim() || !branch.trim() || !sem.trim()) {
          setAuthError("Please enter your name, branch, and semester.");
          return;
        }
        const userCreds = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCreds.user);
        
        // Create user doc
        await addDoc(collection(db, 'fifa_users'), {
          uid: userCreds.user.uid,
          name: name,
          branch: branch,
          sem: sem,
          phone: phone,
          email: email,
          points: 0
        });
        showToast('Verification email sent. Please check your inbox.', 'success');
      } else {
        const userCreds = await signInWithEmailAndPassword(auth, email, password);
        if (!userCreds.user.emailVerified) {
          setAuthError("Please verify your email before accessing the challenge.");
        }
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setEmail('');
    setPassword('');
    setName('');
    setBranch('');
    setSem('');
    setPhone('');
  };

  const handleResendVerification = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
        showToast('Verification email resent. Please check your inbox.', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Password reset link sent to your email.', 'success');
      setIsForgotPassword(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleReloadUser = async () => {
    try {
      if (user) {
        await user.reload();
        // Force state update to reflect verified status
        setUser({ ...auth.currentUser });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitPrediction = async (matchId, teamA, teamB) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      const matchTime = (match.matchDate?.toDate ? match.matchDate.toDate() : new Date(match.matchDate)).getTime();
      const currentTime = Date.now();
      if (currentTime >= matchTime) {
        showToast('Submissions are closed for this match.', 'error');
        return;
      }
    }

    const scoreA = document.getElementById(`scoreA-${matchId}`).value;
    const scoreB = document.getElementById(`scoreB-${matchId}`).value;

    if (!scoreA || !scoreB) {
      showToast('Please fill all prediction fields', 'error');
      return;
    }

    const sA = parseInt(scoreA);
    const sB = parseInt(scoreB);
    let winner = 'Draw';
    if (sA > sB) winner = teamA;
    if (sB > sA) winner = teamB;

    console.log("Submitting prediction payload:", {
      matchId,
      userId: user.uid,
      predictedScoreA: sA,
      predictedScoreB: sB,
      predictedWinner: winner
    });

    try {
      await addDoc(collection(db, 'fifa_predictions'), {
        matchId,
        userId: user.uid,
        predictedScoreA: sA,
        predictedScoreB: sB,
        predictedWinner: winner
      });
      showToast('Prediction submitted!');
      fetchMatchesAndPredictions();
    } catch (err) {
      console.error("Prediction submission failed:", err);
      showToast('Error submitting prediction', 'error');
    }
  };

  if (loadingAuth) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  }

  if (!user) {
    if (isForgotPassword) {
      return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }} className="bento-card">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
            Reset Password
          </h2>
          {authError && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{authError}</p>}
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
                style={inputStyle}
              />
            </div>
            <button type="submit" style={primaryBtnStyle}>
              Send Reset Link
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }} onClick={() => { setIsForgotPassword(false); setAuthError(''); }}>
            Back to Sign In
          </p>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }} className="bento-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
          {isSignUp ? 'Join FIFA Challenge' : 'Login to FIFA Challenge'}
        </h2>
        {authError && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{authError}</p>}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#FCA5A5',
                lineHeight: '1.4',
                marginBottom: '0.5rem'
              }}>
                ⚠️ <strong>Notice:</strong> Participants will be verified along with their branch and semester. Multiple accounts are strictly prohibited.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="form-input"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Branch</label>
                <input
                  type="text"
                  placeholder="e.g. CS, EC, ME"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  required
                  className="form-input"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Semester</label>
                <select
                  value={sem}
                  onChange={e => setSem(e.target.value)}
                  required
                  className="form-input"
                  style={inputStyle}
                >
                  <option value="" disabled style={{background: '#1a1a1a', color: '#f3f4f6'}}>Select Semester</option>
                  <option value="S1" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S1</option>
                  <option value="S2" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S2</option>
                  <option value="S3" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S3</option>
                  <option value="S4" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S4</option>
                  <option value="S5" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S5</option>
                  <option value="S6" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S6</option>
                  <option value="S7" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S7</option>
                  <option value="S8" style={{background: '#1a1a1a', color: '#f3f4f6'}}>S8</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="form-input"
                  style={inputStyle}
                />
              </div>
            </>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Password</label>
              {!isSignUp && (
                <span 
                  onClick={() => { setIsForgotPassword(true); setAuthError(''); }} 
                  style={{ fontSize: '0.8rem', color: '#60A5FA', cursor: 'pointer', fontWeight: '600' }}
                >
                  Forgot password?
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required={!isForgotPassword}
              className="form-input"
              style={inputStyle}
              minLength="6"
            />
          </div>
          <button type="submit" style={primaryBtnStyle}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }} onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); setAuthError(''); }}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(16,185,129,0.9)',
          color: 'white', padding: '1rem', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>FIFA Challenge</h1>
        <button onClick={handleSignOut} style={dangerBtnStyle}>Sign Out</button>
      </div>

      {!user.emailVerified ? (
        <div className="bento-card" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Verify Your Email</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            We've sent a verification email to <strong>{user.email}</strong>. Please click the link in the email to verify your account before participating in the challenge.
          </p>
          <p style={{ color: '#F59E0B', fontSize: '0.875rem', marginBottom: '2rem', background: 'rgba(245,158,11,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
            ⚠️ <strong>Can't find the email?</strong> Please make sure to check your <strong>Spam / Junk</strong> folder.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={handleReloadUser} style={primaryBtnStyle}>
              I have verified my email
            </button>
            <button onClick={handleResendVerification} style={{...primaryBtnStyle, background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: '1px solid var(--glass-border)'}}>
              Resend Verification Email
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Matches Section */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Upcoming Matches</h2>
            {loadingData ? <p>Loading matches...</p> : matches.length === 0 ? <p style={{ color: 'var(--color-text-secondary)' }}>No matches available right now.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {matches.filter(m => m.status !== 'completed').map(match => (
                  <div key={match.id} className="bento-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {match.teamA} <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'normal', margin: '0 0.5rem' }}>vs</span> {match.teamB}
                        {match.matchType && match.matchType !== 'normal' && (
                          <span style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', background: match.matchType === 'final' ? 'rgba(245,158,11,0.2)' : 'rgba(96,165,250,0.2)', color: match.matchType === 'final' ? '#F59E0B' : '#60A5FA', verticalAlign: 'middle' }}>
                            {match.matchType === 'final' ? 'Final' : 'Semi-Final'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {match.matchDate?.toDate ? match.matchDate.toDate().toLocaleDateString() : new Date(match.matchDate).toLocaleDateString()}
                      </div>
                    </div>

                    {predictions[match.id] ? (
                      <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <p style={{ margin: 0, color: '#10B981', fontSize: '0.9rem', fontWeight: '600' }}>Your Prediction:</p>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>
                          Score: {predictions[match.id].predictedScoreA} - {predictions[match.id].predictedScoreB} <br/>
                          Winner: {predictions[match.id].predictedWinner}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 80px' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{match.teamA} Score</label>
                          <input type="number" id={`scoreA-${match.id}`} min="0" style={inputStyle} />
                        </div>
                        <div style={{ flex: '1 1 80px' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{match.teamB} Score</label>
                          <input type="number" id={`scoreB-${match.id}`} min="0" style={inputStyle} />
                        </div>
                        <div style={{ flex: '1 1 100%' }}>
                          <button onClick={() => submitPrediction(match.id, match.teamA, match.teamB)} style={{...primaryBtnStyle, marginTop: '0.5rem'}}>
                            Submit Prediction
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Leaderboard & Rules Stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Leaderboard Section */}
            <div className="bento-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Leaderboard</h2>
              {leaderboard.length === 0 ? <p style={{ color: 'var(--color-text-secondary)' }}>No points awarded yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {leaderboard.map((userObj, index) => (
                    <div key={userObj.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 'bold', color: index === 0 ? '#F59E0B' : index === 1 ? '#9CA3AF' : index === 2 ? '#B45309' : 'var(--color-text-secondary)' }}>
                          #{index + 1}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{userObj.name}</span>
                          {(userObj.branch || userObj.sem) && (
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                              {userObj.branch || ''} {userObj.branch && userObj.sem ? '•' : ''} {userObj.sem || ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#60A5FA' }}>{userObj.points} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rules Section */}
            <div className="bento-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📜 Rules & Info
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderLeft: '3px solid #60A5FA', paddingLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>⚽ How to Participate</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                    Enter your predicted scores for any upcoming match and click <strong>Submit Prediction</strong> before kickoff.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid #10B981', paddingLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>🏆 Point Scoring System</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                    Receive points for perfect predictions (correct scores & winner):
                  </p>
                  <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0, color: 'var(--color-text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                    <li>🔥 <strong>Normal Match</strong>: <code>+1 point</code></li>
                    <li>⚡ <strong>Semi-Final</strong>: <code>+2 points</code></li>
                    <li>👑 <strong>Final</strong>: <code>+4 points</code></li>
                  </ul>
                </div>

                <div style={{ borderLeft: '3px solid #F59E0B', paddingLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>⏱️ Lockout Deadlines</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                    Predictions lock instantly once a match starts. Late submissions are rejected by the database.
                  </p>
                </div>

                <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>🛡️ Verification & Fair Play</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                    Participants will be verified along with their branch and semester. Creation of multiple accounts is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  boxSizing: 'border-box'
};

const primaryBtnStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #0066FF, #3385ff)',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer'
};

const dangerBtnStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  background: 'rgba(239,68,68,0.1)',
  color: '#EF4444',
  fontWeight: 'bold',
  border: '1px solid rgba(239,68,68,0.2)',
  cursor: 'pointer'
};
