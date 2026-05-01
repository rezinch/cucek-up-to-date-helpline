/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BookOpen, Download, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schemesData = {
    ce: ['2019', '2023'],
    cs: ['2019', '2023'],
    ec: ['2019', '2023'],
    ee: ['2019', '2023'],
    it: ['2019', '2023'],
    mca: ['2012', '2023']
};

export default function SyllabusCard() {
    const [branch, setBranch] = useState('');
    const [scheme, setScheme] = useState('');

    const handleDownload = () => {
        if (!branch || !scheme) return;
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
        <motion.div 
            className="bento-card"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            <div className="card-header">
                <BookOpen className="card-icon" size={24} />
                <div>
                    <h3 className="card-title">Syllabus</h3>
                    <p className="card-desc">Download PDF</p>
                </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <select 
                    className="form-select" 
                    value={branch} 
                    onChange={(e) => {
                        setBranch(e.target.value);
                        setScheme('');
                    }}
                >
                    <option value="">Select Branch</option>
                    <option value="ce">Civil</option>
                    <option value="cs">Computer Science</option>
                    <option value="ec">Electronics</option>
                    <option value="ee">Electrical</option>
                    <option value="it">Information Tech</option>
                    <option value="mca">MCA</option>
                </select>

                <AnimatePresence>
                    {branch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <select 
                                className="form-select" 
                                value={scheme} 
                                onChange={(e) => setScheme(e.target.value)}
                            >
                                <option value="">Select Scheme</option>
                                {schemesData[branch].map(s => (
                                    <option key={s} value={s}>{s === '2023' ? '2023 & 2025' : s}</option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {branch && scheme && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{ marginTop: '0.5rem' }}
                        >
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleDownload}>
                                <Download size={18} /> Download
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
