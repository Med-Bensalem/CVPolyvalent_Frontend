import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {jwtDecode} from 'jwt-decode';
import { getTestsByUser } from '../Services/testService';
import DragAndDrop from './DragAndDrop';
import { createStep } from '../Services/stepService';
import {useNavigate, useParams} from 'react-router-dom';
import { getWorkflowByOffreId } from '../Services/workflowService';
import { Modal, Button } from 'react-bootstrap';

const ProcessPart = ({ onNextStep }) => {
    const { offreId } = useParams();
    const [selectedProcessus, setSelectedProcessus] = useState(null);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedEntretien, setSelectedEntretien] = useState("");
    const [interviewDateTime, setInterviewDateTime] = useState('');
    const [address, setAddress] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [stepType, setStepType] = useState('');
    const validTypes = ['Test', 'Entretien'];
    const navigate = useNavigate();

    // States to control visibility of additional input fields
    const [showAddressInput, setShowAddressInput] = useState(false);
    const [showMeetInput, setShowMeetInput] = useState(false);

    const [showAddStepModal, setShowAddStepModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const fetchProcessus = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const user = jwtDecode(token);
                const fetchedTests = await getTestsByUser(user.userId);
                const formattedTest = fetchedTests.map(test => ({
                    value: test._id,
                    label: test.title
                }));
                setTests(formattedTest);
            } catch (error) {
                console.error('Erreur lors du chargement des processus', error);
            }
        }
    };

    useEffect(() => {
        fetchProcessus();
    }, []);

    const handleSelectChange = (selectedOption) => {
        setSelectedProcessus(selectedOption);
    };

    const handleTestChange = (selectedOption) => {
        setSelectedTest(selectedOption);
    };

    const handleEntretienChange = (event) => {
        const value = event.target.value;
        setSelectedEntretien(value);
        setShowAddressInput(value === "Entretien Présentiel");
        setShowMeetInput(value === "Entretien en Ligne");

        if (value === "Entretien Téléphonique") {
            setStepType('INTERVIEW_PHONE'); // Ou le code que vous voulez pour entretien téléphonique
        } else if (value === "Entretien Présentiel") {
            setStepType('INTERVIEW_ONSITE'); // Code pour entretien présentiel
        } else if (value === "Entretien en Ligne") {
            setStepType('INTERVIEW_ONLINE'); // Code pour entretien en ligne
        }
    };

    const handleAddStep = async () => {
        try {
            const workflow = await getWorkflowByOffreId(offreId);
            let stepData = {
                workflow_id: workflow._id,
                step_order: 1,
            };

            if (selectedProcessus && selectedProcessus.label === 'Test') {
                stepData.titre = selectedTest ? selectedTest.label : 'Test';
                stepData.stepType = 'TEST';
            } else if (selectedProcessus && selectedProcessus.label === 'Entretien') {
                stepData.titre = selectedEntretien;
                stepData.dateEntretien = interviewDateTime;
                stepData.adress = address;
                stepData.meet = meetLink;
                stepData.stepType=stepType;
            }

            await createStep(stepData);
            setShowAddStepModal(false);
            setShowConfirmationModal(true);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'étape', error);
        }
    };

    const handleCloseAddStepModal = () => {
        setShowAddStepModal(false);
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    const handleNextStep = () => {
        if (typeof onNextStep === 'function') {
            onNextStep();
        } else {
            console.error('onNextStep n\'est pas une fonction');
        }
        handleCloseConfirmationModal();
    };

    const handleStayOnStep = () => {
        handleCloseConfirmationModal();
    };

    const handleIconClick = () => {
        navigate('/tests');
    };

    return (
        <section>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5>Configurer une Étape du Recrutement</h5>
                        <p>Ajoutez ou modifiez les étapes de votre processus de recrutement pour chaque offre.</p>
                    </div>
                    <div>
                        <Button
                            variant="primary"
                            onClick={() => setShowAddStepModal(true)}
                        >
                            Ajouter une Étape
                        </Button>
                    </div>
                </div>

                <div className="card-body">
                    <DragAndDrop />
                </div>
            </div>

            {/* Add Step Modal */}
            <Modal show={showAddStepModal} onHide={handleCloseAddStepModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une Étape</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="dropdown" className="form-label">Type d'Étape</label>
                        <Select
                            id="dropdown"
                            options={validTypes.map(type => ({ value: type, label: type }))}
                            onChange={handleSelectChange}
                            isSearchable
                        />
                    </div>

                    {selectedProcessus && selectedProcessus.label === 'Entretien' && (
                        <div>
                            <label className="form-label">Veuillez choisir le type d'entretien</label>
                            <div className="d-flex align-items-center mb-3">
                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="entretienType"
                                        id="radio1"
                                        value="Entretien Téléphonique"
                                        checked={selectedEntretien === "Entretien Téléphonique"}
                                        onChange={handleEntretienChange}
                                    />
                                    <label className="form-check-label" htmlFor="radio1">
                                        <i className="bi bi-telephone"></i>
                                        <span className="ms-2">Entretien Téléphonique</span>
                                    </label>
                                </div>

                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="entretienType"
                                        id="radio2"
                                        value="Entretien Présentiel"
                                        checked={selectedEntretien === "Entretien Présentiel"}
                                        onChange={handleEntretienChange}
                                    />
                                    <label className="form-check-label" htmlFor="radio2">
                                        <i className="bi bi-building"></i>
                                        <span className="ms-2">Entretien Présentiel</span>
                                    </label>
                                </div>

                                <div className="form-check me-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="entretienType"
                                        id="radio3"
                                        value="Entretien en Ligne"
                                        checked={selectedEntretien === "Entretien en Ligne"}
                                        onChange={handleEntretienChange}
                                    />
                                    <label className="form-check-label" htmlFor="radio3">
                                        <i className="bi bi-globe"></i>
                                        <span className="ms-2">Entretien en Ligne</span>
                                    </label>
                                </div>
                            </div>

                            {showAddressInput && (
                                <div>
                                    <div className="mb-3">
                                        <label htmlFor="interviewDateTime" className="form-label">Date et Heure de l'entretien</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="interviewDateTime"
                                            value={interviewDateTime}
                                            onChange={(e) => setInterviewDateTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Adresse</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            placeholder="Adresse de l'entretien"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {showMeetInput && (
                                <div>
                                    <div className="mb-3">
                                        <label htmlFor="interviewDateTime" className="form-label">Date et Heure de l'entretien</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="interviewDateTime"
                                            value={interviewDateTime}
                                            onChange={(e) => setInterviewDateTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="meetInput" className="form-label">Lien de la réunion en ligne</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="meetInput"
                                            placeholder="Lien de la réunion"
                                            value={meetLink}
                                            onChange={(e) => setMeetLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedProcessus && selectedProcessus.label === 'Test' && (
                        <div>
                            <label htmlFor="dropdown" className="form-label">
                                Veuillez choisir le type de test
                            </label>

                            <div className="row align-items-center">
                                {/* If tests are empty, give Select component col-md-11; otherwise, col-md-12 */}
                                <div className={tests.length === 0 ? "col-md-11" : "col-md-12"}>
                                    <Select

                                        options={tests}
                                        onChange={handleTestChange}
                                        isSearchable
                                    />
                                </div>

                                {/* Show icon only if there are no tests */}
                                {tests.length === 0 && (
                                    <div className="col-md-1">
                                        <div className="icon-container" onClick={handleIconClick}
                                             style={{cursor: 'pointer'}}>
                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddStepModal}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={handleAddStep}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    L'étape a été ajoutée avec succès. Souhaitez-vous passer à l'étape suivante ou rester sur celle-ci ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleStayOnStep}>
                        Rester sur l'étape actuelle
                    </Button>
                    <Button variant="primary" onClick={handleNextStep}>
                        Passer à l'étape suivante
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default ProcessPart;
