// Template2.js
import React from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import Competence from "../CV Pages/Competence/Competence";
import Experience from "../CV Pages/Experience/Experience";
import Formation from "../CV Pages/Formation/Formation";
import Langue from "../CV Pages/Langue/Langue";
import Certificat from "../CV Pages/Certificat/Certificat";
import Interet from "../CV Pages/Interet/Interet";

const MonCV = () => {
    return (
        <div id="db-wrapper">
            <Sidebar/>

            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>

                <section className="container-fluid p-4">

                    <div className="card mb-3 border-0">
                        <div className="card-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Mon CV </h4>

                        </div>

                        <Experience/>
                        <Formation/>
                        <Certificat/>
                        <Competence/>
                        <Langue/>
                        <Interet/>

                    </div>
                </section>
            </main>
        </div>
    );
};

export default MonCV;
