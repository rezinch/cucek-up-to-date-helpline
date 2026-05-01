import React, { useState } from 'react';

const schemesData = {
    ce: ['2019', '2023'],
    cs: ['2019', '2023'],
    ec: ['2019', '2023'],
    ee: ['2019', '2023'],
    it: ['2019', '2023'],
    mca: ['2012', '2023']
};

function Syllabus() {
    const [branch, setBranch] = useState('');
    const [scheme, setScheme] = useState('');

    const availableSchemes = branch ? schemesData[branch] || [] : [];
    const canDownload = branch && scheme;

    const handleBranchChange = (e) => {
        setBranch(e.target.value);
        setScheme(''); // Reset scheme when branch changes
    };

    const handleDownload = () => {
        if (!canDownload) return;
        const fileName = `syllabus_${branch}_${scheme}.pdf`;
        const fileUrl = `/syllabus/${fileName}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section id="syllabus" className="tab-content section-animate" role="tabpanel">
            <div className="section-header">
                <h2>Syllabus</h2>
                <p className="section-description">Download syllabus documents for your branch & scheme</p>
            </div>
            <div className="syllabus-form">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="branchSelect">Branch</label>
                        <select
                            className="form-control dropdown-animate"
                            id="branchSelect"
                            value={branch}
                            onChange={handleBranchChange}
                        >
                            <option value="">Select Branch</option>
                            <option value="ce">Civil Engineering</option>
                            <option value="cs">Computer Science Engineering</option>
                            <option value="ec">Electronics & Communication Engineering</option>
                            <option value="ee">Electrical & Electronics Engineering</option>
                            <option value="it">Information Technology</option>
                            <option value="mca">MCA</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="schemeSelect">Scheme</label>
                        <select
                            className="form-control dropdown-animate"
                            id="schemeSelect"
                            value={scheme}
                            onChange={(e) => setScheme(e.target.value)}
                            disabled={!branch}
                        >
                            <option value="">Select Scheme</option>
                            {availableSchemes.map((s) => (
                                <option key={s} value={s}>{s === '2023' ? '2023 & 2025' : s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {canDownload && (
                    <button
                        className="btn btn--primary btn--lg download-btn"
                        id="downloadBtn"
                        onClick={handleDownload}
                    >
                        📥 Download Syllabus
                    </button>
                )}
            </div>
        </section>
    );
}

export default Syllabus;
