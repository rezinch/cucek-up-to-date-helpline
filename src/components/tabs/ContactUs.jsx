import React, { useState } from 'react';
import Modal from '../UI/Modal';

const generalEnquiryData = {
    img: '/icon/generalenquiry.png',
    head: "General Enquiry",
    persons: [
        { name: "Unais", phone: "8078494673" },
        { name: "Eesa", phone: "9072341909" },
        { name: "Anand", phone: "9061564501" }
    ]
};

function ContactUs() {
    const [status, setStatus] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [activeData, setActiveData] = useState({ head: '', persons: [] });

    const openModal = (item) => {
        setActiveData({ head: item.head, persons: item.persons });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Contact Us</h2>
                <p className="section-description">Contact us for any greivances or suggestions</p>
            </div>

            <div className="contact-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem', maxWidth: '600px', margin: '2rem auto' }}>

                <div className="contact-form-wrapper" style={{ background: 'var(--surface-color)', padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary-color)' }}>Send us a message</h3>

                    <form onSubmit={handleSubmit} className="contact-form">
                        {/* 
                          1. Go to https://web3forms.com/
                          2. Enter your email and get an Access Key
                          3. Replace 'YOUR_ACCESS_KEY_HERE' below with that key
                        */}
                        <input type="hidden" name="access_key" value="cab0caf4-b1be-4233-ab42-e9b00554fc01" />

                        {/* Optional: Add custom success redirect or subject line */}
                        <input type="hidden" name="subject" value="KSU Helpline Complaint Received" />

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                            <input type="text" id="name" name="name" className="form-control" required placeholder="John Doe" style={{ width: '100%' }} />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address (Optional)</label>
                            <input type="email" id="email" name="email" className="form-control" placeholder="john@example.com" style={{ width: '100%' }} />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Number</label>
                            <input type="tel" id="phone" name="phone" className="form-control" required placeholder="+91 9876543210" style={{ width: '100%' }} />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                            <textarea id="message" name="message" className="form-control" rows="5" required placeholder="Write your message here..." style={{ width: '100%', resize: 'vertical' }}></textarea>
                        </div>

                        <button type="submit" className="btn btn--primary" style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold' }} disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <div style={{ color: '#16a34a', background: '#dcfce7', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', textAlign: 'center', fontWeight: '500' }}>
                                ✅ Message sent successfully! We will get back to you soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div style={{ color: '#dc2626', background: '#fee2e2', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', textAlign: 'center', fontWeight: '500' }}>
                                ❌ Something went wrong. Please try again.
                            </div>
                        )}
                    </form>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--primary-color)' }}>For Urgent Issues Contact</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '1.1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600' }}>Sahil</span>
                            <a href="tel:+917907176934" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>7907176934</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600' }}>Anand</span>
                            <a href="tel:+919061564501" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>9061564501</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600' }}>Jasil</span>
                            <a href="tel:+919496076603" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>9496076603</a>
                        </div>
                    </div>
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

export default ContactUs;
