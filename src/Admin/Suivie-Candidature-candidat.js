// Template2.js
import React, {useEffect, useState} from 'react';
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import {jwtDecode} from "jwt-decode";
import {getPostulesByUser} from "../Services/postuleService";
import {getOffreById} from "../Services/offreService";
import {getUserById} from "../Services/authService";
import moment from "moment/moment";
import ReactPaginate from "react-paginate";
import {getTypeExperienceById} from "../Services/typeExperienceService";
import {Button, Modal} from "react-bootstrap";
import {getWorkflowByOffreId} from "../Services/workflowService";
import {getStepsByWorkflowId} from "../Services/stepService";
import StepCard from "./StepCard";

const baseURL = 'http://localhost:5000';
const itemsPerPage = 5;
const SuivieCandidat = () => {

    const [postules, setPostules] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null); // Étape actuelle

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const fetchPostules = async () => {
        // Implement fetching competences by user
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedPostules = await getPostulesByUser(user.userId);
                console.log(fetchedPostules);

                const offresDetails = await Promise.all(
                    fetchedPostules.map(async (postule) => {
                        const offreDetails = await getOffreById(postule.offreId);
                        const workflow = await getWorkflowByOffreId(postule.offreId);
                        if (workflow && workflow._id) {
                            const stepps = await getStepsByWorkflowId(workflow._id);
                            setSteps(stepps);
                            // Sélectionner le step actuel basé sur le step_order
                            const currentStep = stepps.find(step => step.step_order === postule.status);
                            setCurrentStep(currentStep); // Mettre à jour l'étape actuelle
                        }
                        const typeExperience = await getTypeExperienceById(offreDetails.experience)
                        const offreUserDetails = await getUserById(offreDetails.userId);
                        const imagePath = baseURL + offreUserDetails.image

                        return { ...postule, offreDetails, offreUserDetails ,imagePath, titreTypeExperience: typeExperience.titre};

                    })
                );

                setPostules(offresDetails);


            } catch (error) {
                console.error('Error fetching langue:', error);
            }
        }
    };
    useEffect(() => {
        fetchPostules(); // Fetch competences when the component mounts
    }, []);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(postules.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(postules.length / itemsPerPage));
    }, [itemOffset, postules]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % postules.length;
        setItemOffset(newOffset);
    };


    return (
        <div id="db-wrapper">
            <Sidebar/>

            <main id="page-content">
                <div className="header">
                    <Header/>
                </div>

                <section className="container-fluid p-4">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div
                                className="border-bottom pb-3 mb-3 d-md-flex align-items-center justify-content-between">
                                <div className="mb-3 mb-md-0">
                                    <h1 className="mb-1 h2 fw-bold">Suivie Candidature</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/dashboard">Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Suivie Candidature</li>
                                            <li className="breadcrumb-item active" aria-current="page">Tous</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>

                    {currentItems.length === 0 ? (
                        <div className="col-12 mb-2">
                            <div className="alert alert-info alert-dismissible fade show" role="alert">
                                Désolé, aucune candidature disponible pour le moment. Revenez bientôt !
                            </div>
                        </div>
                    ) : (
                        <>

                    <div className="row">

                            <div className="col-12">
                                <div className="card">
                                    {currentItems.map((postule, index) => (

                                    <div className="card-header" key={index}>

                                            <div className="card card-bordered col-md-10 card-hover cursor-pointer mx-8 ">
                                                <div className="card-body mx-2">
                                                    <div>
                                                        <div className="d-md-flex">
                                                            <div className="mb-3 mb-md-0">
                                                                <img src={postule.imagePath} alt="user"
                                                                     style={{
                                                                         height: '80px',
                                                                         width: '80px',
                                                                         marginTop: '20px'
                                                                     }}/>

                                                            </div>

                                                            <div className="ms-md-3 w-100 mt-3 mt-xl-1">
                                                                <div className="d-flex justify-content-between mb-4">
                                                                    <div>

                                                                        <h3 className="mb-1 fs-4"><a
                                                                            href="/single-job"
                                                                            className="text-inherit">{postule.offreDetails.titre}</a>
                                                                        </h3>
                                                                        <div>
                                                                            <span>{postule.offreUserDetails.nom}</span>


                                                                        </div>
                                                                    </div>
                                                                    <div>


                                                                        <Button variant="primary" onClick={handleShow}>
                                                                            Détails
                                                                        </Button>


                                                                    </div>


                                                                </div>
                                                                <div>

                                                                    <div className="d-md-flex justify-content-between">
                                                                        <div className="mb-2 mb-md-0">

                                                                <span className="me-2">
                                                                <i className="fe fe-briefcase"></i>
                                                                <span
                                                                    className="ms-1">{postule.titreTypeExperience}</span>
                                                            </span>

                                                                            <span className="me-2">
                                                                <i className="fe fe-dollar-sign"></i>
                                                                <span
                                                                    className="ms-1">{postule.offreDetails.remuneration}</span>
                                                            </span>

                                                                            <span className="me-2">
                                                                <i className="fe fe-map-pin"></i>
                                                                <span
                                                                    className="ms-1">{postule.offreUserDetails.adress}</span>
                                                            </span>
                                                                        </div>
                                                                        <div>

                                                                            <span>Postulé le: {moment(postule.dateCreation).format('DD/MM/YYYY')}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                    </div>
                                        ))}


                                </div>
                            </div>

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="suivant >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< précédent"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            activeClassName="active"

                        />
                    </div>

                        </>
                    )}
                </section>
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Détails</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">

                            {/* Card on the left with list */}
                            <div className="col-md-5 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Activity Timeline</h5>
                                        <ul className="list-group list-group-flush list-timeline-activity">

                                            {steps.map((step, index) => (
                                                <li className="list-group-item px-0 pt-0 border-0 mb-4" key={index}>
                                                    <div className="row">
                                                        <div
                                                            className={`col-auto ${currentStep && currentStep.step_order === step.step_order ? 'current-step' : ''}`}>
                                                            <div
                                                                className={`icon-shape icon-md rounded-circle ${currentStep && currentStep.step_order === step.step_order ? 'bg-primary text-white' : 'bg-light-primary text-primary'} position-relative z-1`}>
                                                                <i>{index + 1}</i> {/* Affiche l'index + 1 pour un affichage humain */}
                                                            </div>
                                                        </div>
                                                        <div className="col ms-n2 mt-1">
                                                            <h4 className="mb-3">{step.titre}</h4>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}


                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 mb-2">
                                <StepCard currentStep={currentStep}/>
                            </div>

                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                        Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default SuivieCandidat;
