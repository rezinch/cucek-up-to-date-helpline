/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Bus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function parseTime(timeStr) {
    if (!timeStr) return null;
    const [time, modifier] = timeStr.trim().split(' ');
    if (!time || !modifier) return null;
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (hours === 12 && modifier.toUpperCase() === 'AM') {
        hours = 0;
    } else if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    }
    return hours * 60 + minutes;
}

function getNextBus(schedule, currentMinutes) {
    if (!schedule || schedule.length === 0) return null;
    let nextBus = null;
    let minDiff = Infinity;

    for (const bus of schedule) {
        if (!bus.time) continue;
        const busMinutes = parseTime(bus.time);
        if (busMinutes === null) continue;

        let diff = busMinutes - currentMinutes;
        // If bus already passed today, consider it for tomorrow
        if (diff < 0) diff += 24 * 60;

        if (diff < minDiff) {
            minDiff = diff;
            nextBus = { ...bus, diff };
        }
    }
    return nextBus;
}

export default function LiveBusCard({ setActiveTab }) {
    const [alpTimes, setAlpTimes] = useState([]);
    const [kylpTimes, setKylpTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchBusData = async () => {
            try {
                const [alpRes, kylpRes] = await Promise.all([
                    fetch('/alp.json'),
                    fetch('/kylp.json')
                ]);

                if (alpRes.ok) setAlpTimes(await alpRes.json());
                if (kylpRes.ok) setKylpTimes(await kylpRes.json());
            } catch (error) {
                console.error("Error fetching bus timings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
        return () => clearInterval(timer);
    }, []);

    const renderBus = (fromData, toData, fromName, toName) => {
        // Extract direction arrays
        // fromData means From -> To
        // toData means To -> From
        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

        const fromSchedule = fromData.map((d) => ({
            station: d.from_station,
            time: d.from_time,
            dest: toName
        })).filter(x => x.time);

        const toSchedule = toData.map((d) => ({
            station: d.to_station,
            time: d.to_time,
            dest: fromName
        })).filter(x => x.time);

        const nextFrom = getNextBus(fromSchedule, currentMinutes);
        const nextTo = getNextBus(toSchedule, currentMinutes);

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--color-slate-800)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Next to {toName}</div>
                    <div className="bus-time">{nextFrom ? nextFrom.time : '--:--'}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-electric-blue)' }}>
                        {nextFrom ? `in ${nextFrom.diff} min` : ''}
                    </div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--color-slate-800)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Next to {fromName}</div>
                    <div className="bus-time">{nextTo ? nextTo.time : '--:--'}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-electric-blue)' }}>
                        {nextTo ? `in ${nextTo.diff} min` : ''}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            className="bento-card col-span-2 row-span-2"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bus className="card-icon" size={24} />
                    <h3 className="card-title">Live Bus Tracker</h3>
                </div>
                <div className="live-badge">
                    <Clock size={14} /> Live
                </div>
            </div>

            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading schedules...
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Alappuzha ↔ Kaavalam</div>
                        {renderBus(alpTimes, alpTimes, 'Kaavalam', 'Alappuzha')}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Kayalpuram ↔ Changanassery</div>
                        {renderBus(kylpTimes, kylpTimes, 'Kayalpuram', 'Changanassery')}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ marginTop: 'auto', width: '100%', background: 'var(--color-slate-700)', color: 'var(--color-text-primary)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('bus');
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--color-slate-600)'}
                        onMouseLeave={(e) => e.target.style.background = 'var(--color-slate-700)'}
                    >
                        View All Timings
                    </button>
                </div>
            )}
        </motion.div>
    );
}
