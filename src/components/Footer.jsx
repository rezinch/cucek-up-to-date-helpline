import React from 'react';

function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                    Powered by KSU CUCEK <img src="/blah.png" alt="" style={{ width: '35px', height: '35px', objectFit: 'contain', display: 'inline-block', marginLeft: '-8px' }} />
                </p>
            </div>
        </footer>
    );
}

export default Footer;
