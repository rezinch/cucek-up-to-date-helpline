import React from 'react';

const linksData = [
    {
        href: "https://cucek.cusat.ac.in/?page=3",
        iconEmoji: "👨‍🏫",
        title: "Faculty Directory",
        desc: "Contact faculty members"
    },
    {
        href: "https://admissions.cusat.ac.in/Files/FEE%20STRUCTURE%202024-FINAL1.pdf",
        iconEmoji: "💰",
        title: "Fee Structure",
        desc: "View current fee details"
    },
    {
        href: "/items/fee.pdf",
        iconEmoji: "📋",
        title: "Academic Regulations",
        desc: "Academic rules and guidelines"
    },
    {
        href: "https://chat.whatsapp.com/F9n2thbfS8XDoAhHaIuSCb?mode=ac_t",
        imgSrc: "/items/whatsapp.png",
        title: "WhatsApp Group",
        desc: "Join our WhatsApp community"
    },
    {
        href: "https://www.instagram.com/ksu_cucek/?hl=en",
        imgSrc: "/items/insta.png",
        title: "Instagram",
        desc: "Follow us on Instagram"
    },
    {
        href: "https://drive.google.com/drive/folders/1TgroPw28Ql1OXHkGBeg1MTDZwSHAEAlT?usp=sharing",
        imgSrc: "/items/notes.png",
        title: "Notes",
        desc: "Access important notes"
    }
];

function AdditionalLinks() {
    return (
        <section id="qrcodes" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Additional Links</h2>
                <p className="section-description">Quick access to important resources</p>
            </div>
            <div className="qr-grid">
                {linksData.map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="qr-card hover-lift"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="qr-placeholder">
                            {link.imgSrc ? (
                                <img
                                    src={link.imgSrc}
                                    alt={`${link.title} Icon`}
                                    style={{ width: '2.25rem', height: '2.25rem', objectFit: 'contain' }}
                                />
                            ) : (
                                link.iconEmoji
                            )}
                        </div>
                        <figcaption>{link.title}</figcaption>
                        <p className="qr-desc">{link.desc}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default AdditionalLinks;
