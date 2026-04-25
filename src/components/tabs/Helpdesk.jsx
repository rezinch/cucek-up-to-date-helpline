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
            <div className="section-header">
                <h2>Helpdesk</h2>
                <p className="section-description">Contact Us</p>
            </div>

            <div id="helpdeskCards" className="qr-grid">
                {helpdeskData.map((item, index) => (
                    <figure
                        key={index}
                        className="qr-card hover-lift"
                        onClick={() => openModal(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="qr-placeholder">
                            <img src={item.img} alt="" style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} />
                        </div>
                        <figcaption>{item.head}</figcaption>
                    </figure>
                ))}
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
