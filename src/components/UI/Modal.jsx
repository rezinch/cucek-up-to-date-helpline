import React from 'react';

function Modal({ isOpen, onClose, head, content }) {
    if (!isOpen) return null;

    return (
        <div id="overlay" className="overlay show" onClick={onClose}>
            {/* Stop propagation so clicking inside modal doesn't close it */}
            <div
                id="modal"
                className="modal zoom-in"
                style={{ width: '300px', display: 'block' }}
                onClick={(e) => e.stopPropagation()}
            >
                <span id="closeModal" className="close" onClick={onClose}>&times;</span>
                <h2 id="modalHead" style={{ textAlign: 'center' }}>{head}</h2>
                <div id="modalContent">
                    {content.map((person, index) => (
                        <p key={index} style={{ textAlign: 'center' }}>
                            <strong>{person.name}</strong><br />{person.phone}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Modal;
