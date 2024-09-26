import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConditionByOffer } from '../Services/conditionService';
import {getWorkflowByOffreId} from "../Services/workflowService";
import {getStepsByWorkflowId, getStepsEntrepriseByWorkflowId} from "../Services/stepService";
import moment from "moment/moment";
import {Tooltip} from "react-tooltip";

const CloturePart = () => {
    const { offreId } = useParams();
    const [condition, setCondition] = useState(null);
    const [steps, setSteps] = useState([]);


    useEffect(() => {
        fetchCondition();
        fetchSteps();
    }, []);
    const fetchSteps = async () => {
        try {
            const workflow = await getWorkflowByOffreId(offreId);
            if (workflow && workflow._id) {
                const stepps = await getStepsEntrepriseByWorkflowId(workflow._id);
                setSteps(stepps);
            }
        } catch (error) {
            console.error('Error fetching steps:', error);
        }
    };

    const fetchCondition = async () => {
        try {
            const condArray = await getConditionByOffer(offreId); // Fetch the conditions array
            console.log(condArray); // Log to see the structure

            if (condArray && condArray.length > 0) {
                const cond = condArray[0]; // Access the first object in the array
                setCondition(cond); // Set state with the first object
            } else {
                console.log('No condition data found');
            }
        } catch (error) {
            console.error('Error fetching condition:', error);
        }
    };

    return (
        <section>
            <div className="card mb-2">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <span className="text-uppercase text-primary fw-semibold ls-md">Conditions</span>
                    </div>
                    {condition ? (
                        <ul className="d-flex flex-wrap justify-content-between">
                            <li className="mb-1 d-flex">
                    <span className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                           className="bi bi-check-circle-fill text-success mb-1" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </span>
                                <span>Lieu de Travail : {condition.lieu}</span>
                            </li>
                            <li className="mb-1 d-flex">
                    <span className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                           className="bi bi-check-circle-fill text-success mb-1" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </span>
                                <span>Score : {condition.score}</span>
                            </li>
                            <li className="mb-1 d-flex">
                    <span className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                           className="bi bi-check-circle-fill text-success mb-1" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </span>
                                <span>Niveaux Académique : {condition.niveauxacadem}</span>
                            </li>
                            <li className="mb-1 d-flex">
                    <span className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                           className="bi bi-check-circle-fill text-success mb-1" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </span>
                                <span>Genre : {condition.genre}</span>
                            </li>
                        </ul>
                    ) : (
                        <p>Loading conditions...</p>
                    )}
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <span className="text-uppercase text-primary fw-semibold ls-md">Process</span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center  flex-wrap">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="d-flex flex-column align-items-center mx-3">
                                    <div className="text-center">
                                        <div
                                            className="icon-shape icon-lg border border-primary border-2 fs-3 rounded-circle mb-4 text-primary smooth-shadow-md">
                                            {index + 1}
                                        </div>

                                        <a
                                            {...(step.dateEntretien && {
                                                'data-tooltip-id': 'supp-tooltip',
                                                'data-tooltip-content':  `Date Entretien : ${moment(step.dateEntretien).format('DD/MM/YYYY')}`,
                                                'data-tooltip-place': 'bottom-end'
                                            })}
                                        >
                                            <h5>{step.titre}</h5>
                                        </a>
                                    </div>

                                    {step.dateEntretien && <Tooltip id="supp-tooltip"/>}
                                </div>

                            </React.Fragment>
                        ))}
                    </div>

                </div>
            </div>

            <div className="text-end mb-3">

                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#finishModal">Terminer
                </button>
            </div>

            <div className="modal fade" id="backModal" tabindex="-1" aria-labelledby="backModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="backModalLabel">Retour</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to go back?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="finishModal" tabindex="-1" aria-labelledby="finishModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="finishModalLabel">Terminer</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Voulez-vous terminer ?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button"  onClick={() => (window.location.href = '/offres')} className="btn btn-primary" href="/offres">Confirmer</button>
                        </div>
                    </div>
                </div>
            </div>

        </section>

    );
};

export default CloturePart;
