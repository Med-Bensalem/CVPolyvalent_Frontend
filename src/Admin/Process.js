import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import '../Template.css';
import React, { useEffect, useState } from "react";
import { createStep, getStepsByWorkflowId, updateStep, deleteStep } from "../Services/stepService";
import { useParams } from "react-router-dom";
import { getWorkflowByOffreId } from "../Services/workflowService";
import Stepper from "../stepper/Stepper";


const Process = () => {



    return (
        <div id="db-wrapper">
            <Sidebar />
            <main id="page-content">
                <div className="header">
                    <Header />
                </div>
                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-2 mb-lg-0">
                                    <h1 className="mb-0 h2 fw-bold">Process Offre</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Gestion Process
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Process</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>
                    <Stepper/>
                </section>




            </main>
        </div>
    );
};

export default Process;
