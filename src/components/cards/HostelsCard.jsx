/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Home, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HostelsCard() {
    const [boysList, setBoysList] = useState([]);
    const [girlsList, setGirlsList] = useState([]);
    const [activeTab, setActiveTab] = useState('boys');

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                fetch('/bh.json').then(r => r.json()).then(setBoysList).catch(()=>{});
                fetch('/gh.json').then(r => r.json()).then(setGirlsList).catch(()=>{});
            } catch (err) {}
        };
        fetchHostels();
    }, []);

    const list = activeTab === 'boys' ? boysList : girlsList;

    return (
        <motion.div 
            className="bento-card col-span-2"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            style={{ maxHeight: '400px', display: 'flex', flexDirection: 'column' }}
        >
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home className="card-icon" size={24} />
                    <div>
                        <h3 className="card-title">Approved Hostels</h3>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-slate-800)', borderRadius: '8px', padding: '0.25rem' }}>
                    <button 
                        style={{ background: activeTab === 'boys' ? 'var(--color-slate-700)' : 'transparent', border: 'none', color: 'var(--color-text-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => setActiveTab('boys')}
                    >
                        Boys
                    </button>
                    <button 
                         style={{ background: activeTab === 'girls' ? 'var(--color-slate-700)' : 'transparent', border: 'none', color: 'var(--color-text-primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                         onClick={() => setActiveTab('girls')}
                    >
                        Girls
                    </button>
                </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                    >
                        {list.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>No hostels found</div>
                        ) : (
                            list.map((h, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-slate-800)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-electric-blue)' }}>
                                            <Home size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{h.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{activeTab === 'boys' ? 'Boys Hostel' : 'Girls Hostel'}</div>
                                        </div>
                                    </div>
                                    <a href={`tel:${h.phone}`} className="btn" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                        <Phone size={16} /> Call
                                    </a>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
