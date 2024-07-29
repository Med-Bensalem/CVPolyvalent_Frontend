import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

import ModelCV2 from "./ModelCV2";
import ModelCV1 from "./ModalCV1";

const ViewCV = () => {
    const [selectedCV, setSelectedCV] = useState('Model1');

    const printCV = () => {
        const element = document.getElementById('cv');
        const opt = {
            margin: [10, 0, 10, 0],
            filename: 'cv.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div id="db-wrapper">
            <Sidebar />
            <main id="page-content">
                <div className="header">
                    <Header />
                </div>
                <section className="container-fluid p-4">
                    <div className="container-xxl flex-grow-4 container-p-y">
                        <div id="buttons-container" className="d-flex justify-content-center">
                            <button className="btn btn-outline-primary mb-2 mx-2"
                                    onClick={() => setSelectedCV('Model1')}>Afficher Modèle 1
                            </button>
                            <button className="btn btn-outline-primary mb-2"
                                    onClick={() => setSelectedCV('Model2')}>Afficher Modèle 2
                            </button>
                        </div>
                        <div id="cv-content" className="container" id="cv">
                            {selectedCV === 'Model1' && <ModelCV1 />}
                            {selectedCV === 'Model2' && <ModelCV2 />}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-outline-primary mb-2 " onClick={printCV}>
                            <i className="fas fa-download mx-1"> Télécharger en PDF</i>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ViewCV;
