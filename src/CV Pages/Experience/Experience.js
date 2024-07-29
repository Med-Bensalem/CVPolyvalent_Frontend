import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {addExperienceToUser, deleteExperience,
    getExperiencesByUser,
    updateExperience
} from "../../Services/experienceService";
import moment from "moment";
import ReactQuill from "react-quill";

const formatDate = (dateString) => {
    const options = { month: "long", year: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR", options);

    // Capitalize the first letter of the month name
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};
const Experiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [titre, setTitre] = useState('');
    const [nomEntreprise, setNomEntreprise] = useState('');
    const [description, setDescription] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [disponibilite, setDisponibilite] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [experienceToDelete, setExperienceToDelete] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [experienceDetails, setExperienceDetails] = useState({
        titre: '',
        nomEntreprise: '',
        description: '',
        dateDebut:'',
        dateFin: '',
        disponibilite: false
    });



    const fetchExperiences = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = jwtDecode(token);
            try {
                const fetchedExperiences = await getExperiencesByUser(user.userId);
                setExperiences(fetchedExperiences);
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

        if (!titre.trim()) {
            errors.titre = 'Veuillez entrer un titre.';
        }
        if (!nomEntreprise.trim()) {
            errors.nomEntreprise = 'Veuillez entrer un nom d\'entreprise.';
        }
        if (!description.trim()) {
            errors.description = 'Veuillez entrer une description.';
        }
        if (!dateDebut) {
            errors.dateDebut = 'Veuillez sélectionner une date de début.';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const experienceData = {
                titre,
                nomEntreprise,
                description,
                dateDebut,
                dateFin,
                disponibilite
            };

            // Appel de la fonction addExperienceToUser avec les données de l'expérience
            await addExperienceToUser(userId, experienceData);
            // Réinitialisation des champs du formulaire après soumission réussie
            setTitre('');
            setNomEntreprise('');
            setDescription('');
            setDateDebut('');
            setDateFin('');
            setDisponibilite(false);
            setError('');
            document.getElementById('Experience').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
            fetchExperiences();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (experienceId) => {
        try {
            await deleteExperience(userId, experienceId);
            setExperiences(prevExperiences => prevExperiences.filter(experience => experience._id !== experienceId));
            setExperienceToDelete(null); // Réinitialiser formation à supprimer
            document.getElementById('ExperienceDelete').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    const handleSetExperienceToDelete = (experienceId) => {
        setExperienceToDelete(experienceId);
    };

    const handleEdit = (experience) => {
        setSelectedExperience(experience);
        setExperienceDetails({
            titre: experience.titre,
            nomEntreprise: experience.nomEntreprise,
            description: experience.description,
            dateDebut: experience.dateDebut,
            dateFin: experience.dateFin,
            disponibilite: experience.disponibilite
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateExperience(userId, selectedExperience._id, experienceDetails);
            // Mettre à jour la liste des formations avec les détails modifiés
            setExperiences(prevExperiences => {
                const updatedExperiences = prevExperiences.map(experience => {
                    if (experience._id === selectedExperience._id) {
                        return {
                            ...experience,
                            ...experienceDetails
                        };
                    }
                    return experience;
                });
                return updatedExperiences;
            });
            document.getElementById('ExperienceModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } catch (error) {
            console.error('Error updating formation:', error);
        }
    };

    return (
        <div className="card-body">
            <div className="bg-light rounded p-2 ">
                <div className="row">
                    <div className="col-11">
                        <h4>Expériences</h4>
                    </div>
                    <div className="col-1">
                        <a className="btn btn-outline-primary btn-sm btnCard"
                           data-bs-toggle="modal"
                           data-bs-target="#Experience">Ajouter </a>
                    </div>
                    <div className="modal fade" id="Experience" tabIndex="-1" role="dialog"
                         aria-labelledby="experienceLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title mb-0" id="newCatgoryLabel">Ajouter une Expérience</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Titre
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" name="titre" value={titre}
                                                   onChange={(e) => setTitre(e.target.value)}
                                                   className={`form-control ${error.titre ? 'is-invalid' : ''}`}
                                                   placeholder="Titre"/>

                                            {error.titre && <div className="invalid-feedback">{error.titre}</div>}
                                        </div>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Nom d'entreprise
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" id="nomEntreprise" name="nomEntreprise"
                                                   value={nomEntreprise}
                                                   onChange={(e) => setNomEntreprise(e.target.value)}
                                                   className={`form-control ${error.nomEntreprise ? 'is-invalid' : ''}`}
                                                   placeholder="Nom Entreprise"/>

                                            {error.nomEntreprise && <div className="invalid-feedback">{error.nomEntreprise}</div>}
                                        </div>
                                        <div className="mb-3 mb-2">
                                            <label className="form-label" htmlFor="title">
                                                Description
                                                <span className="text-danger">*</span>
                                            </label>

                                            <ReactQuill
                                                theme="snow"
                                                value={description}
                                                onChange={(html) => setDescription(html)}
                                            />



                                            <div className="invalid-feedback">Please enter category.</div>
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
                                            {!disponibilite && (
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
                                            <input type="checkbox" id="disponibilite" name="disponibilite"
                                                   className="form-check-input" checked={disponibilite}
                                                   onChange={(e) => setDisponibilite(e.target.checked)}/>
                                            <label className="form-check-label mx-2" htmlFor="saveCard">Je travaille
                                                actuellement ici</label>
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


                <div className="list-group list-group-flush border-top-0" id="experienceList">
                    {experiences.map((experience, index) => (
                        <div key={experience._id}>
                            <div className="list-group-item rounded px-3 text-nowrap mb-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 className="mb-0 text-truncate">
                                        <span className="align-middle">{experience.titre}</span>
                                    </h5>
                                    <div>
                                        <a className="me-1 text-inherit" data-bs-toggle="modal"
                                           data-bs-target="#ExperienceModal" data-bs-placement="top" title="Edit"
                                           onClick={() => handleEdit(experience)}>
                                            <i className="fe fe-edit fs-6"></i>
                                        </a>
                                        <a className="me-1 text-inherit" data-bs-toggle="tooltip" data-placement="top"
                                           title="Delete" onClick={() => handleSetExperienceToDelete(experience._id)}>
                                            <i className="fe fe-trash-2 fs-6" data-bs-toggle="modal"
                                               data-bs-target="#ExperienceDelete"></i>
                                        </a>
                                        <a className="text-inherit" aria-expanded="true"
                                           data-bs-toggle="collapse" data-bs-target={`#collapseExperience${index}`}
                                           aria-controls={`collapseExperience${index}`}>
                                            <span className="chevron-arrow"><i
                                                className="fe fe-chevron-down"></i></span>
                                        </a>
                                    </div>
                                </div>
                                <div id={`collapseExperience${index}`} className="collapse" aria-labelledby="experience"
                                     data-bs-parent="#experienceList">
                                    <div className="p-md-4 p-2">
                                         <span>
                                        {experience.disponibilite ? (
                                            <span
                                                className="blue-text"> {formatDate(experience.dateDebut)} - Présent </span>
                                        ) : (
                                            <span
                                                className="blue-text"> {formatDate(experience.dateDebut)} - {formatDate(experience.dateFin)} </span>
                                        )}
                                    </span> <br/>

                                        <span className="black-text">{experience.nomEntreprise}</span>
                                        <br/>

                                        <p style={{marginLeft: '5px'}}
                                           dangerouslySetInnerHTML={{__html: experience.description}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de confirmation de suppression */}
                <div className="modal fade" id="ExperienceDelete">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation de suppression</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Êtes-vous sûr de vouloir supprimer cette Experience ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler
                                </button>
                                <button type="button" className="btn btn-danger"
                                        onClick={() => handleDelete(experienceToDelete)}>Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de modification */}
                <div className="modal fade" id="ExperienceModal" tabIndex="-1" role="dialog"
                     aria-labelledby="experienceLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title mb-0" id="newCatgoryLabel">Modifier une Expérience</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form className="needs-validation" noValidate onSubmit={handleUpdate}>
                                    <div className="mb-3 mb-2">
                                        <label className="form-label" htmlFor="title">
                                            Titre
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" name="titre" value={experienceDetails.titre}
                                               onChange={(e) => setExperienceDetails({
                                                   ...experienceDetails,
                                                   titre: e.target.value
                                               })} className="form-control"
                                               placeholder="Titre"/>

                                        <div className="invalid-feedback">Please enter category.</div>
                                    </div>
                                    <div className="mb-3 mb-2">
                                        <label className="form-label" htmlFor="title">
                                            Nom d'entreprise
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" id="nomEntreprise" name="nomEntreprise"
                                               value={experienceDetails.nomEntreprise}
                                               onChange={(e) => setExperienceDetails({
                                                   ...experienceDetails,
                                                   nomEntreprise: e.target.value
                                               })}
                                               className="form-control"
                                               placeholder="Nom Entreprise"/>

                                        <div className="invalid-feedback">Please enter category.</div>
                                    </div>
                                    <div className="mb-3 mb-2">
                                        <label className="form-label" htmlFor="title">
                                            Description
                                            <span className="text-danger">*</span>
                                        </label>

                                        <ReactQuill
                                            theme="snow"
                                            value={experienceDetails.description}
                                            onChange={(html) => setExperienceDetails({
                                                ...experienceDetails,
                                                description: html
                                            })}
                                        />

                                        <div className="invalid-feedback">Please enter category.</div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-12 col-md-6">
                                            <label className="form-label" htmlFor="dateDebut">Date de début</label>
                                            <span className="text-danger">*</span>
                                            <input type="date" id="dateDebut" name="dateDebut"
                                                   value={moment(experienceDetails.dateDebut).format('YYYY-MM-DD')}
                                                   onChange={(e) => setExperienceDetails({
                                                       ...experienceDetails,
                                                       dateDebut: e.target.value
                                                   })} className="form-control"/>
                                        </div>
                                        {!experienceDetails.disponibilite && (
                                            <div className="mb-3 col-12 col-md-6">
                                                <label className="form-label" htmlFor="dateFin">Date de fin</label>
                                                <span className="text-danger">*</span>
                                                <input type="date" id="dateFin" name="dateFin"
                                                       value={moment(experienceDetails.dateFin).format('YYYY-MM-DD')}
                                                       onChange={(e) => setExperienceDetails({
                                                           ...experienceDetails,
                                                           dateFin: e.target.value
                                                       })} className="form-control"/>
                                            </div>
                                        )}

                                    </div>


                                    <div className="mb-3 mb-2">
                                        <input type="checkbox" id="disponibilite" name="disponibilite" className="form-check-input"
                                               checked={experienceDetails.disponibilite} onChange={(e) => setExperienceDetails({
                                            ...experienceDetails,
                                            disponibilite: e.target.checked
                                        })}/>
                                        <label className="form-check-label mx-2" htmlFor="saveCard">Je travaille
                                            actuellement ici</label>
                                    </div>


                                    <div>
                                        <button type="submit" className="btn btn-primary mx-2">Modifier</button>
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
        </div>
    );
};

export default Experiences;
