import React, { useState } from 'react';
import Modal from '../UI/Modal';

const helpdeskData = [
    {
        img: '/icon/generalenquiry.png',
        head: "General Enquiry",
        persons: [
            { name: "Unais", phone: "8078494673" },
            { name: "Eesa", phone: "9072341909" },
            { name: "Anand", phone: "9061564501" }
        ]
    },
    {
        img: '/icon/it.png',
        head: "Information Technology",
        persons: [
            { name: "Eesa", phone: "9072341909" },
            { name: "Niswan", phone: "9061891616" },
            { name: "Sahil", phone: "7907176934" }
        ]
    },
    {
        img: '/icon/ec.png',
        head: "Electronics & Communication Engineering",
        persons: [
            { name: "Hari", phone: "8590170265" },
            { name: "Rezin", phone: "8086982257" },
            { name: "Kiran", phone: "8086091942" }
        ]
    },
    {
        img: '/icon/eee.png',
        head: "Electrical & Electronics Engineering",
        persons: [
            { name: "Shinan", phone: "8156808440" },
            { name: "Shahzad", phone: "8590465414" }
        ]
    },
    {
        img: '/icon/cs.png',
        head: "Computer Science & Engineering",
        persons: [
            { name: "Maria", phone: "9072955673" },
            { name: "Sijin", phone: "8590912038" },
            { name: "Kiran S", phone: "8848259608" }
        ]
    },
    {
        img: '/icon/civil.png',
        head: "Civil Engineering",
        persons: [
            { name: "Hani", phone: "9495556338" },
            { name: "Lara", phone: "8547244149" }
        ]
    },
    {
        img: '/icon/mca.png',
        head: "MCA",
        persons: [
            { name: "Aslam", phone: "7994595108" },
            { name: "Amil", phone: "8129154915" }
        ]
    }
];

function Helpdesk() {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeData, setActiveData] = useState({ head: '', persons: [] });

    const openModal = (item) => {
        setActiveData({ head: item.head, persons: item.persons });
        setModalOpen(true);
    };

    return (
        <section id="helpdesk" className="tab-content section-animate" role="tabpanel">
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                <div className="section-header" style={{ textAlign: 'center' }}>
                    <h2>Helpdesk</h2>
                    <p className="section-description">Contact Us</p>
                </div>

                <div className="helpdesk-grid">
                    {helpdeskData.map((item, index) => (
                        <div
                            key={index}
                            className={`bento-card ${index === 0 ? 'col-span-2' : ''}`}
                            onClick={() => openModal(item)}
                            style={{
                                cursor: 'pointer',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: index === 0 ? '2.5rem 2rem' : '2rem 1.5rem',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={item.img} alt="" style={{ width: index === 0 ? '5rem' : '3.5rem', height: index === 0 ? '5rem' : '3.5rem', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
                            </div>
                            <div>
                                <h3 className="card-title" style={{ fontSize: index === 0 ? '1.6rem' : '1.1rem', fontWeight: '600', marginBottom: '0.35rem', lineHeight: '1.3' }}>{item.head}</h3>
                                <p className="card-desc" style={{ color: 'var(--color-electric-blue)', fontSize: index === 0 ? '1rem' : '0.85rem', fontWeight: '500' }}>Tap for contacts &rarr;</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                head={activeData.head}
                content={activeData.persons}
            />
        </section>
    );
}

export default Helpdesk;
