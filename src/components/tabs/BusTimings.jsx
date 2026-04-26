import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

function BusTimings() {
    const { isInstallable, install } = usePWAInstall();
    const [alpTimes, setAlpTimes] = useState([]);
    const [kylpTimes, setKylpTimes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const renderTableBody = (data) => {
        if (loading) {
            return <tr><td colSpan="4">Loading...</td></tr>;
        }
        if (!data || data.length === 0) {
            return <tr><td colSpan="4">No timings available.</td></tr>;
        }
        return data.map((route, idx) => (
            <tr key={idx} className="bus-row">
                <td>{route.from_station || ''}</td>
                <td>{route.from_time || ''}</td>
                <td>{route.to_station || ''}</td>
                <td>{route.to_time || ''}</td>
            </tr>
        ));
    };

    return (
        <section id="bus" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Bus Timings</h2>
                <p className="section-description"></p>
            </div>
            <div className="bus-routes">
                <div className="route-section scale-animate">
                    <h3>Alappuzha ↔ Kaavalam / Thattassery</h3>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>From Station</th>
                                    <th>Time</th>
                                    <th className="divider">From Station</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody(alpTimes)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="route-section scale-animate">
                    <h3>Kayalpuram ↔ Changanassery</h3>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>From Station</th>
                                    <th>Time</th>
                                    <th className="divider">From Station</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody(kylpTimes)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </section>
    );
}

export default BusTimings;
