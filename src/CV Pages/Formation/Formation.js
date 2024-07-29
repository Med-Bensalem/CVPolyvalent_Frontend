import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import {
    addFormationToUser,
    deleteFormation,
    getFormationsByUser,
    updateFormation
} from "../../Services/formationService";
import moment from "moment/moment";

const formatDate = (dateString) => {
    const options = { month: "long", year: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR", options);

    // Capitalize the first letter of the month name
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const Formation = () => {
    const [formations, setFormations] = useState([]);
    const [userId, setUserId] = useState(null);
    const [formationToDelete, setFormationToDelete] = useState(null);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [formationDetails, setFormationDetails] = useState({
        diplome: '',
        etablissement: '',
        dateDebut: '',
        dateFin: '',
        enCours: false
    });
    const [diplome, setDiplome] = useState('');
    const [etablissement, setEtablissement] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [enCours, setEnCours] = useState(false); // Initialize as boolean
    const [error, setError] = useState('');

    const fetchExperiences = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedExperiences = await getFormationsByUser(user.userId);
                setFormations(fetchedExperiences);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            }
        }
    };
    useEffect(() => {

        fetchExperiences();
    }, []);

    const validate = () => {
        const errors = {};

        if (!diplome.trim()) {
            errors.diplome = 'Veuillez entrer un diplome.';
        }
        if (!etablissement.trim()) {
            errors.etablissement = 'Veuillez entrer un etablissement.';
        }

        if (!dateDebut) {
            errors.dateDebut = 'Veuillez sélectionner une date de début.';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDelete = async (formationId) => {
        try {
            await deleteFormation(userId, formationId);
            setFormations(prevFormations => prevFormations.filter(formation => formation._id !== formationId));
            setFormationToDelete(null); // Réinitialiser formation à supprimer
            document.getElementById('FormationDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    const handleSetFormationToDelete = (formationId) => {
        setFormationToDelete(formationId);
    };

    const handleEdit = (formation) => {
        setSelectedFormation(formation);
        setFormationDetails({
            diplome: formation.diplome,
            etablissement: formation.etablissement,
            dateDebut: formation.dateDebut,
            dateFin: formation.dateFin,
            enCours: formation.enCours
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateFormation(userId, selectedFormation._id, formationDetails);
            // Mettre à jour la liste des formations avec les détails modifiés
            setFormations(prevFormations => {
                const updatedFormations = prevFormations.map(formation => {
                    if (formation._id === selectedFormation._id) {
                        return {
                            ...formation,
                            ...formationDetails
                        };
                    }
                    return formation;
                });
                return updatedFormations;
            });
            document.getElementById('FormationModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error updating formation:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const formationData = {
                diplome,
                etablissement,
                dateDebut,
                dateFin,
                enCours
            };

            // Appel de la fonction addFormationToUser avec les données de la formation
            await addFormationToUser(userId, formationData);

            // Réinitialiser les champs après succès
            setDiplome('');
            setEtablissement('');
            setDateDebut('');
            setDateFin('');
            setEnCours(false); // Reset disponibilite to false
            document.getElementById('Formation').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);

            fetchExperiences();

        } catch (error) {
            console.error(error.message);
            // Gérer les erreurs
        }
    };


    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 cardStyle">
                <div className="row">
                    <div className="col-11">
                        <h4>Formations</h4>
                    </div>
                    <div className="col-1">
                        <a  className="btn btn-outline-primary btn-sm btnCard"
                           data-bs-toggle="modal"
                           data-bs-target="#Formation">Ajouter </a>
                    </div>

                    {/* Modal Ajout de formation */}
                    <div className="modal fade" id="Formation" tabIndex="-1" role="dialog"
                         aria-labelledby="newCatgoryLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title mb-0" id="newCatgoryLabel">Ajouter une Formation</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Diplome
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text"
                                                   name="diplome" value={diplome}
                                                   onChange={(e) => setDiplome(e.target.value)}
                                                   className={`form-control ${error.diplome ? 'is-invalid' : ''}`}
                                                   placeholder="Diplome"/>

                                            {error.diplome && <div className="invalid-feedback">{error.diplome}</div>}
                                        </div>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Etablissement
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" id="etablissement" name="etablissement"
                                                   value={etablissement}
                                                   onChange={(e) => setEtablissement(e.target.value)}
                                                   className={`form-control ${error.etablissement ? 'is-invalid' : ''}`}
                                                   placeholder="Etablissement"/>
                                            {error.etablissement && <div className="invalid-feedback">{error.etablissement}</div>}
                                        </div>

                                        <div className="row">
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="birth">Date de début</label>
                                                <span className="text-danger">*</span>
                                                <input type="date" id="dateDebut" name="dateDebut" value={dateDebut}
                                                       onChange={(e) => setDateDebut(e.target.value)}
                                                       className={`form-control ${error.dateDebut ? 'is-invalid' : ''}`}
                                                />
                                                {error.dateDebut && <div className="invalid-feedback">{error.dateDebut}</div>}
                                            </div>
                                            {!enCours && (
                                                <div className="mb-3 col-12 col-md-6">
                                                    <label className="form-label" htmlFor="birth">Date de fin</label>
                                                    <span className="text-danger">*</span>
                                                    <input type="date" id="dateFin" name="dateFin" value={dateFin}
                                                           onChange={(e) => setDateFin(e.target.value)}
                                                           className="form-control"/>
                                                </div>
                                            )}

                                        </div>

                                        <div className="mb-3 mb-2">
                                            <input type="checkbox" id="enCours" name="enCours"
                                                   className="form-check-input"
                                                   checked={enCours} onChange={(e) => setEnCours(e.target.checked)}/>
                                            <label className="form-check-label mx-2" htmlFor="saveCard">En cours
                                            </label>
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary mx-2">Enregistrer</button>
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">Fermer
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                {/* Afficher liste des formations */}
                <div className="list-group list-group-flush border-top-0" id="formationList">
                    {formations.map((formation, index) => (
                        <div key={formation._id}>
                            <div className="list-group-item rounded px-3 text-nowrap mb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="mb-0 text-truncate">
                                        <span className="align-middle">{formation.diplome}</span>
                                    </h5>
                                    <div>
                                        <a  className="me-1 text-inherit" data-bs-toggle="modal"
                                           data-bs-target="#FormationModal" data-bs-placement="top" title="Edit"
                                           onClick={() => handleEdit(formation)}>
                                            <i className="fe fe-edit fs-6"></i>
                                        </a>

                                        <a className="me-1 text-inherit" data-bs-toggle="tooltip" data-placement="top"
                                           title="Delete" onClick={() => handleSetFormationToDelete(formation._id)}>
                                            <i className="fe fe-trash-2 fs-6" data-bs-toggle="modal"
                                               data-bs-target="#FormationDelete"></i>
                                        </a>

                                        <a  className="text-inherit" aria-expanded="true"
                                           data-bs-toggle="collapse" data-bs-target={`#collapseFormation${index}`}
                                           aria-controls={`collapseFormation${index}`}>
                                            <span className="chevron-arrow"><i
                                                className="fe fe-chevron-down"></i></span>
                                        </a>
                                    </div>
                                </div>
                                <div id={`collapseFormation${index}`} className="collapse" aria-labelledby="formation"
                                     data-bs-parent="#formationList">
                                    <div className="p-md-4 p-2">
                                        <span>
                                            {formation.enCours ? (
                                                <span
                                                    className="blue-text"> {formatDate(formation.dateDebut)} - Présent </span>
                                            ) : (
                                                <span
                                                    className="blue-text"> {formatDate(formation.dateDebut)} - {formatDate(formation.dateFin)} </span>
                                            )}
                                        </span><br/>


                                        <span className="black-text">{formation.etablissement}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            <div className="modal fade" id="FormationDelete">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation de suppression</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Êtes-vous sûr de vouloir supprimer cette Formation ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" className="btn btn-danger"
                                    onClick={() => handleDelete(formationToDelete)}>Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal modification de formation */}
            <div className="modal fade" id="FormationModal" tabIndex="-1" role="dialog"
                 aria-labelledby="newCatgoryLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title mb-0" id="newCatgoryLabel">Modifier une Formation</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="needs-validation" noValidate onSubmit={handleUpdate}>
                                <div className="mb-3 mb-2">
                                    <label className="form-label" htmlFor="diplome">
                                        Diplome
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" name="diplome" value={formationDetails.diplome}
                                           onChange={(e) => setFormationDetails({
                                               ...formationDetails,
                                               diplome: e.target.value
                                           })} className="form-control" placeholder="Diplome"/>

                                    <div className="invalid-feedback">Veuillez entrer le diplome.</div>
                                </div>
                                <div className="mb-3 mb-2">
                                    <label className="form-label" htmlFor="etablissement">
                                        Etablissement
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" id="etablissement" name="etablissement"
                                           value={formationDetails.etablissement} onChange={(e) => setFormationDetails({
                                        ...formationDetails,
                                        etablissement: e.target.value
                                    })} className="form-control" placeholder="Etablissement"/>

                                    <div className="invalid-feedback">Veuillez entrer l'établissement.</div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-12 col-md-6">
                                        <label className="form-label" htmlFor="dateDebut">Date de début</label>
                                        <span className="text-danger">*</span>
                                        <input type="date" id="dateDebut" name="dateDebut"
                                               value={moment(formationDetails.dateDebut).format('YYYY-MM-DD')}
                                               onChange={(e) => setFormationDetails({
                                                   ...formationDetails,
                                                   dateDebut: e.target.value
                                               })} className="form-control"/>
                                    </div>
                                    {!formationDetails.enCours && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="dateFin">Date de fin</label>
                                            <span className="text-danger">*</span>
                                            <input type="date" id="dateFin" name="dateFin"
                                                   value={moment(formationDetails.dateFin).format('YYYY-MM-DD')}
                                                   onChange={(e) => setFormationDetails({
                                                       ...formationDetails,
                                                       dateFin: e.target.value
                                                   })} className="form-control"/>
                                        </div>
                                    )}

                                </div>

                                <div className="mb-3 mb-2">
                                    <input type="checkbox" id="enCours" name="enCours" className="form-check-input" checked={formationDetails.enCours} onChange={(e) => setFormationDetails({ ...formationDetails, enCours: e.target.checked })} />
                                    <label className="form-check-label mx-2" htmlFor="enCours">En cours</label>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary mx-2">Modifier</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Formation;
