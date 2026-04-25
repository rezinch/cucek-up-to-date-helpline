import React, { useState, useEffect } from 'react';

function Hostels() {
    const [activeTab, setActiveTab] = useState('boys');
    const [boysList, setBoysList] = useState([]);
    const [girlsList, setGirlsList] = useState([]);
    const [loadingBoys, setLoadingBoys] = useState(true);
    const [loadingGirls, setLoadingGirls] = useState(true);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                // Fetch boys hostels
                fetch('/bh.json')
                    .then(res => res.ok ? res.json() : [])
                    .then(data => { setBoysList(data); setLoadingBoys(false); })
                    .catch(() => setLoadingBoys(false));

                // Fetch girls hostels
                fetch('/gh.json')
                    .then(res => res.ok ? res.json() : [])
                    .then(data => { setGirlsList(data); setLoadingGirls(false); })
                    .catch(() => setLoadingGirls(false));
            } catch (err) {
                console.error("Error starting fetch:", err);
            }
        };

        fetchHostels();
    }, []);

    const renderTableBody = (list, loading) => {
        if (loading) return <tr><td colSpan="2">Loading...</td></tr>;
        if (list.length === 0) return <tr><td colSpan="2">No hostels listed.</td></tr>;

        return list.map((hostel, idx) => (
            <tr key={idx} className="hostel-row">
                <td>{hostel.name || ''}</td>
                <td>{hostel.phone || ''}</td>
            </tr>
        ));
    };

    return (
        <section id="hostels" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Approved Hostels</h2>
                <p className="section-description">Find comfortable & safe accommodation</p>
            </div>

            <div className="hostel-switch hostel-toggle-buttons">
                <button
                    id="boysBtn"
                    className={`btn btn--primary ${activeTab === 'boys' ? 'active' : ''}`}
                    onClick={() => setActiveTab('boys')}
                >
                    Boys Hostel
                </button>
                <button
                    id="girlsBtn"
                    className={`btn btn--primary ${activeTab === 'girls' ? 'active' : ''}`}
                    onClick={() => setActiveTab('girls')}
                >
                    Girls Hostel
                </button>
            </div>

            <div className="hostels-container">
                {activeTab === 'boys' && (
                    <div className="hostels-section hostel-slide-in" id="boysSection">
                        <div className="hostels-header">
                            <h3>Boys Hostels</h3>
                        </div>
                        <div className="hostels-content" id="boysContent">
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableBody(boysList, loadingBoys)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'girls' && (
                    <div className="hostels-section hostel-slide-in" id="girlsSection">
                        <div className="hostels-header">
                            <h3>Girls Hostels</h3>
                        </div>
                        <div className="hostels-content" id="girlsContent">
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTableBody(girlsList, loadingGirls)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Hostels;
