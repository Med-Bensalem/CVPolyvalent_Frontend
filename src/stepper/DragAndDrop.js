import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { getWorkflowByOffreId } from '../Services/workflowService';
import {updateStep, deleteStep, getStepsEntrepriseByWorkflowId} from '../Services/stepService';
import {Tooltip} from "react-tooltip";

const ItemTypes = {
    CARD: 'card',
};

// Card component that can be dragged and dropped
const Card = ({ id, text, moveCard, onEdit, onDelete }) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.CARD,
            item: { id },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id]
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.CARD,
            hover: (draggedItem) => {
                if (draggedItem.id !== id) {
                    moveCard(draggedItem.id, id);
                }
            },
        }),
        [id, moveCard]
    );

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div ref={(node) => drag(drop(node))} style={{ opacity }} className="card card-hover">
            <div className="card-body d-flex justify-content-between align-items-center">
                <p className="mb-0">{text}</p>
                <div>
                    <Tooltip id="edit-tooltip"/>
                    <Tooltip id="supp-tooltip"/>
                    <a
                        data-tooltip-id="edit-tooltip"
                        data-tooltip-content="Modifier"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="text-primary mx-2"
                            style={{cursor: 'pointer'}}
                            onClick={() => onEdit(id, text)}
                        /></a>
                    <a
                        data-tooltip-id="supp-tooltip"
                        data-tooltip-content="Supprimer"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger"
                            style={{cursor: 'pointer'}}
                            onClick={() => onDelete(id)}
                        /></a>
                </div>
            </div>
        </div>
);
};

const ProcessPart = () => {
    const {offreId} = useParams();
    const [steps, setSteps] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [stepTitle, setStepTitle] = useState('');
    const [stepMeet, setStepMeet] = useState('');
    const [stepAdresse, setStepAdresse] = useState('');
    const [stepDateEntretien, setStepDateEntretien] = useState('');

    useEffect(() => {
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

        fetchSteps();
    }, [offreId]);

    const moveCard = (draggedId, hoveredId) => {
        const draggedIndex = steps.findIndex((step) => step._id === draggedId);
        const hoveredIndex = steps.findIndex((step) => step._id === hoveredId);

        if (draggedIndex !== -1 && hoveredIndex !== -1) {
            const updatedSteps = [...steps];
            const [removed] = updatedSteps.splice(draggedIndex, 1);
            updatedSteps.splice(hoveredIndex, 0, removed);

            const reorderedSteps = updatedSteps.map((step, index) => ({
                ...step,
                step_order: index + 1,
            }));

            setSteps(reorderedSteps);
            updateStepOrderInBackend(reorderedSteps);
        }
    };

    const updateStepOrderInBackend = async (steps) => {
        try {
            await Promise.all(
                steps.map((step) => updateStep(step._id, { step_order: step.step_order }))
            );
        } catch (error) {
            console.error('Error updating step order:', error);
        }
    };

    const handleEditClick = (id, title, meet, adresse, dateEntretien) => {
        setSelectedStep(id);
        setStepTitle(title);
        setStepMeet(meet || ''); // Handle null values
        setStepAdresse(adresse || ''); // Handle null values
        setStepDateEntretien(dateEntretien || ''); // Handle null values
        setShowEditModal(true);
    };
    

    const handleDeleteClick = (id) => {
        setSelectedStep(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteStep(selectedStep);
            setSteps(steps.filter((step) => step._id !== selectedStep));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting step:', error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            await updateStep(selectedStep, {
                titre: stepTitle,
                meet: stepMeet,
                adress: stepAdresse,
                dateEntretien: stepDateEntretien
            });
            setSteps(steps.map((step) =>
                step._id === selectedStep ? {
                    ...step,
                    titre: stepTitle,
                    meet: stepMeet,
                    adress: stepAdresse,
                    dateEntretien: stepDateEntretien
                } : step
            ));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating step:', error);
        }
    };

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <div className="container mt-4">
                    <div className="row">
                        {steps.map((step, index) => (
                            <div className="col-8 mb-4 mx-auto" key={index}>
                                <h5>Etape {index + 1}</h5>
                                <Card
                                    id={step._id}
                                    text={step.titre}
                                    moveCard={moveCard}
                                    onEdit={() => handleEditClick(step._id, step.titre, step.meet, step.adress, step.dateEntretien)}
                                    onDelete={handleDeleteClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </DndProvider>

            {/* Modal for editing step */}
            {showEditModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modifier Etape </h5>
                                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <h6>Titre</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={stepTitle}
                                        onChange={(e) => setStepTitle(e.target.value)}
                                    />
                                </div>
                                {stepMeet && (
                                    <div className="mt-3">
                                        <h6>Meet</h6>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={stepMeet}
                                            onChange={(e) => setStepMeet(e.target.value)}
                                            placeholder="Meet"
                                        />
                                    </div>
                                )}
                                {stepAdresse && (
                                    <div className="mt-3">
                                        <h6>Adresse</h6>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={stepAdresse}
                                            onChange={(e) => setStepAdresse(e.target.value)}
                                            placeholder="Adresse"
                                        />
                                    </div>
                                )}
                                {stepDateEntretien && (
                                    <div className="mt-3">
                                        <h6>Date d'entretien</h6>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={stepDateEntretien}
                                            onChange={(e) => setStepDateEntretien(e.target.value)}
                                            placeholder="Date d'entretien"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        onClick={() => setShowEditModal(false)}>
                                    Annuler
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for deleting step */}
            {showDeleteModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Supprimer Etape</h5>
                                <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer cette étape ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}>
                                    Annuler
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProcessPart;
